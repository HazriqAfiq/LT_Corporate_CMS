<?php

namespace Database\Seeders;

use App\Models\ContactInquiry;
use Illuminate\Database\Seeder;

class ContactInquirySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $inquiries = [
            [
                'name' => 'Azman Hakim',
                'email' => 'azman@example.com',
                'phone' => '0123456789',
                'company' => 'Azman HR Solutions',
                'subject' => 'Pertanyaan Sistem HR',
                'message' => 'Halo, saya ingin bertanya tentang kesesuaian sistem HR anda untuk syarikat kami yang mempunyai 50 orang pekerja.',
                'is_read' => false,
                'replied_at' => null,
                'created_at' => '2024-05-20 10:00:00',
            ],
            [
                'name' => 'Siti Nur Aisyah',
                'email' => 'siti@example.com',
                'phone' => '0198765432',
                'company' => 'Aisyah Boutique',
                'subject' => 'Minta Demo Sistem',
                'message' => 'Saya berminat untuk melihat demo secara langsung bagi sistem e-dagang.',
                'is_read' => false,
                'replied_at' => null,
                'created_at' => '2024-05-19 09:15:00',
            ],
            [
                'name' => 'Muhammad Firdaus',
                'email' => 'firdaus@example.com',
                'phone' => '0112233445',
                'company' => 'Firdaus Logistics',
                'subject' => 'Sebutharga Pembangunan Sistem',
                'message' => 'Mohon berikan sebutharga kasar untuk pembangunan sistem pengurusan logistik pintar.',
                'is_read' => true,
                'replied_at' => null,
                'created_at' => '2024-05-19 15:30:00',
            ],
            [
                'name' => 'Kamarul Zaman',
                'email' => 'kamarul@example.com',
                'phone' => '0134455667',
                'company' => 'Kamarul API Tech',
                'subject' => 'Pertanyaan Integrasi API',
                'message' => 'Adakah sistem anda menyokong integrasi API dengan gerbang pembayaran pihak ketiga?',
                'is_read' => true,
                'replied_at' => '2024-05-18 16:00:00',
                'created_at' => '2024-05-18 11:00:00',
            ],
            [
                'name' => 'Intan Safiyah',
                'email' => 'intan@example.com',
                'phone' => '0177788990',
                'company' => 'Safiyah Holdings',
                'subject' => 'Minta Maklumat Lanjut',
                'message' => 'Bolehkah anda menghantar brosur penuh perkhidmatan digital yang ditawarkan?',
                'is_read' => true,
                'replied_at' => null,
                'created_at' => '2024-05-17 14:45:00',
            ],
        ];

        foreach ($inquiries as $inquiry) {
            ContactInquiry::create($inquiry);
        }
    }
}
