<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class RoleController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('role:Super Admin'),
        ];
    }
    /**
     * Permissions grouped by module for the UI.
     */
    private array $permissionGroups = [
        'Dashboard'           => ['access_dashboard'],
        'Artikel'             => ['create_articles', 'edit_articles', 'delete_articles'],
        'Slider Utama'        => ['create_sliders', 'edit_sliders', 'delete_sliders'],
        'Pasukan Kami'        => ['create_team', 'edit_team', 'delete_team'],
        'Perpustakaan Media'  => ['manage_media'],
        'Produk Digital'      => ['create_products', 'edit_products', 'delete_products'],
        'Perkhidmatan'        => ['create_services', 'edit_services', 'delete_services'],
        'Portfolio Projek'    => ['create_projects', 'edit_projects', 'delete_projects'],
        'Inquiry'             => ['edit_inquiries', 'delete_inquiries'],
        'Newsletter'          => ['access_newsletter'],
        'Pengguna'            => ['create_users', 'edit_users', 'delete_users'],
        'SEO'                 => ['access_seo'],
        'Analytics'           => ['access_analytics'],
        'Log Aktiviti'        => ['access_activity_logs'],
        'Backup'              => ['access_backup'],
        'Maklumat Sistem'     => ['access_system_info'],
        'Tetapan Umum'        => ['access_settings'],
        'Imej & Branding'     => ['access_branding'],
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
