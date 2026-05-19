<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Dashboard
            'view_dashboard',

            // Sliders
            'view_sliders',
            'create_sliders',
            'edit_sliders',
            'delete_sliders',

            // Pages
            'view_pages',
            'create_pages',
            'edit_pages',
            'delete_pages',

            // Articles
            'view_articles',
            'create_articles',
            'edit_articles',
            'delete_articles',

            // Products
            'view_products',
            'create_products',
            'edit_products',
            'delete_products',

            // Projects / Portfolio
            'view_projects',
            'create_projects',
            'edit_projects',
            'delete_projects',

            // Media
            'view_media',
            'upload_media',
            'delete_media',

            // Contact Inquiries
            'view_inquiries',
            'manage_inquiries',
            'delete_inquiries',

            // Users
            'view_users',
            'create_users',
            'edit_users',
            'delete_users',

            // Settings
            'view_settings',
            'edit_settings',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create roles and assign permissions
        // Super Admin - full access
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        $superAdmin->givePermissionTo(Permission::all());

        // Admin - manage all content
        $admin = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $admin->givePermissionTo([
            'view_dashboard',
            'view_sliders', 'create_sliders', 'edit_sliders', 'delete_sliders',
            'view_pages', 'create_pages', 'edit_pages', 'delete_pages',
            'view_articles', 'create_articles', 'edit_articles', 'delete_articles',
            'view_products', 'create_products', 'edit_products', 'delete_products',
            'view_projects', 'create_projects', 'edit_projects', 'delete_projects',
            'view_media', 'upload_media', 'delete_media',
            'view_inquiries', 'manage_inquiries',
            'view_settings', 'edit_settings',
        ]);

        // Editor - manage articles and media
        $editor = Role::firstOrCreate(['name' => 'Editor', 'guard_name' => 'web']);
        $editor->givePermissionTo([
            'view_dashboard',
            'view_articles', 'create_articles', 'edit_articles',
            'view_media', 'upload_media',
            'view_pages',
        ]);

        // Viewer - view dashboard only
        $viewer = Role::firstOrCreate(['name' => 'Viewer', 'guard_name' => 'web']);
        $viewer->givePermissionTo([
            'view_dashboard',
        ]);
    }
}
