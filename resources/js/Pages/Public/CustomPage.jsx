import React, { useEffect, useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function CustomPage({ page, settings = {} }) {
    const [lang, setLang] = useState('bm');

    useEffect(() => {
        // Track the current language preference from localStorage
        const storedLang = localStorage.getItem('lang') || 'bm';
        setLang(storedLang);

        const handleLangChange = () => {
            setLang(localStorage.getItem('lang') || 'bm');
        };
        window.addEventListener('languageChange', handleLangChange);

        return () => {
            window.removeEventListener('languageChange', handleLangChange);
        };
    }, []);

    // Get localized text content based on the selected language
    const title = (lang === 'en' && page.title_en) ? page.title_en : page.title;
    const content = (lang === 'en' && page.content_en) ? page.content_en : page.content;
    const metaTitle = (lang === 'en' && page.meta_title_en) ? page.meta_title_en : page.meta_title;
    const metaDescription = (lang === 'en' && page.meta_description_en) ? page.meta_description_en : page.meta_description;

    return (
        <PublicLayout 
            title={title} 
            description={metaDescription || undefined} 
            keywords={settings.site_keywords || undefined} 
            settings={settings}
        >
            {/* Hero Banner with Skyline telemetry backdrop or uploaded cover banner */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-[#080808] border-b border-white/5 z-10">
                {/* Background Image (Static when scrolling) */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none z-0 opacity-40" 
                    style={{ 
                        backgroundImage: page.featured_image 
                            ? `url('/storage/${page.featured_image}')` 
                            : "url('/storage/digital_kl_bg.png')" 
                    }}
                />

                {/* Warm Amber-Gold Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)]/5 via-transparent to-amber-500/10 z-0 pointer-events-none" />

                {/* Dark Overlays to ensure readability */}
                <div className="absolute inset-y-0 left-0 w-full lg:w-2/3 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-[#080808]/40 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-full lg:w-1/3 bg-gradient-to-l from-[#080808] via-[#080808]/60 to-[#080808]/40 z-0 pointer-events-none" />

                {/* Technical Line Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />
                
                {/* Tech Glows */}
                <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-[var(--gold)]/15 blur-[100px] pointer-events-none z-0" />
                <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-[var(--gold)]/5 blur-[90px] pointer-events-none z-0" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {title}
                    </h1>
                    {metaDescription && (
                        <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
                            {metaDescription}
                        </p>
                    )}
                </div>
            </section>

            {/* Dynamic Content Panel (Premium Charcoal section with centered glow & gold divider lines) */}
            <section className="py-24 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                {/* Soft top-centered amber radial glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                
                {/* Gold Accent Divider Lines */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {content ? (
                        <div 
                            className="prose prose-lg max-w-none prose-invert prose-headings:text-white prose-a:text-[var(--gold)] prose-strong:text-white prose-ul:list-disc prose-ol:list-decimal text-gray-300 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    ) : (
                        <div className="text-center text-zinc-500 py-12">
                            {lang === 'en' ? 'No content available for this page.' : 'Tiada kandungan tersedia untuk halaman ini.'}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
