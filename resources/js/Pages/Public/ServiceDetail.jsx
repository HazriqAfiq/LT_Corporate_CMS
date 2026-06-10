import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import * as Icons from 'lucide-react';

export default function ServiceDetail({ service, settings = {} }) {
    const [lang, setLang] = useState(() =>
        typeof window !== 'undefined' ? localStorage.getItem('lang') || 'bm' : 'bm'
    );

    useEffect(() => {
        setLang(localStorage.getItem('lang') || 'bm');
        const handleLangChange = () => setLang(localStorage.getItem('lang') || 'bm');
        window.addEventListener('languageChange', handleLangChange);
        return () => window.removeEventListener('languageChange', handleLangChange);
    }, []);

    const name        = (lang === 'en' && service.name_en)        ? service.name_en        : service.name;
    const description = (lang === 'en' && service.description_en) ? service.description_en : service.description;
    const content     = (lang === 'en' && service.content_en)     ? service.content_en     : service.content;
    const features    = Array.isArray(lang === 'en' && service.features_en ? service.features_en : service.features)
        ? (lang === 'en' && service.features_en ? service.features_en : service.features)
        : [];

    const bannerUrl = service.featured_media?.url;

    const IconComponent = service.icon && Icons[service.icon] ? Icons[service.icon] : Icons.Wrench;

    const tr = {
        bm: {
            back:        '← Kembali ke Perkhidmatan',
            badge:       'Perkhidmatan',
            features:    'Ciri-ciri Utama',
            featuresSub: 'Keupayaan terbaik untuk memenuhi keperluan perniagaan anda.',
            ctaTitle:    'Berminat dengan Perkhidmatan Ini?',
            ctaDesc:     'Hubungi kami untuk perbincangan lanjut dan sebut harga percuma.',
            ctaBtn:      'Hubungi Kami Sekarang',
            contactUrl:  '/hubungi-kami',
        },
        en: {
            back:        '← Back to Services',
            badge:       'Service',
            features:    'Key Features',
            featuresSub: 'Best-in-class capabilities to meet your business needs.',
            ctaTitle:    'Interested in This Service?',
            ctaDesc:     'Contact us for further discussion and a free quote.',
            ctaBtn:      'Contact Us Now',
            contactUrl:  '/hubungi-kami',
        },
    }[lang] || {};

    return (
        <PublicLayout
            title={service.meta_title || name}
            description={service.meta_description || description}
            keywords={Array.isArray(service.features) ? service.features.join(', ') : ''}
            settings={settings}
            image={bannerUrl}
        >
            {/* ── Hero Banner ──────────────────────────────────────────────── */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-[#080808] border-b border-white/5 z-10">
                <div className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none z-0 opacity-45" style={{ backgroundImage: "url('/storage/digital_kl_bg.png')" }} />
                <div className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none z-0 opacity-40" style={{ backgroundImage: "url('/storage/hero_laptop_city.png')", filter: 'blur(110px) brightness(0.65)' }} />
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)]/5 via-transparent to-amber-500/10 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-full lg:w-2/3 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-[#080808]/40 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-full lg:w-1/3 bg-gradient-to-l from-[#080808] via-[#080808]/60 to-[#080808]/40 z-0 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />
                <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-[var(--gold)]/10 blur-[100px] pointer-events-none z-0" />
                <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-[var(--gold)]/5 blur-[90px] pointer-events-none z-0" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" data-reveal="fade-up">
                    <Link href="/perkhidmatan" className="text-gray-400 hover:text-[var(--gold)] text-sm mb-6 inline-block transition-colors">
                        {tr.back}
                    </Link>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center text-[var(--gold)]">
                            <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="badge">{tr.badge}</div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">{name}</h1>
                    {description && <p className="text-gray-300 text-lg max-w-3xl leading-relaxed">{description}</p>}
                    {features.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-6">
                            {features.map((f, i) => (
                                <span key={i} className="text-xs bg-white/5 text-gray-300 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">{f}</span>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Rich Text Main Content ────────────────────────────────────── */}
            {content && (
                <section className="py-24 bg-[#080808] border-b border-white/5 relative overflow-hidden z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                    <div className="max-w-7xl mx-auto px-4 relative z-10" data-reveal="fade-up" data-reveal-delay="200">
                        <div
                            className="prose prose-lg max-w-none prose-invert prose-headings:text-white prose-a:text-[var(--gold)]"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                </section>
            )}

        </PublicLayout>
    );
}
