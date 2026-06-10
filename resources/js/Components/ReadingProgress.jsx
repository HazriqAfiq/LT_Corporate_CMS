import { useEffect, useRef } from 'react';

/**
 * ReadingProgress — Thin gold progress bar at the top of the page.
 * Uses requestAnimationFrame + transform: scaleX() for GPU-accelerated updates.
 * Passive scroll listener prevents main thread blocking.
 */
export default function ReadingProgress() {
    const barRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        const bar = barRef.current;
        if (!bar) return;

        // Set the width to 100% so we only animate scaleX
        bar.style.width = '100%';

        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? scrollTop / docHeight : 0;
            bar.style.transform = `scaleX(${Math.min(progress, 1)})`;
        };

        const onScroll = () => {
            // Cancel any pending frame before scheduling a new one
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(updateProgress);
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        // Set initial value
        updateProgress();

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return <div ref={barRef} className="reading-progress-bar" aria-hidden="true" />;
}
