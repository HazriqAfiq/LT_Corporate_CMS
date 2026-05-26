import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ShieldAlert, ArrowLeft, Home, X } from 'lucide-react';

export default function Error({ status, message }) {
    const is403 = status === 403;
    
    const title = is403 ? 'Akses Dihalang' : 'Ralat Sistem';
    const subtitle = is403 ? 'Access Denied' : 'System Error';
    const displayMessage = message || 'User does not have the right permissions.';

    const handleGoBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/admin/dashboard';
        }
    };

    return (
        <div className="min-h-screen bg-[#080808] text-white font-sans antialiased relative flex items-center justify-center p-4">
            <Head title={`${status} - ${title}`} />

            {/* Glowing backgrounds */}
            <div className="fixed top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-red-500/10 blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none z-0" />
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-10 pointer-events-none z-0" />

            {/* Premium Glassmorphic Card */}
            <div className="relative w-full max-w-lg bg-[#0c0c0e]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-2xl z-10 overflow-hidden group">
                
                {/* Close Button / 'X' Symbol at the top-right corner */}
                <button
                    onClick={handleGoBack}
                    className="absolute top-5 right-5 p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/10"
                    title="Tutup / Kembali"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center">
                    
                    {/* Floating Warning Icon */}
                    <div className="relative mb-6">
                        <div className="absolute -inset-2 bg-red-500/20 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative w-16 h-16 rounded-full bg-[#141416] border border-red-500/20 flex items-center justify-center">
                            <ShieldAlert className="w-8 h-8 text-red-500" />
                        </div>
                    </div>

                    {/* Error Code & Titles */}
                    <div className="mb-4">
                        <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-mono font-bold text-red-400 tracking-wider">
                            RALAT {status}
                        </span>
                        <h2 className="text-2xl font-black text-white mt-3 leading-tight">{title}</h2>
                        <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-0.5">{subtitle}</p>
                    </div>

                    <div className="w-12 h-0.5 bg-gradient-to-r from-red-500/50 to-amber-500/50 my-3 rounded-full" />

                    {/* Explanatory text */}
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-md my-4">
                        {displayMessage}
                    </p>

                    {/* Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full justify-center">
                        <button
                            onClick={handleGoBack}
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-white/10 rounded-xl text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/5 transition-all duration-200"
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
