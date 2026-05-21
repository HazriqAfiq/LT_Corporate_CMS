<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ActivityLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Truncate existing activity logs if any
        DB::table('activity_log')->truncate();

        // Seed with the exact 5 activity logs from the user mockup
        DB::table('activity_log')->insert([
            [
                'log_name' => 'article',
                'description' => 'Artikel baru diterbitkan',
                'properties' => json_encode(['subtitle' => '5 Trend Teknologi 2024 Yang Perlu Anda Tahu']),
                'created_at' => Carbon::now()->setTime(10, 30),
                'updated_at' => Carbon::now()->setTime(10, 30),
            ],
            [
                'log_name' => 'inquiry',
                'description' => 'Inquiry baru diterima',
                'properties' => json_encode(['subtitle' => 'Borang pertanyaan dari Azman Hakim']),
                'created_at' => Carbon::now()->setTime(9, 15),
                'updated_at' => Carbon::now()->setTime(9, 15),
            ],
            [
                'log_name' => 'slider',
                'description' => 'Slider dikemaskini',
                'properties' => json_encode(['subtitle' => 'Slider utama diubah suai']),
                'created_at' => Carbon::now()->subDay()->setTime(14, 00),
                'updated_at' => Carbon::now()->subDay()->setTime(14, 00),
            ],
            [
                'log_name' => 'user',
                'description' => 'Pengguna baru didaftarkan',
                'properties' => json_encode(['subtitle' => 'Editor baru: Nurul Aisyah']),
                'created_at' => Carbon::now()->subDay()->setTime(10, 00),
                'updated_at' => Carbon::now()->subDay()->setTime(10, 00),
            ],
            [
                'log_name' => 'article',
                'description' => 'Artikel diterbitkan',
                'properties' => json_encode(['subtitle' => 'AI Dalam Organisasi Moden']),
                'created_at' => Carbon::now()->subDays(2)->setTime(16, 30),
                'updated_at' => Carbon::now()->subDays(2)->setTime(16, 30),
            ],
        ]);
    }
}
