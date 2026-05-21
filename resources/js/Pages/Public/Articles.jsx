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

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="badge mb-6">Artikel & Berita</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Artikel <span className="text-[var(--gold)]">Terkini</span>
                    </h1>
                </div>
            </section>

            {/* Articles Grid (Charcoal section with centered glow & gold divider lines) */}
            <section className="py-28 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                {/* Soft top-centered amber radial glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                
                {/* Gold Accent Divider Lines */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-3 mb-12 justify-center">
                        {categories.map(cat => (
                            <Link key={cat.value} href={cat.value ? `/artikel?category=${cat.value}` : '/artikel'}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${currentCategory === cat.value || (!currentCategory && !cat.value)
                                    ? 'bg-[var(--gold)] text-white' : 'bg-white/5 border border-white/10 text-[var(--gray-600)] hover:bg-[var(--gray-200)]'}`}>
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
                                            <div className="aspect-video bg-white/5 border border-white/10 overflow-hidden">
                                                <img src={`/storage/${article.featured_image}`} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                            </div>
                                        ) : (
                                            <div className="aspect-video bg-white/5 border border-white/10 flex items-center justify-center relative z-10"><span className="text-3xl">📰</span></div>
                                        )}
                                        <div className="p-6">
                                            {article.category && <span className="badge text-xs mb-3 inline-block">{article.category}</span>}
                                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--gold)] transition-colors line-clamp-2">{article.title}</h3>
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
                                        className={`px-4 py-2 rounded-lg text-sm ${link.active ? 'bg-[var(--gold)] text-white font-bold' : 'bg-white/5 border border-white/10 text-[var(--gray-600)] hover:bg-[var(--gray-200)]'} ${!link.url ? 'opacity-50 pointer-events-none' : ''}`} />
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
