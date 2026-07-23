import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import useLanguage from '@/Hooks/useLanguage';

const t = {
    bm: {
        heroBadge: 'Produk Digital',
        heroTitle: 'Produk',
        heroTitleGold: 'Kami',
        heroDesc: 'Penyelesaian perisian siap guna yang direka untuk memenuhi pelbagai keperluan organisasi moden.',
        popular: '⭐ Popular',
        startingFrom: 'Bermula RM',
        noProducts: 'Produk akan dikemaskini tidak lama lagi.',
        quote: 'Sebut Harga',
        moreInfo: 'Info Lanjut →',
    },
    en: {
        heroBadge: 'Digital Products',
        heroTitle: 'Our',
        heroTitleGold: 'Products',
        heroDesc: 'Ready-to-use software solutions designed to meet the diverse needs of modern organizations.',
        popular: '⭐ Popular',
        startingFrom: 'Starting from RM',
        noProducts: 'Products will be updated soon.',
        quote: 'Get Quote',
        moreInfo: 'Learn More →',
    },
};

export default function Products({ products = [], settings = {} }) {
    const { lang } = useLanguage();
    const homepageBg = settings.homepage_background || '/storage/uploads/homepage_bg.webp';

    const tr = t[lang] || t.bm;

    return (
        <PublicLayout title={lang === 'en' ? 'Digital Products' : 'Produk Digital'} settings={settings}>
            {/* Hero Banner */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-[#080808] border-b border-white/5 z-10" style={{ clipPath: 'inset(0)' }}>
                <img 
                    src={homepageBg} 
                    alt="Background" 
                    fetchpriority="high"
                    loading="eager"
                    className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-30 md:opacity-20" 
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center" data-reveal="fade-up">
                    <div className="badge mb-6">{tr.heroBadge}</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {tr.heroTitle} <span className="text-[var(--gold)]">{tr.heroTitleGold}</span>
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">{tr.heroDesc}</p>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-28 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {products.length > 0 ? (
                        <div className={`grid gap-8 justify-center ${
                            products.length === 1 
                                ? 'grid-cols-1 max-w-md mx-auto' 
                                : products.length === 2 
                                    ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' 
                                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                        }`}>
                            {products.map((product, idx) => {
                                const name = (lang === 'en' && product.name_en) ? product.name_en : product.name;
                                const description = (lang === 'en' && product.description_en) ? product.description_en : product.description;
                                const features = (lang === 'en' && product.features_en) ? product.features_en : product.features;
                                const bannerUrl = product.featured_media?.url;

                                return (
                                    <Link key={product.id} href={`/produk/${product.slug}`} className="card group flex flex-col justify-between h-full !rounded-xl border border-white/5 hover:border-[var(--gold)]/30 overflow-hidden transition-all duration-500" data-reveal="fade-up" data-reveal-delay={idx * 100}>
                                        <div className="flex flex-col">
                                            {/* Card Top Banner / Backdrop */}
                                            <div className="h-44 w-full overflow-hidden relative border-b border-white/5 bg-[#08080a]">
                                                {bannerUrl ? (
                                                    <img 
                                                        src={bannerUrl} 
                                                        alt={name} 
                                                        loading="lazy"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-[linear-gradient(to_right,#141416_1px,transparent_1px),linear-gradient(to_bottom,#141416_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                                            </div>

                                             <div className="relative h-0">
                                                 <div className="absolute -top-6 left-6 w-12 h-12 rounded-md bg-[#0c0c0e] border border-white/10 shadow-lg flex items-center justify-center overflow-hidden z-10">
                                                     {product.icon ? (
                                                         <img src={`/storage/${product.icon}`} alt="Icon" className="w-full h-full object-cover" />
                                                     ) : (
                                                         <div className="w-full h-full p-2 bg-gradient-to-br from-[var(--gold)]/20 to-white/5 flex items-center justify-center text-white font-bold text-base rounded-md">
                                                             {name.charAt(0)}
                                                         </div>
                                                     )}
                                                 </div>
                                             </div>

                                            {/* Card Body */}
                                            <div className="pt-10 px-8 pb-6">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <h3 className="text-xl font-bold text-white group-hover:text-[var(--gold)] transition-colors duration-300">{name}</h3>
                                                    {product.is_featured && <span className="badge text-[9px] uppercase tracking-wider py-1 font-bold">{tr.popular}</span>}
                                                </div>
                                                
                                                {product.category && (
                                                    <span className="text-xs text-zinc-500 font-medium mb-4 block tracking-wide uppercase">
                                                        {product.category}
                                                    </span>
                                                )}
                                                
                                                <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                                    {description}
                                                </p>
                                                
                                                {/* Features list using checks instead of pill-shaped boxes */}
                                                {features && Array.isArray(features) && features.length > 0 && (
                                                    <div className="space-y-2 mb-6">
                                                        {features.slice(0, 3).map((f, i) => (
                                                            <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-400">
                                                                <span className="text-[var(--gold)] font-bold flex-shrink-0">✓</span>
                                                                <span className="truncate">{f}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Card Footer */}
                                        <div className="px-8 pb-8 pt-2 border-t border-white/5 flex justify-between items-center bg-[#08080a]/30">
                                            {product.price ? (
                                                <div className="text-[var(--gold)] font-bold text-base">
                                                    <span className="text-xs text-zinc-500 font-normal mr-1">{tr.startingFrom}</span>
                                                    {product.price}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-zinc-600 font-medium italic">{tr.quote}</span>
                                            )}
                                            <span className="text-xs font-semibold text-zinc-400 group-hover:text-[var(--gold)] group-hover:translate-x-1 transition-all duration-300">
                                                {tr.moreInfo}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center py-20 text-[var(--gray-400)]">{tr.noProducts}</p>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
