import PublicLayout from '@/Layouts/PublicLayout';

export default function Privacy({ settings = {} }) {
    return (
        <PublicLayout title="Dasar Privasi" settings={settings}>
            <section className="pt-32 pb-20 bg-navy-gradient">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Dasar <span className="text-[var(--gold)]">Privasi</span></h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">Komitmen kami terhadap perlindungan data peribadi anda.</p>
                </div>
            </section>

            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none">
                        <h2>1. Pengenalan</h2>
                        <p>Laman Teknologi Sdn. Bhd. ("kami") komited untuk melindungi dan menghormati privasi anda. Dasar ini menerangkan bagaimana kami mengumpul, menggunakan, dan melindungi maklumat peribadi anda.</p>

                        <h2>2. Maklumat Yang Kami Kumpul</h2>
                        <p>Kami mungkin mengumpul maklumat berikut:</p>
                        <ul>
                            <li>Nama dan maklumat hubungan (emel, nombor telefon).</li>
                            <li>Maklumat syarikat.</li>
                            <li>Maklumat yang anda berikan melalui borang hubungan kami.</li>
                        </ul>

                        <h2>3. Penggunaan Maklumat</h2>
                        <p>Maklumat yang dikumpul digunakan untuk:</p>
                        <ul>
                            <li>Menjawab pertanyaan anda.</li>
                            <li>Menyediakan perkhidmatan yang diminta.</li>
                            <li>Menghantar maklumat promosi jika anda bersetuju.</li>
                        </ul>

                        <h2>4. Keselamatan Data</h2>
                        <p>Kami melaksanakan langkah-langkah keselamatan yang sesuai untuk menghalang akses tanpa kebenaran, pendedahan, pengubahan, atau pemusnahan data peribadi anda tanpa kebenaran.</p>

                        <h2>5. Hubungi Kami</h2>
                        <p>Jika anda mempunyai sebarang soalan mengenai Dasar Privasi ini, sila hubungi kami di info@lamanteknologi.com.</p>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
