<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $privacyPolicyBM = '<h2>1. Pengenalan</h2><p>Laman Teknologi Sdn. Bhd. ("kami") komited untuk melindungi dan menghormati privasi anda. Dasar ini menerangkan bagaimana kami mengumpul, menggunakan, dan melindungi maklumat peribadi anda.</p><h2>2. Maklumat Yang Kami Kumpul</h2><p>Kami mungkin mengumpul maklumat berikut:</p><ul><li>Nama dan maklumat hubungan (emel, nombor telefon).</li><li>Maklumat syarikat.</li><li>Maklumat yang anda berikan melalui borang hubungan kami.</li></ul><h2>3. Penggunaan Maklumat</h2><p>Maklumat yang dikumpul digunakan untuk:</p><ul><li>Menjawab pertanyaan anda.</li><li>Menyediakan perkhidmatan yang diminta.</li><li>Menghantar maklumat promosi jika anda bersetuju.</li></ul><h2>4. Keselamatan Data</h2><p>Kami melaksanakan langkah-langkah keselamatan yang sesuai untuk menghalang akses tanpa kebenaran, pendedahan, pengubahan, atau pemusnahan data peribadi anda tanpa kebenaran.</p><h2>5. Hubungi Kami</h2><p>Jika anda mempunyai sebarang soalan mengenai Dasar Privasi ini, sila hubungi kami di info@lamanteknologi.com.</p>';
        
        $privacyPolicyEN = '<h2>1. Introduction</h2><p>Laman Teknologi Sdn. Bhd. ("we", "us", or "our") is committed to protecting and respecting your privacy. This policy explains how we collect, use, and protect your personal information.</p><h2>2. Information We Collect</h2><p>We may collect the following information:</p><ul><li>Name and contact information (email, phone number).</li><li>Company information.</li><li>Information you provide through our contact forms.</li></ul><h2>3. Use of Information</h2><p>The collected information is used to:</p><ul><li>Respond to your inquiries.</li><li>Provide the requested services.</li><li>Send promotional materials if you consent.</li></ul><h2>4. Data Security</h2><p>We implement appropriate security measures to prevent unauthorized access, disclosure, alteration, or destruction of your personal data.</p><h2>5. Contact Us</h2><p>If you have any questions regarding this Privacy Policy, please contact us at info@lamanteknologi.com.</p>';

        $termsConditionsBM = '<h2>1. Penerimaan Terma</h2><p>Dengan mengakses dan menggunakan laman web ini, anda bersetuju untuk terikat dengan Terma & Syarat ini serta semua undang-undang dan peraturan yang terpakai.</p><h2>2. Hak Harta Intelek</h2><p>Semua kandungan di laman web ini, termasuk teks, grafik, logo, dan kod, adalah hak milik Laman Teknologi Sdn. Bhd. atau pembekal kandungannya dan dilindungi oleh undang-undang hak cipta.</p><h2>3. Penggunaan Laman</h2><p>Anda bersetuju untuk menggunakan laman web ini hanya untuk tujuan yang sah dan dengan cara yang tidak melanggar hak orang lain atau menyekat penggunaan mereka terhadap laman web ini.</p><h2>4. Penafian</h2><p>Laman web ini dan kandungannya disediakan "sebagaimana adanya". Kami tidak membuat sebarang jaminan, nyata atau tersirat, mengenai ketepatan, kebolehpercayaan, atau ketersediaan laman web ini.</p><h2>5. Perubahan Terma</h2><p>Kami berhak untuk mengubah Terma & Syarat ini pada bila-bila masa tanpa notis awal. Penggunaan berterusan anda selepas perubahan tersebut constitutes persetujuan anda terhadap terma baru.</p>';

        $termsConditionsEN = '<h2>1. Acceptance of Terms</h2><p>By accessing and using this website, you agree to be bound by these Terms & Conditions and all applicable laws and regulations.</p><h2>2. Intellectual Property Rights</h2><p>All content on this website, including text, graphics, logos, and code, is the property of Laman Teknologi Sdn. Bhd. or its content suppliers and is protected by copyright laws.</p><h2>3. Use of Site</h2><p>You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use of this website.</p><h2>4. Disclaimer</h2><p>This website and its contents are provided "as is". We make no warranties, expressed or implied, regarding the accuracy, reliability, or availability of this website.</p><h2>5. Changes to Terms</h2><p>We reserve the right to modify these Terms & Conditions at any time without prior notice. Your continued use after such modifications constitutes your acceptance of the new terms.</p>';

        \DB::table('settings')->updateOrInsert(
            ['key' => 'privacy_policy'],
            [
                'value' => $privacyPolicyBM,
                'value_en' => $privacyPolicyEN,
                'type' => 'richtext',
                'group' => 'company',
                'label' => 'Dasar Privasi',
                'label_en' => 'Privacy Policy',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        \DB::table('settings')->updateOrInsert(
            ['key' => 'terms_conditions'],
            [
                'value' => $termsConditionsBM,
                'value_en' => $termsConditionsEN,
                'type' => 'richtext',
                'group' => 'company',
                'label' => 'Terma & Syarat',
                'label_en' => 'Terms & Conditions',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \DB::table('settings')->whereIn('key', ['privacy_policy', 'terms_conditions'])->delete();
    }
};
