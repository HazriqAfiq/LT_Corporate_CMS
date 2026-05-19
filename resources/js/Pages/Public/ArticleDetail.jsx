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
            <section className="pt-32 pb-16 bg-navy-gradient">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/artikel" className="text-gray-400 hover:text-[var(--gold)] text-sm mb-6 inline-block">← Kembali ke Artikel</Link>
                    {article.category && <span className="badge mb-4 inline-block">{article.category}</span>}
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">{article.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{article.author_name}</span>
                        <span>•</span>
                        <span>{article.published_at ? new Date(article.published_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span>
                        <span>•</span>
                        <span>{article.views_count} tontonan</span>
                    </div>
                </div>
            </section>
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {article.excerpt && <p className="text-lg text-[var(--gray-500)] border-l-4 border-[var(--gold)] pl-6 mb-10 italic">{article.excerpt}</p>}
                    <div className="prose prose-lg max-w-none prose-headings:text-[var(--navy)] prose-a:text-[var(--gold)]" dangerouslySetInnerHTML={{ __html: article.content }} />
                    {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-[var(--gray-200)]">
                            <span className="text-sm font-medium text-[var(--gray-500)] mr-2">Tag:</span>
                            {article.tags.map((tag, i) => <span key={i} className="badge text-xs">{tag}</span>)}
                        </div>
                    )}
                </div>
            </section>
            {relatedArticles.length > 0 && (
                <section className="py-16 bg-[var(--gray-50)]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="section-title text-center mb-12">Artikel <span className="gold-accent">Berkaitan</span></h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedArticles.map(a => (
                                <Link key={a.id} href={`/artikel/${a.slug}`} className="card group">
                                    <div className="p-6">
                                        {a.category && <span className="badge text-xs mb-3 inline-block">{a.category}</span>}
                                        <h3 className="text-lg font-bold text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors line-clamp-2">{a.title}</h3>
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
