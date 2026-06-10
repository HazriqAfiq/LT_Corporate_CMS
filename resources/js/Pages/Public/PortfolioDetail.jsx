import { Link } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from 'lucide-react';

export default function PortfolioDetail({ project, galleryMedia = [], settings = {} }) {
    const [lang, setLang] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('lang') || 'bm' : 'bm'));
    const [lightboxIndex, setLightboxIndex] = useState(null); // Tracks active image in lightbox

    // Slider States
    const [startIndex, setStartIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [visibleCount, setVisibleCount] = useState(3);

    // Touch Swipe States
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    useEffect(() => {
        setLang(localStorage.getItem('lang') || 'bm');
        const handleLangChange = () => setLang(localStorage.getItem('lang') || 'bm');
        window.addEventListener('languageChange', handleLangChange);
        return () => window.removeEventListener('languageChange', handleLangChange);
    }, []);

    // Track visible count based on screen sizes
    useEffect(() => {
        const updateVisibleCount = () => {
            if (window.innerWidth < 768) {
                setVisibleCount(1);  // Mobile
            } else if (window.innerWidth < 1024) {
                setVisibleCount(2);  // Tablet
            } else {
                setVisibleCount(3);  // Desktop
            }
        };
        updateVisibleCount();
        window.addEventListener('resize', updateVisibleCount);
        return () => window.removeEventListener('resize', updateVisibleCount);
    }, []);

    // Auto-slide loop effect
    useEffect(() => {
        if (galleryMedia.length <= visibleCount || isPaused) return;

        const interval = setInterval(() => {
            setStartIndex((prev) => {
                if (prev >= galleryMedia.length) {
                    setIsTransitioning(false);
                    setTimeout(() => {
                        setIsTransitioning(true);
                        setStartIndex(1);
                    }, 50);
                    return 0;
                } else {
                    setIsTransitioning(true);
                    return prev + 1;
                }
            });
        }, 2500); // Shift every 2.5 seconds

        return () => clearInterval(interval);
    }, [galleryMedia.length, visibleCount, isPaused]);

    // Force reflow and re-enable transition after seamless jump
    useEffect(() => {
        if (!isTransitioning) {
            const raf = requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsTransitioning(true);
                });
            });
            return () => cancelAnimationFrame(raf);
        }
    }, [isTransitioning]);

    // Handle wrap jumps seamlessly
    const handleTransitionEnd = () => {
        if (startIndex >= galleryMedia.length) {
            setIsTransitioning(false);
            setStartIndex(0);
        }
    };

    const nextSlide = () => {
        if (startIndex >= galleryMedia.length) {
            setIsTransitioning(false);
            setStartIndex(0);
            setTimeout(() => {
                setIsTransitioning(true);
                setStartIndex(1);
            }, 50);
        } else {
            setIsTransitioning(true);
            setStartIndex((prev) => prev + 1);
        }
    };

    const prevSlide = () => {
        if (startIndex === 0) {
            setIsTransitioning(false);
            setStartIndex(galleryMedia.length);
            setTimeout(() => {
                setIsTransitioning(true);
                setStartIndex(galleryMedia.length - 1);
            }, 50);
        } else {
            setIsTransitioning(true);
            setStartIndex((prev) => prev - 1);
        }
    };

    // Touch handlers
    const onTouchStart = (e) => {
        setIsPaused(true);
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }

        setTimeout(() => {
            setIsPaused(false);
        }, 3000);
    };

    // Extended gallery for circular loop
    const extendedGallery = useMemo(() => {
        if (galleryMedia.length <= visibleCount) return galleryMedia;
        return [...galleryMedia, ...galleryMedia.slice(0, visibleCount)];
    }, [galleryMedia, visibleCount]);

    // Toggle body classes to block scroll & hide BackToTop button
    useEffect(() => {
        if (lightboxIndex !== null) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('lightbox-open');
        } else {
            document.body.style.overflow = 'unset';
            document.body.classList.remove('lightbox-open');
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.classList.remove('lightbox-open');
        };
    }, [lightboxIndex]);

    const title = (lang === 'en' && project.title_en) ? project.title_en : project.title;
    const description = (lang === 'en' && project.description_en) ? project.description_en : project.description;
    const content = (lang === 'en' && project.content_en) ? project.content_en : project.content;
    const techs = Array.isArray(project.technologies) ? project.technologies : [];

    const backLabel = lang === 'en' ? '← Back to Portfolio' : '← Kembali ke Portfolio';
    const clientLabel = lang === 'en' ? 'Client:' : 'Klien:';

    const tr = {
        bm: {
            galleryTitle: 'Galeri Projek',
            galleryDesc: 'Lihat gambar-gambar visual dan tangkapan skrin dari projek ini.',
        },
        en: {
            galleryTitle: 'Project Gallery',
            galleryDesc: 'Explore visual previews and screenshots from this project.',
        }
    }[lang] || {
        galleryTitle: 'Galeri Projek',
        galleryDesc: 'Lihat gambar-gambar visual dan tangkapan skrin dari projek ini.',
    };

    const formatCompletedDate = (dateString, lang) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'ms-MY', {
            month: 'long',
            year: 'numeric'
        });
    };

    const handlePrevScreenshot = (e) => {
        e.stopPropagation();
        setLightboxIndex((prev) => (prev === 0 ? galleryMedia.length - 1 : prev - 1));
    };

    const handleNextScreenshot = (e) => {
        e.stopPropagation();
        setLightboxIndex((prev) => (prev === galleryMedia.length - 1 ? 0 : prev + 1));
    };

    return (
        <PublicLayout
            title={project.seo_title || title}
            description={project.seo_description || description}
            keywords={Array.isArray(project.technologies) ? project.technologies.join(', ') : ''}
            settings={settings}
            image={project.featured_media?.url}
        >
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

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" data-reveal="fade-up">
                    <Link href="/portfolio" className="text-gray-400 hover:text-[var(--gold)] text-sm mb-6 inline-block transition-colors">{backLabel}</Link>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="badge">{project.category || (lang === 'en' ? 'Project' : 'Projek')}</div>
                        {project.completed_at && (
                            <span className="text-sm text-zinc-500 font-semibold bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                                {lang === 'en' ? 'Completed: ' : 'Selesai: '}{formatCompletedDate(project.completed_at, lang)}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">{title}</h1>
                    <p className="text-gray-300 text-lg max-w-3xl leading-relaxed">{description}</p>
                    <div className="flex flex-wrap gap-3 mt-6">
                        {techs.map((t, i) => (
                            <span key={i} className="text-xs bg-white/5 text-gray-300 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">{t}</span>
                        ))}
                    </div>
                    {project.client && <p className="mt-6 text-[var(--gold)] font-medium">{clientLabel} {project.client}</p>}
                </div>
            </section>

            {/* Content */}
            {content && (
                <section className="py-24 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                    <div className="max-w-7xl mx-auto px-4 relative z-10" data-reveal="fade-up" data-reveal-delay="200">
                        <div className="prose prose-lg max-w-none prose-invert prose-headings:text-white prose-a:text-[var(--gold)]" dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                </section>
            )}

            {/* Project Image Gallery */}
            {galleryMedia.length > 0 && (
                <section className="py-24 bg-[#080808] border-b border-white/5 relative z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group/gallery">
                        {/* Gallery Header */}
                        <div className="text-center mb-12" data-reveal="fade-up">
                            <h2 className="text-3xl font-bold text-white mb-4">{tr.galleryTitle}</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">{tr.galleryDesc}</p>
                        </div>

                        {galleryMedia.length === 1 ? (
                            /* Case 4: Exactly 1 Image (Large centered, visually balanced) */
                            <div className="max-w-3xl mx-auto px-4">
                                <div 
                                    onClick={() => setLightboxIndex(0)}
                                    className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/5 bg-[#0c0c0e] hover:border-[var(--gold)]/20 cursor-pointer group transition-all duration-300 shadow-2xl"
                                >
                                    <img 
                                        src={galleryMedia[0].url} 
                                        alt={galleryMedia[0].caption || galleryMedia[0].alt_text || galleryMedia[0].filename}
                                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="p-3.5 rounded-full bg-[var(--gold)] text-[#040914] scale-90 group-hover:scale-100 transition-transform duration-300">
                                            <ImageIcon className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : galleryMedia.length === 2 ? (
                            /* Case 3: Exactly 2 Images (Two larger responsive columns) */
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
                                {galleryMedia.map((mediaItem, idx) => (
                                    <div 
                                        key={mediaItem.id || idx}
                                        onClick={() => setLightboxIndex(idx)}
                                        className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/5 bg-[#0c0c0e] hover:border-[var(--gold)]/20 cursor-pointer group transition-all duration-300 shadow-xl"
                                    >
                                        <img 
                                            src={mediaItem.url} 
                                            alt={mediaItem.caption || mediaItem.alt_text || mediaItem.filename}
                                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="p-3 rounded-full bg-[var(--gold)] text-[#040914] scale-90 group-hover:scale-100 transition-transform duration-300">
                                                <ImageIcon className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Case 1 & 2: 3 or More Images (Carousel or standard grid) */
                            <div className="relative overflow-hidden px-2 py-4">
                                <div 
                                    className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
                                    style={{
                                        transform: `translateX(-${startIndex * (100 / extendedGallery.length)}%)`,
                                        width: `${(extendedGallery.length / visibleCount) * 100}%`
                                    }}
                                    onTransitionEnd={handleTransitionEnd}
                                    onMouseEnter={() => setIsPaused(true)}
                                    onMouseLeave={() => setIsPaused(false)}
                                    onTouchStart={onTouchStart}
                                    onTouchMove={onTouchMove}
                                    onTouchEnd={onTouchEnd}
                                >
                                    {extendedGallery.map((mediaItem, idx) => (
                                        <div 
                                            key={`${mediaItem.id || idx}-${idx}`}
                                            style={{ width: `${100 / extendedGallery.length}%` }}
                                            className="px-2 shrink-0"
                                        >
                                            <div 
                                                onClick={() => setLightboxIndex(idx % galleryMedia.length)}
                                                className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/5 bg-[#0c0c0e] hover:border-[var(--gold)]/20 cursor-pointer group transition-all duration-300"
                                            >
                                                <img 
                                                    src={mediaItem.url} 
                                                    alt={mediaItem.caption || mediaItem.alt_text || mediaItem.filename}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <div className="p-3 rounded-full bg-[var(--gold)] text-[#040914] scale-90 group-hover:scale-100 transition-transform duration-300">
                                                        <ImageIcon className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Navigation Controls (Only if count > visibleCount) */}
                                {galleryMedia.length > visibleCount && (
                                    <>
                                        <button 
                                            onClick={prevSlide}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-white/10 hover:bg-black/80 hover:border-[var(--gold)]/50 text-white transition-all duration-200 opacity-0 group-hover/gallery:opacity-100 focus:opacity-100 z-20 shadow-xl"
                                            aria-label="Previous Slide"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-[var(--gold)]" />
                                        </button>
                                        <button 
                                            onClick={nextSlide}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-white/10 hover:bg-black/80 hover:border-[var(--gold)]/50 text-white transition-all duration-200 opacity-0 group-hover/gallery:opacity-100 focus:opacity-100 z-20 shadow-xl"
                                            aria-label="Next Slide"
                                        >
                                            <ChevronRight className="w-5 h-5 text-[var(--gold)]" />
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Testimonial */}
            {project.testimonial && (
                <section className="py-20 relative bg-[#080808] border-b border-white/5 z-10 overflow-hidden">
                    <div className="max-w-3xl mx-auto px-4 text-center relative z-10" data-reveal="scale-in">
                        <div className="text-5xl text-[var(--gold)]/20 mb-6 font-serif">"</div>
                        <p className="text-xl md:text-2xl italic text-gray-200 mb-6 leading-relaxed">"{project.testimonial}"</p>
                        {project.testimonial_author && <p className="text-[var(--gold)] font-semibold tracking-wider">— {project.testimonial_author}</p>}
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
                                alt={galleryMedia[lightboxIndex].caption || galleryMedia[lightboxIndex].alt_text || 'Screenshot View'} 
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
                            {galleryMedia[lightboxIndex].original_filename || galleryMedia[lightboxIndex].filename} {galleryMedia[lightboxIndex].human_size ? `(${galleryMedia[lightboxIndex].human_size})` : ''}
                        </p>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
