<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = [
            [
                'title' => 'Sistem E-Dagang Selangor',
                'title_en' => 'Selangor E-Commerce System',
                'slug' => 'sistem-e-dagang-selangor',
                'description' => 'Pembangunan portal e-dagang berprestasi tinggi untuk memperkasakan usahawan kecil di Selangor.',
                'description_en' => 'High-performance e-commerce portal development to empower small entrepreneurs in Selangor.',
                'content' => '<p>Portal e-dagang Selangor merupakan inisiatif transformasi digital yang dilancarkan oleh kerajaan negeri untuk memperkasakan usahawan kecil dan sederhana (PKS) di seluruh negeri Selangor. Projekt ini bermula dengan sesi konsultasi intensif bersama pihak berkepentingan termasuk wakil kerajaan negeri, persatuan peniaga, dan usahawan untuk memahami keperluan dan cabaran sebenar yang dihadapi oleh komuniti perniagaan tempatan dalam beralih ke platform digital.</p><p>Dari segi teknikal, portal ini dibina di atas seni bina berasaskan Laravel di bahagian backend dan React di bahagian frontend, dengan TailwindCSS sebagai rangka kerja rekabentuk. Pangkalan data MySQL yang dioptimumkan menyokong ribuan transaksi serentak dengan masa respons di bawah 100 milisaat. Caching berlapis menggunakan Redis memastikan halaman yang kerap diakses dimuatkan hampir serta-merta, memberikan pengalaman pengguna yang lancar walaupun pada waktu trafik puncak semasa kempen jualan.</p><p>Sistem ini mengintegrasikan pelbagai gerbang pembayaran tempatan dan antarabangsa termasuk FPX, Touch \'n Go eWallet, Boost, GrabPay, dan kad kredit melalui Stripe. Setiap transaksi dienkripsi dan dipantau untuk mengesan aktiviti penipuan. Modul inventori masa nyata memastikan stok produk sentiasa dikemas kini merentas semua kedai, mengelakkan situasi terlebih jual (overselling). Selain itu, sistem logistik bersepadu menghubungkan peniaga dengan perkhidmatan kurier seperti Pos Laju, J&T, dan DHL untuk penghantaran automatik.</p><p>Portal ini juga dilengkapi dengan papan pemuka analitik untuk setiap peniaga dan pentadbir. Peniaga boleh melihat prestasi jualan, produk terlaris, demografi pelanggan, dan trend mengikut masa. Pihak kerajaan negeri pula boleh memantau prestasi keseluruhan program — jumlah peniaga aktif, nilai transaksi, kategori produk popular, dan impak ekonomi — melalui papan pemuka eksekutif. Sejak dilancarkan, portal ini telah membantu lebih 10,000 usahawan Selangor menjana pendapatan digital dan mengembangkan pasaran mereka ke seluruh Malaysia.</p>',
                'content_en' => '<p>The Selangor E-Commerce portal is a digital transformation initiative launched by the state government to empower small and medium entrepreneurs (SMEs) throughout Selangor. The project began with intensive consultation sessions with stakeholders including state government representatives, trade associations, and entrepreneurs to understand the real needs and challenges faced by the local business community in transitioning to digital platforms.</p><p>Technically, the portal is built on a Laravel-based architecture for the backend and React for the frontend, with TailwindCSS as the design framework. An optimized MySQL database supports thousands of concurrent transactions with sub-100-millisecond response times. Multi-layered caching using Redis ensures frequently accessed pages load almost instantly, providing a smooth user experience even during peak traffic periods during sales campaigns.</p><p>The system integrates various local and international payment gateways including FPX, Touch \'n Go eWallet, Boost, GrabPay, and credit cards via Stripe. Every transaction is encrypted and monitored for fraud detection. The real-time inventory module ensures product stock is always updated across all stores, preventing overselling situations. Additionally, the integrated logistics system connects merchants with courier services such as Pos Laju, J&T, and DHL for automated shipping.</p><p>The portal is also equipped with analytics dashboards for each merchant and administrator. Merchants can view sales performance, top-selling products, customer demographics, and trends over time. The state government can monitor the overall program performance — number of active merchants, transaction value, popular product categories, and economic impact — through an executive dashboard. Since launch, this portal has helped over 10,000 Selangor entrepreneurs generate digital income and expand their market reach throughout Malaysia.</p>',
                'client' => 'Kerajaan Negeri Selangor',
                'category' => 'Web Development',
                'featured_media_id' => null,
                'gallery_media_ids' => null,
                'technologies' => ['Laravel', 'React', 'TailwindCSS', 'MySQL'],
                'url' => 'https://selangorec.example.com',
                'testimonial' => 'Sistem yang sangat lancar dan berjaya membantu lebih 10,000 usahawan beralih ke alam digital.',
                'testimonial_en' => 'A very smooth system that successfully helped over 10,000 entrepreneurs transition into the digital realm.',
                'testimonial_author' => 'Pengarah Unit Digital Selangor',
                'is_featured' => true,
                'is_published' => true,
                'completed_at' => '2025-10-15',
                'order' => 1,
            ],
            [
                'title' => 'Aplikasi Penjejakan Logistik SmartTrack',
                'title_en' => 'SmartTrack Logistics Tracking App',
                'slug' => 'aplikasi-penjejakan-logistik-smarttrack',
                'description' => 'Aplikasi mudah alih iOS & Android untuk penjejakan armada logistik secara masa nyata (real-time).',
                'description_en' => 'Mobile iOS & Android application for real-time logistics fleet tracking.',
                'content' => '<p>SmartTrack adalah aplikasi penjejakan logistik generasi terkini yang direka khas untuk syarikat logistik yang menguruskan armada kenderaan yang besar. Projek ini bermula apabila SmartTrack Logistics Sdn. Bhd. mendapati bahawa sistem penjejakan sedia ada mereka — yang bergantung kepada panggilan telefon dan kemas kini manual — tidak lagi mencukupi untuk mengendalikan pertumbuhan operasi yang pesat. Mereka memerlukan penyelesaian digital yang memberikan keterlihatan masa nyata ke atas setiap kenderaan dan penghantaran.</p><p>Aplikasi ini dibangunkan menggunakan Flutter, membolehkan penggunaan tunggal pangkalan kod untuk kedua-dua platform iOS dan Android — menjimatkan kos pembangunan dan penyelenggaraan. Backend dibina dengan Node.js dan Firebase, menyediakan kemas kini masa nyata melalui WebSocket dan Firebase Realtime Database. Integrasi Google Maps API memberikan visualisasi laluan yang tepat dengan lapisan trafik masa nyata, membolehkan pemandu mengelakkan kesesakan dan pusat kawalan memantau pergerakan setiap kenderaan pada peta interaktif.</p><p>Ciri pengoptimuman laluan berasaskan kecerdasan buatan (AI) adalah komponen teras aplikasi ini. Algoritma pembelajaran mesin menganalisis data trafik sejarah dan masa nyata, cuaca, jarak, dan kekangan masa untuk mencadangkan laluan paling efisien bagi setiap pemandu. Ini bukan sahaja mengurangkan penggunaan bahan api, tetapi juga meningkatkan bilangan penghantaran yang boleh diselesaikan dalam sehari. Ujian lapangan menunjukkan pengurangan masa kelewatan sebanyak 25% selepas pelaksanaan pengoptimuman laluan AI.</p><p>Selain penjejakan, aplikasi ini juga menyediakan komunikasi dua hala antara pemandu dan pusat kawalan melalui ciri chat bersepadu. Pengesahan penghantaran digital — lengkap dengan tandatangan elektronik, foto barang yang dihantar, dan cop masa GPS — menggantikan borang kertas yang leceh dan mudah hilang. Papan pemuka analitik memberikan laporan prestasi armada, kecekapan pemandu, dan trend penghantaran kepada pihak pengurusan. Hasilnya, skor kepuasan pelanggan SmartTrack meningkat secara signifikan.</p>',
                'content_en' => '<p>SmartTrack is a next-generation logistics tracking application specifically designed for logistics companies managing large vehicle fleets. This project began when SmartTrack Logistics Sdn. Bhd. discovered that their existing tracking system — which relied on phone calls and manual updates — was no longer sufficient to handle rapid operational growth. They needed a digital solution providing real-time visibility over every vehicle and delivery.</p><p>The application was developed using Flutter, enabling a single codebase deployment for both iOS and Android platforms — saving development and maintenance costs. The backend was built with Node.js and Firebase, providing real-time updates via WebSocket and Firebase Realtime Database. Google Maps API integration provides accurate route visualization with real-time traffic layers, enabling drivers to avoid congestion and the control center to monitor every vehicle movement on an interactive map.</p><p>The AI-based route optimization feature is a core component of this application. Machine learning algorithms analyze historical and real-time traffic data, weather, distance, and time constraints to suggest the most efficient routes for each driver. This not only reduces fuel consumption but also increases the number of deliveries that can be completed in a day. Field tests demonstrated a 25% reduction in delay time after implementing AI route optimization.</p><p>Beyond tracking, the application also provides two-way communication between drivers and the control center through an integrated chat feature. Digital delivery confirmation — complete with electronic signatures, photos of delivered goods, and GPS timestamps — replaces cumbersome and easily lost paper forms. Analytics dashboards provide fleet performance reports, driver efficiency, and delivery trends to management. As a result, SmartTrack customer satisfaction scores increased significantly.</p>',
                'client' => 'SmartTrack Logistics Sdn. Bhd.',
                'category' => 'Mobile App',
                'featured_media_id' => null,
                'gallery_media_ids' => null,
                'technologies' => ['Flutter', 'Firebase', 'Google Maps API', 'Node.js'],
                'url' => 'https://smarttrack.example.com',
                'testimonial' => 'Mengurangkan masa kelewatan penghantaran sebanyak 25% dan meningkatkan kepuasan pelanggan kami.',
                'testimonial_en' => 'Reduced delivery delays by 25% and dramatically boosted our customer satisfaction scores.',
                'testimonial_author' => 'Ketua Pegawai Operasi SmartTrack',
                'is_featured' => true,
                'is_published' => true,
                'completed_at' => '2026-01-20',
                'order' => 2,
            ],
            [
                'title' => 'Migrasi Infrastruktur Awan Tenaga Nasional',
                'title_en' => 'TNB Cloud Infrastructure Migration',
                'slug' => 'migrasi-infrastruktur-awan-tenaga-nasional',
                'description' => 'Migrasi pangkalan data legacy dan sistem teras ke arkitektur awan AWS yang selamat dan berskala.',
                'description_en' => 'Migration of legacy databases and core systems to a secure and scalable AWS cloud architecture.',
                'content' => '<p>Projek migrasi infrastruktur awan Tenaga Nasional Berhad (TNB) merupakan salah satu inisiatif transformasi digital terbesar di Malaysia. TNB, sebagai penyedia utiliti elektrik nasional, mengendalikan sistem-sistem kritikal yang menyokong bekalan tenaga kepada jutaan rakyat Malaysia. Sistem legacy yang berusia lebih 15 tahun beroperasi di pusat data fizikal, menghadapi cabaran dari segi kos penyelenggaraan yang tinggi, kebolehskalaan yang terhad, dan risiko gangguan yang semakin meningkat.</p><p>Fasa pertama projek melibatkan migrasi pangkalan data legacy — termasuk Oracle, SQL Server, dan sistem fail — ke platform AWS. Pasukan kami melaksanakan strategi migrasi berperingkat menggunakan AWS Database Migration Service (DMS) dan Schema Conversion Tool (SCT) untuk meminimumkan masa henti (downtime). Pangkalan data yang telah dimigrasi diletakkan di bawah Amazon RDS dengan konfigurasi Multi-AZ untuk ketersediaan tinggi dan failover automatik. Keseluruhan proses migrasi diselesaikan dalam tempoh enam bulan dengan gangguan perkhidmatan yang minimum kepada operasi harian TNB.</p><p>Infrastruktur sebagai Kod (IaC) dilaksanakan menggunakan Terraform, membolehkan setiap komponen infrastruktur — daripada Virtual Private Cloud (VPC), subnet, security groups, sehinggalah kepada kluster pangkalan data — ditakrifkan dalam kod yang boleh diuji, diaudit, dan direplikasi dengan mudah. Sebarang perubahan kepada infrastruktur melalui pipeline CI/CD yang ketat, memastikan konsistensi dan mengurangkan risiko kesilapan manual. Orkestrasi Kubernetes diimplementasi untuk menguruskan aplikasi kontena (containerized applications), membolehkan aplikasi korporat diskalakan secara automatik berdasarkan beban trafik sebenar.</p><p>Strategi sandaran dan pemulihan bencana (Disaster Recovery) yang komprehensif turut dilaksanakan. Sandaran automatik harian dijalankan ke Amazon S3 dengan dasar pengekalan berperingkat — sandaran harian (30 hari), mingguan (12 minggu), dan bulanan (12 bulan). Infrastruktur pemulihan bencana di rantau AWS yang berasingan diwujudkan dengan Recovery Time Objective (RTO) kurang daripada 4 jam dan Recovery Point Objective (RPO) kurang daripada 15 minit. Sejak migrasi diselesaikan, TNB melaporkan peningkatan prestasi sistem sebanyak 40% dan penjimatan kos operasi IT sehingga 15% berbanding penyelenggaraan pusat data fizikal.</p>',
                'content_en' => '<p>The Tenaga Nasional Berhad (TNB) cloud infrastructure migration project is one of the largest digital transformation initiatives in Malaysia. TNB, as the national electricity utility provider, operates critical systems that support energy supply to millions of Malaysians. Legacy systems over 15 years old were operating in physical data centers, facing challenges in terms of high maintenance costs, limited scalability, and increasing disruption risks.</p><p>The first phase of the project involved migrating legacy databases — including Oracle, SQL Server, and file systems — to the AWS platform. Our team implemented a phased migration strategy using AWS Database Migration Service (DMS) and Schema Conversion Tool (SCT) to minimize downtime. Migrated databases were placed under Amazon RDS with Multi-AZ configuration for high availability and automatic failover. The entire migration process was completed within six months with minimal service disruption to TNB daily operations.</p><p>Infrastructure as Code (IaC) was implemented using Terraform, enabling every infrastructure component — from Virtual Private Cloud (VPC), subnets, security groups, to database clusters — to be defined in testable, auditable, and easily replicable code. Any infrastructure changes go through a rigorous CI/CD pipeline, ensuring consistency and reducing the risk of manual errors. Kubernetes orchestration was implemented to manage containerized applications, enabling corporate applications to scale automatically based on actual traffic loads.</p><p>A comprehensive backup and disaster recovery strategy was also implemented. Automated daily backups are performed to Amazon S3 with tiered retention policies — daily backups (30 days), weekly (12 weeks), and monthly (12 months). Disaster recovery infrastructure in a separate AWS region was established with a Recovery Time Objective (RTO) of less than 4 hours and a Recovery Point Objective (RPO) of less than 15 minutes. Since migration completion, TNB reports a 40% improvement in system performance and IT operational cost savings of up to 15% compared to physical data center maintenance.</p>',
                'client' => 'Tenaga Nasional Berhad',
                'category' => 'Cloud Infrastructure',
                'featured_media_id' => null,
                'gallery_media_ids' => null,
                'technologies' => ['AWS', 'Terraform', 'Kubernetes', 'Docker'],
                'url' => null,
                'testimonial' => 'Prestasi sistem kami meningkat 40% dan kos operasi IT berjaya dijimatkan sehingga 15%.',
                'testimonial_en' => 'System performance increased by 40% and our IT operational costs were reduced by 15%.',
                'testimonial_author' => 'Pengurus IT Infrastruktur TNB',
                'is_featured' => true,
                'is_published' => true,
                'completed_at' => '2026-03-05',
                'order' => 3,
            ],
            [
                'title' => 'Analitis Pelanggan Dipacu Kecerdasan Buasan (AI)',
                'title_en' => 'AI-Driven Customer Analytics Portal',
                'slug' => 'analitis-pelanggan-dipacu-kecerdasan-buatan-ai',
                'description' => 'Integrasi model pembelajaran mesin untuk meramal trend pembelian pelanggan dan mencadangkan diskaun automatik.',
                'description_en' => 'Machine learning model integration to predict customer buying trends and automate coupon recommendations.',
                'content' => '<p>Projek Analitis Pelanggan Dipacu AI merupakan kerjasama strategik antara Laman Teknologi dan Kuala Lumpur Retail Group (KLRG), sebuah konglomerat runcit yang mengendalikan rangkaian pasar raya dan kedai serbaneka di seluruh Lembah Klang. KLRG menghadapi cabaran utama — mereka mempunyai data transaksi pelanggan yang sangat besar tetapi tidak mempunyai keupayaan untuk menukarkan data tersebut kepada cerapan perniagaan yang boleh diambil tindakan. Tawaran diskaun dan promosi mereka bersifat generik, menyebabkan kadar penebusan yang rendah dan pembaziran belanjawan pemasaran.</p><p>Pasukan sains data kami membangunkan model pembelajaran mesin tersuai menggunakan Python dan TensorFlow untuk menganalisis tiga sumber data utama KLRG: data transaksi di kaunter jualan (Point of Sale), data program kesetiaan pelanggan, dan data interaksi aplikasi mudah alih. Model ini dilatih untuk mengenal pasti corak pembelian, meramalkan keperluan pelanggan, dan mencadangkan diskaun yang diperibadikan. Aliran data masa nyata diproses menggunakan Apache Kafka, manakala FastAPI menyediakan API berprestasi tinggi untuk integrasi dengan portal e-dagang sedia ada KLRG.</p><p>Salah satu komponen paling inovatif dalam projek ini adalah enjin cadangan diskaun automatik. Apabila pelanggan melayari portal e-dagang atau aplikasi mudah alih KLRG, model AI menganalisis sejarah pembelian, corak pelayaran semasa, dan data demografi mereka dalam masa beberapa milisaat. Berdasarkan analisis ini, sistem mencadangkan diskaun yang sangat relevan dan diperibadikan — contohnya, menawarkan diskaun lampin kepada ibu bapa yang sebelum ini membeli susu bayi, atau mencadangkan promosi makanan kucing kepada pelanggan yang kerap membeli produk haiwan peliharaan.</p><p>Hasilnya melebihi jangkaan. Dalam tempoh tiga bulan pertama selepas pelaksanaan, KLRG melaporkan peningkatan kadar penebusan kupon sebanyak 35% dan peningkatan jualan keseluruhan sebanyak 18%. Nilai troli purata meningkat sebanyak 22% kerana cadangan produk yang lebih relevan. Yang paling penting, skor kepuasan pelanggan meningkat dengan ketara kerana pelanggan merasakan promosi yang mereka terima benar-benar memahami keperluan mereka. Projek ini telah menjadi model rujukan untuk inisiatif AI-driven retail di Malaysia.</p>',
                'content_en' => '<p>The AI-Driven Customer Analytics Project is a strategic collaboration between Laman Teknologi and Kuala Lumpur Retail Group (KLRG), a retail conglomerate operating a chain of supermarkets and convenience stores throughout the Klang Valley. KLRG faced a major challenge — they had enormous customer transaction data but lacked the capability to transform that data into actionable business insights. Their discount and promotion offerings were generic, resulting in low redemption rates and marketing budget wastage.</p><p>Our data science team developed custom machine learning models using Python and TensorFlow to analyze three key data sources from KLRG: Point of Sale transaction data, customer loyalty program data, and mobile app interaction data. The model was trained to identify purchasing patterns, predict customer needs, and recommend personalized discounts. Real-time data streams were processed using Apache Kafka, while FastAPI provided a high-performance API for integration with KLRG existing e-commerce portal.</p><p>One of the most innovative components of this project is the automated discount recommendation engine. When a customer browses the KLRG e-commerce portal or mobile app, the AI model analyzes their purchase history, current browsing patterns, and demographic data within milliseconds. Based on this analysis, the system suggests highly relevant and personalized discounts — for example, offering diaper discounts to parents who previously purchased baby formula, or suggesting cat food promotions to customers who frequently buy pet products.</p><p>The results exceeded expectations. Within the first three months after implementation, KLRG reported a 35% increase in coupon redemption rates and an 18% increase in overall sales. Average basket value increased by 22% due to more relevant product recommendations. Most importantly, customer satisfaction scores improved significantly because customers felt the promotions they received truly understood their needs. This project has become a reference model for AI-driven retail initiatives in Malaysia.</p>',
                'client' => 'Kuala Lumpur Retail Group',
                'category' => 'AI Integration',
                'featured_media_id' => null,
                'gallery_media_ids' => null,
                'technologies' => ['Python', 'TensorFlow', 'FastAPI', 'PostgreSQL'],
                'url' => 'https://klretail.example.com',
                'testimonial' => 'Satu inovasi hebat! Kami kini dapat memahami keperluan pelanggan secara ramalan dengan sangat tepat.',
                'testimonial_en' => 'An amazing innovation! We can now predictively understand customer needs with high precision.',
                'testimonial_author' => 'Pengarah Pemasaran KL Retail Group',
                'is_featured' => false,
                'is_published' => true,
                'completed_at' => '2026-04-12',
                'order' => 4,
            ],
        ];

        foreach ($projects as $project) {
            $imageMapping = [
                'sistem-e-dagang-selangor' => 'selangor_ecommerce.png',
                'aplikasi-penjejakan-logistik-smarttrack' => 'smarttrack.png',
                'migrasi-infrastruktur-awan-tenaga-nasional' => 'tnb_cloud.png',
                'analitis-pelanggan-dipacu-kecerdasan-buatan-ai' => 'retail_analytics.png',
            ];

            $slug = $project['slug'];
            $imageName = $imageMapping[$slug] ?? null;
            $mediaId = null;

            if ($imageName) {
                $mediaPath = 'uploads/projects/' . $imageName;
                $media = \App\Models\Media::firstOrCreate(
                    ['path' => $mediaPath],
                    [
                        'uuid' => (string) \Illuminate\Support\Str::uuid(),
                        'type' => 'image',
                        'extension' => 'png',
                        'filename' => $imageName,
                        'original_filename' => $imageName,
                        'disk' => 'public',
                        'mime_type' => 'image/png',
                        'size' => 102400,
                        'is_public' => true,
                        'title' => $project['title'] . ' Preview',
                        'alt_text' => $project['title'] . ' Preview Image',
                        'collection' => 'projects',
                    ]
                );
                $mediaId = $media->id;
            }

            $projectData = $project;
            if ($mediaId) {
                $projectData['featured_media_id'] = $mediaId;
            }

            Project::updateOrCreate(
                ['slug' => $slug],
                $projectData
            );
        }
    }
}
