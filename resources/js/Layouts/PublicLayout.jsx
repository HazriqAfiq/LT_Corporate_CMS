import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function PublicLayout({ children, title, description, keywords, settings = {} }) {
    const siteName = settings.site_name || 'Laman Teknologi';
    const defaultDesc = 'Penyedia penyelesaian teknologi terbaik untuk organisasi anda. Kami membantu perniagaan berkembang melalui inovasi digital.';
    const metaDesc = description || settings.site_description || defaultDesc;
    const metaKeywords = keywords || settings.site_keywords || 'teknologi, sistem web, aplikasi mudah alih, AI, automasi, Malaysia';

    return (
        <div className="bg-[#080808] text-white font-sans antialiased relative min-h-screen flex flex-col selection:bg-yellow-500 selection:text-black">
            <Head>
                <title>{`${title} | ${siteName}`}</title>
                <meta name="description" content={metaDesc} />
                <meta name="keywords" content={metaKeywords} />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`${title} | ${siteName}`} />
                <meta property="og:description" content={metaDesc} />
                <meta property="og:site_name" content={siteName} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${title} | ${siteName}`} />
                <meta name="twitter:description" content={metaDesc} />
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
