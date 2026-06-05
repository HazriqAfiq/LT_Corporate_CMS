import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function ArticleDetail({ article, relatedArticles = [], settings = {} }) {
    const [lang, setLang] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('lang') || 'bm' : 'bm'));

    useEffect(() => {
        setLang(localStorage.getItem('lang') || 'bm');
        const handleLangChange = () => setLang(localStorage.getItem('lang') || 'bm');
        window.addEventListener('languageChange', handleLangChange);
        return () => window.removeEventListener('languageChange', handleLangChange);
    }, []);

    const title = (lang === 'en' && article.title_en) ? article.title_en : article.title;
    const excerpt = (lang === 'en' && article.excerpt_en) ? article.excerpt_en : article.excerpt;
    const content = (lang === 'en' && article.content_en) ? article.content_en : article.content;

    const backLabel = lang === 'en' ? '← Back to Articles' : '← Kembali ke Artikel';
    const relatedLabel = lang === 'en' ? 'Related' : 'Berkaitan';
    const relatedTitle = lang === 'en' ? 'Related Articles' : 'Artikel Berkaitan';
    const viewsLabel = lang === 'en' ? 'views' : 'tontonan';

    return (
        <PublicLayout
            title={article.seo_title || title}
            description={article.seo_description || excerpt}
            keywords={Array.isArray(article.tags) ? article.tags.join(', ') : ''}
            settings={settings}
            image={article.featured_media?.url}
        >
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

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href="/artikel" className="text-gray-400 hover:text-[var(--gold)] text-sm mb-6 inline-block transition-colors">{backLabel}</Link>
                    {article.category && <span className="badge mb-4 inline-block">{article.category}</span>}
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">{title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                        <span>{article.author_name}</span>
                        <span>•</span>
                        <span>{article.published_at ? new Date(article.published_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'ms-MY', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span>
                        <span>•</span>
                        <span>{article.views_count} {viewsLabel}</span>
                    </div>
                </div>
            </section>

            {/* Article Content */}
            <section className="py-24 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {excerpt && (
                        <p className="text-lg text-gray-300 border-l-4 border-[var(--gold)] pl-6 mb-10 italic leading-relaxed">
                            {excerpt}
                        </p>
                    )}
                    <div className="prose prose-lg max-w-none prose-invert prose-headings:text-white prose-a:text-[var(--gold)] prose-strong:text-white prose-code:text-[var(--gold)]" dangerouslySetInnerHTML={{ __html: content }} />
                    {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-white/5">
                            <span className="text-sm font-medium text-gray-400 mr-2">Tag:</span>
                            {article.tags.map((tag, i) => <span key={i} className="badge text-xs">{tag}</span>)}
                        </div>
                    )}
                </div>
            </section>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <section className="py-24 relative bg-[#080808] border-b border-white/5 z-10 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <h2 className="section-title text-center mb-12">{lang === 'en' ? 'Related ' : 'Artikel '}<span className="gold-accent">{relatedLabel}</span></h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedArticles.map(a => {
                                const aTitle = (lang === 'en' && a.title_en) ? a.title_en : a.title;
                                return (
                                    <Link key={a.id} href={`/artikel/${a.slug}`} className="card group hover:scale-[1.02] transition-transform duration-300">
                                        <div className="p-6">
                                            {a.category && <span className="badge text-xs mb-3 inline-block">{a.category}</span>}
                                            <h3 className="text-lg font-bold text-white group-hover:text-[var(--gold)] transition-colors line-clamp-2">{aTitle}</h3>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
