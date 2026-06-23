import PublicLayout from '@/Layouts/PublicLayout';
import useLanguage from '@/Hooks/useLanguage';

export default function Terms({ settings = {} }) {
    const { lang } = useLanguage();
    const homepageBg = settings.homepage_background || '/storage/uploads/homepage_bg.webp';

    const defaultContentBM = `
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
    `;

    const defaultContentEN = `
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using this website, you agree to be bound by these Terms & Conditions and all applicable laws and regulations.</p>

        <h2>2. Intellectual Property Rights</h2>
        <p>All content on this website, including text, graphics, logos, and code, is the property of Laman Teknologi Sdn. Bhd. or its content suppliers and is protected by copyright laws.</p>

        <h2>3. Use of Site</h2>
        <p>You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use of this website.</p>

        <h2>4. Disclaimer</h2>
        <p>This website and its contents are provided "as is". We make no warranties, expressed or implied, regarding the accuracy, reliability, or availability of this website.</p>

        <h2>5. Changes to Terms</h2>
        <p>We reserve the right to modify these Terms & Conditions at any time without prior notice. Your continued use after such modifications constitutes your acceptance of the new terms.</p>
    `;

    const content = lang === 'en'
        ? (settings.terms_conditions_en || settings.terms_conditions || defaultContentEN)
        : (settings.terms_conditions || defaultContentBM);

    return (
        <PublicLayout title="Terma & Syarat" settings={settings}>
            {/* Hero Banner with Homepage-styled Backdrop */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-[#080808] border-b border-white/5 z-10" style={{ clipPath: 'inset(0)' }}>
                {/* Master Background Image (Static when scrolling) */}
                <div 
                    className="fixed inset-0 bg-cover bg-center pointer-events-none z-0 opacity-45" 
                    style={{ backgroundImage: `url('${homepageBg}')` }}
                />

                {/* Ambient Static Warm Golden Blur Glow */}
                <div 
                    className="fixed inset-0 bg-cover bg-center pointer-events-none z-0 opacity-40" 
                    style={{ 
                        backgroundImage: "url('/storage/hero_laptop_city.webp')",
                        filter: 'blur(110px) brightness(0.65)'
                    }}
                />

                {/* Warm Amber-Gold Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)]/5 via-transparent to-amber-500/10 z-0 pointer-events-none" />

                {/* Dark Overlays */}
                <div className="absolute inset-y-0 left-0 w-full lg:w-2/3 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-[#080808]/40 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-full lg:w-1/3 bg-gradient-to-l from-[#080808] via-[#080808]/60 to-[#080808]/40 z-0 pointer-events-none" />

                {/* Technical Line Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />
                
                {/* Tech Glows */}
                <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-[var(--gold)]/10 blur-[100px] pointer-events-none z-0" />
                <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-[var(--gold)]/5 blur-[90px] pointer-events-none z-0" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Terma & <span className="text-[var(--gold)]">Syarat</span>
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
                        Peraturan dan garis panduan untuk penggunaan laman web kami.
                    </p>
                </div>
            </section>

            {/* Legal content (Charcoal section with centered glow & gold divider lines) */}
            <section className="py-24 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                {/* Soft top-centered amber radial glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                
                {/* Gold Accent Divider Lines */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="relative p-8 sm:p-12 rounded-3xl border border-white/5 bg-[#0c0c0e]/60 backdrop-blur-md overflow-hidden shadow-2xl animate-fade-in" data-reveal="fade-up" data-reveal-delay="200">
                        <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-[var(--gold)]/10 blur-xl pointer-events-none" />
                        <div className="absolute -bottom-12 -left-12 w-24 h-24 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />
                        
                        <div 
                            className="prose prose-lg max-w-none prose-invert prose-headings:text-white prose-a:text-[var(--gold)] prose-strong:text-white prose-ul:list-disc prose-ol:list-decimal relative z-10 font-sans select-text"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
