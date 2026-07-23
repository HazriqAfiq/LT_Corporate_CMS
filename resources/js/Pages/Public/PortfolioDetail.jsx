import { Link } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import ScreenshotGallery from '@/Components/Public/ScreenshotGallery';

export default function PortfolioDetail({ project, galleryMedia = [], settings = {} }) {
    const homepageBg = settings.homepage_background || '/storage/uploads/homepage_bg.webp';
    const [lang, setLang] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('lang') || 'bm' : 'bm'));

    useEffect(() => {
        setLang(localStorage.getItem('lang') || 'bm');
        const handleLangChange = () => setLang(localStorage.getItem('lang') || 'bm');
        window.addEventListener('languageChange', handleLangChange);
        return () => window.removeEventListener('languageChange', handleLangChange);
    }, []);



    const title = (lang === 'en' && project.title_en) ? project.title_en : project.title;
    const description = (lang === 'en' && project.description_en) ? project.description_en : project.description;
    const content = (lang === 'en' && project.content_en) ? project.content_en : project.content;
    const techs = (lang === 'en' && project.technologies_en && Array.isArray(project.technologies_en)) ? project.technologies_en : (project.technologies || []);

    const backLabel = lang === 'en' ? '← Back to Portfolio' : '← Kembali ke Portfolio';
    const clientLabel = lang === 'en' ? 'Client:' : 'Klien:';

    const tr = {
        bm: {
            galleryTitle: 'Galeri Projek',
            galleryDesc: 'Lihat gambar-gambar visual dan tangkapan skrin dari projek ini.',
        },
        en: {
            galleryTitle: 'Project Gallery',
            galleryDesc: 'Explore visual previews and screenshots from this project.',
        }
    }[lang] || {
        galleryTitle: 'Galeri Projek',
        galleryDesc: 'Lihat gambar-gambar visual dan tangkapan skrin dari projek ini.',
    };

    const formatCompletedDate = (dateString, lang) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'ms-MY', {
            month: 'long',
            year: 'numeric'
        });
    };



    return (
        <PublicLayout
            title={project.meta_title || title}
            description={project.meta_description || description}
            keywords={Array.isArray(techs) ? techs.join(', ') : ''}
            settings={settings}
            image={project.featured_media?.url}
        >
            {/* Hero Banner */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-[#080808] border-b border-white/5 z-10" style={{ clipPath: 'inset(0)' }}>
                <div className="fixed inset-0 bg-cover bg-center pointer-events-none z-0 opacity-30 md:opacity-20" style={{ backgroundImage: `url('${homepageBg}')` }} />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" data-reveal="fade-up">
                    <Link href="/portfolio" className="text-gray-400 hover:text-[var(--gold)] text-sm mb-6 inline-block transition-colors">{backLabel}</Link>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="badge">{project.category || (lang === 'en' ? 'Project' : 'Projek')}</div>
                        {project.completed_at && (
                            <span className="text-sm text-zinc-500 font-semibold bg-white/5 border border-white/10 px-3 py-1 rounded-md">
                                {lang === 'en' ? 'Completed: ' : 'Selesai: '}{formatCompletedDate(project.completed_at, lang)}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">{title}</h1>
                    <p className="text-gray-300 text-lg max-w-3xl leading-relaxed">{description}</p>
                    <div className="flex flex-wrap gap-3 mt-6">
                        {techs.map((t, i) => (
                            <span key={i} className="text-xs bg-white/5 text-gray-300 px-3 py-1 rounded-md border border-white/10 backdrop-blur-sm">{t}</span>
                        ))}
                    </div>
                    {project.client && <p className="mt-6 text-[var(--gold)] font-medium">{clientLabel} {project.client}</p>}
                </div>
            </section>

            {/* Content */}
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

            {/* Project Image Gallery */}
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
