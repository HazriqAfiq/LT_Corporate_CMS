import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PublicLayout from '@/Layouts/PublicLayout';
import useLanguage from '@/Hooks/useLanguage';

const t = {
    bm: {
        heroBadge: 'Artikel & Berita',
        heroTitle: 'Artikel',
        heroTitleGold: 'Terkini',
        noArticles: 'Tiada artikel buat masa ini.',
        loadMore: 'Lihat Lagi',
        loading: 'Memuatkan...',
        categories: [
            { value: '', label: 'Semua' },
            { value: 'berita', label: 'Berita' },
            { value: 'teknologi', label: 'Teknologi' },
            { value: 'tips', label: 'Tips & Tutorial' },
            { value: 'pengumuman', label: 'Pengumuman' },
            { value: 'kajian-kes', label: 'Kajian Kes' },
        ],
    },
    en: {
        heroBadge: 'Articles & News',
        heroTitle: 'Latest',
        heroTitleGold: 'Articles',
        noArticles: 'No articles at this time.',
        loadMore: 'View More',
        loading: 'Loading...',
        categories: [
            { value: '', label: 'All' },
            { value: 'berita', label: 'News' },
            { value: 'teknologi', label: 'Technology' },
            { value: 'tips', label: 'Tips & Tutorials' },
            { value: 'pengumuman', label: 'Announcements' },
            { value: 'kajian-kes', label: 'Case Studies' },
        ],
    },
};

export default function Articles({ articles, currentCategory, settings = {} }) {
    const { lang } = useLanguage();

    const tr = t[lang] || t.bm;
    const [loadedArticles, setLoadedArticles] = useState(articles?.data || []);
    const [nextPageUrl, setNextPageUrl] = useState(articles?.next_page_url || null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoadedArticles(articles?.data || []);
        setNextPageUrl(articles?.next_page_url || null);
    }, [articles]);

    const handleLoadMore = async () => {
        if (!nextPageUrl || loading) return;
        setLoading(true);
        try {
            const response = await axios.get(nextPageUrl);
            const newArticles = response.data?.data || [];
            setLoadedArticles(prev => [...prev, ...newArticles]);
            setNextPageUrl(response.data?.next_page_url || null);
        } catch (error) {
            console.error('Error loading more articles:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicLayout title={lang === 'en' ? 'Articles' : 'Artikel'} settings={settings}>
            {/* Hero banner bg-scroll for mobile performance */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-[#080808] border-b border-white/5 z-10" style={{ clipPath: 'inset(0)' }}>
                <div className="fixed inset-0 bg-cover bg-center pointer-events-none z-0 opacity-65 md:opacity-55" style={{ backgroundImage: "url('/storage/digital_kl_bg.png')" }} />
                <div className="fixed inset-0 bg-cover bg-center pointer-events-none z-0 opacity-60 md:opacity-50" style={{ backgroundImage: "url('/storage/hero_laptop_city.png')", filter: 'blur(110px) brightness(0.65)' }} />
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)]/5 via-transparent to-amber-500/10 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-full lg:w-2/3 bg-gradient-to-r from-[#080808]/75 via-[#080808]/50 to-[#080808]/20 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-full lg:w-1/3 bg-gradient-to-l from-[#080808]/40 via-[#080808]/30 to-[#080808]/20 z-0 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />
                <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-[var(--gold)]/10 blur-[100px] pointer-events-none z-0" />
                <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-[var(--gold)]/5 blur-[90px] pointer-events-none z-0" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center" data-reveal="fade-up">
                    <div className="badge mb-6">{tr.heroBadge}</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {tr.heroTitle} <span className="text-[var(--gold)]">{tr.heroTitleGold}</span>
                    </h1>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-28 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-3 mb-12 justify-center" data-reveal="fade-up" data-reveal-delay="100">
                        {tr.categories.map(cat => (
                            <Link key={cat.value} href={cat.value ? `/artikel?category=${cat.value}` : '/artikel'}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${currentCategory === cat.value || (!currentCategory && !cat.value)
                                    ? 'bg-[var(--gold)] text-white' : 'bg-white/5 border border-white/10 text-[var(--gray-600)] hover:bg-[var(--gray-200)]'}`}>
                                {cat.label}
                            </Link>
                        ))}
                    </div>
                    {loadedArticles.length > 0 ? (
                        <>
                            <div className={`grid gap-8 justify-center ${
                                loadedArticles.length === 1 
                                    ? 'grid-cols-1 max-w-md mx-auto' 
                                    : loadedArticles.length === 2 
                                        ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' 
                                        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            }`}>
                                {loadedArticles.map((article, i) => {
                                    const title = (lang === 'en' && article.title_en) ? article.title_en : article.title;
                                    const excerpt = (lang === 'en' && article.excerpt_en) ? article.excerpt_en : article.excerpt;
                                    return (
                                        <Link key={article.id} href={`/artikel/${article.slug}`} className="card group flex flex-col h-full" data-reveal="fade-up" data-reveal-delay={i * 100}>
                                            {article.featured_media?.url || article.featured_image ? (
                                                <div className="aspect-video bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                                                    <img src={article.featured_media?.url || `/storage/${article.featured_image}`} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                                </div>
                                            ) : (
                                                <div className="aspect-video bg-white/5 border border-white/10 flex items-center justify-center relative z-10 flex-shrink-0"><span className="text-3xl">📰</span></div>
                                            )}
                                            <div className="p-6 flex flex-col flex-grow">
                                                {article.category && <span className="badge text-xs mb-3 inline-block self-start">{article.category}</span>}
                                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--gold)] transition-colors line-clamp-2">{title}</h3>
                                                <p className="text-[var(--gray-500)] text-sm line-clamp-2 mb-4">{excerpt}</p>
                                                <div className="flex items-center justify-between text-xs text-[var(--gray-400)] mt-auto pt-4 border-t border-white/5">
                                                    <span>{article.author_name}</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                            {article.views_count ?? 0}
                                                        </span>
                                                        <span>{article.published_at ? new Date(article.published_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'ms-MY') : ''}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                            {/* Load More Button */}
                            {nextPageUrl && (
                                <div className="flex justify-center mt-16">
                                    <button 
                                        onClick={handleLoadMore} 
                                        disabled={loading}
                                        className="text-[var(--gold)] hover:text-white transition-colors text-sm font-semibold flex items-center gap-2 mx-auto uppercase tracking-wider disabled:opacity-50"
                                    >
                                        {loading ? tr.loading : `${tr.loadMore} ↓`}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-center py-20 text-[var(--gray-400)]">{tr.noArticles}</p>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
