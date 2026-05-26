<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the Admin user as the primary author
        $adminAuthor = User::where('email', 'admin2@lamanteknologi.com')->first();
        $adminId = $adminAuthor ? $adminAuthor->id : 1;

        // Get the Editor user as the secondary author
        $editorAuthor = User::where('email', 'editor@lamanteknologi.com')->first();
        $editorId = $editorAuthor ? $editorAuthor->id : $adminId;

        $articles = [
            [
                'title' => '5 Trend Teknologi 2024 Yang Perlu Anda Tahu',
                'title_en' => '5 Technology Trends in 2024 You Need to Know',
                'slug' => '5-trend-teknologi-2024-yang-perlu-anda-tahu',
                'excerpt' => 'Ketahui trend teknologi utama tahun ini yang bakal mengubah landskap perniagaan dan gaya hidup kita.',
                'excerpt_en' => 'Discover the major technology trends of the year that will reshape the business landscape and our daily lives.',
                'content' => '<p>Tahun 2024 membawa pelbagai inovasi teknologi yang pesat. Daripada integrasi AI yang lebih mendalam sehinggalah kepada kemajuan dalam pengkomputeran kuantum and ketersambungan 5G/6G.</p><p>Syarikat yang cepat mengadaptasi trend ini akan memimpin pasaran, manakala yang lambat akan ketinggalan jauh di belakang.</p>',
                'content_en' => '<p>The year 2024 brings rapid technological innovations, from deeper AI integration to advancements in quantum computing and 5G/6G connectivity.</p><p>Companies that quickly adapt to these trends will lead the market, while latecomers will fall far behind.</p>',
                'featured_image_path' => 'uploads/articles/digital_kl_bg.png',
                'category' => 'Teknologi',
                'tags' => ['Inovasi', '2024', 'Trend'],
                'meta_title' => '5 Trend Teknologi 2024',
                'meta_description' => 'Panduan lengkap mengenai trend teknologi terkemuka yang melanda industri global pada tahun 2024.',
                'author_id' => $adminId,
                'is_published' => true,
                'is_featured' => true,
                'views_count' => 520,
                'published_at' => '2024-05-20 09:00:00',
            ],
            [
                'title' => 'AI Dalam Organisasi Moden',
                'title_en' => 'AI in Modern Organizations',
                'slug' => 'ai-dalam-organisasi-moden',
                'excerpt' => 'Penerokaan praktikal bagaimana kecerdasan buatan menyelaraskan aliran kerja dan meningkatkan pembuatan keputusan.',
                'excerpt_en' => 'A practical exploration of how artificial intelligence streamlines workflows and enhances decision-making.',
                'content' => '<p>Kecerdasan buatan (AI) kini bukan sekadar gimik. Ia membolehkan sistem mengautomasikan analisis data yang kompleks, menjimatkan masa bernilai, serta memaksimumkan pulangan pelaburan.</p>',
                'content_en' => '<p>Artificial intelligence (AI) is no longer a gimmick. It enables systems to automate complex data analysis, saving valuable time and maximizing ROI.</p>',
                'featured_image_path' => 'uploads/sliders/01KRXARSNHC19B0CYYAS6R7FED.jpg',
                'category' => 'Kecerdasan Buatan',
                'tags' => ['AI', 'Automasi', 'Produktiviti'],
                'meta_title' => 'AI Dalam Organisasi Moden',
                'meta_description' => 'Cara mengintegrasikan AI for transformasi digital organisasi moden anda.',
                'author_id' => $adminId,
                'is_published' => true,
                'is_featured' => true,
                'views_count' => 380,
                'published_at' => '2024-05-18 10:30:00',
            ],
            [
                'title' => 'Cloud Computing: Kelebihan Untuk Organisasi',
                'title_en' => 'Cloud Computing: Benefits for Organizations',
                'slug' => 'cloud-computing-kelebihan-untuk-organisasi',
                'excerpt' => 'Kelebihan migrasi ke sistem awan dari segi skalabiliti, keselamatan, dan pengurangan kos infrastruktur fizikal.',
                'excerpt_en' => 'The benefits of migrating to cloud systems in terms of scalability, security, and physical infrastructure cost reduction.',
                'content' => '<p>Dengan cloud computing, organisasi tidak lagi dibebani oleh kos penyelenggaraan pelayan perkakasan tempatan yang mahal dan tidak fleksibel.</p>',
                'content_en' => '<p>With cloud computing, organizations are no longer burdened by the costs of maintaining local hardware servers that are expensive and inflexible.</p>',
                'featured_image_path' => 'uploads/articles/hero_laptop_city.png',
                'category' => 'Infrastruktur Awan',
                'tags' => ['Cloud', 'SaaS', 'Skalabiliti'],
                'meta_title' => 'Kelebihan Cloud Computing',
                'meta_description' => 'Mengapa migrasi ke cloud computing adalah pilihan paling bijak untuk organisasi digital hari ini.',
                'author_id' => $editorId,
                'is_published' => false,
                'is_featured' => false,
                'views_count' => 145,
                'published_at' => '2024-05-17 14:00:00',
            ],
            [
                'title' => 'Cybersecurity: Lindungi Data Perniagaan Anda',
                'title_en' => 'Cybersecurity: Protect Your Business Data',
                'slug' => 'cybersecurity-lindungi-data-perniagaan-anda',
                'excerpt' => 'Langkah-langkah penting untuk memastikan rangkaian, peranti, dan data perniagaan anda selamat daripada ancaman siber.',
                'excerpt_en' => 'Crucial steps to ensure your networks, devices, and business data are safe from cyber threats.',
                'content' => '<p>Keselamatan siber merupakan keutamaan kritikal hari ini di mana data sensitif perniagaan dan pelanggan sentiasa terdedah kepada serangan penggodam.</p>',
                'content_en' => '<p>Cybersecurity is a critical priority today where sensitive business and customer data are constantly exposed to hacker attacks.</p>',
                'featured_image_path' => 'uploads/sliders/01KRXCHTZ96CS520V40SBF1XGS.avif',
                'category' => 'Keselamatan',
                'tags' => ['Siber', 'Sekuriti', 'Perlindungan'],
                'meta_title' => 'Panduan Cybersecurity Perniagaan',
                'meta_description' => 'Pelajari langkah melindungi maklumat sulit syarikat anda daripada kebocoran data.',
                'author_id' => $editorId,
                'is_published' => false,
                'is_featured' => false,
                'views_count' => 95,
                'published_at' => '2024-05-16 11:15:00',
            ],
            [
                'title' => 'Panduan Memilih Sistem HR Yang Tepat',
                'title_en' => 'Guide to Choosing the Right HR System',
                'slug' => 'panduan-memilih-sistem-hr-yang-tepat',
                'excerpt' => 'Bagaimana memilih perisian pengurusan sumber manusia yang sepadan dengan skala operasi dan bajet syarikat.',
                'excerpt_en' => 'How to choose human resource management software that aligns with your company scale of operation and budget.',
                'content' => '<p>Sistem HR yang efisien membantu mempermudahkan urusan penggajian, tuntutan, cuti, serta penilaian prestasi kerja kakitangan secara automatik.</p>',
                'content_en' => '<p>An efficient HR system helps simplify payroll, claims, leave, and employee performance appraisals automatically.</p>',
                'featured_image_path' => 'uploads/sliders/01KRXB6J7MSSVBD2VVB6GDY955.png',
                'category' => 'Sistem HR',
                'tags' => ['HR', 'Pengurusan', 'Kakitangan'],
                'meta_title' => 'Cara Pilih Sistem HR Terbaik',
                'meta_description' => 'Tips dan kriteria utama memilih perisian HR bagi syarikat dan organisasi sederhana.',
                'author_id' => $adminId,
                'is_published' => true,
                'is_featured' => false,
                'views_count' => 290,
                'published_at' => '2024-05-15 15:45:00',
            ],
        ];

        foreach ($articles as $data) {
            $imagePath = $data['featured_image_path'];
            unset($data['featured_image_path']);

            $filename = basename($imagePath);
            $media = \App\Models\Media::create([
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'filename' => $filename,
                'original_filename' => $filename,
                'path' => $imagePath,
                'disk' => 'public',
                'type' => 'image',
                'extension' => pathinfo($filename, PATHINFO_EXTENSION),
                'collection' => 'articles',
            ]);

            $data['featured_media_id'] = $media->id;

            Article::updateOrCreate(
                ['slug' => $data['slug']],
                $data
            );
        }
    }
}
