import { useState, useEffect, useCallback } from 'react';
import translations from '../Locales/translations.json';

export default function useTranslation() {
    const [lang, setLang] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('lang') || 'bm';
        }
        return 'bm';
    });

    useEffect(() => {
        const handleLangChange = () => {
            setLang(localStorage.getItem('lang') || 'bm');
        };
        window.addEventListener('languageChange', handleLangChange);
        return () => window.removeEventListener('languageChange', handleLangChange);
    }, []);

    const t = useCallback((key, replacements = {}) => {
        const dict = translations[lang] || translations['bm'];
        let text = dict[key];
        
        if (text === undefined) {
            // Fallback to English if not in current lang but available in English
            if (lang !== 'en' && translations['en'] && translations['en'][key]) {
                text = translations['en'][key];
            } else if (lang !== 'bm' && translations['bm'] && translations['bm'][key]) {
                text = translations['bm'][key];
            } else {
                return key; // return key if completely missing
            }
        }
        
        // Simple replacement logic for variables like :name
        if (Object.keys(replacements).length > 0) {
            Object.keys(replacements).forEach(r => {
                text = text.replace(`:${r}`, replacements[r]);
            });
        }
        
        return text;
    }, [lang]);

    return { t, lang };
}
