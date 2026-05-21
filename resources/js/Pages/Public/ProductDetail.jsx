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

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href="/produk" className="text-gray-400 hover:text-[var(--gold)] text-sm mb-6 inline-block transition-colors">← Kembali ke Produk</Link>
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="badge mb-6">{product.category || 'Produk Digital'}</div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                {product.name}
                            </h1>
                            <p className="text-gray-300 text-lg leading-relaxed mb-8">{product.description}</p>
                            <div className="flex flex-wrap gap-4">
                                {product.demo_url && <a href={product.demo_url} target="_blank" className="btn-primary px-8 py-4">Lihat Demo →</a>}
                                <Link href="/hubungi-kami" className="btn-outline px-8 py-4">Minta Sebut Harga</Link>
                            </div>
                            {product.price && <div className="mt-8 text-[var(--gold)] font-bold text-2xl">Bermula RM {product.price}</div>}
                        </div>
                        <div className="hidden lg:block relative z-20">
                            {/* Glassmorphic border box matching premium digital look */}
                            <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-[var(--gold)]/20 to-white/5 p-8 backdrop-blur-md border border-white/10 shadow-2xl">
                                <div className="w-full h-full rounded-2xl bg-[#0c0c0e]/80 border border-[var(--gold)]/20 flex items-center justify-center">
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

            {/* Features (Charcoal section with centered glow & gold divider lines) */}
            {features.length > 0 && (
                <section className="py-24 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                    {/* Soft top-centered amber radial glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                    
                    {/* Gold Accent Divider Lines */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <h2 className="section-title text-center mb-12">Ciri-ciri <span className="gold-accent">Utama</span></h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((f, i) => (
                                <div key={i} className="card p-6 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)] font-bold flex-shrink-0">✓</div>
                                    <span className="text-white font-medium">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Content Section (Deep Charcoal) */}
            {product.content && (
                <section className="py-24 bg-[#080808] border-b border-white/5 relative z-10">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="prose prose-lg max-w-none prose-invert prose-headings:text-white prose-a:text-[var(--gold)]" dangerouslySetInnerHTML={{ __html: product.content }} />
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
