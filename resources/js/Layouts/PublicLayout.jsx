import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function PublicLayout({ children, title, description, keywords, settings = {} }) {
    const siteName = settings.site_name || 'Laman Teknologi';
    const defaultDesc = 'Penyedia penyelesaian teknologi terbaik untuk organisasi anda. Kami membantu perniagaan berkembang melalui inovasi digital.';
    const metaDesc = description || settings.site_description || defaultDesc;
    const metaKeywords = keywords || settings.site_keywords || 'teknologi, sistem web, aplikasi mudah alih, AI, automasi, Malaysia';

    return (
        <>
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
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer settings={settings} />
            </div>
        </>
    );
}
