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
                'content' => 'Portal e-dagang Selangor merupakan inisiatif kerajaan negeri untuk mendigitalkan perniagaan kecil dan sederhana. Menggunakan seni bina moden berasaskan Laravel dan React, portal ini menyokong ribuan transaksi harian dengan selamat dan pantas.',
                'content_en' => 'The Selangor E-Commerce portal is a state government initiative to digitize small and medium businesses. Built on a modern architecture using Laravel and React, the portal safely and quickly supports thousands of daily transactions.',
                'client' => 'Kerajaan Negeri Selangor',
                'category' => 'Web Development',
                'featured_image' => null,
                'images' => [],
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
                'content' => 'Aplikasi SmartTrack menyediakan penjejakan masa nyata armada kenderaan logistik menggunakan koordinat GPS, pengoptimuman laluan AI, serta komunikasi langsung antara pemandu dan pusat kawalan.',
                'content_en' => 'The SmartTrack application provides real-time tracking of logistics vehicle fleets using GPS coordinates, AI route optimization, and direct communication between drivers and the control center.',
                'client' => 'SmartTrack Logistics Sdn. Bhd.',
                'category' => 'Mobile App',
                'featured_image' => null,
                'images' => [],
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
                'content' => 'Inisiatif migrasi TNB melibatkan pemindahan infrastruktur data fizikal ke awan AWS. Pelaksanaan Terraform memastikan infrastruktur sebagai kod (IaC), manakala orkestras Kubernetes membolehkan aplikasi korporat beroperasi tanpa sela masa (zero downtime).',
                'content_en' => 'The TNB migration initiative involved transferring physical data infrastructure to AWS cloud. Executing Terraform ensured Infrastructure as Code (IaC), while Kubernetes orchestration allows corporate apps to operate with zero downtime.',
                'client' => 'Tenaga Nasional Berhad',
                'category' => 'Cloud Infrastructure',
                'featured_image' => null,
                'images' => [],
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
                'title' => 'Analitis Pelanggan Dipacu Kecerdasan Buatan (AI)',
                'title_en' => 'AI-Driven Customer Analytics Portal',
                'slug' => 'analitis-pelanggan-dipacu-kecerdasan-buatan-ai',
                'description' => 'Integrasi model pembelajaran mesin untuk meramal trend pembelian pelanggan dan mencadangkan diskaun automatik.',
                'description_en' => 'Machine learning model integration to predict customer buying trends and automate coupon recommendations.',
                'content' => 'Sistem analitis AI runcit ini mengumpulkan data jualan dan tingkah laku pengguna untuk melatih model pembelajaran mesin. Hasil ramalan digunakan oleh portal e-dagang untuk mencadangkan diskaun secara dinamik kepada pelanggan, meningkatkan jualan sebanyak 18%.',
                'content_en' => 'This retail AI analytics system aggregates sales and customer behavior data to train machine learning models. Predicted outcomes are used dynamically to suggest automatic coupons, raising sales by 18%.',
                'client' => 'Kuala Lumpur Retail Group',
                'category' => 'AI Integration',
                'featured_image' => null,
                'images' => [],
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
            Project::updateOrCreate(
                ['slug' => $project['slug']],
                $project
            );
        }
    }
}
