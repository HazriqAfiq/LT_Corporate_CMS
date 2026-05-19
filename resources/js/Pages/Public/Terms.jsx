import PublicLayout from '@/Layouts/PublicLayout';

export default function Terms({ settings = {} }) {
    return (
        <PublicLayout title="Terma & Syarat" settings={settings}>
            <section className="pt-32 pb-20 bg-navy-gradient">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Terma & <span className="text-[var(--gold)]">Syarat</span></h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">Peraturan dan garis panduan untuk penggunaan laman web kami.</p>
                </div>
            </section>

            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none">
                        <h2>1. Penerimaan Terma</h2>
                        <p>Dengan mengakses dan menggunakan laman web ini, anda bersetuju untuk terikat dengan Terma & Syarat ini serta semua undang-undang dan peraturan yang terpakai.</p>

                        <h2>2. Hak Harta Intelek</h2>
                        <p>Semua kandungan di laman web ini, termasuk teks, grafik, logo, dan kod, adalah hak milik Laman Teknologi Sdn. Bhd. atau pembekal kandungannya dan dilindungi oleh undang-undang hak cipta.</p>

                        <h2>3. Penggunaan Laman</h2>
                        <p>Anda bersetuju untuk menggunakan laman web ini hanya untuk tujuan yang sah dan dengan cara yang tidak melanggar hak orang lain atau menyekat penggunaan mereka terhadap laman web ini.</p>

                        <h2>4. Penafian</h2>
                        <p>Laman web ini dan kandungannya disediakan "sebagaimana adanya". Kami tidak membuat sebarang jaminan, nyata atau tersirat, mengenai ketepatan, kebolehpercayaan, atau ketersediaan laman web ini.</p>

                        <h2>5. Perubahan Terma</h2>
                        <p>Kami berhak untuk mengubah Terma & Syarat ini pada bila-bila masa tanpa notis awal. Penggunaan berterusan anda selepas perubahan tersebut constitutes persetujuan anda terhadap terma baru.</p>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
