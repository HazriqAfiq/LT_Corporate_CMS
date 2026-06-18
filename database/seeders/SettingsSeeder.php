<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    private function getOrCreateMedia(string $filename, string $collection): int
    {
        // Try direct uploads path first (where actual physical files are located)
        $path = "uploads/" . $filename;
        $media = \App\Models\Media::where('path', $path)->first();
        
        if (!$media) {
            // Fall back to check the legacy uploads/branding path
            $path = "uploads/branding/" . $filename;
            $media = \App\Models\Media::where('path', $path)->first();
        }

        if (!$media) {
            // Create a new record using the direct uploads path
            $path = "uploads/" . $filename;
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
                'value_en' => 'Laman Teknologi Sdn. Bhd.',
                'type' => 'text',
                'group' => 'general',
                'label' => 'Nama Laman',
                'label_en' => 'Site Name',
            ],
            [
                'key' => 'site_tagline',
                'value' => 'Teknologi Untuk Organisasi',
                'value_en' => 'Technology For Organizations',
                'type' => 'text',
                'group' => 'general',
                'label' => 'Tagline',
                'label_en' => 'Tagline',
            ],
            [
                'key' => 'site_description',
                'value' => 'Laman Teknologi Sdn. Bhd. menyediakan penyelesaian teknologi terbaik untuk organisasi anda.',
                'value_en' => 'Laman Teknologi Sdn. Bhd. provides the best technology solutions for your organization.',
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
                'key' => 'logo_admin_facing',
                'value' => (string) $logoId,
                'type' => 'image',
                'group' => 'general',
                'label' => 'Logo Panel Admin',
                'label_en' => 'Admin Facing Logo',
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
                'value_en' => 'Kuala Lumpur, Malaysia',
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
            [
                'key' => 'contact_business_hours',
                'value' => json_encode([
                    ['day_bm' => 'Isnin - Jumaat', 'day_en' => 'Monday - Friday', 'open_time' => '09:00', 'close_time' => '18:00', 'is_closed' => false],
                    ['day_bm' => 'Sabtu', 'day_en' => 'Saturday', 'open_time' => '09:00', 'close_time' => '13:00', 'is_closed' => false],
                    ['day_bm' => 'Ahad & Cuti Umum', 'day_en' => 'Sunday & Public Holidays', 'open_time' => '', 'close_time' => '', 'is_closed' => true],
                ]),
                'type' => 'textarea',
                'group' => 'contact',
                'label' => 'Waktu Operasi',
                'label_en' => 'Business Hours',
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
                'value_en' => 'Laman Teknologi Sdn. Bhd. provides innovative technology solutions, cybersecurity, and comprehensive IT consulting to help your business stay competitive in the digital landscape.',
                'type' => 'textarea',
                'group' => 'footer',
                'label' => 'Tentang Syarikat',
                'label_en' => 'About Company',
            ],
            [
                'key' => 'company_background',
                'value' => "<h3>Tentang Laman Teknologi: Penyelesaian Teknologi Inovatif untuk Membantu Perniagaan Anda Sentiasa Selangkah ke Hadapan</h3><p>Di Laman Teknologi, kami bersemangat dalam menyediakan penyelesaian teknologi inovatif dan menyeluruh untuk membantu perniagaan kekal selangkah ke hadapan dalam dunia digital yang pantas berubah. Kami memahami bahawa teknologi sentiasa berkembang, dan perniagaan perlu menyesuaikan diri dengan cepat untuk kekal berdaya saing. Oleh itu, kami komited untuk sentiasa mengikuti perkembangan terkini dalam industri serta memanfaatkan kepakaran kami untuk menyediakan penyelesaian yang disesuaikan bagi membantu pelanggan mencapai matlamat mereka.</p><p>Pasukan kami terdiri daripada para profesional berpengalaman dengan kepakaran dalam pelbagai bidang teknologi, termasuk pembangunan perisian, keselamatan siber, pengkomputeran awan, perundingan IT, dan banyak lagi. Kami bekerjasama rapat dengan pelanggan untuk memahami keperluan dan cabaran unik mereka, lalu membangunkan penyelesaian yang disesuaikan dengan matlamat perniagaan mereka.</p><p>Di Laman Teknologi, kami mengutamakan kepuasan pelanggan dan berusaha memberikan perkhidmatan terbaik. Pendekatan berpusatkan pelanggan kami membolehkan kami membina hubungan jangka panjang serta membantu mereka mencapai kejayaan yang berterusan. Kami mengukur kejayaan kami berdasarkan kejayaan pelanggan, dan kami berbangga kerana telah membantu pelbagai perniagaan dalam pelbagai industri mencapai matlamat digital mereka.</p><p>Sama ada anda memerlukan pembangunan perisian khas, migrasi dan pengurusan awan, penyelesaian keselamatan siber, atau perundingan IT, Laman Teknologi sedia membantu. Hubungi kami hari ini untuk mengetahui lebih lanjut tentang bagaimana kami boleh membantu perniagaan anda kekal berdaya saing dalam landskap digital masa kini.</p>",
                'value_en' => "<h3>About Laman Teknologi: Innovative Technology Solutions to Keep Your Business One Step Ahead</h3><p>At Laman Teknologi, we are passionate about providing innovative and comprehensive technology solutions to help businesses stay ahead in a fast-changing digital world. We understand that technology is constantly evolving, and businesses must adapt quickly to remain competitive. That is why we are committed to keeping up with the latest industry developments and leveraging our expertise to provide tailored solutions that help our clients achieve their goals.</p><p>Our team consists of experienced professionals with expertise across various technology fields, including software development, cybersecurity, cloud computing, IT consulting, and more. We work closely with clients to understand their unique needs and challenges, then develop solutions tailored to their business objectives.</p><p>At Laman Teknologi, we prioritize customer satisfaction and strive to deliver the best service. Our customer-centric approach enables us to build long-term relationships and help our clients achieve continued success. We measure our success by our clients' success, and we take pride in having helped many businesses across various industries achieve their digital goals.</p><p>Whether you need custom software development, cloud migration and management, cybersecurity solutions, or IT consulting, Laman Teknologi is here to help. Contact us today to learn more about how we can help your business stay competitive in today's digital landscape.</p>",
                'type' => 'richtext',
                'group' => 'company',
                'label' => 'Latar Belakang Syarikat',
                'label_en' => 'Company Background',
            ],
            [
                'key' => 'company_vision',
                'value' => 'Menjadi peneraju penyelesaian teknologi di Malaysia.',
                'value_en' => 'To become a leading technology solutions provider in Malaysia.',
                'type' => 'textarea',
                'group' => 'company',
                'label' => 'Visi',
                'label_en' => 'Vision',
            ],
            [
                'key' => 'company_mission',
                'value' => 'Menyediakan penyelesaian teknologi yang inovatif, berkualiti dan mampu milik untuk semua organisasi.',
                'value_en' => 'To provide innovative, high-quality, and affordable technology solutions for all organizations.',
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
                'value_en' => '© 2026 Laman Teknologi Sdn. Bhd. All Rights Reserved.',
                'type' => 'text',
                'group' => 'footer',
                'label' => 'Teks Footer',
                'label_en' => 'Footer Text',
            ],
            [
                'key' => 'privacy_policy',
                'value' => '<h2>1. Pengenalan</h2><p>Laman Teknologi Sdn. Bhd. ("kami") komited untuk melindungi dan menghormati privasi anda. Dasar ini menerangkan bagaimana kami mengumpul, menggunakan, dan melindungi maklumat peribadi anda.</p><h2>2. Maklumat Yang Kami Kumpul</h2><p>Kami mungkin mengumpul maklumat berikut:</p><ul><li>Nama dan maklumat hubungan (emel, nombor telefon).</li><li>Maklumat syarikat.</li><li>Maklumat yang anda berikan melalui borang hubungan kami.</li></ul><h2>3. Penggunaan Maklumat</h2><p>Maklumat yang dikumpul digunakan untuk:</p><ul><li>Menjawab pertanyaan anda.</li><li>Menyediakan perkhidmatan yang diminta.</li><li>Menghantar maklumat promosi jika anda bersetuju.</li></ul><h2>4. Keselamatan Data</h2><p>Kami melaksanakan langkah-langkah keselamatan yang sesuai untuk menghalang akses tanpa kebenaran, pendedahan, pengubahan, atau pemusnahan data peribadi anda tanpa kebenaran.</p><h2>5. Hubungi Kami</h2><p>Jika anda mempunyai sebarang soalan mengenai Dasar Privasi ini, sila hubungi kami di info@lamanteknologi.com.</p>',
                'value_en' => '<h2>1. Introduction</h2><p>Laman Teknologi Sdn. Bhd. ("we", "us", or "our") is committed to protecting and respecting your privacy. This policy explains how we collect, use, and protect your personal information.</p><h2>2. Information We Collect</h2><p>We may collect the following information:</p><ul><li>Name and contact information (email, phone number).</li><li>Company information.</li><li>Information you provide through our contact forms.</li></ul><h2>3. Use of Information</h2><p>The collected information is used to:</p><ul><li>Respond to your inquiries.</li><li>Provide the requested services.</li><li>Send promotional materials if you consent.</li></ul><h2>4. Data Security</h2><p>We implement appropriate security measures to prevent unauthorized access, disclosure, alteration, or destruction of your personal data.</p><h2>5. Contact Us</h2><p>If you have any questions regarding this Privacy Policy, please contact us at info@lamanteknologi.com.</p>',
                'type' => 'richtext',
                'group' => 'company',
                'label' => 'Dasar Privasi',
                'label_en' => 'Privacy Policy',
            ],
            [
                'key' => 'terms_conditions',
                'value' => '<h2>1. Penerimaan Terma</h2><p>Dengan mengakses dan menggunakan laman web ini, anda bersetuju untuk terikat dengan Terma & Syarat ini serta semua undang-undang dan peraturan yang terpakai.</p><h2>2. Hak Harta Intelek</h2><p>Semua kandungan di laman web ini, termasuk teks, grafik, logo, dan kod, adalah hak milik Laman Teknologi Sdn. Bhd. atau pembekal kandungannya dan dilindungi oleh undang-undang hak cipta.</p><h2>3. Penggunaan Laman</h2><p>Anda bersetuju untuk menggunakan laman web ini hanya untuk tujuan yang sah dan dengan cara yang tidak melanggar hak orang lain atau menyekat penggunaan mereka terhadap laman web ini.</p><h2>4. Penafian</h2><p>Laman web ini dan kandungannya disediakan "sebagaimana adanya". Kami tidak membuat sebarang jaminan, nyata atau tersirat, mengenai ketepatan, kebolehpercayaan, atau ketersediaan laman web ini.</p><h2>5. Perubahan Terma</h2><p>Kami berhak untuk mengubah Terma & Syarat ini pada bila-bila masa tanpa notis awal. Penggunaan berterusan anda selepas perubahan tersebut constitutes persetujuan anda terhadap terma baru.</p>',
                'value_en' => '<h2>1. Acceptance of Terms</h2><p>By accessing and using this website, you agree to be bound by these Terms & Conditions and all applicable laws and regulations.</p><h2>2. Intellectual Property Rights</h2><p>All content on this website, including text, graphics, logos, and code, is the property of Laman Teknologi Sdn. Bhd. or its content suppliers and is protected by copyright laws.</p><h2>3. Use of Site</h2><p>You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use of this website.</p><h2>4. Disclaimer</h2><p>This website and its contents are provided "as is". We make no warranties, expressed or implied, regarding the accuracy, reliability, or availability of this website.</p><h2>5. Changes to Terms</h2><p>We reserve the right to modify these Terms & Conditions at any time without prior notice. Your continued use after such modifications constitutes your acceptance of the new terms.</p>',
                'type' => 'richtext',
                'group' => 'company',
                'label' => 'Terma & Syarat',
                'label_en' => 'Terms & Conditions',
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
