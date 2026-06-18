import { useEffect, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import BackToTop from '@/Components/BackToTop';
import useLanguage from '@/Hooks/useLanguage';

export default function PublicLayout({ children, title, description, keywords, image }) {
    const mainRef = useRef(null);
    const { url, props: pageProps } = usePage();

    useEffect(() => {
        const cleanup = init();
        return () => {
            if (cleanup) cleanup();
        };

        function init() {
            // Increment the observer session ID to identify the active page load
            window._currentObserverId = (window._currentObserverId || 0) + 1;
            const activeObserverId = String(window._currentObserverId);

            // Clean up any stale/previous attributes to guarantee fresh animation trigger
            document.querySelectorAll('[data-reveal]').forEach((el) => {
                el.removeAttribute('data-sr-state');
                el.removeAttribute('data-sr-revealed');
                el.removeAttribute('data-sr-observed');
                el.style.removeProperty('--sr-duration');
            });

            // Force animations to run regardless of OS reduced-motion settings to resolve lack of motion issues
            /*
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (prefersReducedMotion) {
                document.querySelectorAll('[data-reveal]').forEach((el) => {
                    el.removeAttribute('data-sr-state');
                    el.style.removeProperty('--sr-duration');
                });
                return null;
            }
            */

            const isMobile = window.matchMedia('(max-width: 767px)').matches;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    const el = entry.target;
                    if (entry.isIntersecting) {
                        const rawDelay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
                        // On mobile, cap stagger delay to 150ms max so grid items
                        // don't queue up for too long when many are on screen at once
                        const delay = isMobile ? Math.min(rawDelay, 150) : rawDelay;
                        const duration = parseInt(el.getAttribute('data-reveal-duration') || '560', 10);

                        const reveal = () => {
                            el.setAttribute('data-sr-state', 'revealing');
                            el.setAttribute('data-sr-revealed', 'true'); // Permanently mark as revealed

                            // Clean up attributes after transition completes to restore hover states
                            setTimeout(() => {
                                el.removeAttribute('data-sr-state');
                                el.style.removeProperty('--sr-duration');
                            }, duration + 100);
                        };

                        if (delay > 0) {
                            setTimeout(reveal, delay);
                        } else {
                            reveal();
                        }

                        observer.unobserve(el);
                    }
                });
            }, {
                threshold: 0.01,
                // On mobile, reveal elements slightly before they fully enter the
                // viewport so the animation completes right as they come into view
                rootMargin: isMobile ? '0px 0px 100px 0px' : '0px 0px -10px 0px'
            });

            function setupElements() {
                const elements = document.querySelectorAll('[data-reveal]');

                elements.forEach((el) => {
                    // Reset if the element is not observed by the current page session (e.g. from reused DOM nodes)
                    if (el.getAttribute('data-sr-observed') !== activeObserverId) {
                        el.removeAttribute('data-sr-state');
                        el.removeAttribute('data-sr-revealed');
                        el.style.removeProperty('--sr-duration');

                        // Initialize state hidden synchronously to prevent flash of content
                        const duration = el.getAttribute('data-reveal-duration') || '560';
                        el.style.setProperty('--sr-duration', `${duration}ms`);
                        el.setAttribute('data-sr-state', 'hidden');
                    }
                });

                // Delay observation to let layout settle and avoid the initial page load race condition
                setTimeout(() => {
                    elements.forEach((el) => {
                        if (el.getAttribute('data-sr-state') === 'hidden' && el.getAttribute('data-sr-observed') !== activeObserverId) {
                            el.setAttribute('data-sr-observed', activeObserverId);
                            observer.observe(el);
                        }
                    });
                }, 150);
            }

            setupElements();

            // Watch for dynamic content additions — debounced to avoid firing on
            // every DOM mutation which is costly on mobile devices.
            const mutationObserver = new MutationObserver((mutations) => {
                let hasNewNodes = false;
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        hasNewNodes = true;
                        break;
                    }
                }
                if (hasNewNodes) {
                    // Debounce: only run setupElements once every 200ms to avoid
                    // firing on every DOM mutation (costly on mobile)
                    clearTimeout(mutationObserver._debounceTimer);
                    mutationObserver._debounceTimer = setTimeout(() => {
                        setupElements();
                    }, 200);
                }
            });
            mutationObserver.observe(document.body, { childList: true, subtree: true });

            return () => {
                observer.disconnect();
                clearTimeout(mutationObserver._debounceTimer);
                mutationObserver.disconnect();
            };
        }
    }, [url]);



    const settings = pageProps.settings || {};
    const { lang } = useLanguage();

    const siteName = (lang === 'en' ? (settings.site_name_en || settings.site_name) : settings.site_name) || 'Laman Teknologi';
    const siteTaglineVal = lang === 'en' ? (settings.site_tagline_en || settings.site_tagline) : settings.site_tagline;
    const siteTagline = siteTaglineVal ? ` - ${siteTaglineVal}` : '';
    const fullTitle = `${title} | ${siteName}${siteTagline}`;
    const defaultDesc = 'Penyedia penyelesaian teknologi terbaik untuk organisasi anda. Kami membantu perniagaan berkembang melalui inovasi digital.';
    const settingsDesc = lang === 'en' ? (settings.site_description_en || settings.site_description) : settings.site_description;
    const metaDesc = description || settingsDesc || defaultDesc;
    const metaKeywords = keywords || settings.site_keywords || 'teknologi, sistem web, aplikasi mudah alih, AI, automasi, Malaysia';
    const homepageBg = settings.homepage_background || '/storage/uploads/homepage_bg.png';

    // Construct the absolute SEO preview image URL
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    let seoImage = image || settings.seo_image || settings.homepage_background || settings.logo || '/storage/uploads/logo.png';
    if (seoImage && !seoImage.startsWith('http') && origin) {
        seoImage = origin + seoImage;
    }

    return (
        <div className="bg-[#080808] text-white font-sans antialiased relative min-h-screen flex flex-col selection:bg-yellow-500 selection:text-black">
            <Head>
                <title>{fullTitle}</title>
                <meta name="description" content={metaDesc} />
                <meta name="keywords" content={metaKeywords} />
                
                {/* Structured Data (Schema.org) for Google Search */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": siteName,
                        "url": origin || "https://lamanteknologi.com.my",
                        "description": metaDesc
                    })}
                </script>
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={fullTitle} />
                <meta property="og:description" content={metaDesc} />
                <meta property="og:site_name" content={siteName} />
                {seoImage && <meta property="og:image" content={seoImage} />}

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={fullTitle} />
                <meta name="twitter:description" content={metaDesc} />
                {seoImage && <meta name="twitter:image" content={seoImage} />}

                {/* Globally rewrite legacy static digital_kl_bg.png paths to settings.homepage_background */}
                <style>{`
                    [style*="/storage/digital_kl_bg.png"] {
                        background-image: url('${homepageBg}') !important;
                    }
                `}</style>
            </Head>

            {/*
              Ambient glow orbs — absolute positioned (not fixed) so they don't
              create a separate GPU compositing layer on every scroll frame.
              Blur reduced from 80px to 40px for better mobile GPU performance.
            */}
            <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-yellow-500/4 blur-[40px] pointer-events-none z-0" />
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-amber-600/3 blur-[40px] pointer-events-none z-0" />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main ref={mainRef} className="flex-grow w-full">
                    {children}
                </main>
                <Footer settings={settings} />
            </div>

            {/* Back to top — renders once here for all public pages */}
            <BackToTop />
        </div>
    );
}
