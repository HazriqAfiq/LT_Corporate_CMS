import React, { useState, useEffect, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import NewsletterSection from '@/Components/Public/NewsletterSection';
import useLanguage from '@/Hooks/useLanguage';
// Named icon imports only — avoids loading entire lucide library (~1000+ icons)
import { Wrench } from 'lucide-react';

const translations = {
    bm: {
        techBadge: "🚀 Teknologi Untuk Organisasi",
        startNow: "Mulakan Sekarang",
        viewProducts: "Lihat Produk",
        uptime: "Uptime Terjamin",
        support: "Sokongan Teknikal",
        completedProjects: "Projek Siap",
        activeClients: "Klien Aktif",
        digitalProducts: "Produk Digital",
        featuresCheck1: "Teknologi Terkini",
        featuresCheck2: "Penyelesaian Selamat",
        featuresCheck3: "Sokongan 24/7",
        servicesBadge: "Perkhidmatan Kami",
        servicesTitle: "Penyelesaian Digital Menyeluruh",
        servicesSubtitle: "Kami menyediakan rangkaian perkhidmatan teknologi yang lengkap untuk memenuhi keperluan organisasi anda.",
        productsBadge: "Produk Digital",
        productsTitle: "Produk Pilihan Kami",
        productsSubtitle: "Penyelesaian perisian yang siap digunakan untuk pelbagai keperluan organisasi.",
        seeAllProducts: "Lihat Semua Produk →",
        portfolioBadge: "Portfolio",
        portfolioTitle: "Projek Terbaik Kami",
        portfolioSubtitle: "Lihat projek-projek yang telah kami siapkan untuk klien kami.",
        seeAllPortfolio: "Lihat Semua Portfolio →",
        articlesBadge: "Artikel & Berita",
        articlesTitle: "Berita Terkini",
        seeAllArticles: "Lihat Semua Artikel →",
    },
    en: {
        techBadge: "🚀 Technology For Organizations",
        startNow: "Get Started",
        viewProducts: "View Products",
        uptime: "Uptime Guaranteed",
        support: "Technical Support",
        completedProjects: "Completed Projects",
        activeClients: "Active Clients",
        digitalProducts: "Digital Products",
        featuresCheck1: "Latest Technology",
        featuresCheck2: "Secure Solutions",
        featuresCheck3: "24/7 Support",
        servicesBadge: "Our Services",
        servicesTitle: "Comprehensive Digital Solutions",
        servicesSubtitle: "We provide a complete suite of technological services to meet your organization's needs.",
        productsBadge: "Digital Products",
        productsTitle: "Our Featured Products",
        productsSubtitle: "Ready-to-use software solutions for various organizational needs.",
        seeAllProducts: "See All Products →",
        portfolioBadge: "Portfolio",
        portfolioTitle: "Our Best Projects",
        portfolioSubtitle: "Check out the projects we have completed for our clients.",
        seeAllPortfolio: "See All Portfolio →",
        articlesBadge: "Articles & News",
        articlesTitle: "Latest News",
        seeAllArticles: "See All Articles →",
    }
};

const servicesList = {
    bm: [
        { 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-monitor"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
            ), 
            title: 'Pembangunan Sistem', 
            desc: 'Sistem web dan mobile yang dibina khas untuk keperluan organisasi anda.',
            bg: '/storage/services/dev_bg.png'
        },
        { 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-palette"><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.648 0-.438-.12-.824-.368-1.127-.229-.273-.351-.628-.351-.989 0-1.109.897-2 2.008-2H19c2.21 0 4-1.79 4-4C23 6.03 18.477 2 12 2Z" /></svg>
            ), 
            title: 'Rekabentuk UI/UX', 
            desc: 'Antara muka pengguna yang moden, mesra dan profesional.',
            bg: '/storage/services/design_bg.png'
        },
        { 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cloud"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></svg>
            ), 
            title: 'Cloud & Hosting', 
            desc: 'Infrastruktur awan yang selamat, pantas dan boleh dipercayai.',
            bg: '/storage/services/cloud_bg.png'
        },
        { 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cpu"><rect width="16" height="16" x="4" y="4" rx="2" /><rect width="6" height="6" x="9" y="9" rx="1" /><path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" /><path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" /></svg>
            ), 
            title: 'AI & Automasi', 
            desc: 'Penyelesaian kecerdasan buatan untuk automasi proses perniagaan.',
            bg: '/storage/services/ai_bg.png'
        },
        { 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smartphone"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
            ), 
            title: 'Aplikasi Mudah Alih', 
            desc: 'Aplikasi iOS and Android yang responsif and berprestasi tinggi.',
            bg: '/storage/services/mobile_bg.png'
        },
        { 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            ), 
            title: 'Keselamatan Siber', 
            desc: 'Perlindungan data dan sistem daripada ancaman siber.',
            bg: '/storage/services/security_bg.png'
        },
    ],
    en: [
        { 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-monitor"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
            ), 
            title: 'System Development', 
            desc: 'Custom web and mobile systems built for your organizational needs.',
            bg: '/storage/services/dev_bg.png'
        },
        { 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-palette"><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.648 0-.438-.12-.824-.368-1.127-.229-.273-.351-.628-.351-.989 0-1.109.897-2 2.008-2H19c2.21 0 4-1.79 4-4C23 6.03 18.477 2 12 2Z" /></svg>
            ), 
            title: 'UI/UX Design', 
            desc: 'Modern, user-friendly, and professional user interfaces.',
            bg: '/storage/services/design_bg.png'
        },
        { 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cloud"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></svg>
            ), 
            title: 'Cloud & Hosting', 
            desc: 'Secure, fast, and reliable cloud infrastructures.',
            bg: '/storage/services/cloud_bg.png'
        },
        { 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cpu"><rect width="16" height="16" x="4" y="4" rx="2" /><rect width="6" height="6" x="9" y="9" rx="1" /><path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" /><path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" /></svg>
            ), 
            title: 'AI & Automation', 
            desc: 'Artificial intelligence solutions for business process automation.',
            bg: '/storage/services/ai_bg.png'
        },
        { 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smartphone"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
            ), 
            title: 'Mobile Applications', 
            desc: 'Responsive and high-performance iOS and Android applications.',
            bg: '/storage/services/mobile_bg.png'
        },
        { 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            ), 
            title: 'Cybersecurity', 
            desc: 'Data and system protection against cyber threats.',
            bg: '/storage/services/security_bg.png'
        },
    ]
};

export default function Home({ sliders = [], services = [], featuredProducts = [], featuredProjects = [], latestArticles = [], settings = {} }) {
    const homepageBg = settings.homepage_background || '/storage/uploads/homepage_bg.png';
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slideMounted, setSlideMounted] = useState(true);
    const { lang } = useLanguage();


    useEffect(() => {
        if (sliders.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sliders.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [sliders.length]);

    const t = translations[lang] || translations.bm;
    const activeServices = services && services.length > 0 ? services : (servicesList[lang] || servicesList.bm);
    const activeSliders = sliders.length > 0 ? sliders : [null];

    const formatCompletedDate = useCallback((dateString, language) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString(language === 'en' ? 'en-US' : 'ms-MY', {
            month: 'long',
            year: 'numeric'
        });
    }, []);

    return (
        <PublicLayout title={lang === 'en' ? 'Home' : 'Utama'} settings={settings}>
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes progressFill {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                .animate-progress-fill {
                    animation: progressFill 5000ms linear forwards;
                }
            ` }} />
            {/* Hero Section */}
            <section className="relative h-screen min-h-[600px] lg:min-h-[750px] flex items-center overflow-hidden bg-[#080808]">
                {/* Background \u2014 bg-scroll on mobile (no scroll jank), bg-fixed parallax on desktop */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-scroll md:bg-fixed pointer-events-none z-10 opacity-30" 
                    style={{ backgroundImage: `url('${homepageBg}')` }}
                />

                {/* Warm Amber-Gold Overlay to blend the skyline with ambient city light */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)]/5 via-transparent to-amber-500/10 z-10 pointer-events-none" />

                {/* Dark Overlays (Stronger on left for text readability) */}
                <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-[#080808] via-[#080808]/85 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-full lg:w-2/5 bg-gradient-to-l from-[#080808]/50 to-transparent z-10 pointer-events-none" />
                <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#080808] to-transparent z-10 pointer-events-none" />

                {/* Technical Line Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-10" />
                
                {/* Tech Glows */}
                <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-[var(--gold)]/10 blur-[120px] pointer-events-none z-10" />
                <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-10" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 relative z-20 w-full h-full flex flex-col justify-center">
                    {/* Slider Viewport Container */}
                    <div className="relative flex-grow min-h-[400px] sm:min-h-[360px] lg:min-h-[420px] w-full flex items-center">
                        {activeSliders.map((s, index) => {
                            const isActive = index === currentSlide && slideMounted;
                            const titleText = (lang === 'en' ? s?.title_en : s?.title) || s?.title || (lang === 'en' ? 'Technology Solutions' : 'Penyelesaian Teknologi');
                            const subtitleText = (lang === 'en' ? s?.subtitle_en : s?.subtitle) || s?.subtitle || (lang === 'en' ? 'For Your Organization' : 'Untuk Organisasi Anda');
                            const descText = (lang === 'en' ? s?.description_en : s?.description) || s?.description || (lang === 'en' ? 'We help your organization grow through modern technology, smart systems, and innovative digital solutions for a more efficient future.' : 'Kami membantu organisasi anda berkembang melalui teknologi moden, sistem pintar, dan penyelesaian digital yang inovatif untuk masa depan yang lebih efisien.');

                            return (
                                <div
                                    key={s?.id || index}
                                    className={`absolute inset-0 flex items-center transition-all duration-1000 ease-in-out hero-slide-item ${
                                        isActive
                                            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto z-20 active-slide'
                                            : 'opacity-0 scale-95 translate-y-8 pointer-events-none z-0'
                                    }`}
                                >
                                    <div className="grid lg:grid-cols-5 gap-12 items-center w-full">
                                        {/* Left Column: Text (3/5 width) */}
                                        <div className="lg:col-span-3 flex flex-col justify-center w-full">
                                            <div className="badge mb-6 self-start hero-slide-content" style={{ animationDelay: '70ms', transitionDelay: '70ms' }}>{t.techBadge}</div>
                                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5 tracking-tight hero-slide-content" style={{ animationDelay: '150ms', transitionDelay: '150ms' }}>
                                                {titleText}{' '}
                                                <span className="text-[var(--gold)]">
                                                    {subtitleText}
                                                </span>
                                            </h1>
                                            <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed max-w-2xl hero-slide-content" style={{ animationDelay: '230ms', transitionDelay: '230ms' }}>
                                                {descText}
                                            </p>

                                            <div className="flex flex-wrap gap-4 mb-6 hero-slide-content" style={{ animationDelay: '310ms', transitionDelay: '310ms' }}>
                                                <Link 
                                                    href={s?.button_url || '/hubungi-kami'} 
                                                    className="btn-primary text-base px-8 py-3.5 flex items-center gap-2"
                                                >
                                                    {((lang === 'en' ? s?.button_text_en : s?.button_text) || s?.button_text) || t.startNow} <span className="text-xl">→</span>
                                                </Link>
                                                <Link href="/produk" className="btn-outline text-base px-8 py-3.5 flex items-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                                    {t.viewProducts}
                                                </Link>
                                            </div>

                                            {/* Features Checklist */}
                                            <div className="flex flex-wrap gap-6 text-sm text-gray-400 hero-slide-content" style={{ animationDelay: '390ms', transitionDelay: '390ms' }}>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[var(--gold)] font-bold">✓</span> {t.featuresCheck1}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[var(--gold)] font-bold">✓</span> {t.featuresCheck2}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[var(--gold)] font-bold">✓</span> {t.featuresCheck3}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: Premium Slide Image (2/5 width) with original glow & floating badges */}
                                        <div className="lg:col-span-2 hidden lg:block w-full">
                                            <div className="relative group hero-slide-image" style={{ animationDelay: '200ms', transitionDelay: '200ms' }}>
                                                {/* Glow Effect Behind */}
                                                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--gold)] to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                                
                                                <div className="relative w-full aspect-[4/3] rounded-3xl bg-[#040914] border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                                                    {s?.media?.url || s?.image ? (
                                                        <img 
                                                            src={s?.media?.url || `/storage/${s.image}`} 
                                                            alt={titleText} 
                                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                                                        />
                                                    ) : (
                                                        <img 
                                                            src="/storage/hero_laptop_city.png" 
                                                            alt="Laman Teknologi" 
                                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                                                        />
                                                    )}
                                                </div>

                                                {/* Floating Badges */}
                                                <div className="absolute -bottom-4 -left-4 bg-[#040914]/90 backdrop-blur-md border border-white/10 rounded-xl px-6 py-4 shadow-xl z-20 hero-slide-badge" style={{ animationDelay: '470ms', transitionDelay: '470ms' }}>
                                                    <div className="text-[var(--gold)] font-bold text-lg">99.9%</div>
                                                    <div className="text-white/70 text-xs">{t.uptime}</div>
                                                </div>
                                                <div className="absolute -top-4 -right-4 bg-[#040914]/90 backdrop-blur-md border border-white/10 rounded-xl px-6 py-4 shadow-xl z-20 hero-slide-badge" style={{ animationDelay: '550ms', transitionDelay: '550ms' }}>
                                                    <div className="text-green-400 font-bold text-lg">24/7</div>
                                                    <div className="text-white/70 text-xs">{t.support}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom Control Bar */}
                    {sliders.length > 1 && (
                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative z-20 border-t border-white/5 pt-6">
                            {/* Left: Slide Number & Progress Trackers */}
                            <div className="flex items-center gap-6">
                                <div className="text-sm font-mono text-zinc-500 tracking-wider">
                                    <span className="text-[var(--gold)] font-bold">{(currentSlide + 1).toString().padStart(2, '0')}</span> / {sliders.length.toString().padStart(2, '0')}
                                </div>
                                
                                {/* Progress Tracks */}
                                <div className="flex gap-2.5">
                                    {sliders.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentSlide(idx)}
                                            className="group relative py-3 focus:outline-none"
                                            aria-label={`Go to slide ${idx + 1}`}
                                        >
                                            <div className="w-10 sm:w-16 h-1 rounded-full bg-white/10 overflow-hidden transition-all duration-300 group-hover:bg-white/20">
                                                {idx === currentSlide && (
                                                    <div 
                                                        key={idx}
                                                        className="h-full bg-[var(--gold)] rounded-full animate-progress-fill shadow-[0_0_8px_var(--gold)]"
                                                    />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Circular Navigation Control Buttons */}
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length)}
                                    className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-[var(--gold)] hover:text-[#080808] hover:border-[var(--gold)] flex items-center justify-center text-white transition-all duration-300 group shadow-lg hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] focus:outline-none"
                                    aria-label="Previous Slide"
                                >
                                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={() => setCurrentSlide((prev) => (prev + 1) % sliders.length)}
                                    className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-[var(--gold)] hover:text-[#080808] hover:border-[var(--gold)] flex items-center justify-center text-white transition-all duration-300 group shadow-lg hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] focus:outline-none"
                                    aria-label="Next Slide"
                                >
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Services Section (Highlighted dark-charcoal background break with glowing gold separator lines) */}
            <section className="py-28 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                {/* Soft top-centered amber radial glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                
                {/* Gold Accent Divider Lines */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16" data-reveal="fade-up">
                        <div className="badge mb-4">{t.servicesBadge}</div>
                        <h2 className="section-title">{lang === 'en' ? 'Comprehensive Digital ' : 'Penyelesaian Digital '}<span className="gold-accent">{lang === 'en' ? 'Solutions' : 'Menyeluruh'}</span></h2>
                        <p className="section-subtitle">{t.servicesSubtitle}</p>
                    </div>
                    <div className={`grid gap-8 justify-center ${
                        activeServices.length === 1 
                            ? 'grid-cols-1 max-w-md mx-auto' 
                            : activeServices.length === 2 
                                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' 
                                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    }`}>
                        {activeServices.map((svc, i) => {
                            const title = svc.title || (lang === 'en' ? (svc.name_en || svc.name) : svc.name);
                            const desc = svc.desc || (lang === 'en' ? (svc.description_en || svc.description) : svc.description);
                            const bg = svc.bg || svc.featured_media?.url || '/storage/services/dev_bg.png';
                            const slug = svc.slug;

                            const CardInner = (
                                <div 
                                    className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#1e1e26] hover:border-[var(--gold)]/40 hover:shadow-[0_12px_45px_rgba(234,179,8,0.1)] group transition-all duration-500 h-full"
                                >
                                    {/* AI Generated Background Image (Sharp, highly visible) */}
                                    {bg && (
                                        <img 
                                            src={bg} 
                                            alt={title} 
                                            loading="lazy"
                                            className="absolute inset-0 w-full h-full object-cover opacity-[0.45] group-hover:opacity-[0.75] scale-100 group-hover:scale-105 transition-all duration-700 ease-out z-0 pointer-events-none" 
                                        />
                                    )}
                                    
                                    {/* Sharp minimal overlay for text contrast */}
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-all duration-500 z-0 pointer-events-none" />

                                    {/* Card Content */}
                                    <div className="relative p-8 z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-[var(--gold)]/25 border border-[var(--gold)]/40 flex items-center justify-center text-2xl text-[var(--gold)] mb-6 group-hover:bg-[var(--gold)] group-hover:text-[#080808] group-hover:border-transparent transition-all duration-300 shadow-md">
                                            {React.isValidElement(svc.icon) ? (
                                                svc.icon
                                            ) : (
                                                React.createElement(Wrench, { className: "w-6 h-6" })
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[var(--gold)] transition-colors duration-300 drop-shadow-sm">{title}</h3>
                                        <p className="text-zinc-200 font-medium text-sm leading-relaxed drop-shadow-sm">{desc}</p>
                                    </div>
                                </div>
                            );

                            return slug ? (
                                <Link key={i} href={`/perkhidmatan/${slug}`} className="block h-full" data-reveal="fade-up" data-reveal-delay={i * 100}>
                                    {CardInner}
                                </Link>
                            ) : (
                                <div key={i} className="h-full" data-reveal="fade-up" data-reveal-delay={i * 100}>
                                    {CardInner}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Products Section (Highlighted dark-charcoal background break with glowing gold separator lines) */}
            {featuredProducts.length > 0 && (
                <section className="py-28 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                    {/* Soft top-centered amber radial glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                    
                    {/* Gold Accent Divider Lines */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16" data-reveal="fade-up">
                            <div className="badge mb-4">{t.productsBadge}</div>
                            <h2 className="section-title">{lang === 'en' ? 'Our Featured ' : 'Produk '}<span className="gold-accent">{lang === 'en' ? 'Products' : 'Pilihan Kami'}</span></h2>
                            <p className="section-subtitle">{t.productsSubtitle}</p>
                        </div>
                        <div className={`grid gap-8 justify-center ${
                            featuredProducts.length === 1 
                                ? 'grid-cols-1 max-w-md mx-auto' 
                                : featuredProducts.length === 2 
                                    ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' 
                                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                        }`}>
                            {featuredProducts.map((product, idx) => {
                                const name = (lang === 'en' && product.name_en) ? product.name_en : product.name;
                                const description = (lang === 'en' && product.description_en) ? product.description_en : product.description;
                                const features = Array.isArray((lang === 'en' && product.features_en) ? product.features_en : product.features)
                                    ? ((lang === 'en' && product.features_en) ? product.features_en : product.features)
                                    : [];

                                const bannerUrl = product.featured_media?.url;

                                return (
                                    <Link key={product.id} href={`/produk/${product.slug}`} className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#1e1e26] hover:border-[var(--gold)]/40 hover:shadow-[0_12px_45px_rgba(234,179,8,0.1)] group flex flex-col justify-between h-full p-8 transition-all duration-500 min-h-[280px]" data-reveal="scale-in" data-reveal-delay={idx * 100}>
                                        {/* Product Main Image as Background */}
                                        {bannerUrl && (
                                            <img 
                                                src={bannerUrl} 
                                                alt={name} 
                                                loading="lazy"
                                                className="absolute inset-0 w-full h-full object-cover opacity-[0.45] group-hover:opacity-[0.75] scale-100 group-hover:scale-105 transition-all duration-700 ease-out z-0 pointer-events-none" 
                                            />
                                        )}
                                        
                                        {/* Sharp minimal overlay for text contrast */}
                                        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-all duration-500 z-0 pointer-events-none" />

                                        {/* Content positioned above background */}
                                        <div className="relative z-10">
                                            {/* Floating brand icon */}
                                            <div className="w-14 h-14 rounded-2xl bg-[var(--gold)]/25 border border-[var(--gold)]/40 flex items-center justify-center overflow-hidden shrink-0 mb-6 group-hover:bg-[var(--gold)] group-hover:text-[#080808] group-hover:border-transparent transition-all duration-300 shadow-md">
                                                {product.icon ? (
                                                    <img src={`/storage/${product.icon}`} alt="Icon" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-[var(--gold)] font-bold text-2xl group-hover:text-[#080808]">💡</span>
                                                )}
                                            </div>
                                            
                                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[var(--gold)] transition-colors duration-300 drop-shadow-sm">{name}</h3>
                                            <p className="text-zinc-200 font-medium text-sm leading-relaxed mb-6 drop-shadow-sm line-clamp-3">{description}</p>
                                        </div>

                                        {features.length > 0 && (
                                            <div className="relative z-10 flex flex-wrap gap-2 mt-auto">
                                                {features.slice(0, 3).map((f, i) => (
                                                    <span key={i} className="text-xs bg-black/40 border border-white/10 text-zinc-200 px-3.5 py-1.5 rounded-full font-medium tracking-wide">
                                                        {f}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="text-center mt-12" data-reveal="fade-up" data-reveal-delay="200">
                            <Link href="/produk" className="btn-navy px-8 py-4">{t.seeAllProducts}</Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Portfolio Section (With same skyline background and overlay system as the Hero slider) */}
            {featuredProjects.length > 0 && (
                <section className="py-28 bg-[#080808] border-y border-white/5 relative overflow-hidden z-10">
                    {/* Background — bg-scroll instead of bg-fixed for mobile performance */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center bg-scroll md:bg-fixed pointer-events-none z-10 opacity-30" 
                        style={{ backgroundImage: `url('${homepageBg}')` }}
                    />

                    {/* Warm Amber-Gold Overlay to blend the skyline with ambient city light */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)]/5 via-transparent to-amber-500/10 z-10 pointer-events-none" />

                    {/* Dark Overlays */}
                    <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-[#080808] via-[#080808]/85 to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-full lg:w-2/5 bg-gradient-to-l from-[#080808]/50 to-transparent z-10 pointer-events-none" />
                    <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#080808] to-transparent z-10 pointer-events-none" />

                    {/* Technical Line Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-10" />
                    
                    {/* Tech Glows */}
                    <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-[var(--gold)]/10 blur-[120px] pointer-events-none z-10" />
                    <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-10" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                        <div className="text-center mb-16" data-reveal="fade-up">
                            <div className="badge mb-4">{t.portfolioBadge}</div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{lang === 'en' ? 'Our Best ' : 'Projek '}<span className="text-[var(--gold)]">{lang === 'en' ? 'Projects' : 'Terbaik Kami'}</span></h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">{t.portfolioSubtitle}</p>
                        </div>
                        <div className={`grid gap-8 justify-center ${
                            featuredProjects.length === 1 
                                ? 'grid-cols-1 max-w-2xl mx-auto' 
                                : 'grid-cols-1 md:grid-cols-2'
                        }`}>
                            {featuredProjects.map((project, idx) => {
                                const bannerUrl = project.featured_media?.url;

                                return (
                                    <Link key={project.id} href={`/portfolio/${project.slug}`} className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#1e1e26] hover:border-[var(--gold)]/40 hover:shadow-[0_12px_45px_rgba(234,179,8,0.1)] group flex flex-col justify-between h-full p-8 transition-all duration-500 min-h-[280px]" data-reveal="fade-up" data-reveal-delay={idx * 100}>
                                        {/* Project Main Image as Background */}
                                        {bannerUrl && (
                                            <img 
                                                src={bannerUrl} 
                                                alt={(lang === 'en' && project.title_en) ? project.title_en : project.title} 
                                                loading="lazy"
                                                className="absolute inset-0 w-full h-full object-cover opacity-[0.45] group-hover:opacity-[0.75] scale-100 group-hover:scale-105 transition-all duration-700 ease-out z-0 pointer-events-none" 
                                            />
                                        )}
                                        
                                        {/* Sharp minimal overlay for text contrast */}
                                        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-all duration-500 z-0 pointer-events-none" />

                                        {/* Content positioned above background */}
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-4 flex-wrap">
                                                {project.category && <span className="badge text-[10px] tracking-wide uppercase py-1 font-bold">{project.category}</span>}
                                                {project.client && <span className="text-zinc-300 text-xs font-semibold drop-shadow-sm">• {project.client}</span>}
                                                {project.completed_at && <span className="text-zinc-300 text-xs font-semibold drop-shadow-sm">• {formatCompletedDate(project.completed_at, lang)}</span>}
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[var(--gold)] transition-colors duration-300 drop-shadow-sm">{(lang === 'en' && project.title_en) ? project.title_en : project.title}</h3>
                                            <p className="text-zinc-200 font-medium text-sm leading-relaxed mb-6 drop-shadow-sm">{(lang === 'en' && project.description_en) ? project.description_en : project.description}</p>
                                        </div>

                                        {project.technologies && (
                                            <div className="relative z-10 flex flex-wrap gap-2 mt-auto">
                                                {(Array.isArray(project.technologies) ? project.technologies : []).slice(0, 4).map((t, i) => (
                                                    <span key={i} className="text-xs bg-black/40 border border-white/10 text-zinc-200 px-3.5 py-1.5 rounded-full font-medium tracking-wide">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="text-center mt-12" data-reveal="fade-up" data-reveal-delay="200">
                            <Link href="/portfolio" className="btn-outline px-8 py-4">{t.seeAllPortfolio}</Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Articles Section (Highlighted dark-charcoal background break with glowing gold separator lines) */}
            {latestArticles.length > 0 && (
                <section className="py-28 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                    {/* Soft top-centered amber radial glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                    
                    {/* Gold Accent Divider Lines */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16" data-reveal="fade-up">
                            <div className="badge mb-4">{t.articlesBadge}</div>
                            <h2 className="section-title">{lang === 'en' ? 'Latest ' : 'Berita '}<span className="gold-accent">{lang === 'en' ? 'News' : 'Terkini'}</span></h2>
                        </div>
                        <div className={`grid gap-8 justify-center ${
                            latestArticles.length === 1 
                                ? 'grid-cols-1 max-w-md mx-auto' 
                                : latestArticles.length === 2 
                                    ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' 
                                    : 'grid-cols-1 md:grid-cols-3'
                        }`}>
                            {latestArticles.map((article, idx) => {
                                const bannerUrl = article.featured_media?.url || (article.featured_image ? `/storage/${article.featured_image}` : null);
                                const title = (lang === 'en' && article.title_en) ? article.title_en : article.title;
                                const excerpt = (lang === 'en' && article.excerpt_en) ? article.excerpt_en : article.excerpt;

                                return (
                                    <Link key={article.id} href={`/artikel/${article.slug}`} className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#1e1e26] hover:border-[var(--gold)]/40 hover:shadow-[0_12px_45px_rgba(234,179,8,0.1)] group flex flex-col justify-between h-full p-8 transition-all duration-500 min-h-[280px]" data-reveal="fade-up" data-reveal-delay={idx * 100}>
                                        {/* Article Main Image as Background */}
                                        {bannerUrl && (
                                            <img 
                                                src={bannerUrl} 
                                                alt={title} 
                                                className="absolute inset-0 w-full h-full object-cover opacity-[0.45] group-hover:opacity-[0.75] scale-100 group-hover:scale-105 transition-all duration-700 ease-out z-0 pointer-events-none" 
                                                loading="lazy"
                                            />
                                        )}
                                        
                                        {/* Sharp minimal overlay for text contrast */}
                                        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-all duration-500 z-0 pointer-events-none" />

                                        {/* Content positioned above background */}
                                        <div className="relative z-10">
                                            {article.category && <span className="badge text-[10px] tracking-wide uppercase py-1 font-bold mb-4 inline-block">{article.category}</span>}
                                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--gold)] transition-colors duration-300 drop-shadow-sm line-clamp-2">{title}</h3>
                                            <p className="text-zinc-200 font-medium text-xs leading-relaxed mb-6 drop-shadow-sm line-clamp-2">{excerpt}</p>
                                        </div>

                                        <div className="relative z-10 flex items-center justify-between text-[11px] font-semibold text-zinc-300 mt-auto pt-2 border-t border-white/5">
                                            <span>{article.author_name}</span>
                                            <span>{article.published_at ? new Date(article.published_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'ms-MY') : ''}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="text-center mt-12" data-reveal="fade-up" data-reveal-delay="200">
                            <Link href="/artikel" className="btn-outline px-8 py-4">{t.seeAllArticles}</Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Newsletter Subscribe Section */}
            <NewsletterSection />

        </PublicLayout>
    );
}
