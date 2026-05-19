<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or update Super Admin user
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@lamanteknologi.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $superAdmin->assignRole('Super Admin');

        // Create a sample Admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin2@lamanteknologi.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('Admin');

        // Create a sample Editor user
        $editor = User::firstOrCreate(
            ['email' => 'editor@lamanteknologi.com'],
            [
                'name' => 'Editor',
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $editor->assignRole('Editor');
    }
}
