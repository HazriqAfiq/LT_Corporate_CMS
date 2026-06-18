import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import ReadingProgress from '@/Components/ReadingProgress';
import useLanguage from '@/Hooks/useLanguage';
import ScreenshotGallery from '@/Components/Public/ScreenshotGallery';

export default function ArticleDetail({ article, galleryMedia = [], relatedArticles = [], settings = {} }) {
    const { lang } = useLanguage();

    const title = (lang === 'en' && article.title_en) ? article.title_en : article.title;
    const excerpt = (lang === 'en' && article.excerpt_en) ? article.excerpt_en : article.excerpt;
    const content = (lang === 'en' && article.content_en) ? article.content_en : article.content;

    const backLabel = lang === 'en' ? '← Back to Articles' : '← Kembali ke Artikel';
    const relatedLabel = lang === 'en' ? 'Related' : 'Berkaitan';
    const viewsLabel = lang === 'en' ? 'views' : 'tontonan';

    const tr = {
        bm: {
            galleryTitle: 'Galeri Artikel',
            galleryDesc: 'Lihat gambar-gambar visual dan tangkapan skrin berkaitan artikel ini.',
        },
        en: {
            galleryTitle: 'Article Gallery',
            galleryDesc: 'Explore visual previews and screenshots related to this article.',
        }
    }[lang] || {
        galleryTitle: 'Galeri Artikel',
        galleryDesc: 'Lihat gambar-gambar visual dan tangkapan skrin berkaitan artikel ini.',
    };



    return (
        <PublicLayout
            title={article.seo_title || title}
            description={article.seo_description || excerpt}
            keywords={Array.isArray(article.tags) ? article.tags.join(', ') : ''}
            settings={settings}
            image={article.featured_media?.url}
        >
            {/* Reading progress bar for articles */}
            <ReadingProgress />

            {/* Hero Banner — bg-scroll on mobile for performance */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-[#080808] border-b border-white/5 z-10" style={{ clipPath: 'inset(0)' }}>
                <div className="fixed inset-0 bg-cover bg-center pointer-events-none z-0 opacity-65 md:opacity-55" style={{ backgroundImage: "url('/storage/digital_kl_bg.png')" }} />
                <div className="fixed inset-0 bg-cover bg-center pointer-events-none z-0 opacity-60 md:opacity-50" style={{ backgroundImage: "url('/storage/hero_laptop_city.png')", filter: 'blur(110px) brightness(0.65)' }} />
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)]/5 via-transparent to-amber-500/10 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-full lg:w-2/3 bg-gradient-to-r from-[#080808]/75 via-[#080808]/50 to-[#080808]/20 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-full lg:w-1/3 bg-gradient-to-l from-[#080808]/40 via-[#080808]/30 to-[#080808]/20 z-0 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />
                <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-[var(--gold)]/10 blur-[100px] pointer-events-none z-0" />
                <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-[var(--gold)]/5 blur-[90px] pointer-events-none z-0" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" data-reveal="fade-up">
                    <Link href="/artikel" className="text-gray-400 hover:text-[var(--gold)] text-sm mb-6 inline-block transition-colors">{backLabel}</Link>
                    {article.category && <div className="mb-6"><span className="badge">{article.category}</span></div>}
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

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" data-reveal="fade-up" data-reveal-delay="200">
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

            {/* Article Gallery Section */}
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

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <section className="py-24 relative bg-[#080808] border-b border-white/5 z-10 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <h2 className="section-title text-center mb-12" data-reveal="fade-up">{lang === 'en' ? 'Related ' : 'Artikel '}<span className="gold-accent">{lang === 'en' ? 'Articles' : relatedLabel}</span></h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedArticles.map((a, i) => {
                                const aTitle = (lang === 'en' && a.title_en) ? a.title_en : a.title;
                                const aExcerpt = (lang === 'en' && a.excerpt_en) ? a.excerpt_en : a.excerpt;
                                return (
                                    <Link key={a.id} href={`/artikel/${a.slug}`} className="card group flex flex-col h-full hover:scale-[1.02] transition-transform duration-300" data-reveal="fade-up" data-reveal-delay={i * 100}>
                                        {a.featured_media?.url || a.featured_image ? (
                                            <div className="aspect-video bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                                                <img src={a.featured_media?.url || `/storage/${a.featured_image}`} alt={aTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                            </div>
                                        ) : (
                                            <div className="aspect-video bg-white/5 border border-white/10 flex items-center justify-center relative z-10 flex-shrink-0"><span className="text-3xl">📰</span></div>
                                        )}
                                        <div className="p-6 flex flex-col flex-grow">
                                            {a.category && <span className="badge text-xs mb-3 inline-block self-start">{a.category}</span>}
                                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--gold)] transition-colors line-clamp-2">{aTitle}</h3>
                                            <p className="text-[var(--gray-500)] text-sm line-clamp-2 mb-4">{aExcerpt}</p>
                                            <div className="flex items-center justify-between text-xs text-[var(--gray-400)] mt-auto pt-4 border-t border-white/5">
                                                <span>{a.author_name}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                        {a.views_count ?? 0}
                                                    </span>
                                                    <span>{a.published_at ? new Date(a.published_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'ms-MY') : ''}</span>
                                                </div>
                                            </div>
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
