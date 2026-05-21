import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Products({ products = [], settings = {} }) {
    return (
        <PublicLayout title="Produk Digital" settings={settings}>
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
                    <div className="badge mb-6">Produk Digital</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Produk <span className="text-[var(--gold)]">Kami</span>
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
                        Penyelesaian perisian siap guna yang direka untuk memenuhi pelbagai keperluan organisasi moden.
                    </p>
                </div>
            </section>

            {/* Products Grid (Charcoal section with centered glow & gold divider lines) */}
            <section className="py-28 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                {/* Soft top-centered amber radial glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                
                {/* Gold Accent Divider Lines */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map(product => (
                            <Link key={product.id} href={`/produk/${product.slug}`} className="card group">
                                <div className="p-8">
                                    <div className="w-16 h-16 rounded-2xl bg-[var(--gold)]/10 flex items-center justify-center text-3xl mb-6 group-hover:bg-[var(--gold)] group-hover:text-[#080808] transition-all duration-300">
                                        💡
                                    </div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-xl font-bold text-white group-hover:text-[var(--gold)] transition-colors">{product.name}</h3>
                                        {product.is_featured && <span className="badge text-[10px]">⭐ Popular</span>}
                                    </div>
                                    {product.category && <span className="text-xs text-[var(--gray-400)] mb-3 block">{product.category}</span>}
                                    <p className="text-[var(--gray-500)] text-sm leading-relaxed mb-6">{product.description}</p>
                                    {product.features && (
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {(Array.isArray(product.features) ? product.features : []).slice(0, 4).map((f, i) => (
                                                <span key={i} className="text-xs bg-white/5 border border-white/10 text-[var(--gray-600)] px-3 py-1 rounded-full">{f}</span>
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
