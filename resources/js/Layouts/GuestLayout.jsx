import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { ShieldCheck, Cpu, Activity, Server, Clock, CheckCircle2, Sun, Moon, FileText, Briefcase, Package, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

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
    const loginBg = settings.login_background || '/storage/branding/login_bg.png';

    useEffect(() => {
        // Force light mode for the login page
        const root = window.document.documentElement;
        root.classList.remove('dark');
    }, []);

    return (
        <div className="flex min-h-screen bg-[#080808] text-white font-sans antialiased relative overflow-hidden select-none">
            {/* Skyscraper background image with overlay (strictly grayscale) */}
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-[0.08] grayscale contrast-[1.15] pointer-events-none" 
                style={{ backgroundImage: `url('${loginBg}')` }}
            />

            {/* Background Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-yellow-500/20 to-amber-500/10 blur-[130px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-yellow-600/15 to-amber-600/10 blur-[110px] pointer-events-none" />
            
            {/* Technical Grid Pattern across full screen */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto w-full min-h-screen px-6 py-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
                {/* Left Side: Brand Showcase */}
                <div className="w-full lg:w-[50%] flex flex-col justify-center animate-fade-in-left">
                    {/* Logo Wrapper Container */}
                    <div className="flex items-center mb-2">
                        <Link
                            href="/"
                            className="relative group block w-[180px] h-[120px] -ml-2 flex items-center justify-center"
                        >
                            {/* ===================================================== */}
                            {/* BACKGROUND GLOW */}
                            {/* ===================================================== */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                {/* Main White Glow - Expanded and brightened */}
                                <div className="w-28 h-28 rounded-full bg-white/20 blur-2xl animate-pulse" />

                                {/* Soft White Glow - Boosted */}
                                <div className="absolute w-20 h-20 rounded-full bg-white/10 blur-xl" />

                                {/* High Intensity Center Glow - New layer for radiance */}
                                <div className="absolute w-12 h-12 rounded-full bg-white/15 blur-lg animate-pulse" />
                            </div>

                            {/* ===================================================== */}
                            {/* CIRCUIT LINES */}
                            {/* ===================================================== */}

                            {/* Top Left to Center */}
                            <div className="absolute top-4 left-4 w-9 h-px bg-gradient-to-r from-transparent via-white/80 to-white animate-pulse" />
                            <div className="absolute top-4 left-[48px] w-1 h-1 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.95)] animate-ping" />

                            {/* Top Right to Center */}
                            <div className="absolute top-6 right-4 w-9 h-px bg-gradient-to-l from-transparent via-white/70 to-white animate-pulse" />
                            <div className="absolute top-6 right-[48px] w-1 h-1 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.95)] animate-ping" />

                            {/* Bottom Left to Center */}
                            <div className="absolute bottom-6 left-4 w-9 h-px bg-gradient-to-r from-transparent via-white/70 to-white animate-pulse" />
                            <div className="absolute bottom-6 left-[48px] w-1 h-1 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] animate-ping" />

                            {/* Bottom Right to Center */}
                            <div className="absolute bottom-4 right-4 w-9 h-px bg-gradient-to-l from-transparent via-white/60 to-white animate-pulse" />
                            <div className="absolute bottom-4 right-[48px] w-1 h-1 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] animate-ping" />

                            {/* ===================================================== */}
                            {/* HEXAGON TECH GRID */}
                            {/* ===================================================== */}
                            <div className="absolute w-[150px] h-[85px] rounded-[30%] border border-white/15 rotate-6 animate-[spin_30s_linear_infinite] pointer-events-none" />
                            <div className="absolute w-[125px] h-[72px] rounded-[30%] border border-white/10 -rotate-6 animate-[spin_24s_linear_infinite_reverse] pointer-events-none" />

                            {/* ===================================================== */}
                            {/* FLOATING PARTICLES */}
                            {/* ===================================================== */}
                            <div className="absolute top-4 left-10 w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] animate-ping" />
                            <div className="absolute top-7 right-8 w-1 h-1 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.95)] animate-pulse" />
                            <div className="absolute bottom-5 left-10 w-1 h-1 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)] animate-pulse" />
                            <div className="absolute bottom-7 right-9 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] animate-ping" />

                            {/* ===================================================== */}
                            {/* CENTER ENERGY RING */}
                            {/* ===================================================== */}
                            <div className="absolute w-[75px] h-[75px] rounded-full border border-white/15 animate-pulse pointer-events-none" />

                            {/* ===================================================== */}
                            {/* LOGO CONTAINER */}
                            {/* ===================================================== */}
                            <div className="relative z-20 transition-all duration-700 ease-out group-hover:scale-110">
                                {/* Glow Behind Logo - Intensified & Animated */}
                                <div className="absolute inset-0 bg-white/20 blur-2xl scale-120 rounded-full animate-pulse" />

                                {/* Your Logo */}
                                <ApplicationLogo
                                    className="
                                        relative z-10
                                        w-[110px] h-[67px] object-contain
                                        transition-all duration-700 ease-out
                                        group-hover:brightness-110
                                        filter
                                        drop-shadow-[0_0_5px_rgba(255,255,255,0.95)]
                                        drop-shadow-[0_0_16px_rgba(255,255,255,0.9)]
                                        drop-shadow-[0_0_32px_rgba(255,255,255,0.35)]
                                        group-hover:drop-shadow-[0_0_60px_rgba(255,255,255,0.65)]
                                    "
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Enterprise Portal Pill */}
                    <div className="mt-6">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-yellow-500 text-xs font-bold tracking-wider">
                            ✨ Portal Pentadbir
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight text-white mt-6">
                        Urus portal dengan <br />
                        lebih <span className="text-yellow-500 font-black animate-pulse">pantas</span> & berkesan.
                    </h1>

                    {/* Description */}
                    <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-md">
                        Platform kawalan CMS korporat bersepadu untuk mengurus portal web, portfolio perniagaan, dan interaksi pelanggan secara masa-nyata.
                    </p>

                    {/* Features list */}
                    <div className="space-y-3 mt-6">
                        <div className="flex items-center gap-3 group/item text-slate-300">
                            <div className="w-7 h-7 rounded-full bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center text-yellow-500 shrink-0 transition-transform duration-300 group-hover/item:scale-110">
                                <FileText className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-bold text-zinc-200 transition-colors group-hover/item:text-white">Urus Kandungan & Artikel Berita</span>
                        </div>
                        <div className="flex items-center gap-3 group/item text-slate-300">
                            <div className="w-7 h-7 rounded-full bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center text-yellow-500 shrink-0 transition-transform duration-300 group-hover/item:scale-110">
                                <Briefcase className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-bold text-zinc-200 transition-colors group-hover/item:text-white">Portfolio Projek & Katalog Produk</span>
                        </div>
                        <div className="flex items-center gap-3 group/item text-slate-300">
                            <div className="w-7 h-7 rounded-full bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center text-yellow-500 shrink-0 transition-transform duration-300 group-hover/item:scale-110">
                                <MessageSquare className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-bold text-zinc-200 transition-colors group-hover/item:text-white">Inkuiri & Maklum Balas Pelanggan</span>
                        </div>
                    </div>

                    {/* Footer Copyright */}
                    <div className="flex items-center gap-2 mt-8 text-xs text-zinc-500 font-semibold select-none">
                        <span>© 2026 Laman Teknologi Sdn Bhd</span>
                    </div>
                </div>

                {/* Right Side: Form Card */}
                <div className="w-full lg:w-[42%] max-w-[480px] mx-auto lg:mx-0 animate-fade-in-right z-10">
                    <div className="bg-[#121212]/45 backdrop-blur-xl border border-zinc-800 rounded-[32px] shadow-[0_30px_70px_rgba(0,0,0,0.6)] px-6 py-8 sm:px-8 sm:py-10 relative overflow-hidden transition-all duration-500 hover:shadow-[0_35px_80px_rgba(0,0,0,0.7)]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
