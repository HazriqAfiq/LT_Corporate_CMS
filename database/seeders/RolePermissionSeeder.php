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
            'access_dashboard',

            // Sliders
            'create_sliders',
            'edit_sliders',
            'delete_sliders',

            // Articles
            'create_articles',
            'edit_articles',
            'delete_articles',
            'manage_own_articles',

            // Products
            'create_products',
            'edit_products',
            'delete_products',

            // Services
            'create_services',
            'edit_services',
            'delete_services',

            // Projects / Portfolio
            'create_projects',
            'edit_projects',
            'delete_projects',

            // Media
            'manage_media',

            // Contact Inquiries
            'edit_inquiries',
            'delete_inquiries',

            // Newsletter
            'access_newsletter',

            // Users
            'create_users',
            'edit_users',
            'delete_users',

            // SEO & Analytics
            'access_seo',
            'access_analytics',

            // System
            'access_activity_logs',
            'access_backup',
            'access_system_info',

            // Settings & Branding
            'access_settings',
            'access_branding',

            // Team
            'create_team',
            'edit_team',
            'delete_team',
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
            'access_dashboard',
            'create_sliders', 'edit_sliders', 'delete_sliders',
            'create_articles', 'edit_articles', 'delete_articles',
            'create_products', 'edit_products', 'delete_products',
            'create_services', 'edit_services', 'delete_services',
            'create_projects', 'edit_projects', 'delete_projects',
            'manage_media',
            'edit_inquiries', 'delete_inquiries',
            'create_users', 'edit_users', 'delete_users',
            'create_team', 'edit_team', 'delete_team',
            'access_newsletter',
            'access_seo', 'access_analytics',
            'access_activity_logs', 'access_backup', 'access_system_info',
            'access_settings', 'access_branding',
        ]);

        // Editor - manage articles and media
        $editor = Role::firstOrCreate(['name' => 'Editor', 'guard_name' => 'web']);
        $editor->givePermissionTo([
            'access_dashboard',
            'create_articles', 'edit_articles',
            'manage_media',
        ]);

        // Viewer - view dashboard only
        $viewer = Role::firstOrCreate(['name' => 'Viewer', 'guard_name' => 'web']);
        $viewer->givePermissionTo([
            'access_dashboard',
        ]);
    }
}
