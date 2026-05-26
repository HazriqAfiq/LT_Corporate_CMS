<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    private function getOrCreateMedia(string $filename, string $collection): int
    {
        $path = "uploads/branding/" . $filename;
        $media = \App\Models\Media::where('path', $path)->first();
        if (!$media) {
            $media = \App\Models\Media::create([
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'filename' => $filename,
                'original_filename' => $filename,
                'path' => $path,
                'disk' => 'public',
                'type' => 'image',
                'extension' => pathinfo($filename, PATHINFO_EXTENSION),
                'collection' => $collection,
            ]);
        }
        return $media->id;
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $logoId = $this->getOrCreateMedia('logo.png', 'branding');
        $faviconId = $this->getOrCreateMedia('favicon.png', 'branding');
        $loginBgId = $this->getOrCreateMedia('login_bg.png', 'branding');
        $homepageBgId = $this->getOrCreateMedia('homepage_bg.png', 'branding');

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
                'value' => (string) $logoId,
                'type' => 'image',
                'group' => 'general',
                'label' => 'Logo Utama',
                'label_en' => 'Main Logo',
            ],
            [
                'key' => 'logo_dark',
                'value' => (string) $logoId,
                'type' => 'image',
                'group' => 'general',
                'label' => 'Logo Mod Gelap',
                'label_en' => 'Dark Mode Logo',
            ],
            [
                'key' => 'logo_footer',
                'value' => (string) $logoId,
                'type' => 'image',
                'group' => 'general',
                'label' => 'Logo Footer',
                'label_en' => 'Footer Logo',
            ],
            [
                'key' => 'favicon',
                'value' => (string) $faviconId,
                'type' => 'image',
                'group' => 'general',
                'label' => 'Favicon',
                'label_en' => 'Favicon',
            ],
            [
                'key' => 'login_background',
                'value' => (string) $loginBgId,
                'type' => 'image',
                'group' => 'general',
                'label' => 'Latar Belakang Log Masuk',
                'label_en' => 'Login Background',
            ],
            [
                'key' => 'homepage_background',
                'value' => (string) $homepageBgId,
                'type' => 'image',
                'group' => 'general',
                'label' => 'Latar Belakang Laman Utama',
                'label_en' => 'Homepage Background',
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
                'value' => 'Laman Teknologi Sdn. Bhd. menyediakan penyelesaian teknologi inovatif, keselamatan siber, dan perundingan IT menyeluruh untuk membantu perniagaan anda kekal berdaya saing dalam landskap digital.',
                'type' => 'textarea',
                'group' => 'company',
                'label' => 'Tentang Syarikat',
                'label_en' => 'About Company',
            ],
            [
                'key' => 'company_background',
                'value' => "<h3>Tentang Laman Teknologi: Penyelesaian Teknologi Inovatif untuk Membantu Perniagaan Anda Sentiasa Selangkah ke Hadapan</h3><p>Di Laman Teknologi, kami bersemangat dalam menyediakan penyelesaian teknologi inovatif dan menyeluruh untuk membantu perniagaan kekal selangkah ke hadapan dalam dunia digital yang pantas berubah. Kami memahami bahawa teknologi sentiasa berkembang, dan perniagaan perlu menyesuaikan diri dengan cepat untuk kekal berdaya saing. Oleh itu, kami komited untuk sentiasa mengikuti perkembangan terkini dalam industri serta memanfaatkan kepakaran kami untuk menyediakan penyelesaian yang disesuaikan bagi membantu pelanggan mencapai matlamat mereka.</p><p>Pasukan kami terdiri daripada para profesional berpengalaman dengan kepakaran dalam pelbagai bidang teknologi, termasuk pembangunan perisian, keselamatan siber, pengkomputeran awan, perundingan IT, dan banyak lagi. Kami bekerjasama rapat dengan pelanggan untuk memahami keperluan dan cabaran unik mereka, lalu membangunkan penyelesaian yang disesuaikan dengan matlamat perniagaan mereka.</p><p>Di Laman Teknologi, kami mengutamakan kepuasan pelanggan dan berusaha memberikan perkhidmatan terbaik. Pendekatan berpusatkan pelanggan kami membolehkan kami membina hubungan jangka panjang serta membantu mereka mencapai kejayaan yang berterusan. Kami mengukur kejayaan kami berdasarkan kejayaan pelanggan, dan kami berbangga kerana telah membantu pelbagai perniagaan dalam pelbagai industri mencapai matlamat digital mereka.</p><p>Sama ada anda memerlukan pembangunan perisian khas, migrasi dan pengurusan awan, penyelesaian keselamatan siber, atau perundingan IT, Laman Teknologi sedia membantu. Hubungi kami hari ini untuk mengetahui lebih lanjut tentang bagaimana kami boleh membantu perniagaan anda kekal berdaya saing dalam landskap digital masa kini.</p>",
                'type' => 'richtext',
                'group' => 'company',
                'label' => 'Latar Belakang Syarikat',
                'label_en' => 'Company Background',
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
            [
                'key' => 'company_journey',
                'value' => "2020 | Penubuhan / Founded | Laman Teknologi ditubuhkan dengan visi besar. / Laman Teknologi was established with a grand vision.\n2021 | Produk Pertama / First Product | Pelancaran LamanHR — sistem HR pertama kami. / Launch of LamanHR — our first HR system.\n2023 | Pengembangan / Expansion | 30+ klien aktif dan 7 produk digital. / 30+ active clients and 7 digital products.\n2025 | Inovasi AI / AI Innovation | Pelancaran LamanAI untuk automasi pintar. / Launch of LamanAI for smart automation.",
                'type' => 'textarea',
                'group' => 'company',
                'label' => 'Perjalanan Syarikat (Milestones)',
                'label_en' => 'Company Journey (Milestones)',
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
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
