import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Products({ products = [], settings = {} }) {
    return (
        <PublicLayout title="Produk Digital" settings={settings}>
            <section className="pt-32 pb-20 bg-navy-gradient relative overflow-hidden">
                <div className="absolute inset-0 opacity-5"><div className="absolute top-20 left-40 w-80 h-80 rounded-full bg-[var(--gold)] blur-[100px]" /></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="badge mb-6">Produk Digital</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Produk <span className="text-[var(--gold)]">Kami</span></h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">Penyelesaian perisian siap guna yang direka untuk memenuhi pelbagai keperluan organisasi moden.</p>
                </div>
            </section>

            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map(product => (
                            <Link key={product.id} href={`/produk/${product.slug}`} className="card group">
                                <div className="p-8">
                                    <div className="w-16 h-16 rounded-2xl bg-[var(--gold)]/10 flex items-center justify-center text-3xl mb-6 group-hover:bg-[var(--gold)] group-hover:text-[var(--navy)] transition-all duration-300">💡</div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-xl font-bold text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors">{product.name}</h3>
                                        {product.is_featured && <span className="badge text-[10px]">⭐ Popular</span>}
                                    </div>
                                    {product.category && <span className="text-xs text-[var(--gray-400)] mb-3 block">{product.category}</span>}
                                    <p className="text-[var(--gray-500)] text-sm leading-relaxed mb-6">{product.description}</p>
                                    {product.features && (
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {(Array.isArray(product.features) ? product.features : []).slice(0, 4).map((f, i) => (
                                                <span key={i} className="text-xs bg-[var(--gray-100)] text-[var(--gray-600)] px-3 py-1 rounded-full">{f}</span>
                                            ))}
                                        </div>
                                    )}
                                    {product.price && <div className="text-[var(--gold)] font-bold text-lg">Bermula RM {product.price}</div>}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
