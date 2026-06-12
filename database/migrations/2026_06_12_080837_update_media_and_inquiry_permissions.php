<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Remove old media permissions
        Permission::whereIn('name', ['upload_media', 'edit_media', 'delete_media'])->delete();
        
        // Add manage_media
        $manageMedia = Permission::firstOrCreate(['name' => 'manage_media', 'guard_name' => 'web']);
        
        // Update inquiry permissions
        Permission::where('name', 'view_inquiries')->update(['name' => 'edit_inquiries']);
        
        // Re-assign manage_media to roles that had any of the old media permissions?
        // Let's just assign manage_media to Admin and Super Admin
        $superAdmin = Role::where('name', 'Super Admin')->first();
        if ($superAdmin) {
            $superAdmin->givePermissionTo(Permission::all());
        }
        
        $admin = Role::where('name', 'Admin')->first();
        if ($admin) {
            $admin->givePermissionTo('manage_media');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Permission::where('name', 'manage_media')->delete();
        Permission::firstOrCreate(['name' => 'upload_media', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'edit_media', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'delete_media', 'guard_name' => 'web']);
        
        Permission::where('name', 'edit_inquiries')->update(['name' => 'view_inquiries']);
    }
};
