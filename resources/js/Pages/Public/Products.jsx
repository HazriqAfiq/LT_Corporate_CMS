import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';

const t = {
    bm: {
        heroBadge: 'Produk Digital',
        heroTitle: 'Produk',
        heroTitleGold: 'Kami',
        heroDesc: 'Penyelesaian perisian siap guna yang direka untuk memenuhi pelbagai keperluan organisasi moden.',
        popular: '⭐ Popular',
        startingFrom: 'Bermula RM',
        noProducts: 'Produk akan dikemaskini tidak lama lagi.',
    },
    en: {
        heroBadge: 'Digital Products',
        heroTitle: 'Our',
        heroTitleGold: 'Products',
        heroDesc: 'Ready-to-use software solutions designed to meet the diverse needs of modern organizations.',
        popular: '⭐ Popular',
        startingFrom: 'Starting from RM',
        noProducts: 'Products will be updated soon.',
    },
};

export default function Products({ products = [], settings = {} }) {
    const [lang, setLang] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('lang') || 'bm' : 'bm'));

    useEffect(() => {
        setLang(localStorage.getItem('lang') || 'bm');
        const handleLangChange = () => setLang(localStorage.getItem('lang') || 'bm');
        window.addEventListener('languageChange', handleLangChange);
        return () => window.removeEventListener('languageChange', handleLangChange);
    }, []);

    const tr = t[lang] || t.bm;

    return (
        <PublicLayout title={lang === 'en' ? 'Digital Products' : 'Produk Digital'} settings={settings}>
            {/* Hero Banner */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-[#080808] border-b border-white/5 z-10">
                <div className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none z-0 opacity-45" style={{ backgroundImage: "url('/storage/digital_kl_bg.png')" }} />
                <div className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none z-0 opacity-40" style={{ backgroundImage: "url('/storage/hero_laptop_city.png')", filter: 'blur(110px) brightness(0.65)' }} />
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)]/5 via-transparent to-amber-500/10 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-full lg:w-2/3 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-[#080808]/40 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-full lg:w-1/3 bg-gradient-to-l from-[#080808] via-[#080808]/60 to-[#080808]/40 z-0 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />
                <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-[var(--gold)]/10 blur-[100px] pointer-events-none z-0" />
                <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-[var(--gold)]/5 blur-[90px] pointer-events-none z-0" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
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
                            {products.map(product => {
                                const name = (lang === 'en' && product.name_en) ? product.name_en : product.name;
                                const description = (lang === 'en' && product.description_en) ? product.description_en : product.description;
                                const features = (lang === 'en' && product.features_en) ? product.features_en : product.features;
                                const bannerUrl = product.featured_media?.url;

                                return (
                                    <Link key={product.id} href={`/produk/${product.slug}`} className="card group flex flex-col justify-between h-full !rounded-[24px] border border-white/5 hover:border-[var(--gold)]/30 hover:shadow-[0_12px_40px_rgba(234,179,8,0.06)] overflow-hidden transition-all duration-500">
                                        <div className="flex flex-col">
                                            {/* Card Top Banner / Backdrop */}
                                            <div className="h-44 w-full overflow-hidden relative border-b border-white/5 bg-[#08080a]">
                                                {bannerUrl ? (
                                                    <img 
                                                        src={bannerUrl} 
                                                        alt={name} 
                                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-[linear-gradient(to_right,#141416_1px,transparent_1px),linear-gradient(to_bottom,#141416_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                                                
                                                {/* Floating custom icon */}
                                                <div className="absolute -bottom-6 left-6 w-14 h-14 rounded-2xl bg-[#0c0c0e] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden p-2 z-10 transition-transform duration-500 group-hover:scale-105 group-hover:border-[var(--gold)]/40">
                                                    {product.icon ? (
                                                        <img src={`/storage/${product.icon}`} alt="Icon" className="w-full h-full object-contain" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-[var(--gold)]/20 to-white/5 flex items-center justify-center text-white font-bold text-lg rounded-xl">
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
                                                <span className="text-xs text-zinc-600 font-medium italic">Sebut Harga</span>
                                            )}
                                            <span className="text-xs font-semibold text-zinc-400 group-hover:text-[var(--gold)] group-hover:translate-x-1 transition-all duration-300">
                                                Info Lanjut →
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
