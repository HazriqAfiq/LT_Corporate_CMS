import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Articles({ articles, currentCategory, settings = {} }) {
    const categories = [
        { value: '', label: 'Semua' },
        { value: 'berita', label: 'Berita' },
        { value: 'teknologi', label: 'Teknologi' },
        { value: 'tips', label: 'Tips & Tutorial' },
        { value: 'pengumuman', label: 'Pengumuman' },
        { value: 'kajian-kes', label: 'Kajian Kes' },
    ];
    const items = articles?.data || [];
    const links = articles?.links || [];

    return (
        <PublicLayout title="Artikel" settings={settings}>
            <section className="pt-32 pb-20 bg-navy-gradient">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="badge mb-6">Artikel & Berita</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Artikel <span className="text-[var(--gold)]">Terkini</span></h1>
                </div>
            </section>
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-3 mb-12 justify-center">
                        {categories.map(cat => (
                            <Link key={cat.value} href={cat.value ? `/artikel?category=${cat.value}` : '/artikel'}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${currentCategory === cat.value || (!currentCategory && !cat.value)
                                    ? 'bg-[var(--gold)] text-[var(--navy)]' : 'bg-[var(--gray-100)] text-[var(--gray-600)] hover:bg-[var(--gray-200)]'}`}>
                                {cat.label}
                            </Link>
                        ))}
                    </div>
                    {items.length > 0 ? (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {items.map(article => (
                                    <Link key={article.id} href={`/artikel/${article.slug}`} className="card group">
                                        {article.featured_image ? (
                                            <div className="aspect-video bg-[var(--gray-100)] overflow-hidden">
                                                <img src={`/storage/${article.featured_image}`} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                            </div>
                                        ) : (
                                            <div className="aspect-video bg-[var(--gray-100)] flex items-center justify-center bg-navy-gradient"><span className="text-3xl">📰</span></div>
                                        )}
                                        <div className="p-6">
                                            {article.category && <span className="badge text-xs mb-3 inline-block">{article.category}</span>}
                                            <h3 className="text-lg font-bold text-[var(--navy)] mb-2 group-hover:text-[var(--gold)] transition-colors line-clamp-2">{article.title}</h3>
                                            <p className="text-[var(--gray-500)] text-sm line-clamp-2 mb-4">{article.excerpt}</p>
                                            <div className="flex items-center justify-between text-xs text-[var(--gray-400)]">
                                                <span>{article.author_name}</span>
                                                <span>{article.published_at ? new Date(article.published_at).toLocaleDateString('ms-MY') : ''}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            {/* Pagination */}
                            <div className="flex justify-center gap-2 mt-12">
                                {links.map((link, i) => (
                                    <Link key={i} href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-4 py-2 rounded-lg text-sm ${link.active ? 'bg-[var(--gold)] text-[var(--navy)] font-bold' : 'bg-[var(--gray-100)] text-[var(--gray-600)] hover:bg-[var(--gray-200)]'} ${!link.url ? 'opacity-50 pointer-events-none' : ''}`} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-center py-20 text-[var(--gray-400)]">Tiada artikel buat masa ini.</p>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
