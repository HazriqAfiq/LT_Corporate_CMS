import { useEffect, useState } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import BackToTop from '@/Components/BackToTop';

export default function PromoLayout({ children, title, description, hideNavbar = false }) {
    const { props: pageProps } = usePage();
    const settings = pageProps.settings || {};
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const logo = settings.logo || '/storage/uploads/logo.png';
    const siteName = settings.site_name || 'Laman Teknologi';
    const siteTagline = settings.site_tagline || 'Mudah. Pantas. Profesional.';
    const homepageBg = '/storage/uploads/promo_hero_bg.png';

    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const metaDesc = description || 'Promosi Khas Landing Page Profesional oleh Laman Teknologi.';

    const navLinks = [
        { label: 'Pakej', href: '#keistimewaan' },
        { label: 'Proses', href: '#proses' },
        { label: 'FAQ', href: '#faq' },
    ];

    const handleNavClick = (e, href) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Scroll-reveal observer
    useEffect(() => {
        const htmlEl = document.documentElement;
        htmlEl.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);

        let cleanup = null;
        const settleTimer = setTimeout(() => {
            htmlEl.style.scrollBehavior = '';
            cleanup = init();
        }, 30);

        return () => {
            clearTimeout(settleTimer);
            if (cleanup) cleanup();
        };

        function init() {
            window._currentObserverId = (window._currentObserverId || 0) + 1;
            const activeObserverId = String(window._currentObserverId);

            document.querySelectorAll('[data-reveal]').forEach((el) => {
                el.removeAttribute('data-sr-state');
                el.removeAttribute('data-sr-revealed');
                el.removeAttribute('data-sr-observed');
                el.style.removeProperty('--sr-duration');
            });

            const isMobile = window.matchMedia('(max-width: 767px)').matches;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    const el = entry.target;
                    if (entry.isIntersecting) {
                        const rawDelay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
                        const delay = isMobile ? Math.min(rawDelay, 150) : rawDelay;
                        const duration = parseInt(el.getAttribute('data-reveal-duration') || '560', 10);
                        const reveal = () => {
                            el.setAttribute('data-sr-state', 'revealing');
                            el.setAttribute('data-sr-revealed', 'true');
                            setTimeout(() => {
                                el.removeAttribute('data-sr-state');
                                el.style.removeProperty('--sr-duration');
                            }, duration + 100);
                        };
                        if (delay > 0) setTimeout(reveal, delay);
                        else reveal();
                        observer.unobserve(el);
                    }
                });
            }, {
                threshold: 0.01,
                rootMargin: isMobile ? '0px 0px 100px 0px' : '0px 0px -10px 0px'
            });

            function setupElements() {
                const elements = document.querySelectorAll('[data-reveal]');
                elements.forEach((el) => {
                    if (el.getAttribute('data-sr-observed') !== activeObserverId) {
                        const duration = el.getAttribute('data-reveal-duration') || '560';
                        el.style.setProperty('--sr-duration', `${duration}ms`);
                        el.removeAttribute('data-sr-revealed');
                        el.setAttribute('data-sr-state', 'hidden');
                    }
                });
                setTimeout(() => {
                    elements.forEach((el) => {
                        if (el.getAttribute('data-sr-state') === 'hidden' && el.getAttribute('data-sr-observed') !== activeObserverId) {
                            el.setAttribute('data-sr-observed', activeObserverId);
                            observer.observe(el);
                        }
                    });
                }, 50);
            }
            setupElements();
            return () => observer.disconnect();
        }
    }, []);

    const rawPhone = settings.contact_phone || '60123456789';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const waPhone = cleanPhone.startsWith('60') ? cleanPhone : '60' + cleanPhone.replace(/^0/, '');
    const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent('Hai Laman Teknologi, saya ingin bertanya mengenai promosi Landing Page Khas.')}`;

    return (
        <div className="public-layout bg-[#0a0a14] text-white font-sans antialiased relative min-h-screen flex flex-col selection:bg-yellow-400 selection:text-black">
            <Head>
                <title>{fullTitle}</title>
                <meta name="description" content={metaDesc} />
                {homepageBg && <link rel="preload" as="image" href={homepageBg} fetchpriority="high" />}
                <meta property="og:title" content={fullTitle} />
                <meta property="og:description" content={metaDesc} />
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            {/* ── NAVBAR ── */}
            {!hideNavbar && (
                <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center border-b border-white/5 bg-[#0a0a14]/95 backdrop-blur-md" style={{ transform: 'translateZ(0)' }}>
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
                        {/* Logo */}
                        <a href="#hero" onClick={e => handleNavClick(e, '#hero')} className="flex items-center gap-2.5 flex-shrink-0">
                            {logo ? (
                                <img src={logo} alt={siteName} className="h-8 w-auto object-contain" />
                            ) : (
                                <div className="flex flex-col leading-tight">
                                    <span className="text-white font-extrabold text-sm tracking-tight">{siteName}</span>
                                    <span className="text-yellow-400 text-[9px] font-medium">{siteTagline}</span>
                                </div>
                            )}
                        </a>

                        {/* Right-aligned Navigation links & CTA */}
                        <div className="hidden md:flex items-center gap-8 ml-auto mr-6">
                            {navLinks.map(link => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={e => handleNavClick(e, link.href)}
                                    className="text-xs font-bold text-zinc-300 hover:text-white uppercase tracking-wider transition-colors duration-200 hover:text-yellow-400"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/promosi/tempah"
                                className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-md bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-200"
                            >
                                Dapatkan Sekarang
                            </Link>

                            {/* Mobile hamburger */}
                            <button
                                className="md:hidden flex flex-col gap-1 p-2"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu dropdown */}
                    {mobileMenuOpen && (
                        <div className="absolute top-16 left-0 right-0 bg-[#0f0f1a] border-b border-zinc-800 py-4 px-4 flex flex-col gap-4 md:hidden z-50">
                            {navLinks.map(link => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={e => handleNavClick(e, link.href)}
                                    className="text-sm font-bold text-zinc-300 hover:text-yellow-400 uppercase tracking-wider transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <Link
                                href="/promosi/tempah"
                                onClick={() => setMobileMenuOpen(false)}
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all"
                            >
                                Dapatkan Sekarang
                            </Link>
                        </div>
                    )}
                </nav>
            )}

            {/* Main content (offset for fixed navbar) */}
            <div className={`relative z-10 flex flex-col min-h-screen ${hideNavbar ? '' : 'pt-16'}`}>
                <main className="flex-grow w-full">
                    {children}
                </main>

                {/* Footer */}
                <footer className="bg-[#080810] border-t border-white/5 py-8 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2.5">
                                {logo ? (
                                    <img src={logo} alt={siteName} className="h-7 w-auto object-contain" />
                                ) : (
                                    <div className="flex flex-col leading-tight">
                                        <span className="text-white font-extrabold text-sm">{siteName}</span>
                                        <span className="text-yellow-400 text-[9px] font-medium">{siteTagline}</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-zinc-500 text-xs text-center">
                                © {new Date().getFullYear()} {siteName}. Semua Hak Cipta Terpelihara.
                            </p>
                        </div>
                        <p className="text-zinc-700 text-[10px] text-center mt-4">
                            *Tertakluk kepada terma & syarat.
                        </p>
                    </div>
                </footer>
            </div>

            <BackToTop />
        </div>
    );
}
