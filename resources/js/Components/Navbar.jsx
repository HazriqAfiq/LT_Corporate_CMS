import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Mail, Phone } from 'lucide-react';

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
    const [lang, setLang] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('lang') || 'bm' : 'bm'));

    useEffect(() => {
        const storedLang = localStorage.getItem('lang') || 'bm';
        setLang(storedLang);

        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);

        const handleLangChange = () => {
            setLang(localStorage.getItem('lang') || 'bm');
        };
        window.addEventListener('languageChange', handleLangChange);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('languageChange', handleLangChange);
        };
    }, []);

    const toggleLanguage = (newLang) => {
        localStorage.setItem('lang', newLang);
        setLang(newLang);
        window.dispatchEvent(new Event('languageChange'));
    };

    const currentLinks = navLinks[lang] || navLinks.bm;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#080808]/80 backdrop-blur-xl border-b border-zinc-800/50 shadow-2xl' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group relative">
                        <div className="relative transition-all duration-500 ease-out group-hover:scale-105">
                            {/* Subtle Glow Behind Logo */}
                            <div className="absolute inset-0 bg-white/5 blur-xl scale-110 rounded-full animate-pulse pointer-events-none" />
                            
                            <ApplicationLogo
                                className="
                                    relative z-10
                                    w-[90px] h-[55px] sm:w-[100px] sm:h-[60px] object-contain
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
                        <div className="flex items-center bg-white/10 rounded-full p-1 border border-white/20">
                            <button
                                onClick={() => toggleLanguage('bm')}
                                className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-200 ${lang === 'bm' ? 'bg-[var(--gold)] text-[var(--navy)] shadow-md' : 'text-gray-400 hover:text-white'}`}
                            >
                                BM
                            </button>
                            <button
                                onClick={() => toggleLanguage('en')}
                                className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-200 ${lang === 'en' ? 'bg-[var(--gold)] text-[var(--navy)] shadow-md' : 'text-gray-400 hover:text-white'}`}
                            >
                                EN
                            </button>
                        </div>

                        <Link href="/hubungi-kami" className="btn-primary text-xs px-5 py-2.5">
                            {lang === 'en' ? 'Get a Demo' : 'Dapatkan Demo'}
                        </Link>
                    </div>

                    {/* Mobile Menu Button & Language Switcher */}
                    <div className="flex lg:hidden items-center gap-3">
                        {/* Language Switcher */}
                        <div className="flex items-center bg-white/10 rounded-full p-0.5 border border-white/20">
                            <button
                                onClick={() => toggleLanguage('bm')}
                                className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-all duration-200 ${lang === 'bm' ? 'bg-[var(--gold)] text-[var(--navy)] shadow-md' : 'text-gray-400 hover:text-white'}`}
                            >
                                BM
                            </button>
                            <button
                                onClick={() => toggleLanguage('en')}
                                className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-all duration-200 ${lang === 'en' ? 'bg-[var(--gold)] text-[var(--navy)] shadow-md' : 'text-gray-400 hover:text-white'}`}
                            >
                                EN
                            </button>
                        </div>

                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="text-white p-2"
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

            {/* Mobile Menu */}
            <div className={`lg:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <div className="bg-[#080808]/95 backdrop-blur-xl border-t border-zinc-800/50 px-4 py-4 space-y-2 shadow-2xl">
                    {currentLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                url === link.href
                                    ? 'bg-[var(--gold)]/10 text-[var(--gold)]'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link href="/hubungi-kami" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center mt-4 block">
                        {lang === 'en' ? 'Get a Demo' : 'Dapatkan Demo'}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
