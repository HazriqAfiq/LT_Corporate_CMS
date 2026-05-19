import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function ProductDetail({ product, settings = {} }) {
    const features = Array.isArray(product.features) ? product.features : [];
    return (
        <PublicLayout 
            title={product.seo_title || product.name} 
            description={product.seo_description || product.description}
            keywords={Array.isArray(product.features) ? product.features.join(', ') : ''}
            settings={settings}
        >
            <section className="pt-32 pb-20 bg-navy-gradient relative overflow-hidden">
                <div className="absolute inset-0 opacity-5"><div className="absolute top-20 right-40 w-80 h-80 rounded-full bg-[var(--gold)] blur-[100px]" /></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href="/produk" className="text-gray-400 hover:text-[var(--gold)] text-sm mb-6 inline-block transition-colors">← Kembali ke Produk</Link>
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="badge mb-6">{product.category || 'Produk Digital'}</div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{product.name}</h1>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">{product.description}</p>
                            <div className="flex flex-wrap gap-4">
                                {product.demo_url && <a href={product.demo_url} target="_blank" className="btn-primary px-8 py-4">Lihat Demo →</a>}
                                <Link href="/hubungi-kami" className="btn-outline px-8 py-4">Minta Sebut Harga</Link>
                            </div>
                            {product.price && <div className="mt-8 text-[var(--gold)] font-bold text-2xl">Bermula RM {product.price}</div>}
                        </div>
                        <div className="hidden lg:block">
                            <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-[var(--gold)]/20 to-[var(--navy-mid)] p-8">
                                <div className="w-full h-full rounded-2xl bg-[var(--navy)] border border-[var(--gold)]/20 flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="text-7xl mb-4">💡</div>
                                        <div className="text-white text-2xl font-bold">{product.name}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {features.length > 0 && (
                <section className="py-24 bg-[var(--gray-50)]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="section-title text-center mb-12">Ciri-ciri <span className="gold-accent">Utama</span></h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((f, i) => (
                                <div key={i} className="card p-6 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)] font-bold flex-shrink-0">✓</div>
                                    <span className="text-[var(--navy)] font-medium">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {product.content && (
                <section className="py-24">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: product.content }} />
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
