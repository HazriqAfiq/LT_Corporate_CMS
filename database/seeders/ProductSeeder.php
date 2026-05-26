<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'LamanHR',
                'name_en' => 'LamanHR',
                'slug' => 'lamanhr',
                'description' => 'Sistem pengurusan sumber manusia yang lengkap dan moden untuk organisasi anda.',
                'description_en' => 'A complete and modern human resource management system for your organization.',
                'icon' => null,
                'category' => 'Pengurusan',
                'features' => ['Pengurusan Pekerja', 'Sistem Cuti', 'Pengurusan Gaji', 'Laporan HR', 'Kehadiran Digital'],
                'features_en' => ['Employee Management', 'Leave System', 'Payroll Management', 'HR Reports', 'Digital Attendance'],
                'is_active' => true,
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'name' => 'LamanSupport',
                'name_en' => 'LamanSupport',
                'slug' => 'lamansupport',
                'description' => 'Sistem sokongan pelanggan dan tiket yang efisien untuk perniagaan anda.',
                'description_en' => 'An efficient customer support and ticketing system for your business.',
                'icon' => null,
                'category' => 'Sokongan',
                'features' => ['Sistem Tiket', 'Live Chat', 'Pangkalan Pengetahuan', 'Laporan SLA', 'Integrasi Email'],
                'features_en' => ['Ticketing System', 'Live Chat', 'Knowledge Base', 'SLA Reports', 'Email Integration'],
                'is_active' => true,
                'is_featured' => true,
                'order' => 2,
            ],
            [
                'name' => 'LamanAI',
                'name_en' => 'LamanAI',
                'slug' => 'lamanai',
                'description' => 'Penyelesaian kecerdasan buatan untuk automasi dan analitik perniagaan.',
                'description_en' => 'Artificial intelligence solutions for business automation and analytics.',
                'icon' => null,
                'category' => 'AI',
                'features' => ['Chatbot AI', 'Analitik Ramalan', 'Automasi Proses', 'NLP Bahasa Melayu', 'Dashboard Pintar'],
                'features_en' => ['AI Chatbot', 'Predictive Analytics', 'Process Automation', 'Malay NLP', 'Smart Dashboard'],
                'is_active' => true,
                'is_featured' => true,
                'order' => 3,
            ],
            [
                'name' => 'LamanTeam',
                'name_en' => 'LamanTeam',
                'slug' => 'lamanteam',
                'description' => 'Platform kolaborasi pasukan untuk pengurusan projek dan komunikasi dalaman.',
                'description_en' => 'Team collaboration platform for project management and internal communication.',
                'icon' => null,
                'category' => 'Kolaborasi',
                'features' => ['Pengurusan Projek', 'Kanban Board', 'Chat Pasukan', 'Perkongsian Fail', 'Penjejakan Masa'],
                'features_en' => ['Project Management', 'Kanban Board', 'Team Chat', 'File Sharing', 'Time Tracking'],
                'is_active' => true,
                'is_featured' => false,
                'order' => 4,
            ],
            [
                'name' => 'LamanCRM',
                'name_en' => 'LamanCRM',
                'slug' => 'lamancrm',
                'description' => 'Sistem pengurusan hubungan pelanggan untuk meningkatkan jualan dan khidmat pelanggan.',
                'description_en' => 'Customer relationship management system to boost sales and customer service.',
                'icon' => null,
                'category' => 'Jualan',
                'features' => ['Pipeline Jualan', 'Pengurusan Leads', 'Automasi Pemasaran', 'Laporan Jualan', 'Integrasi WhatsApp'],
                'features_en' => ['Sales Pipeline', 'Lead Management', 'Marketing Automation', 'Sales Reports', 'WhatsApp Integration'],
                'is_active' => true,
                'is_featured' => false,
                'order' => 5,
            ],
            [
                'name' => 'LamanEvent',
                'name_en' => 'LamanEvent',
                'slug' => 'lamanevent',
                'description' => 'Platform pengurusan acara dan pendaftaran peserta secara digital.',
                'description_en' => 'Digital event management and participant registration platform.',
                'icon' => null,
                'category' => 'Acara',
                'features' => ['Pendaftaran Online', 'Pengurusan Tempat', 'E-Sijil', 'QR Check-in', 'Laporan Acara'],
                'features_en' => ['Online Registration', 'Venue Management', 'E-Certificate', 'QR Check-in', 'Event Reports'],
                'is_active' => true,
                'is_featured' => false,
                'order' => 6,
            ],
            [
                'name' => 'LamanRisk',
                'name_en' => 'LamanRisk',
                'slug' => 'lamanrisk',
                'description' => 'Sistem pengurusan risiko dan pematuhan untuk organisasi korporat.',
                'description_en' => 'Risk management and compliance system for corporate organizations.',
                'icon' => null,
                'category' => 'Pematuhan',
                'features' => ['Penilaian Risiko', 'Pematuhan Regulasi', 'Audit Trail', 'Dashboard Risiko', 'Laporan Pematuhan'],
                'features_en' => ['Risk Assessment', 'Regulatory Compliance', 'Audit Trail', 'Risk Dashboard', 'Compliance Reports'],
                'is_active' => true,
                'is_featured' => false,
                'order' => 7,
            ],
        ];

        foreach ($products as $product) {
            $imageMapping = [
                'lamanhr' => 'hr_dashboard.png',
                'lamansupport' => 'support_crm.png',
                'lamanai' => 'ai_analytics.png',
                'lamanteam' => 'hr_dashboard.png',
                'lamancrm' => 'support_crm.png',
                'lamanevent' => 'ai_analytics.png',
                'lamanrisk' => 'hr_dashboard.png',
            ];

            $slug = $product['slug'];
            $imageName = $imageMapping[$slug] ?? null;
            $mediaId = null;

            if ($imageName) {
                $mediaPath = 'uploads/products/' . $imageName;
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
                        'title' => $product['name'] . ' Preview',
                        'alt_text' => $product['name'] . ' Preview Image',
                        'collection' => 'products',
                    ]
                );
                $mediaId = $media->id;
            }

            $productData = $product;
            if ($mediaId) {
                $productData['featured_media_id'] = $mediaId;
            }

            $existingProduct = Product::where('slug', $slug)->first();
            if ($existingProduct) {
                $existingProduct->update($productData);
            } else {
                Product::create($productData);
            }
        }
    }
}
