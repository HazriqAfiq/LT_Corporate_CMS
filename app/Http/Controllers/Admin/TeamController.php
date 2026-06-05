<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware;

class TeamController extends Controller implements HasMiddleware
{
    use HasResourcePermissions;

    protected static string $permissionPrefix = 'team';



    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = TeamMember::query()->with('profileMedia');

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('role', 'like', "%{$search}%")
                  ->orWhere('role_en', 'like', "%{$search}%");
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->input('is_active') === 'true');
        }

        $members = $query->orderBy('order')->orderBy('id')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Team/Index', [
            'members' => $members,
            'filters' => $request->only(['search', 'is_active']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Team/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($request->has('media_id')) {
            $request->merge(['profile_media_id' => $request->input('media_id')]);
        }

        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'role'      => 'required|string|max:255',
            'role_en'   => 'nullable|string|max:255',
            'profile_media_id' => 'nullable|exists:media,id',
            'order'     => 'integer|min:0',
            'is_active' => 'boolean',
        ]);



        $teamMember = TeamMember::create($validated);

        ActivityLogger::logCreate('Ahli Pasukan', $teamMember->name, $teamMember);

        return redirect()->route('admin.team-members.index')
            ->with('success', 'Ahli pasukan berjaya ditambah.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TeamMember $teamMember)
    {
        $teamMember->load(['profileMedia']);
        return Inertia::render('Admin/Team/Edit', [
            'member' => $teamMember->append(['profileMedia']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TeamMember $teamMember)
    {
        if ($request->has('media_id')) {
            $request->merge(['profile_media_id' => $request->input('media_id')]);
        }

        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'role'      => 'required|string|max:255',
            'role_en'   => 'nullable|string|max:255',
            'profile_media_id' => 'nullable|exists:media,id',
            'order'     => 'integer|min:0',
            'is_active' => 'boolean',
        ]);



        $teamMember->update($validated);

        ActivityLogger::logUpdate('Ahli Pasukan', $teamMember->name, $teamMember);

        return back()
            ->with('success', 'Maklumat ahli pasukan berjaya dikemaskini.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TeamMember $teamMember)
    {

        
        $teamMemberName = $teamMember->name;
        $teamMember->delete();

        ActivityLogger::logDelete('Ahli Pasukan', $teamMemberName);

        return redirect()->route('admin.team-members.index')
            ->with('success', 'Ahli pasukan berjaya dipadam.');
    }

    /**
     * Reorder team members via drag-and-drop (receives [{id, order}] array).
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'items'         => 'required|array',
            'items.*.id'    => 'required|integer|exists:team_members,id',
            'items.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->input('items') as $item) {
            TeamMember::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Toggle active status.
     */
    public function toggleActive(TeamMember $teamMember)
    {
        $teamMember->update(['is_active' => !$teamMember->is_active]);

        return response()->json([
            'success'   => true,
            'is_active' => $teamMember->is_active,
        ]);
    }
}
