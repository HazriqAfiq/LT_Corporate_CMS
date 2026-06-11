import { useState, useEffect } from 'react';
import { Mail, Check, AlertCircle, Loader2 } from 'lucide-react';
import useLanguage from '@/Hooks/useLanguage';
import { usePage } from '@inertiajs/react';


const t = {
    bm: {
        badge: 'Newsletter',
        title: 'Kekal Berhubung',
        titleGold: 'Dengan Kami',
        desc: 'Langgan newsletter kami dan dapatkan berita terkini, artikel eksklusif, dan kemaskini produk terus ke peti masuk anda.',
        namePlaceholder: 'Nama anda (pilihan)',
        emailPlaceholder: 'Alamat e-mel anda',
        btn: 'Langgan Sekarang',
        subscribing: 'Menghantar...',
        successTitle: 'Berjaya Dilanggan!',
        successDesc: 'Terima kasih! Anda akan menerima kemaskini terkini kami.',
        alreadyTitle: 'Sudah Dilanggan',
        alreadyDesc: 'E-mel ini telah pun melanggan newsletter kami.',
        errorDesc: 'Ralat berlaku. Sila cuba sekali lagi.',
        benefit1: 'Berita & Artikel Terkini',
        benefit2: 'Kemaskini Produk Eksklusif',
        benefit3: 'Tanpa Spam. Berhenti Bila-bila Masa.',
    },
    en: {
        badge: 'Newsletter',
        title: 'Stay Connected',
        titleGold: 'With Us',
        desc: 'Subscribe to our newsletter and get the latest news, exclusive articles, and product updates delivered straight to your inbox.',
        namePlaceholder: 'Your name (optional)',
        emailPlaceholder: 'Your email address',
        btn: 'Subscribe Now',
        subscribing: 'Subscribing...',
        successTitle: 'Successfully Subscribed!',
        successDesc: 'Thank you! You will receive our latest updates.',
        alreadyTitle: 'Already Subscribed',
        alreadyDesc: 'This email is already subscribed to our newsletter.',
        errorDesc: 'An error occurred. Please try again.',
        benefit1: 'Latest News & Articles',
        benefit2: 'Exclusive Product Updates',
        benefit3: 'No Spam. Unsubscribe Anytime.',
    },
};

export default function NewsletterSection() {
    const { lang } = useLanguage();
    const { props: pageProps } = usePage();
    const settings = pageProps.settings || {};
    const homepageBg = settings.homepage_background || '/storage/uploads/homepage_bg.png';
    const [name, setName]       = useState('');
    const [email, setEmail]     = useState('');
    const [status, setStatus]   = useState(null);
    const csrfToken = pageProps.csrf_token || '';

    const tr = t[lang] || t.bm;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        try {
            const res = await fetch('/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ name: name.trim() || undefined, email }),
            });
            const data = await res.json();
            if (res.status === 409 && data.already) {
                setStatus('already');
            } else if (data.success) {
                setStatus('success');
                setName('');
                setEmail('');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    const benefits = [tr.benefit1, tr.benefit2, tr.benefit3];

    return (
        <section className="py-28 bg-[#080808] border-y border-white/5 relative overflow-hidden z-10">
            {/* Background Image — parallax on desktop, scroll on mobile */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-scroll md:bg-fixed pointer-events-none z-0 opacity-25" 
                style={{ backgroundImage: `url('${homepageBg}')` }}
            />
            {/* Warm Amber-Gold Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)]/5 via-transparent to-amber-500/10 z-0 pointer-events-none" />

            {/* Dark Overlays for text contrast */}
            <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-transparent z-0 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-full lg:w-2/5 bg-gradient-to-l from-[#080808]/70 to-transparent z-0 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#080808] to-transparent z-0 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#080808] to-transparent z-0 pointer-events-none" />

            {/* Background effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-[var(--gold)]/8 blur-[120px] pointer-events-none z-0" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left: copy */}
                    <div data-reveal="fade-up">
                        <div className="badge mb-6">{tr.badge}</div>
                        <h2 className="section-title mb-5">
                            {tr.title}{' '}
                            <span className="gold-accent">{tr.titleGold}</span>
                        </h2>
                        <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-md">
                            {tr.desc}
                        </p>
                        <ul className="space-y-3">
                            {benefits.map((b, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-400">
                                    <span className="w-5 h-5 rounded-full bg-[var(--gold)]/15 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-[var(--gold)]" />
                                    </span>
                                    {b}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right: form card */}
                    <div className="relative" data-reveal="fade-up" data-reveal-delay="200">
                        {/* Glow behind card */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--gold)]/20 to-amber-600/10 rounded-3xl blur opacity-50 pointer-events-none" />
                        <div className="relative bg-[#0c0c0e] border border-white/8 rounded-2xl p-8 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/10 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-[var(--gold)]" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">{tr.badge}</p>
                                    <p className="text-zinc-500 text-xs">Laman Teknologi</p>
                                </div>
                            </div>

                            {/* Success */}
                            {status === 'success' && (
                                <div className="flex flex-col items-center text-center py-8 gap-4">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                                        <Check className="w-8 h-8 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-lg">{tr.successTitle}</p>
                                        <p className="text-zinc-400 text-sm mt-1">{tr.successDesc}</p>
                                    </div>
                                </div>
                            )}

                            {/* Already subscribed */}
                            {status === 'already' && (
                                <div className="flex flex-col items-center text-center py-8 gap-4">
                                    <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                                        <Mail className="w-8 h-8 text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-lg">{tr.alreadyTitle}</p>
                                        <p className="text-zinc-400 text-sm mt-1">{tr.alreadyDesc}</p>
                                    </div>
                                    <button
                                        onClick={() => setStatus(null)}
                                        className="text-xs text-zinc-500 hover:text-zinc-300 underline mt-2"
                                    >
                                        {lang === 'en' ? 'Try another email' : 'Cuba e-mel lain'}
                                    </button>
                                </div>
                            )}

                            {/* Form */}
                            {(status === null || status === 'error') && (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder={tr.namePlaceholder}
                                            className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/[0.03] text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/30 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder={tr.emailPlaceholder}
                                            required
                                            className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/[0.03] text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/30 transition-all"
                                        />
                                    </div>
                                    {status === 'error' && (
                                        <div className="flex items-center gap-2 text-red-400 text-xs">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            {tr.errorDesc}
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={status === 'loading' || !email}
                                        className="w-full py-3.5 rounded-xl bg-[var(--gold)] text-[#080808] font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[var(--gold)]/10"
                                    >
                                        {status === 'loading' ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                {tr.subscribing}
                                            </>
                                        ) : tr.btn}
                                    </button>
                                    <p className="text-center text-xs text-zinc-600 mt-2">
                                        {tr.benefit3}
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
