<?php

namespace Database\Seeders;

use App\Models\Slider;
use Illuminate\Database\Seeder;

class SliderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sliders = [
            [
                'title' => 'Penyelesaian Teknologi Pintar',
                'title_en' => 'Smart Technology Solutions',
                'subtitle' => 'Untuk Organisasi Anda',
                'subtitle_en' => 'For Your Organization',
                'description' => 'Kami membantu organisasi anda berkembang melalui teknologi moden, sistem pintar, dan penyelesaian digital yang inovatif untuk masa depan yang lebih efisien.',
                'description_en' => 'We help your organization grow through modern technology, smart systems, and innovative digital solutions for a more efficient future.',
                'image_path' => 'uploads/sliders/01KRXARSNHC19B0CYYAS6R7FED.jpg',
                'button_text' => 'Mulakan Sekarang',
                'button_text_en' => 'Get Started',
                'button_url' => '/hubungi-kami',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Transformasi Digital Korporat',
                'title_en' => 'Corporate Digital Transformation',
                'subtitle' => 'Menginovasi Aliran Kerja',
                'subtitle_en' => 'Innovating Workflows',
                'description' => 'Perkemaskan operasi perniagaan anda dengan platform awan yang disesuaikan, automasi dipacu AI dan keselamatan siber bertaraf standard industri.',
                'description_en' => 'Streamline your business operations with tailored cloud platforms, AI-driven automation, and industry-standard cybersecurity.',
                'image_path' => 'uploads/sliders/01KRXCHTZ96CS520V40SBF1XGS.avif',
                'button_text' => 'Lihat Produk',
                'button_text_en' => 'View Products',
                'button_url' => '/produk',
                'order' => 2,
                'is_active' => true,
            ],
        ];

        foreach ($sliders as $data) {
            $imagePath = $data['image_path'];
            unset($data['image_path']);

            $filename = basename($imagePath);
            $media = \App\Models\Media::create([
                'uuid' => (string) \Illuminate\Support\Str::uuid(),
                'filename' => $filename,
                'original_filename' => $filename,
                'path' => $imagePath,
                'disk' => 'public',
                'type' => 'image',
                'extension' => pathinfo($filename, PATHINFO_EXTENSION),
                'collection' => 'sliders',
            ]);

            $data['media_id'] = $media->id;

            Slider::updateOrCreate(
                ['title' => $data['title']],
                $data
            );
        }
    }
}
