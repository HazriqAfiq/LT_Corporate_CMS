import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';

const t = {
    bm: {
        heroBadge: 'Portfolio',
        heroTitle: 'Projek',
        heroTitleGold: 'Kami',
        heroDesc: 'Projek yang telah kami siapkan untuk klien di pelbagai industri.',
        noProjects: 'Projek akan dikemaskini tidak lama lagi.',
    },
    en: {
        heroBadge: 'Portfolio',
        heroTitle: 'Our',
        heroTitleGold: 'Projects',
        heroDesc: 'Projects we have completed for clients across various industries.',
        noProjects: 'Projects will be updated soon.',
    },
};

export default function Portfolio({ projects = [], settings = {} }) {
    const [lang, setLang] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('lang') || 'bm' : 'bm'));

    useEffect(() => {
        setLang(localStorage.getItem('lang') || 'bm');
        const handleLangChange = () => setLang(localStorage.getItem('lang') || 'bm');
        window.addEventListener('languageChange', handleLangChange);
        return () => window.removeEventListener('languageChange', handleLangChange);
    }, []);

    const tr = t[lang] || t.bm;

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
        <PublicLayout title={lang === 'en' ? 'Portfolio' : 'Portfolio'} settings={settings}>
            {/* Hero Banner */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-[#080808] border-b border-white/5 z-10">
                <div className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none z-0 opacity-45" style={{ backgroundImage: "url('/storage/digital_kl_bg.png')" }} />
                <div className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none z-0 opacity-40" style={{ backgroundImage: "url('/storage/hero_laptop_city.png')", filter: 'blur(110px) brightness(0.65)' }} />
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)]/5 via-transparent to-amber-500/10 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-full lg:w-2/3 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-[#080808]/40 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-full lg:w-1/3 bg-gradient-to-l from-[#080808] via-[#080808]/60 to-[#080808]/40 z-0 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />
                <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-[var(--gold)]/10 blur-[100px] pointer-events-none z-0" />
                <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-[var(--gold)]/5 blur-[90px] pointer-events-none z-0" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="badge mb-6">{tr.heroBadge}</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {tr.heroTitle} <span className="text-[var(--gold)]">{tr.heroTitleGold}</span>
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">{tr.heroDesc}</p>
                </div>
            </section>

            {/* Portfolio Grid */}
            <section className="py-28 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map(project => {
                            const title = (lang === 'en' && project.title_en) ? project.title_en : project.title;
                            const description = (lang === 'en' && project.description_en) ? project.description_en : project.description;
                            return (
                                <Link key={project.id} href={`/portfolio/${project.slug}`} className="card group">
                                    {project.featured_media?.url || project.featured_image ? (
                                        <div className="aspect-video bg-white/5 border border-white/10 overflow-hidden">
                                            <img src={project.featured_media?.url || `/storage/${project.featured_image}`} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-white/5 border border-white/10 flex items-center justify-center relative z-10">
                                            <span className="text-4xl">🖥️</span>
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-3">
                                            {project.category && <span className="badge text-xs inline-block">{project.category}</span>}
                                            {project.completed_at && (
                                                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                                                    {formatCompletedDate(project.completed_at, lang)}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--gold)] transition-colors">{title}</h3>
                                        <p className="text-[var(--gray-500)] text-sm line-clamp-2">{description}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    {projects.length === 0 && <p className="text-center py-20 text-[var(--gray-400)]">{tr.noProjects}</p>}
                </div>
            </section>
        </PublicLayout>
    );
}
