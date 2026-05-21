<?php

namespace Database\Seeders;

use App\Models\TeamMember;
use Illuminate\Database\Seeder;

class TeamMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $members = [
            [
                'name' => 'Ahmad Razif',
                'role' => 'CEO & Pengasas',
                'role_en' => 'CEO & Founder',
                'image_path' => 'team/team_razif.png',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Nurul Aisyah',
                'role' => 'Pengarah Teknologi (CTO)',
                'role_en' => 'CTO',
                'image_path' => 'team/team_aisyah.png',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Muhammad Hafiz',
                'role' => 'Ketua Pembangun',
                'role_en' => 'Lead Developer',
                'image_path' => 'team/team_hafiz.png',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Siti Aminah',
                'role' => 'Pereka UI/UX',
                'role_en' => 'UI/UX Designer',
                'image_path' => 'team/team_aminah.png',
                'order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($members as $member) {
            TeamMember::updateOrCreate(
                ['name' => $member['name']],
                $member
            );
        }
    }
}
