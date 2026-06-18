import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from 'lucide-react';

export default function ScreenshotGallery({ galleryMedia = [], lang = 'bm' }) {
    const [lightboxIndex, setLightboxIndex] = useState(null); // Tracks active image in lightbox

    // Slider States
    const [startIndex, setStartIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [visibleCount, setVisibleCount] = useState(3);

    // Touch Swipe States
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

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

    const nextSlide = (e) => {
        if (e) e.stopPropagation();
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

    const prevSlide = (e) => {
        if (e) e.stopPropagation();
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

    const handlePrevScreenshot = (e) => {
        e.stopPropagation();
        setLightboxIndex((prev) => (prev === 0 ? galleryMedia.length - 1 : prev - 1));
    };

    const handleNextScreenshot = (e) => {
        e.stopPropagation();
        setLightboxIndex((prev) => (prev === galleryMedia.length - 1 ? 0 : prev + 1));
    };

    if (!galleryMedia || galleryMedia.length === 0) return null;

    return (
        <div className="relative overflow-hidden px-2 py-4">
            {galleryMedia.length === 1 ? (
                /* Exactly 1 Image */
                <div className="max-w-3xl mx-auto px-4">
                    <div 
                        onClick={() => setLightboxIndex(0)}
                        className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/5 bg-[#0c0c0e] hover:border-[var(--gold)]/20 cursor-pointer group transition-all duration-300 shadow-2xl"
                    >
                        <img 
                            src={galleryMedia[0].url} 
                            alt={galleryMedia[0].caption || galleryMedia[0].alt_text || `Screenshot 1`}
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
                /* Exactly 2 Images */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {galleryMedia.map((mediaItem, idx) => (
                        <div 
                            key={mediaItem.id || idx}
                            onClick={() => setLightboxIndex(idx)}
                            className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/5 bg-[#0c0c0e] hover:border-[var(--gold)]/20 cursor-pointer group transition-all duration-300 shadow-xl"
                        >
                            <img 
                                src={mediaItem.url} 
                                alt={mediaItem.caption || mediaItem.alt_text || `Screenshot ${idx + 1}`}
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
                /* 3 or More Images (Carousel slider) */
                <div className="relative group/gallery-slider">
                    <div className="overflow-hidden">
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
                                            alt={mediaItem.caption || mediaItem.alt_text || `Screenshot ${idx + 1}`}
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
                    </div>

                    {/* Navigation Controls */}
                    {galleryMedia.length > visibleCount && (
                        <>
                            <button 
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-white/10 hover:bg-black/80 hover:border-[var(--gold)]/50 text-white transition-all duration-200 opacity-0 group-hover/gallery-slider:opacity-100 focus:opacity-100 z-20 shadow-xl"
                                aria-label="Previous Slide"
                            >
                                <ChevronLeft className="w-5 h-5 text-[var(--gold)]" />
                            </button>
                            <button 
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-white/10 hover:bg-black/80 hover:border-[var(--gold)]/50 text-white transition-all duration-200 opacity-0 group-hover/gallery-slider:opacity-100 focus:opacity-100 z-20 shadow-xl"
                                aria-label="Next Slide"
                            >
                                <ChevronRight className="w-5 h-5 text-[var(--gold)]" />
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* full-screen Screenshot Lightbox Modal Overlay */}
            {lightboxIndex !== null && (
                <div 
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8"
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
        </div>
    );
}
