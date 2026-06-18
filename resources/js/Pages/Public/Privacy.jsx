import PublicLayout from '@/Layouts/PublicLayout';
import useLanguage from '@/Hooks/useLanguage';

export default function Privacy({ settings = {} }) {
    const { lang } = useLanguage();

    const defaultContentBM = `
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
    `;

    const defaultContentEN = `
        <h2>1. Introduction</h2>
        <p>Laman Teknologi Sdn. Bhd. ("we", "us", or "our") is committed to protecting and respecting your privacy. This policy explains how we collect, use, and protect your personal information.</p>

        <h2>2. Information We Collect</h2>
        <p>We may collect the following information:</p>
        <ul>
            <li>Name and contact information (email, phone number).</li>
            <li>Company information.</li>
            <li>Information you provide through our contact forms.</li>
        </ul>

        <h2>3. Use of Information</h2>
        <p>The collected information is used to:</p>
        <ul>
            <li>Respond to your inquiries.</li>
            <li>Provide the requested services.</li>
            <li>Send promotional materials if you consent.</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>We implement appropriate security measures to prevent unauthorized access, disclosure, alteration, or destruction of your personal data.</p>

        <h2>5. Contact Us</h2>
        <p>If you have any questions regarding this Privacy Policy, please contact us at info@lamanteknologi.com.</p>
    `;

    const content = lang === 'en'
        ? (settings.privacy_policy_en || settings.privacy_policy || defaultContentEN)
        : (settings.privacy_policy || defaultContentBM);

    return (
        <PublicLayout title="Dasar Privasi" settings={settings}>
            {/* Hero Banner with Homepage-styled Backdrop */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-[#080808] border-b border-white/5 z-10">
                {/* Master Background Image (Static when scrolling) */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none z-0 opacity-45" 
                    style={{ backgroundImage: "url('/storage/digital_kl_bg.png')" }}
                />

                {/* Ambient Static Warm Golden Blur Glow */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none z-0 opacity-40" 
                    style={{ 
                        backgroundImage: "url('/storage/hero_laptop_city.png')",
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
                        Dasar <span className="text-[var(--gold)]">Privasi</span>
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
                        Komitmen kami terhadap perlindungan data peribadi anda.
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
