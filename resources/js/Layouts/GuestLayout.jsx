import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { ShieldCheck, Cpu, Activity, Server, Clock, CheckCircle2, Sun, Moon, FileText, Briefcase, Package, MessageSquare, Globe, ChevronDown, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

function AnimatedCounter({ value, duration = 1500, suffix = '', decimals = 0 }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseFloat(value);
        if (isNaN(end)) return;
        if (start === end) return;

        const totalMiliseconds = duration;
        const incrementTime = 30;
        const totalSteps = Math.ceil(totalMiliseconds / incrementTime);
        const increment = (end - start) / totalSteps;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            start += increment;
            if (currentStep >= totalSteps) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, incrementTime);

        return () => clearInterval(timer);
    }, [value, duration]);

    return (
        <span>
            {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
            {suffix}
        </span>
    );
}

export default function GuestLayout({ children }) {
    const { settings = {} } = usePage().props;
    const loginBg = settings.login_background || '/storage/uploads/login_bg.png';
    const [lang, setLang] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('lang') || 'bm' : 'bm'));
    const [showLangDropdown, setShowLangDropdown] = useState(false);
    const [animationDone, setAnimationDone] = useState(false);

    const langRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (langRef.current && !langRef.current.contains(event.target)) {
                setShowLangDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // Clear theme classes for guest page
        const root = window.document.documentElement;
        root.classList.remove('dark');
        root.classList.remove('light');

        const storedLang = localStorage.getItem('lang') || 'bm';
        setLang(storedLang);

        const handleLangChange = () => {
            setLang(localStorage.getItem('lang') || 'bm');
        };
        window.addEventListener('languageChange', handleLangChange);

        const timer = setTimeout(() => {
            setAnimationDone(true);
        }, 1250);

        return () => {
            window.removeEventListener('languageChange', handleLangChange);
            clearTimeout(timer);
        };
    }, []);

    const toggleLanguage = (newLang) => {
        localStorage.setItem('lang', newLang);
        setLang(newLang);
        window.dispatchEvent(new Event('languageChange'));
    };

    const contentTranslations = {
        bm: {
            adminPortal: 'Portal Pentadbir',
            title: <>Urus portal dengan <br />lebih <span className="text-yellow-500 font-black">pantas</span> & berkesan.</>,
            description: 'Platform kawalan CMS korporat bersepadu untuk mengurus portal web, portfolio perniagaan, dan interaksi pelanggan secara masa-nyata.',
            feat1: 'Urus Kandungan & Artikel Berita',
            feat2: 'Portfolio Projek & Katalog Produk',
            feat3: 'Inkuiri & Maklum Balas Pelanggan',
            copyright: '© 2026 Laman Teknologi Sdn Bhd'
        },
        en: {
            adminPortal: 'Admin Portal',
            title: <>Manage your portal <br />with <span className="text-yellow-500 font-black">speed</span> & efficiency.</>,
            description: 'Integrated corporate CMS control platform to manage web portal, business portfolio, and real-time customer interactions.',
            feat1: 'Manage Content & News Articles',
            feat2: 'Project Portfolio & Product Catalog',
            feat3: 'Customer Inquiries & Feedback',
            copyright: '© 2026 Laman Teknologi Sdn Bhd'
        }
    };

    const t = contentTranslations[lang] || contentTranslations.bm;

    return (
        <div className="flex min-h-screen bg-[#080808] text-white font-sans antialiased relative overflow-hidden select-none">
            {/* Skyscraper background image with overlay */}
            <div 
                className="fixed inset-0 bg-cover bg-center opacity-30 md:opacity-20 pointer-events-none" 
                style={{ backgroundImage: `url('${loginBg}')` }}
            />

            {/* Top Header: Logo (mobile only) & Language Switcher */}
            <div className="absolute top-6 left-6 right-6 z-50 flex items-center justify-between" ref={langRef}>
                {/* Mobile Logo */}
                <div className="block lg:hidden">
                    <Link href="/" className="flex items-center">
                        <ApplicationLogo className="w-[100px] h-[52px] object-contain" />
                    </Link>
                </div>

                {/* Language Switcher Float */}
                <div className="relative ml-auto">
                    <button
                        onClick={() => setShowLangDropdown(!showLangDropdown)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all duration-200"
                    >
                        <span>{lang === 'en' ? 'EN' : 'BM'}</span>
                        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${showLangDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showLangDropdown && (
                        <div className="absolute right-0 mt-2 w-36 rounded-xl bg-[#121212] border border-zinc-800 shadow-2xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                            <button
                                onClick={() => {
                                    toggleLanguage('bm');
                                    setShowLangDropdown(false);
                                }}
                                className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                            >
                                <span>Bahasa Melayu</span>
                                {lang === 'bm' && <Check className="w-3.5 h-3.5 text-yellow-500" />}
                            </button>
                            <button
                                onClick={() => {
                                    toggleLanguage('en');
                                    setShowLangDropdown(false);
                                }}
                                className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                            >
                                <span>English</span>
                                {lang === 'en' && <Check className="w-3.5 h-3.5 text-yellow-500" />}
                            </button>
                        </div>
                    )}
                </div>
            </div>


            
            {/* Technical Grid Pattern across full screen */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto w-full min-h-screen px-6 pt-28 pb-12 lg:py-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
                {/* Left Side: Brand Showcase */}
                <div className={`w-full lg:w-[50%] flex flex-col justify-center order-2 lg:order-1 ${animationDone ? '' : 'animate-fade-in-left'}`}>
                    {/* Logo Wrapper Container (desktop only) */}
                    <div className="hidden lg:flex items-center mb-4">
                        <Link
                            href="/"
                            className="flex items-center"
                        >
                            <ApplicationLogo
                                className="w-[125px] h-[65px] object-contain"
                            />
                        </Link>
                    </div>

                    {/* Enterprise Portal Pill */}
                    <div className="mt-6">
                        <div className="badge">
                            {t.adminPortal}
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight text-white mt-6">
                        {t.title}
                    </h1>

                    {/* Description */}
                    <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-md">
                        {t.description}
                    </p>

                    {/* Features list */}
                    <div className="space-y-4 mt-6">
                        <div className="flex items-center gap-3 group/item text-slate-300">
                            <FileText className="w-5 h-5 text-yellow-500 shrink-0" />
                            <span className="text-xs font-bold text-zinc-200 transition-colors group-hover/item:text-white">{t.feat1}</span>
                        </div>
                        <div className="flex items-center gap-3 group/item text-slate-300">
                            <Briefcase className="w-5 h-5 text-yellow-500 shrink-0" />
                            <span className="text-xs font-bold text-zinc-200 transition-colors group-hover/item:text-white">{t.feat2}</span>
                        </div>
                        <div className="flex items-center gap-3 group/item text-slate-300">
                            <MessageSquare className="w-5 h-5 text-yellow-500 shrink-0" />
                            <span className="text-xs font-bold text-zinc-200 transition-colors group-hover/item:text-white">{t.feat3}</span>
                        </div>
                    </div>

                    {/* Footer Copyright */}
                    <div className="flex items-center gap-2 mt-8 text-xs text-zinc-500 font-semibold select-none">
                        <span>{t.copyright}</span>
                    </div>
                </div>

                {/* Right Side: Form Card */}
                <div className={`w-full lg:w-[42%] max-w-[480px] mx-auto lg:mx-0 z-10 order-1 lg:order-2 ${animationDone ? '' : 'animate-fade-in-right'}`}>
                    <div className="bg-[#121212]/45 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-[0_30px_70px_rgba(0,0,0,0.6)] px-6 py-8 sm:px-8 sm:py-10 relative overflow-hidden transition-shadow duration-500 hover:shadow-[0_35px_80px_rgba(0,0,0,0.7)]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
