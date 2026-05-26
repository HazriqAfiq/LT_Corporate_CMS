<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Permissions grouped by module for the UI.
     */
    private array $permissionGroups = [
        'Dashboard'  => ['view_dashboard'],
        'Slider'     => ['view_sliders', 'create_sliders', 'edit_sliders', 'delete_sliders'],
        'Artikel'    => ['view_articles', 'create_articles', 'edit_articles', 'delete_articles'],
        'Produk'     => ['view_products', 'create_products', 'edit_products', 'delete_products'],
        'Portfolio'  => ['view_projects', 'create_projects', 'edit_projects', 'delete_projects'],
        'Media'      => ['view_media', 'upload_media', 'delete_media'],
        'Inquiry'    => ['view_inquiries', 'manage_inquiries', 'delete_inquiries'],
        'Pengguna'   => ['view_users', 'create_users', 'edit_users', 'delete_users'],
        'Tetapan'    => ['view_settings', 'edit_settings'],
    ];

    public function index()
    {
        $roles = Role::with(['permissions', 'users'])->get()->map(function (Role $role) {
            return [
                'id'           => $role->id,
                'name'         => $role->name,
                'user_count'   => $role->users->count(),
                'permissions'  => $role->permissions->pluck('name')->toArray(),
            ];
        });

        // Build permission matrix from all existing permissions
        $allPermissions = Permission::pluck('name')->toArray();

        return Inertia::render('Admin/Roles/Index', [
            'roles'            => $roles,
            'allPermissions'   => $allPermissions,
            'permissionGroups' => $this->permissionGroups,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Roles/Create', [
            'permissionGroups' => $this->permissionGroups,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role = Role::create(['name' => $validated['name'], 'guard_name' => 'web']);

        if (!empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        ActivityLogger::logCreate('Peranan (Role)', $role->name);

        return redirect()
            ->route('admin.roles.index')
            ->with('success', "Role '{$role->name}' berjaya dicipta.");
    }

    public function edit(Role $role)
    {
        $role->load('permissions');

        return Inertia::render('Admin/Roles/Edit', [
            'role'             => [
                'id'          => $role->id,
                'name'        => $role->name,
                'permissions' => $role->permissions->pluck('name')->toArray(),
            ],
            'permissionGroups' => $this->permissionGroups,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        // Super Admin name cannot be changed
        $isSuperAdmin = $role->name === 'Super Admin';

        $rules = [
            'permissions'   => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ];

        if (!$isSuperAdmin) {
            $rules['name'] = 'required|string|max:255|unique:roles,name,' . $role->id;
        }

        $validated = $request->validate($rules);

        if (!$isSuperAdmin && isset($validated['name'])) {
            $role->update(['name' => $validated['name']]);
        }

        // Super Admin always retains all permissions
        if ($isSuperAdmin) {
            $role->syncPermissions(Permission::all());
        } else {
            $role->syncPermissions($validated['permissions'] ?? []);
        }

        ActivityLogger::logUpdate('Peranan (Role)', $role->name);

        return back()
            ->with('success', "Role '{$role->name}' berjaya dikemaskini.");
    }

    public function destroy(Role $role)
    {
        if ($role->name === 'Super Admin') {
            return back()->with('error', 'Role Super Admin tidak boleh dipadam.');
        }

        // Revoke this role from all users before deleting
        foreach ($role->users as $user) {
            $user->removeRole($role);
        }

        $roleName = $role->name;
        $role->delete();

        ActivityLogger::logDelete('Peranan (Role)', $roleName);

        return redirect()
            ->route('admin.roles.index')
            ->with('success', "Role '{$roleName}' berjaya dipadam.");
    }
}
