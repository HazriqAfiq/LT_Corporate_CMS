import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { ChevronLeft, ChevronRight, X, Image as ImageIcon, CheckCircle, ArrowRight } from 'lucide-react';

export default function ProductDetail({ product, galleryMedia = [], settings = {} }) {
    const [lang, setLang] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('lang') || 'bm' : 'bm'));
    const [lightboxIndex, setLightboxIndex] = useState(null); // Tracks active screenshot in lightbox

    useEffect(() => {
        setLang(localStorage.getItem('lang') || 'bm');
        const handleLangChange = () => setLang(localStorage.getItem('lang') || 'bm');
        window.addEventListener('languageChange', handleLangChange);
        return () => window.removeEventListener('languageChange', handleLangChange);
    }, []);

    // Block page scroll when Lightbox is active
    useEffect(() => {
        if (lightboxIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [lightboxIndex]);

    const name = (lang === 'en' && product.name_en) ? product.name_en : product.name;
    const description = (lang === 'en' && product.description_en) ? product.description_en : product.description;
    const features = Array.isArray((lang === 'en' && product.features_en) ? product.features_en : product.features)
        ? ((lang === 'en' && product.features_en) ? product.features_en : product.features)
        : [];
    const content = (lang === 'en' && product.content_en) ? product.content_en : product.content;

    // Translation keys
    const tr = {
        bm: {
            back: '← Kembali ke Produk',
            demo: 'Lihat Demo',
            quote: 'Minta Sebut Harga',
            features: 'Ciri-ciri Utama',
            startingFrom: 'Bermula RM',
            galleryTitle: 'Tangkapan Skrin & Pratinjau',
            galleryDesc: 'Lihat antaramuka dan ciri-ciri visual produk digital kami.',
            noGallery: 'Tiada pratinjau tambahan buat masa ini.',
            badgeDefault: 'Produk Digital',
            quoteUrl: '/hubungi-kami',
            featuresSub: 'Seni reka bertaraf tinggi dengan ciri-ciri keselamatan industri.',
        },
        en: {
            back: '← Back to Products',
            demo: 'View Live Demo',
            quote: 'Request a Quote',
            features: 'Key Features',
            startingFrom: 'Starting from RM',
            galleryTitle: 'Screenshots & Preview',
            galleryDesc: 'Explore the visual interface and capabilities of our digital product.',
            noGallery: 'No additional previews available at the moment.',
            badgeDefault: 'Digital Product',
            quoteUrl: '/en/contact',
            featuresSub: 'State-of-the-art craftsmanship with enterprise-grade security.',
        }
    }[lang] || {
        back: '← Kembali ke Produk',
        demo: 'Lihat Demo',
        quote: 'Minta Sebut Harga',
        features: 'Ciri-ciri Utama',
        startingFrom: 'Bermula RM',
        galleryTitle: 'Tangkapan Skrin & Pratinjau',
        galleryDesc: 'Lihat antaramuka dan ciri-ciri visual produk digital kami.',
        noGallery: 'Tiada pratinjau tambahan buat masa ini.',
        badgeDefault: 'Produk Digital',
        quoteUrl: '/hubungi-kami',
        featuresSub: 'Seni reka bertaraf tinggi dengan ciri-ciri keselamatan industri.',
    };

    const handlePrevScreenshot = (e) => {
        e.stopPropagation();
        setLightboxIndex((prev) => (prev === 0 ? galleryMedia.length - 1 : prev - 1));
    };

    const handleNextScreenshot = (e) => {
        e.stopPropagation();
        setLightboxIndex((prev) => (prev === galleryMedia.length - 1 ? 0 : prev + 1));
    };

    const bannerUrl = product.featured_media?.url;

    return (
        <PublicLayout
            title={product.seo_title || name}
            description={product.seo_description || description}
            keywords={Array.isArray(product.features) ? product.features.join(', ') : ''}
            settings={settings}
        >
            {/* Premium Hero Banner */}
            <section className="relative pt-44 pb-28 overflow-hidden bg-[#080808] border-b border-white/5 z-10">
                {/* Visual Ambient Backdrops */}
                <div className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none z-0 opacity-45" style={{ backgroundImage: "url('/storage/digital_kl_bg.png')" }} />
                <div className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none z-0 opacity-30" style={{ backgroundImage: bannerUrl ? `url('${bannerUrl}')` : "url('/storage/hero_laptop_city.png')", filter: 'blur(100px) brightness(0.55)' }} />
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)]/5 via-transparent to-amber-500/10 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-[#080808] via-[#080808]/95 to-transparent z-0 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-full lg:w-2/5 bg-gradient-to-l from-[#080808] via-[#080808]/60 to-[#080808]/40 z-0 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />
                
                {/* Floating Glows */}
                <div className="absolute top-10 right-20 w-96 h-96 rounded-full bg-[var(--gold)]/10 blur-[120px] pointer-events-none z-0 animate-pulse-glow" />
                <div className="absolute bottom-10 left-20 w-80 h-80 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none z-0" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href="/produk" className="text-zinc-500 hover:text-[var(--gold)] text-sm mb-8 inline-flex items-center transition-colors duration-300">
                        <ChevronLeft className="w-4 h-4 mr-1.5" />
                        {tr.back}
                    </Link>
                    
                    <div className="grid lg:grid-cols-12 gap-16 items-center">
                        {/* Left column info */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="flex items-center gap-4">
                                {/* Floating brand icon */}
                                <div className="w-16 h-16 rounded-2xl bg-[#0c0c0e]/90 border border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden p-2.5 shrink-0 hover:border-[var(--gold)]/30 transition-colors duration-300">
                                    {product.icon ? (
                                        <img src={`/storage/${product.icon}`} alt="Icon" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[var(--gold)]/20 to-white/5 flex items-center justify-center text-[var(--gold)] font-bold text-xl rounded-xl">
                                            {name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <div className="badge !px-3 !py-1 !rounded-full !text-[10px] tracking-wider uppercase font-bold">{product.category || tr.badgeDefault}</div>
                                    {product.is_featured && <span className="ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-[var(--gold)]">POPULAR</span>}
                                </div>
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                                {name}
                            </h1>
                            
                            <p className="text-zinc-300 text-lg leading-relaxed max-w-xl">
                                {description}
                            </p>
                            
                            <div className="flex flex-wrap gap-4 pt-2">
                                {product.demo_url && (
                                    <a 
                                        href={product.demo_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn-primary px-8 py-4 text-sm font-bold flex items-center gap-2 group/btn"
                                    >
                                        {tr.demo}
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                    </a>
                                )}
                                <Link 
                                    href={tr.quoteUrl} 
                                    className="btn-outline px-8 py-4 text-sm font-bold hover:shadow-[0_0_15px_rgba(234,179,8,0.1)] transition-all duration-300"
                                >
                                    {tr.quote}
                                </Link>
                            </div>
                            
                            {product.price && (
                                <div className="pt-4 flex items-center gap-2">
                                    <span className="text-sm text-zinc-500 font-medium">{tr.startingFrom}</span>
                                    <span className="text-[var(--gold)] font-extrabold text-3xl tracking-tight">{product.price}</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Right column premium mockup showcase */}
                        <div className="lg:col-span-5 relative z-20">
                            <div className="w-full aspect-[4/3] sm:aspect-square rounded-[32px] bg-gradient-to-br from-[var(--gold)]/15 to-white/5 p-4 sm:p-6 backdrop-blur-md border border-white/5 shadow-2xl relative group overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                
                                <div className="w-full h-full rounded-[24px] bg-[#0c0c0e]/95 border border-white/10 flex items-center justify-center overflow-hidden relative shadow-inner">
                                    {bannerUrl ? (
                                        <img 
                                            src={bannerUrl} 
                                            alt={name} 
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                                        />
                                    ) : (
                                        <div className="text-center p-8 relative z-10 flex flex-col items-center">
                                            <div className="w-20 h-20 rounded-3xl bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)] text-4xl mb-6 shadow-lg border border-[var(--gold)]/20">
                                                💡
                                            </div>
                                            <div className="text-white text-xl font-bold tracking-wide">{name}</div>
                                            <div className="text-zinc-500 text-xs mt-2 font-medium">Laman Teknologi Corporate CMS</div>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium Features List */}
            {features.length > 0 && (
                <section className="py-28 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                    {/* Glowing Ambience */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-[var(--gold)]/5 blur-[120px] pointer-events-none z-0" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/20 to-transparent" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/20 to-transparent" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                            <h2 className="section-title !mb-0">{lang === 'en' ? '' : 'Ciri-ciri '}<span className="gold-accent">{tr.features}</span></h2>
                            <p className="section-subtitle">{tr.featuresSub}</p>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((f, i) => (
                                <div key={i} className="card p-6 flex items-start gap-4 hover:border-[var(--gold)]/20 transition-all duration-300 group">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gold)]/20 to-[var(--gold)]/5 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] font-bold flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-white font-bold text-base leading-snug block">{f}</span>
                                        <span className="text-xs text-zinc-500 leading-normal block">Mengoptimumkan aliran kerja harian anda secara automatik.</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Premium Screenshot Gallery Section */}
            {galleryMedia.length > 0 && (
                <section className="py-28 bg-[#080808] border-b border-white/5 relative z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                            <h2 className="section-title !mb-0">{tr.galleryTitle}</h2>
                            <p className="section-subtitle">{tr.galleryDesc}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                            {galleryMedia.map((mediaItem, idx) => (
                                <div 
                                    key={mediaItem.id || idx}
                                    onClick={() => setLightboxIndex(idx)}
                                    className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/5 bg-[#0c0c0e] hover:border-[var(--gold)]/40 hover:shadow-[0_8px_30px_rgba(234,179,8,0.08)] cursor-pointer group transition-all duration-500"
                                >
                                    <img 
                                        src={mediaItem.url} 
                                        alt={mediaItem.caption || `Screenshot ${idx + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                                    />
                                    {/* Overlay Hover */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="p-3.5 rounded-full bg-[var(--gold)] text-[#040914] scale-90 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                                            <ImageIcon className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Main Content Editorial Section */}
            {content && (
                <section className="py-28 bg-[#0c0c0e]/30 border-b border-white/5 relative z-10">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="prose prose-lg max-w-none prose-invert prose-headings:text-white prose-a:text-[var(--gold)] prose-strong:text-white prose-p:text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                </section>
            )}

            {/* full-screen Screenshot Lightbox Modal Overlay */}
            {lightboxIndex !== null && (
                <div 
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-fade-in"
                    onClick={() => setLightboxIndex(null)}
                >
                    {/* Lightbox Header */}
                    <div className="w-full max-w-7xl flex justify-between items-center z-10 py-2">
                        <span className="text-zinc-400 font-semibold text-sm">
                            {lightboxIndex + 1} / {galleryMedia.length}
                        </span>
                        <button 
                            onClick={() => setLightboxIndex(null)} 
                            className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all duration-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Main Image Slider View */}
                    <div className="w-full max-w-5xl flex-1 flex items-center justify-between relative px-4 sm:px-12 my-4">
                        {/* Prev Button */}
                        <button 
                            onClick={handlePrevScreenshot}
                            className="absolute left-0 sm:left-4 p-3 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 text-white transition-all duration-200 z-10"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div 
                            className="w-full h-full flex items-center justify-center p-2 z-0"
                            onClick={(e) => e.stopPropagation()} // Prevent close on clicking image
                        >
                            <img 
                                src={galleryMedia[lightboxIndex].url} 
                                alt={galleryMedia[lightboxIndex].caption || 'Screenshot View'} 
                                className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] animate-scale-up"
                            />
                        </div>

                        {/* Next Button */}
                        <button 
                            onClick={handleNextScreenshot}
                            className="absolute right-0 sm:right-4 p-3 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 text-white transition-all duration-200 z-10"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Lightbox Caption Footer */}
                    <div className="w-full max-w-3xl text-center py-4 z-10">
                        {galleryMedia[lightboxIndex].caption && (
                            <p className="text-white font-bold text-base leading-snug">{galleryMedia[lightboxIndex].caption}</p>
                        )}
                        <p className="text-zinc-500 text-xs mt-1.5 leading-relaxed tracking-wide">
                            {galleryMedia[lightboxIndex].original_filename} ({galleryMedia[lightboxIndex].human_size})
                        </p>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
