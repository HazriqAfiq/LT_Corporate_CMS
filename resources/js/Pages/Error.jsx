import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ShieldAlert, ArrowLeft, Home, X } from 'lucide-react';

export default function Error({ status, message }) {
    const is403 = status === 403;
    
    const title = is403 ? 'Akses Dihalang' : 'Ralat Sistem';
    const subtitle = is403 ? 'Access Denied' : 'System Error';
    const displayMessage = message || 'User does not have the right permissions.';

    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'dark';
        }
        return 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'light') {
            root.classList.add('light');
        } else {
            root.classList.remove('light');
        }
    }, [theme]);

    const isLight = theme === 'light';

    const handleGoBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/admin/dashboard';
        }
    };

    return (
        <div className={`min-h-screen font-sans antialiased relative flex items-center justify-center p-4 transition-colors duration-300 ${
            isLight ? 'bg-[#f1f5f9] text-[#27272a]' : 'bg-[#080808] text-white'
        }`}>
            <Head title={`${status} - ${title}`} />

            {/* Glowing backgrounds */}
            <div className={`fixed top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-red-500/10 blur-[120px] pointer-events-none z-0 transition-opacity duration-300 ${
                isLight ? 'opacity-40' : 'opacity-100'
            }`} />
            <div className={`fixed bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none z-0 transition-opacity duration-300 ${
                isLight ? 'opacity-40' : 'opacity-100'
            }`} />
            <div className={`fixed inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0 transition-opacity duration-300 ${
                isLight ? 'opacity-5 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)]' : 'opacity-10'
            }`} />

            {/* Premium Glassmorphic Card */}
            <div className={`relative w-full max-w-lg backdrop-blur-2xl rounded-3xl p-8 z-10 overflow-hidden group transition-all duration-300 border ${
                isLight 
                    ? 'bg-white border-[#cbd5e1] shadow-xl' 
                    : 'bg-[#0c0c0e]/80 border-white/5 shadow-2xl'
            }`}>
                
                {/* Ambient Red Glow */}
                <div className={`absolute top-[-20%] left-[-20%] w-[200px] h-[200px] rounded-full blur-[80px] pointer-events-none z-0 transition-all duration-300 ${
                    isLight ? 'bg-red-500/5' : 'bg-red-500/10'
                }`} />

                {/* Close Button / 'X' Symbol at the top-right corner */}
                <button
                    onClick={handleGoBack}
                    className={`absolute top-5 right-5 p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                        isLight 
                            ? 'text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 focus:ring-zinc-200' 
                            : 'text-zinc-500 hover:text-white hover:bg-white/5 focus:ring-white/10'
                    }`}
                    title="Tutup / Kembali"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="relative z-10 flex flex-col items-center text-center">
                    
                    {/* Warning Icon Badge */}
                    <div className="relative mb-6">
                        <div className="absolute -inset-2 bg-red-500/20 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className={`relative w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-300 ${
                            isLight 
                                ? 'bg-[#fef2f2] border-[#fecaca]' 
                                : 'bg-[#141416] border-red-500/20'
                        }`}>
                            <ShieldAlert className={`w-8 h-8 transition-colors duration-300 ${
                                isLight ? 'text-red-600' : 'text-red-500'
                            }`} />
                        </div>
                    </div>

                    {/* Error Code & Titles */}
                    <div className="mb-4">
                        <span className={`px-3 py-1 border rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-300 ${
                            isLight 
                                ? 'bg-red-50/50 border-red-100 text-red-600' 
                                : 'bg-red-500/10 border border-red-500/20 text-red-400'
                        }`}>
                            RALAT {status}
                        </span>
                        <h2 className={`text-2xl font-black mt-3 leading-tight transition-colors duration-300 ${
                            isLight ? 'text-[#18181b]' : 'text-white'
                        }`}>{title}</h2>
                        <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-0.5">{subtitle}</p>
                    </div>

                    <div className="w-12 h-0.5 bg-gradient-to-r from-red-500/50 to-amber-500/50 my-3 rounded-full" />

                    {/* Explanatory text */}
                    <p className={`text-sm leading-relaxed max-w-md my-4 transition-colors duration-300 ${
                        isLight ? 'text-zinc-600' : 'text-zinc-400'
                    }`}>
                        {displayMessage}
                    </p>

                    {/* Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full justify-center">
                        <button
                            onClick={handleGoBack}
                            className={`inline-flex items-center justify-center gap-2 px-5 py-3 border rounded-xl text-sm font-bold transition-all duration-200 ${
                                isLight 
                                    ? 'border-zinc-200 text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50' 
                                    : 'border-white/10 text-zinc-300 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Halaman Sebelumnya
                        </button>
                        
                        <Link
                            href="/admin/dashboard"
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-transparent rounded-xl text-sm font-bold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[#080808] transition-all duration-200 shadow-lg shadow-yellow-500/5"
                        >
                            <Home className="w-4 h-4" />
                            Utama Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
