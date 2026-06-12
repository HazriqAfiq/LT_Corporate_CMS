<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;

return new class extends Migration
{
    protected array $permissionsToDelete = [
        'view_dashboard',
        'view_sliders',
        'view_articles',
        'view_products',
        'view_services',
        'view_projects',
        'view_media',
        'manage_inquiries',
        'view_users',
        'view_settings',
        'view_inquiries',
        'view_team',
        'edit_settings',
        'upload_media',
    ];

    protected array $permissionsToAdd = [
        'access_dashboard',
        'edit_media',
        'access_newsletter',
        'access_seo',
        'access_analytics',
        'access_activity_logs',
        'access_backup',
        'access_system_info',
        'access_settings',
        'access_branding',
        'view_inquiries', // Will be re-added below
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Delete old permissions
        foreach ($this->permissionsToDelete as $perm) {
            $permission = Permission::where('name', $perm)->where('guard_name', 'web')->first();
            if ($permission) {
                $permission->delete();
            }
        }

        // 2. Add new permissions
        foreach ($this->permissionsToAdd as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Delete new permissions
        foreach ($this->permissionsToAdd as $perm) {
            $permission = Permission::where('name', $perm)->where('guard_name', 'web')->first();
            if ($permission) {
                $permission->delete();
            }
        }

        // 2. Add old permissions back
        foreach ($this->permissionsToDelete as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }
    }
};
