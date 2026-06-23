import { Link } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import ScreenshotGallery from '@/Components/Public/ScreenshotGallery';

export default function ProductDetail({ product, galleryMedia = [], settings = {} }) {
    const homepageBg = settings.homepage_background || '/storage/digital_kl_bg.webp';
    const [lang, setLang] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('lang') || 'bm' : 'bm'));

    useEffect(() => {
        setLang(localStorage.getItem('lang') || 'bm');
        const handleLangChange = () => setLang(localStorage.getItem('lang') || 'bm');
        window.addEventListener('languageChange', handleLangChange);
        return () => window.removeEventListener('languageChange', handleLangChange);
    }, []);



    const name = (lang === 'en' && product.name_en) ? product.name_en : product.name;
    const description = (lang === 'en' && product.description_en) ? product.description_en : product.description;
    const features = Array.isArray((lang === 'en' && product.features_en) ? product.features_en : product.features)
        ? ((lang === 'en' && product.features_en) ? product.features_en : product.features)
        : [];
    const content = (lang === 'en' && product.content_en) ? product.content_en : product.content;

    // Translation keys
    const tr = {
        bm: {
            back: '← Kembali ke Produk',
            demo: 'Lihat Demo',
            quote: 'Minta Sebut Harga',
            features: 'Ciri-ciri Utama',
            startingFrom: 'Bermula RM',
            galleryTitle: 'Tangkapan Skrin & Pratinjau',
            galleryDesc: 'Lihat antaramuka dan ciri-ciri visual produk digital kami.',
            noGallery: 'Tiada pratinjau tambahan buat masa ini.',
            badgeDefault: 'Produk Digital',
            quoteUrl: '/hubungi-kami',
            featuresSub: 'Seni reka bertaraf tinggi dengan ciri-ciri keselamatan industri.',
        },
        en: {
            back: '← Back to Products',
            demo: 'View Live Demo',
            quote: 'Request a Quote',
            features: 'Key Features',
            startingFrom: 'Starting from RM',
            galleryTitle: 'Screenshots & Preview',
            galleryDesc: 'Explore the visual interface and capabilities of our digital product.',
            noGallery: 'No additional previews available at the moment.',
            badgeDefault: 'Digital Product',
            quoteUrl: '/en/contact',
            featuresSub: 'State-of-the-art craftsmanship with enterprise-grade security.',
        }
    }[lang] || {
        back: '← Kembali ke Produk',
        demo: 'Lihat Demo',
        quote: 'Minta Sebut Harga',
        features: 'Ciri-ciri Utama',
        startingFrom: 'Bermula RM',
        galleryTitle: 'Tangkapan Skrin & Pratinjau',
        galleryDesc: 'Lihat antaramuka dan ciri-ciri visual produk digital kami.',
        noGallery: 'Tiada pratinjau tambahan buat masa ini.',
        badgeDefault: 'Produk Digital',
        quoteUrl: '/hubungi-kami',
        featuresSub: 'Seni reka bertaraf tinggi dengan ciri-ciri keselamatan industri.',
    };



    const bannerUrl = product.featured_media?.url;

    return (
        <PublicLayout
            title={product.seo_title || name}
            description={product.seo_description || description}
            keywords={Array.isArray(product.features) ? product.features.join(', ') : ''}
            settings={settings}
            image={product.featured_media?.url}
        >
            {/* Hero Banner */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-[#080808] border-b border-white/5 z-10" style={{ clipPath: 'inset(0)' }}>
                <div className="fixed inset-0 bg-cover bg-center pointer-events-none z-0 opacity-45" style={{ backgroundImage: `url('${homepageBg}')` }} />
                <div className="fixed inset-0 bg-cover bg-center pointer-events-none z-0 opacity-40" style={{ backgroundImage: bannerUrl ? `url('${bannerUrl}')` : "url('/storage/hero_laptop_city.webp')", filter: 'blur(110px) brightness(0.65)' }} />
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)]/5 via-transparent to-amber-500/10 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-full lg:w-2/3 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-[#080808]/40 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-full lg:w-1/3 bg-gradient-to-l from-[#080808] via-[#080808]/60 to-[#080808]/40 z-0 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />
                <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-[var(--gold)]/10 blur-[100px] pointer-events-none z-0" />
                <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-[var(--gold)]/5 blur-[90px] pointer-events-none z-0" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" data-reveal="fade-up">
                    <Link href="/produk" className="text-gray-400 hover:text-[var(--gold)] text-sm mb-6 inline-block transition-colors">
                        {tr.back}
                    </Link>
                    <div className="flex items-start gap-6">
                        <div className="flex-1">
                            <div className="badge inline-block mb-4">{product.category || tr.badgeDefault}</div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{name}</h1>
                            {description && <p className="text-gray-300 text-lg max-w-3xl leading-relaxed">{description}</p>}
                            {features.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-4">
                                    {features.map((f, i) => (
                                        <span key={i} className="text-xs bg-white/5 text-gray-300 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">{f}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="w-52 h-52 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center overflow-hidden shrink-0">
                            {product.icon ? (
                                <img src={`/storage/${product.icon}`} alt="Icon" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-[var(--gold)] font-bold text-7xl">{name.charAt(0)}</span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Editorial Section */}
            {content && (
                <section className="py-24 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                    <div className="max-w-7xl mx-auto px-4 relative z-10" data-reveal="fade-up" data-reveal-delay="200">
                        <div className="prose prose-lg max-w-none prose-invert prose-headings:text-white prose-a:text-[var(--gold)]" dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                </section>
            )}

            {/* Premium Screenshot Gallery Section */}
            {galleryMedia.length > 0 && (
                <section className="py-24 bg-[#080808] border-b border-white/5 relative z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group/gallery">
                        {/* Gallery Header */}
                        <div className="text-center mb-12" data-reveal="fade-up">
                            <h2 className="text-3xl font-bold text-white mb-4">{tr.galleryTitle}</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">{tr.galleryDesc}</p>
                        </div>

                        <ScreenshotGallery galleryMedia={galleryMedia} lang={lang} />
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
