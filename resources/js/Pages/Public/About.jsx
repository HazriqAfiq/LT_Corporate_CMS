import PublicLayout from '@/Layouts/PublicLayout';
import React, { useEffect, useState } from 'react';
import { Compass, Rocket, Award } from 'lucide-react';

const values = [
    { icon: Compass, title: 'Visi', desc: 'Menjadi peneraju penyelesaian teknologi di Malaysia yang dipercayai oleh organisasi pelbagai saiz.' },
    { icon: Rocket, title: 'Misi', desc: 'Menyediakan penyelesaian teknologi yang inovatif, berkualiti dan mampu milik untuk semua organisasi.' },
    { icon: Award, title: 'Nilai', desc: 'Integriti, Inovasi, Kecemerlangan, Kerjasama, dan Komitmen terhadap kualiti.' },
];

const milestones = [
    { year: '2020', title: 'Penubuhan', desc: 'Laman Teknologi ditubuhkan dengan visi besar.' },
    { year: '2021', title: 'Produk Pertama', desc: 'Pelancaran LamanHR — sistem HR pertama kami.' },
    { year: '2023', title: 'Pengembangan', desc: '30+ klien aktif dan 7 produk digital.' },
    { year: '2025', title: 'Inovasi AI', desc: 'Pelancaran LamanAI untuk automasi pintar.' },
];

export default function About({ settings = {}, team = [] }) {
    const [lang, setLang] = useState('bm');

    useEffect(() => {
        // Track the current language preference from localStorage
        const storedLang = localStorage.getItem('lang') || 'bm';
        setLang(storedLang);

        const handleLangChange = () => {
            setLang(localStorage.getItem('lang') || 'bm');
        };
        window.addEventListener('languageChange', handleLangChange);

        return () => {
            window.removeEventListener('languageChange', handleLangChange);
        };
    }, []);

    const getImageUrl = (path) => {
        if (!path) return '/images/default_avatar.png';
        if (path.startsWith('http') || path.startsWith('/') || path.startsWith('data:')) {
            return path;
        }
        return `/storage/${path}`;
    };

    return (
        <PublicLayout title="Tentang Kami" settings={settings}>
            {/* Hero Banner with Homepage-styled Backdrop */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-[#080808] border-b border-white/5 z-10">
                {/* Master Background Image (Static when scrolling) */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none z-0 opacity-45" 
                    style={{ backgroundImage: "url('/storage/digital_kl_bg.png')" }}
                />

                {/* Ambient Static Warm Golden Blur Glow */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none z-0 opacity-40" 
                    style={{ 
                        backgroundImage: "url('/storage/hero_laptop_city.png')",
                        filter: 'blur(110px) brightness(0.65)'
                    }}
                />

                {/* Warm Amber-Gold Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)]/5 via-transparent to-amber-500/10 z-0 pointer-events-none" />

                {/* Dark Overlays */}
                <div className="absolute inset-y-0 left-0 w-full lg:w-2/3 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-[#080808]/40 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-full lg:w-1/3 bg-gradient-to-l from-[#080808] via-[#080808]/60 to-[#080808]/40 z-0 pointer-events-none" />

                {/* Technical Line Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />
                
                {/* Tech Glows */}
                <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-[var(--gold)]/10 blur-[100px] pointer-events-none z-0" />
                <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-[var(--gold)]/5 blur-[90px] pointer-events-none z-0" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="badge mb-6">Tentang Kami</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Mengenali <span className="text-[var(--gold)]">Laman Teknologi</span>
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
                        {settings.company_about || 'Kami adalah syarikat teknologi yang berdedikasi untuk menyediakan penyelesaian digital terbaik bagi organisasi di Malaysia.'}
                    </p>
                </div>
            </section>

            {/* Team (Charcoal section with centered glow & gold divider lines) */}
            <section className="py-28 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                {/* Soft top-centered amber radial glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                
                {/* Gold Accent Divider Lines */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pasukan <span className="gold-accent">Kami</span></h2>
                        <p className="text-gray-400 max-w-xl mx-auto">Individu berdedikasi yang memacu inovasi teknologi.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((t, i) => {
                            const memberRole = (lang === 'en' && t.role_en) ? t.role_en : t.role;
                            return (
                                <div key={t.id || i} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#121214] transition-all duration-300 hover:-translate-y-2 hover:border-[var(--gold)]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                                    {/* Staff Image Frame - Object contain with dark premium framing to show the full staff image */}
                                    <div className="aspect-[4/5] w-full overflow-hidden relative bg-[#0c0c0e]/80 flex items-center justify-center">
                                        <img 
                                            src={getImageUrl(t.image_path)} 
                                            alt={t.name} 
                                            className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105" 
                                        />
                                        {/* Tech Line Grid mask overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent opacity-20 z-10" />
                                        
                                        {/* Premium Border Overlay */}
                                        <div className="absolute inset-0 border border-white/5 rounded-t-2xl pointer-events-none z-20" />
                                    </div>
                                    
                                    {/* Info Panel */}
                                    <div className="p-6 relative z-20 -mt-8 bg-[#121214] border-t border-white/5">
                                        <h4 className="text-xl font-bold text-white mb-1 group-hover:text-[var(--gold)] transition-colors">{t.name}</h4>
                                        <p className="text-[var(--gold)] text-sm font-semibold tracking-wider uppercase mb-1">{memberRole}</p>
                                        <div className="w-8 h-px bg-[var(--gold)]/30 group-hover:w-full transition-all duration-500" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Timeline (Solid Dark separator) */}
            <section className="py-24 bg-[#080808] border-b border-white/5 relative z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="section-title">Perjalanan <span className="gold-accent">Kami</span></h2>
                    </div>
                    <div className="space-y-8">
                        {milestones.map((m, i) => (
                            <div key={i} className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-[var(--gold)]/10 flex items-center justify-center">
                                    <span className="text-[var(--gold)] font-bold text-lg">{m.year}</span>
                                </div>
                                <div className="pt-2">
                                    <h4 className="text-lg font-bold text-white mb-1">{m.title}</h4>
                                    <p className="text-[var(--gray-500)] text-sm">{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vision, Mission, Values (Charcoal section with centered glow & gold divider lines) */}
            <section className="py-28 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                {/* Soft top-centered amber radial glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                
                {/* Gold Accent Divider Lines */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((v, i) => (
                            <div key={i} className="card p-8 group cursor-pointer">
                                <div className="w-14 h-14 rounded-xl bg-[var(--gold)]/10 flex items-center justify-center mb-6 group-hover:bg-[var(--gold)] transition-all duration-300">
                                    <v.icon className="w-7 h-7 text-[var(--gold)] group-hover:text-[#080808] transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{v.title}</h3>
                                <p className="text-[var(--gray-500)] leading-relaxed text-sm">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
