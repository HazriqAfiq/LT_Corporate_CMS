import { useState, useEffect, useCallback } from 'react';

/**
 * Shared language hook — eliminates duplicate localStorage reads and
 * redundant languageChange event listeners across all public components.
 * Returns the current lang string and a toggleLanguage setter.
 */
export default function useLanguage() {
    const [lang, setLang] = useState(() =>
        typeof window !== 'undefined' ? localStorage.getItem('lang') || 'bm' : 'bm'
    );

    const handleLangChange = useCallback(() => {
        setLang(localStorage.getItem('lang') || 'bm');
    }, []);

    useEffect(() => {
        // Sync on mount in case server-side rendered with wrong default
        setLang(localStorage.getItem('lang') || 'bm');
        window.addEventListener('languageChange', handleLangChange);
        return () => window.removeEventListener('languageChange', handleLangChange);
    }, [handleLangChange]);

    const toggleLanguage = useCallback((newLang) => {
        localStorage.setItem('lang', newLang);
        setLang(newLang);
        window.dispatchEvent(new Event('languageChange'));
    }, []);

    return { lang, toggleLanguage };
}
