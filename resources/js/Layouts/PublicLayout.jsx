import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function PublicLayout({ children, title, description, keywords, image }) {
    const { settings = {} } = usePage().props;
    const [lang, setLang] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('lang') || 'bm' : 'bm'));

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.document.documentElement.classList.remove('light');
        }
        setLang(localStorage.getItem('lang') || 'bm');
        const handleLangChange = () => setLang(localStorage.getItem('lang') || 'bm');
        window.addEventListener('languageChange', handleLangChange);
        return () => window.removeEventListener('languageChange', handleLangChange);
    }, []);

    const siteName = (lang === 'en' ? (settings.site_name_en || settings.site_name) : settings.site_name) || 'Laman Teknologi';
    const siteTaglineVal = lang === 'en' ? (settings.site_tagline_en || settings.site_tagline) : settings.site_tagline;
    const siteTagline = siteTaglineVal ? ` - ${siteTaglineVal}` : '';
    const fullTitle = `${title} | ${siteName}${siteTagline}`;
    const defaultDesc = 'Penyedia penyelesaian teknologi terbaik untuk organisasi anda. Kami membantu perniagaan berkembang melalui inovasi digital.';
    const settingsDesc = lang === 'en' ? (settings.site_description_en || settings.site_description) : settings.site_description;
    const metaDesc = description || settingsDesc || defaultDesc;
    const metaKeywords = keywords || settings.site_keywords || 'teknologi, sistem web, aplikasi mudah alih, AI, automasi, Malaysia';
    const homepageBg = settings.homepage_background || '/storage/uploads/branding/homepage_bg.png';

    // Construct the absolute SEO preview image URL
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    let seoImage = image || settings.seo_image || settings.homepage_background || settings.logo || '/storage/uploads/branding/logo.png';
    if (seoImage && !seoImage.startsWith('http') && origin) {
        seoImage = origin + seoImage;
    }

    return (
        <div className="bg-[#080808] text-white font-sans antialiased relative min-h-screen flex flex-col selection:bg-yellow-500 selection:text-black">
            <Head>
                <title>{fullTitle}</title>
                <meta name="description" content={metaDesc} />
                <meta name="keywords" content={metaKeywords} />
                
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

            {/* No background image — clean pure dark #080808 background for all non-home pages */}
            {/* Subtle ambient gold glow accents only */}
            <div className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-yellow-500/5 to-transparent blur-[140px] pointer-events-none z-0" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-amber-600/4 to-transparent blur-[120px] pointer-events-none z-0" />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow w-full">
                    {children}
                </main>
                <Footer settings={settings} />
            </div>
        </div>
    );
}
