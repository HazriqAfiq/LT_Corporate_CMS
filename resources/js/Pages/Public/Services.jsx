import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import useLanguage from '@/Hooks/useLanguage';
// Named icon imports — avoids loading entire lucide library
import { Wrench, ArrowRight } from 'lucide-react';

const servicesList = {
    bm: [
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>),
            title: 'Pembangunan Sistem Web', desc: 'Sistem web korporat, e-dagang, portal dalaman dan aplikasi web progressif (PWA) yang dibina khas menggunakan teknologi terkini.',
            features: ['Laravel & React', 'API Integration', 'Real-time Dashboard', 'Scalable Architecture'],
            bg: '/storage/services/dev_bg.png' },
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>),
            title: 'Pembangunan Aplikasi Mudah Alih', desc: 'Aplikasi iOS dan Android yang responsif menggunakan Flutter atau React Native untuk pengalaman pengguna yang lancar.',
            features: ['Cross-platform', 'Push Notifications', 'Offline Support', 'App Store Publishing'],
            bg: '/storage/services/mobile_bg.png' },
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.648 0-.438-.12-.824-.368-1.127-.229-.273-.351-.628-.351-.989 0-1.109.897-2 2.008-2H19c2.21 0 4-1.79 4-4C23 6.03 18.477 2 12 2Z"/></svg>),
            title: 'Rekabentuk UI/UX', desc: 'Rekabentuk antara muka pengguna yang moden, intuitif dan menarik menggunakan prinsip design thinking.',
            features: ['User Research', 'Wireframing', 'Prototyping', 'Design System'],
            bg: '/storage/services/design_bg.png' },
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>),
            title: 'Cloud & Hosting', desc: 'Infrastruktur awan yang selamat dan berprestasi tinggi untuk aplikasi kritikal perniagaan anda.',
            features: ['AWS & Azure', '99.9% Uptime', 'Auto Scaling', 'Daily Backup'],
            bg: '/storage/services/cloud_bg.png' },
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>),
            title: 'AI & Automasi', desc: 'Penyelesaian kecerdasan buatan termasuk chatbot, analitik ramalan dan automasi proses.',
            features: ['NLP Processing', 'Machine Learning', 'Chatbot AI', 'Data Analytics'],
            bg: '/storage/services/ai_bg.png' },
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
            title: 'Keselamatan Siber', desc: 'Perlindungan menyeluruh terhadap ancaman siber termasuk audit keselamatan dan pemantauan.',
            features: ['Security Audit', 'Penetration Testing', 'SSL Certificate', '24/7 Monitoring'],
            bg: '/storage/services/security_bg.png' },
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>),
            title: 'Business Intelligence', desc: 'Analitik data dan papan pemuka pintar untuk membantu membuat keputusan perniagaan yang lebih baik.',
            features: ['Custom Dashboard', 'Data Visualization', 'Automated Reports', 'KPI Tracking'],
            bg: '/storage/services/ai_bg.png' },
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>),
            title: 'Sokongan & Penyelenggaraan', desc: 'Perkhidmatan sokongan teknikal berterusan untuk memastikan sistem anda sentiasa optimum.',
            features: ['24/7 Support', 'Bug Fixes', 'Performance Tuning', 'Version Updates'],
            bg: '/storage/services/dev_bg.png' },
    ],
    en: [
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>),
            title: 'Web System Development', desc: 'Corporate web systems, e-commerce, internal portals and progressive web apps (PWA) built with the latest technology.',
            features: ['Laravel & React', 'API Integration', 'Real-time Dashboard', 'Scalable Architecture'],
            bg: '/storage/services/dev_bg.png' },
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>),
            title: 'Mobile App Development', desc: 'Responsive iOS and Android apps using Flutter or React Native for smooth user experiences.',
            features: ['Cross-platform', 'Push Notifications', 'Offline Support', 'App Store Publishing'],
            bg: '/storage/services/mobile_bg.png' },
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.648 0-.438-.12-.824-.368-1.127-.229-.273-.351-.628-.351-.989 0-1.109.897-2 2.008-2H19c2.21 0 4-1.79 4-4C23 6.03 18.477 2 12 2Z"/></svg>),
            title: 'UI/UX Design', desc: 'Modern, intuitive, and attractive user interfaces using design thinking principles.',
            features: ['User Research', 'Wireframing', 'Prototyping', 'Design System'],
            bg: '/storage/services/design_bg.png' },
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>),
            title: 'Cloud & Hosting', desc: 'Secure and high-performance cloud infrastructure for your critical business applications.',
            features: ['AWS & Azure', '99.9% Uptime', 'Auto Scaling', 'Daily Backup'],
            bg: '/storage/services/cloud_bg.png' },
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>),
            title: 'AI & Automation', desc: 'Artificial intelligence solutions including chatbots, predictive analytics and process automation.',
            features: ['NLP Processing', 'Machine Learning', 'Chatbot AI', 'Data Analytics'],
            bg: '/storage/services/ai_bg.png' },
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
            title: 'Cybersecurity', desc: 'Comprehensive protection against cyber threats including security audits and monitoring.',
            features: ['Security Audit', 'Penetration Testing', 'SSL Certificate', '24/7 Monitoring'],
            bg: '/storage/services/security_bg.png' },
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>),
            title: 'Business Intelligence', desc: 'Data analytics and smart dashboards to help make better business decisions.',
            features: ['Custom Dashboard', 'Data Visualization', 'Automated Reports', 'KPI Tracking'],
            bg: '/storage/services/ai_bg.png' },
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>),
            title: 'Support & Maintenance', desc: 'Continuous technical support services to ensure your systems are always at peak performance.',
            features: ['24/7 Support', 'Bug Fixes', 'Performance Tuning', 'Version Updates'],
            bg: '/storage/services/dev_bg.png' },
    ],
};

const t = {
    bm: {
        badge: 'Perkhidmatan',
        heroBadge: 'Perkhidmatan',
        heroTitle: 'Apa Yang',
        heroTitleGold: 'Kami Tawarkan',
        heroDesc: 'Perkhidmatan teknologi menyeluruh dari konsep hingga pelaksanaan.',
    },
    en: {
        badge: 'Services',
        heroBadge: 'Services',
        heroTitle: 'What We',
        heroTitleGold: 'Offer',
        heroDesc: 'Comprehensive technology services from concept to execution.',
    },
};

export default function Services({ settings = {}, services = [] }) {
    const { lang } = useLanguage();
    const homepageBg = settings.homepage_background || '/storage/uploads/homepage_bg.png';

    const tr = t[lang] || t.bm;
    const activeServices = services && services.length > 0 ? services : (servicesList[lang] || servicesList.bm);

    return (
        <PublicLayout title={lang === 'en' ? 'Services' : 'Perkhidmatan'} settings={settings}>
            {/* Hero Banner */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-[#080808] border-b border-white/5 z-10" style={{ clipPath: 'inset(0)' }}>
                <img 
                    src={homepageBg} 
                    alt="Background" 
                    fetchpriority="high"
                    loading="eager"
                    className="absolute md:fixed inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-55 md:opacity-45" 
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)]/5 via-transparent to-amber-500/10 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-full lg:w-2/3 bg-gradient-to-r from-[#080808]/75 via-[#080808]/50 to-[#080808]/20 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-full lg:w-1/3 bg-gradient-to-l from-[#080808]/40 via-[#080808]/30 to-[#080808]/20 z-0 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />
                <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-[var(--gold)]/10 blur-[60px] pointer-events-none z-0" />
                <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-[var(--gold)]/5 blur-[50px] pointer-events-none z-0" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center" data-reveal="fade-up">
                    <div className="badge mb-6">{tr.heroBadge}</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {tr.heroTitle} <span className="text-[var(--gold)]">{tr.heroTitleGold}</span>
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">{tr.heroDesc}</p>
                </div>
            </section>

            {/* Services List */}
            <section className="py-28 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {activeServices.map((svc, i) => {
                            const title = svc.title || (lang === 'en' ? (svc.name_en || svc.name) : svc.name);
                            const desc = svc.desc || (lang === 'en' ? (svc.description_en || svc.description) : svc.description);
                            const bg = svc.bg || svc.featured_media?.url || '/storage/services/dev_bg.png';
                            const features = (lang === 'en' ? (svc.features_en || svc.features) : svc.features) || [];
                            const slug = svc.slug;

                            const CardInner = (
                                <div className={`card group flex flex-col sm:flex-row h-full min-h-[220px] hover:border-[var(--gold)]/30 hover:shadow-[0_12px_40px_rgba(234,179,8,0.06)] ${slug ? 'cursor-pointer' : ''}`}>
                                    {/* Left Side: Image */}
                                    <div className="relative w-full sm:w-2/5 min-h-[160px] sm:min-h-full overflow-hidden bg-zinc-950 flex-shrink-0">
                                        {bg && (
                                            <img 
                                                src={bg} 
                                                alt={title} 
                                                loading="lazy"
                                                className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-all duration-700 ease-out pointer-events-none" 
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-transparent via-transparent to-[#0e0e11]/90 z-10" />
                                        
                                        <div className="absolute inset-0 flex items-center justify-center z-20">
                                            <div className="w-14 h-14 rounded-2xl bg-[#080808]/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-2xl text-[var(--gold)] transition-transform duration-500 group-hover:scale-105 group-hover:border-[var(--gold)]/40 shadow-xl">
                                                {React.isValidElement(svc.icon) ? (
                                                    svc.icon
                                                ) : (
                                                    React.createElement(Wrench, { className: "w-6 h-6" })
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Text & Tags */}
                                    <div className="p-8 flex-1 flex flex-col justify-between relative z-20">
                                        <div className="mb-4">
                                            <h3 className="text-lg font-bold text-white group-hover:text-[var(--gold)] transition-colors duration-300 mb-2 font-sans">
                                                {title}
                                            </h3>
                                            <p className="text-zinc-400 text-xs leading-relaxed font-medium">
                                                {desc}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 mt-auto">
                                            {features.map((f, j) => (
                                                <span 
                                                    key={j} 
                                                    className="text-[10px] bg-white/[0.02] border border-white/5 text-zinc-400 px-2.5 py-0.5 rounded-full group-hover:border-[var(--gold)]/20 group-hover:text-zinc-300 transition-colors duration-300"
                                                >
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
                                        {slug && (
                                            <div className="mt-4 flex items-center gap-1.5 text-[var(--gold)] text-xs font-bold opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300">
                                                {lang === 'en' ? 'Learn More' : 'Ketahui Lebih Lanjut'}
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );

                            const AnimationWrapper = slug ? Link : 'div';
                            const animProps = slug ? { href: `/perkhidmatan/${slug}`, className: 'block h-full' } : { className: 'h-full' };

                            return (
                                <AnimationWrapper key={i} {...animProps} data-reveal="fade-up" data-reveal-delay={i * 100}>
                                    {CardInner}
                                </AnimationWrapper>
                            );
                        })}
                    </div>
                </div>
            </section>

        </PublicLayout>
    );
}
