import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import useLanguage from '@/Hooks/useLanguage';
import { Globe, ChevronDown, Check } from 'lucide-react';

const navLinks = {
    bm: [
        { name: 'Utama', href: '/' },
        { name: 'Tentang Kami', href: '/tentang-kami' },
        { name: 'Perkhidmatan', href: '/perkhidmatan' },
        { name: 'Produk', href: '/produk' },
        { name: 'Portfolio', href: '/portfolio' },
        { name: 'Artikel', href: '/artikel' },
        { name: 'Hubungi Kami', href: '/hubungi-kami' },
    ],
    en: [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/tentang-kami' },
        { name: 'Services', href: '/perkhidmatan' },
        { name: 'Products', href: '/produk' },
        { name: 'Portfolio', href: '/portfolio' },
        { name: 'Articles', href: '/artikel' },
        { name: 'Contact Us', href: '/hubungi-kami' },
    ]
};

export default function Navbar() {
    const { url, props } = usePage();
    const settings = props.settings || {};
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showLangDropdown, setShowLangDropdown] = useState(false);
    const [showMobileLangDropdown, setShowMobileLangDropdown] = useState(false);
    const { lang, toggleLanguage } = useLanguage();

    const langRef = useRef(null);
    const mobileLangRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (langRef.current && !langRef.current.contains(event.target)) {
                setShowLangDropdown(false);
            }
            if (mobileLangRef.current && !mobileLangRef.current.contains(event.target)) {
                setShowMobileLangDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const onScroll = useCallback(() => {
        setScrolled(window.scrollY > 20);
    }, []);

    useEffect(() => {
        // Passive listener — critical for mobile scroll performance
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [onScroll]);

    const closeMobileMenu = useCallback(() => setMobileOpen(false), []);
    const toggleMobileMenu = useCallback(() => setMobileOpen(prev => !prev), []);

    const currentLinks = navLinks[lang] || navLinks.bm;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#080808]/80 backdrop-blur-xl border-b border-zinc-800/50 shadow-2xl' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo — removed animate-pulse glow (continuous GPU repaint) */}
                    <Link href="/" className="flex items-center group relative">
                        <div className="relative transition-all duration-500 ease-out group-hover:scale-105">
                            <ApplicationLogo
                                className="
                                    relative z-10
                                    w-[125px] h-[65px] sm:w-[145px] sm:h-[75px] object-contain
                                    transition-all duration-500 ease-out
                                    group-hover:brightness-110
                                    filter
                                    drop-shadow-[0_0_3px_rgba(255,255,255,0.7)]
                                    drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]
                                    group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]
                                "
                            />
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-6">
                        {currentLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`nav-link ${url === link.href ? 'text-[var(--gold)] active' : 'text-gray-300 hover:text-white'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* CTA & Language Switcher */}
                    <div className="hidden lg:flex items-center gap-4">
                        {/* Language Switcher */}
                        <div className="relative" ref={langRef}>
                            <button
                                onClick={() => setShowLangDropdown(!showLangDropdown)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all duration-200"
                            >
                                <Globe className="w-3.5 h-3.5 text-[var(--gold)]" />
                                <span>{lang === 'en' ? 'EN' : 'BM'}</span>
                                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${showLangDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            {showLangDropdown && (
                                <div className="absolute right-0 mt-2 w-36 rounded-xl bg-[#080808] border border-zinc-800 shadow-2xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                                    <button
                                        onClick={() => {
                                            toggleLanguage('bm');
                                            setShowLangDropdown(false);
                                        }}
                                        className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                    >
                                        <span>Bahasa Melayu</span>
                                        {lang === 'bm' && <Check className="w-3.5 h-3.5 text-[var(--gold)]" />}
                                    </button>
                                    <button
                                        onClick={() => {
                                            toggleLanguage('en');
                                            setShowLangDropdown(false);
                                        }}
                                        className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                    >
                                        <span>English</span>
                                        {lang === 'en' && <Check className="w-3.5 h-3.5 text-[var(--gold)]" />}
                                    </button>
                                </div>
                            )}
                        </div>

                        <Link href="/hubungi-kami" className="btn-primary text-xs px-5 py-2.5">
                            {lang === 'en' ? 'Get a Demo' : 'Dapatkan Demo'}
                        </Link>
                    </div>

                    {/* Mobile Menu Button & Language Switcher */}
                    <div className="flex lg:hidden items-center gap-3">
                        {/* Language Switcher */}
                        <div className="relative" ref={mobileLangRef}>
                            <button
                                onClick={() => setShowMobileLangDropdown(!showMobileLangDropdown)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold transition-all duration-200"
                            >
                                <Globe className="w-3 h-3 text-[var(--gold)]" />
                                <span>{lang === 'en' ? 'EN' : 'BM'}</span>
                                <ChevronDown className={`w-2.5 h-2.5 text-gray-400 transition-transform duration-200 ${showMobileLangDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            {showMobileLangDropdown && (
                                <div className="absolute right-0 mt-2 w-32 rounded-xl bg-[#080808] border border-zinc-800 shadow-2xl z-50 py-1 overflow-hidden">
                                    <button
                                        onClick={() => {
                                            toggleLanguage('bm');
                                            setShowMobileLangDropdown(false);
                                        }}
                                        className="flex items-center justify-between w-full px-3 py-2 text-[10px] font-bold text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                    >
                                        <span>Bahasa Melayu</span>
                                        {lang === 'bm' && <Check className="w-3 h-3 text-[var(--gold)]" />}
                                    </button>
                                    <button
                                        onClick={() => {
                                            toggleLanguage('en');
                                            setShowMobileLangDropdown(false);
                                        }}
                                        className="flex items-center justify-between w-full px-3 py-2 text-[10px] font-bold text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                    >
                                        <span>English</span>
                                        {lang === 'en' && <Check className="w-3 h-3 text-[var(--gold)]" />}
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={toggleMobileMenu}
                            className="text-white p-2"
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={mobileOpen}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu — GPU-friendly transform transition instead of max-height */}
            <div
                className={`lg:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                style={{
                    maxHeight: mobileOpen ? '600px' : '0px',
                    transition: 'max-height 0.3s ease, opacity 0.2s ease',
                }}
            >
                <div className="bg-[#080808]/95 backdrop-blur-xl border-t border-zinc-800/50 px-4 py-4 space-y-2 shadow-2xl">
                    {currentLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeMobileMenu}
                            className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                url === link.href
                                    ? 'bg-[var(--gold)]/10 text-[var(--gold)]'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link href="/hubungi-kami" onClick={closeMobileMenu} className="btn-primary w-full text-center mt-4 block">
                        {lang === 'en' ? 'Get a Demo' : 'Dapatkan Demo'}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
