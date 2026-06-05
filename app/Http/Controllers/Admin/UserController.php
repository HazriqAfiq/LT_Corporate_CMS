<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;
use Illuminate\Routing\Controllers\HasMiddleware;

class UserController extends Controller implements HasMiddleware
{
    use HasResourcePermissions;

    protected static string $permissionPrefix = 'users';

    public function index(Request $request)
    {
        $query = User::query()->with('roles');

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->input('is_active') === 'true');
        }

        $users = $query->orderBy('name')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'is_active']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'availableRoles' => Role::all(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8',
            'is_active' => 'boolean',
            'avatar' => 'nullable|image|max:2048',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $path = $file->store('uploads/users', 'public');
            
            $filename = basename($path);
            \App\Models\Media::create([
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'filename' => $filename,
                'original_filename' => $file->getClientOriginalName(),
                'path' => $path,
                'mime_type' => $file->getMimeType(),
                'type' => 'image',
                'extension' => $file->getClientOriginalExtension(),
                'size' => $file->getSize(),
                'disk' => 'public',
                'collection' => 'users',
                'uploaded_by' => auth()->id(),
            ]);

            $validated['avatar'] = $path;
        }

        $user = User::create($validated);

        if (!empty($validated['roles'])) {
            $user->roles()->sync($validated['roles']);
        }

        ActivityLogger::logCreate('Pengguna', $user->name, $user);

        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        $user->load('roles');
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'availableRoles' => Role::all(['id', 'name']),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8',
            'is_active' => 'boolean',
            'avatar' => 'nullable|image|max:2048',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
        ]);

        if (filled($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        if ($request->hasFile('avatar')) {
            // Delete old avatar from disk & media library
            if ($user->avatar) {
                $oldMedia = \App\Models\Media::where('path', $user->avatar)->first();
                if ($oldMedia) {
                    $oldMedia->delete();
                }
                if (Storage::disk('public')->exists($user->avatar)) {
                    Storage::disk('public')->delete($user->avatar);
                }
            }
            
            $file = $request->file('avatar');
            $path = $file->store('uploads/users', 'public');
            
            $filename = basename($path);
            \App\Models\Media::create([
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'filename' => $filename,
                'original_filename' => $file->getClientOriginalName(),
                'path' => $path,
                'mime_type' => $file->getMimeType(),
                'type' => 'image',
                'extension' => $file->getClientOriginalExtension(),
                'size' => $file->getSize(),
                'disk' => 'public',
                'collection' => 'users',
                'uploaded_by' => auth()->id(),
            ]);

            $validated['avatar'] = $path;
        }

        $user->update($validated);

        if (isset($validated['roles'])) {
            $user->roles()->sync($validated['roles']);
        }

        ActivityLogger::logUpdate('Pengguna', $user->name, $user);

        return back()->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Cannot delete your own account.');
        }
        
        if ($user->avatar) {
            $oldMedia = \App\Models\Media::where('path', $user->avatar)->first();
            if ($oldMedia) {
                $oldMedia->delete();
            }
            if (Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
        }

        $name = $user->name;
        $user->delete();

        ActivityLogger::logDelete('Pengguna', $name);

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }
}
