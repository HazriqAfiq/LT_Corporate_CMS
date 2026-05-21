import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function ArticleDetail({ article, relatedArticles = [], settings = {} }) {
    return (
        <PublicLayout 
            title={article.seo_title || article.title} 
            description={article.seo_description || article.excerpt}
            keywords={Array.isArray(article.tags) ? article.tags.join(', ') : ''}
            settings={settings}
        >
            {/* Hero Banner with Homepage-styled Backdrop */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-[#080808] border-b border-white/5 z-10">
                {/* Master Background Image (Static when scrolling) */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none z-0 opacity-45" 
                    style={{ backgroundImage: "url('/storage/digital_kl_bg.png')" }}
                />

                {/* Ambient Static Warm Golden Blur Glow */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none z-0 opacity-40" 
                    style={{ 
                        backgroundImage: "url('/storage/hero_laptop_city.png')",
                        filter: 'blur(110px) brightness(0.65)'
                    }}
                />

                {/* Warm Amber-Gold Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)]/5 via-transparent to-amber-500/10 z-0 pointer-events-none" />

                {/* Dark Overlays */}
                <div className="absolute inset-y-0 left-0 w-full lg:w-2/3 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-[#080808]/40 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-full lg:w-1/3 bg-gradient-to-l from-[#080808] via-[#080808]/60 to-[#080808]/40 z-0 pointer-events-none" />

                {/* Technical Line Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />
                
                {/* Tech Glows */}
                <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-[var(--gold)]/10 blur-[100px] pointer-events-none z-0" />
                <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-[var(--gold)]/5 blur-[90px] pointer-events-none z-0" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href="/artikel" className="text-gray-400 hover:text-[var(--gold)] text-sm mb-6 inline-block transition-colors">← Kembali ke Artikel</Link>
                    {article.category && <span className="badge mb-4 inline-block">{article.category}</span>}
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">{article.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                        <span>{article.author_name}</span>
                        <span>•</span>
                        <span>{article.published_at ? new Date(article.published_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span>
                        <span>•</span>
                        <span>{article.views_count} tontonan</span>
                    </div>
                </div>
            </section>

            {/* Article Content Section (Charcoal section with centered glow & gold divider lines) */}
            <section className="py-24 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                {/* Soft top-centered amber radial glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                
                {/* Gold Accent Divider Lines */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {article.excerpt && (
                        <p className="text-lg text-gray-300 border-l-4 border-[var(--gold)] pl-6 mb-10 italic leading-relaxed">
                            {article.excerpt}
                        </p>
                    )}
                    <div className="prose prose-lg max-w-none prose-invert prose-headings:text-white prose-a:text-[var(--gold)] prose-strong:text-white prose-code:text-[var(--gold)]" dangerouslySetInnerHTML={{ __html: article.content }} />
                    {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-white/5">
                            <span className="text-sm font-medium text-gray-400 mr-2">Tag:</span>
                            {article.tags.map((tag, i) => <span key={i} className="badge text-xs">{tag}</span>)}
                        </div>
                    )}
                </div>
            </section>

            {/* Related Articles Section (Deep Charcoal / Black) */}
            {relatedArticles.length > 0 && (
                <section className="py-24 relative bg-[#080808] border-b border-white/5 z-10 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <h2 className="section-title text-center mb-12">Artikel <span className="gold-accent">Berkaitan</span></h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedArticles.map(a => (
                                <Link key={a.id} href={`/artikel/${a.slug}`} className="card group hover:scale-[1.02] transition-transform duration-300">
                                    <div className="p-6">
                                        {a.category && <span className="badge text-xs mb-3 inline-block">{a.category}</span>}
                                        <h3 className="text-lg font-bold text-white group-hover:text-[var(--gold)] transition-colors line-clamp-2">{a.title}</h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
