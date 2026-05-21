<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // General Settings
            [
                'key' => 'site_name',
                'value' => 'Laman Teknologi Sdn. Bhd.',
                'type' => 'text',
                'group' => 'general',
                'label' => 'Nama Laman',
                'label_en' => 'Site Name',
            ],
            [
                'key' => 'site_tagline',
                'value' => 'Teknologi Untuk Organisasi',
                'type' => 'text',
                'group' => 'general',
                'label' => 'Tagline',
                'label_en' => 'Tagline',
            ],
            [
                'key' => 'site_description',
                'value' => 'Laman Teknologi Sdn. Bhd. menyediakan penyelesaian teknologi terbaik untuk organisasi anda.',
                'type' => 'textarea',
                'group' => 'general',
                'label' => 'Penerangan Laman',
                'label_en' => 'Site Description',
            ],
            [
                'key' => 'logo',
                'value' => '/storage/branding/logo.png',
                'type' => 'image',
                'group' => 'general',
                'label' => 'Logo Utama',
                'label_en' => 'Main Logo',
            ],
            [
                'key' => 'logo_dark',
                'value' => '/storage/branding/logo.png',
                'type' => 'image',
                'group' => 'general',
                'label' => 'Logo Mod Gelap',
                'label_en' => 'Dark Mode Logo',
            ],
            [
                'key' => 'logo_footer',
                'value' => '/storage/branding/logo.png',
                'type' => 'image',
                'group' => 'general',
                'label' => 'Logo Footer',
                'label_en' => 'Footer Logo',
            ],
            [
                'key' => 'favicon',
                'value' => '/storage/branding/favicon.png',
                'type' => 'image',
                'group' => 'general',
                'label' => 'Favicon',
                'label_en' => 'Favicon',
            ],
            [
                'key' => 'login_background',
                'value' => '/storage/branding/login_bg.png',
                'type' => 'image',
                'group' => 'general',
                'label' => 'Latar Belakang Log Masuk',
                'label_en' => 'Login Background',
            ],

            // Contact Information
            [
                'key' => 'contact_email',
                'value' => 'info@lamanteknologi.com',
                'type' => 'text',
                'group' => 'contact',
                'label' => 'Emel',
                'label_en' => 'Email',
            ],
            [
                'key' => 'contact_phone',
                'value' => '+60-123456789',
                'type' => 'text',
                'group' => 'contact',
                'label' => 'Telefon',
                'label_en' => 'Phone',
            ],
            [
                'key' => 'contact_address',
                'value' => 'Kuala Lumpur, Malaysia',
                'type' => 'textarea',
                'group' => 'contact',
                'label' => 'Alamat',
                'label_en' => 'Address',
            ],
            [
                'key' => 'contact_map_url',
                'value' => null,
                'type' => 'text',
                'group' => 'contact',
                'label' => 'URL Peta Google',
                'label_en' => 'Google Map URL',
            ],

            // Social Media
            [
                'key' => 'social_facebook',
                'value' => null,
                'type' => 'text',
                'group' => 'social',
                'label' => 'Facebook URL',
                'label_en' => 'Facebook URL',
            ],
            [
                'key' => 'social_instagram',
                'value' => null,
                'type' => 'text',
                'group' => 'social',
                'label' => 'Instagram URL',
                'label_en' => 'Instagram URL',
            ],
            [
                'key' => 'social_linkedin',
                'value' => null,
                'type' => 'text',
                'group' => 'social',
                'label' => 'LinkedIn URL',
                'label_en' => 'LinkedIn URL',
            ],
            [
                'key' => 'social_twitter',
                'value' => null,
                'type' => 'text',
                'group' => 'social',
                'label' => 'Twitter / X URL',
                'label_en' => 'Twitter / X URL',
            ],
            [
                'key' => 'social_tiktok',
                'value' => null,
                'type' => 'text',
                'group' => 'social',
                'label' => 'TikTok URL',
                'label_en' => 'TikTok URL',
            ],

            // Company Information
            [
                'key' => 'company_about',
                'value' => 'Laman Teknologi Sdn. Bhd. adalah syarikat teknologi yang menyediakan penyelesaian digital terbaik untuk organisasi.',
                'type' => 'textarea',
                'group' => 'company',
                'label' => 'Tentang Syarikat',
                'label_en' => 'About Company',
            ],
            [
                'key' => 'company_vision',
                'value' => 'Menjadi peneraju penyelesaian teknologi di Malaysia.',
                'type' => 'textarea',
                'group' => 'company',
                'label' => 'Visi',
                'label_en' => 'Vision',
            ],
            [
                'key' => 'company_mission',
                'value' => 'Menyediakan penyelesaian teknologi yang inovatif, berkualiti dan mampu milik untuk semua organisasi.',
                'type' => 'textarea',
                'group' => 'company',
                'label' => 'Misi',
                'label_en' => 'Mission',
            ],
            [
                'key' => 'company_registration',
                'value' => null,
                'type' => 'text',
                'group' => 'company',
                'label' => 'No. Pendaftaran SSM',
                'label_en' => 'SSM Registration No.',
            ],

            // SEO Settings
            [
                'key' => 'seo_title',
                'value' => 'Laman Teknologi - Teknologi Untuk Organisasi',
                'type' => 'text',
                'group' => 'seo',
                'label' => 'Tajuk SEO',
                'label_en' => 'SEO Title',
            ],
            [
                'key' => 'seo_description',
                'value' => 'Laman Teknologi Sdn. Bhd. menyediakan penyelesaian teknologi terbaik termasuk pembangunan sistem, UI/UX, cloud hosting dan banyak lagi.',
                'type' => 'textarea',
                'group' => 'seo',
                'label' => 'Penerangan SEO',
                'label_en' => 'SEO Description',
            ],
            [
                'key' => 'seo_keywords',
                'value' => 'teknologi, pembangunan sistem, web development, cloud hosting, Malaysia',
                'type' => 'text',
                'group' => 'seo',
                'label' => 'Kata Kunci SEO',
                'label_en' => 'SEO Keywords',
            ],

            // Footer
            [
                'key' => 'footer_text',
                'value' => '© 2026 Laman Teknologi Sdn. Bhd. Hak Cipta Terpelihara.',
                'type' => 'text',
                'group' => 'footer',
                'label' => 'Teks Footer',
                'label_en' => 'Footer Text',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::firstOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
