import { useEffect, useRef } from 'react';

/**
 * BackToTop — Lightweight floating button that appears after scrolling 400px.
 * Uses a passive scroll listener and CSS-only visibility toggle.
 * GPU-accelerated via transform + opacity (no layout thrashing).
 */
export default function BackToTop() {
    const btnRef = useRef(null);

    useEffect(() => {
        const btn = btnRef.current;
        if (!btn) return;

        const onScroll = () => {
            if (window.scrollY > 400) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            window.scrollTo(0, 0);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <button
            ref={btnRef}
            onClick={scrollToTop}
            className="back-to-top"
            aria-label="Back to top"
            title="Back to top"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M18 15l-6-6-6 6" />
            </svg>
        </button>
    );
}
