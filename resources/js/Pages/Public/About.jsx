import PublicLayout from '@/Layouts/PublicLayout';
import React from 'react';
import { Compass, Rocket, Award } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import useLanguage from '@/Hooks/useLanguage';


const values = {
    bm: [
        { icon: Compass, title: 'Visi', desc: 'Menjadi peneraju penyelesaian teknologi di Malaysia yang dipercayai oleh organisasi pelbagai saiz.' },
        { icon: Rocket, title: 'Misi', desc: 'Menyediakan penyelesaian teknologi yang inovatif, berkualiti dan mampu milik untuk semua organisasi.' },
        { icon: Award, title: 'Nilai', desc: 'Integriti, Inovasi, Kecemerlangan, Kerjasama, dan Komitmen terhadap kualiti.' },
    ],
    en: [
        { icon: Compass, title: 'Vision', desc: 'To be a leading and trusted technology solutions provider in Malaysia for organizations of all sizes.' },
        { icon: Rocket, title: 'Mission', desc: 'To provide innovative, high-quality, and affordable technology solutions for all organizations.' },
        { icon: Award, title: 'Values', desc: 'Integrity, Innovation, Excellence, Collaboration, and Commitment to quality.' },
    ],
};

const milestones = {
    bm: [
        { year: '2020', title: 'Penubuhan', desc: 'Laman Teknologi ditubuhkan dengan visi besar.' },
        { year: '2021', title: 'Produk Pertama', desc: 'Pelancaran LamanHR — sistem HR pertama kami.' },
        { year: '2023', title: 'Pengembangan', desc: '30+ klien aktif dan 7 produk digital.' },
        { year: '2025', title: 'Inovasi AI', desc: 'Pelancaran LamanAI untuk automasi pintar.' },
    ],
    en: [
        { year: '2020', title: 'Founded', desc: 'Laman Teknologi was established with a grand vision.' },
        { year: '2021', title: 'First Product', desc: 'Launch of LamanHR — our first HR system.' },
        { year: '2023', title: 'Expansion', desc: '30+ active clients and 7 digital products.' },
        { year: '2025', title: 'AI Innovation', desc: 'Launch of LamanAI for smart automation.' },
    ],
};

const t = {
    bm: {
        heroBadge: 'Tentang Kami',
        heroTitle: 'Mengenali',
        heroTitleGold: 'Laman Teknologi',
        teamTitle: 'Pasukan',
        teamTitleGold: 'Kami',
        teamDesc: 'Individu berdedikasi yang memacu inovasi teknologi.',
        journeyTitle: 'Perjalanan',
        journeyTitleGold: 'Kami',
        defaultAbout: 'Kami adalah syarikat teknologi yang berdedikasi untuk menyediakan penyelesaian digital terbaik bagi organisasi di Malaysia.',
    },
    en: {
        heroBadge: 'About Us',
        heroTitle: 'Getting to Know',
        heroTitleGold: 'Laman Teknologi',
        teamTitle: 'Our',
        teamTitleGold: 'Team',
        teamDesc: 'Dedicated individuals driving technological innovation.',
        journeyTitle: 'Our',
        journeyTitleGold: 'Journey',
        defaultAbout: 'We are a technology company dedicated to providing the best digital solutions for organizations in Malaysia.',
    },
};

export default function About({ team = [] }) {
    const { settings = {} } = usePage().props;
    const { lang } = useLanguage();

    const isRichText = (str) => {
        if (!str) return false;
        return str.includes('<p>') || str.includes('<div>') || str.includes('<br>') || str.includes('<h2>') || str.includes('<strong>');
    };

    const tr = t[lang] || t.bm;
    const currentValues = (values[lang] || values.bm).map((v, i) => {
        const bgImages = [
            '/storage/uploads/vision_bg.webp',
            '/storage/uploads/mission_bg.webp',
            '/storage/uploads/value_bg.webp'
        ];
        let desc = v.desc;
        if (i === 0) {
            const visionVal = lang === 'en' ? (settings.company_vision_en || settings.company_vision) : settings.company_vision;
            if (visionVal) desc = visionVal;
        }
        if (i === 1) {
            const missionVal = lang === 'en' ? (settings.company_mission_en || settings.company_mission) : settings.company_mission;
            if (missionVal) desc = missionVal;
        }
        return { ...v, desc, bg: bgImages[i] };
    });
    const getJourneyMilestones = () => {
        if (!settings.company_journey) {
            return milestones[lang] || milestones.bm;
        }

        const lines = settings.company_journey.split("\n").map(l => l.trim()).filter(Boolean);
        const parsed = lines.map(line => {
            const parts = line.split("|").map(p => p.trim());
            const year = parts[0] || '';
            let title = parts[1] || '';
            let desc = parts[2] || '';

            if (title.includes('/') && lang === 'en') {
                title = title.split('/').map(t => t.trim())[1] || title.split('/')[0].trim();
            } else if (title.includes('/')) {
                title = title.split('/').map(t => t.trim())[0];
            }

            if (desc.includes('/') && lang === 'en') {
                desc = desc.split('/').map(d => d.trim())[1] || desc.split('/')[0].trim();
            } else if (desc.includes('/')) {
                desc = desc.split('/').map(d => d.trim())[0];
            }

            return { year, title, desc };
        });

        return parsed.length > 0 ? parsed : (milestones[lang] || milestones.bm);
    };

    const currentMilestones = getJourneyMilestones();

    const companyBackground = lang === 'en' ? (settings.company_background_en || settings.company_background) : settings.company_background;
    const homepageBg = settings.homepage_background || '/storage/uploads/homepage_bg.webp';

    const getCompanyBackgroundContent = () => {
        if (!companyBackground) return null;
        
        if (isRichText(companyBackground)) {
            return {
                title: lang === 'en' ? 'Company Background' : 'Latar Belakang Laman Teknologi',
                subtitle: '',
                paragraphs: []
            };
        }
        
        const paragraphs = companyBackground.split("\n").map(p => p.trim()).filter(Boolean);
        if (paragraphs.length === 0) return null;

        const headingParagraph = paragraphs.find(p => p.startsWith("Tentang Laman Teknologi:") || p.startsWith("About Laman Teknologi:") || (p.length < 150 && p.endsWith(":")));
        const bodyParagraphs = paragraphs.filter(p => p !== headingParagraph);

        let sectionTitle = lang === 'en' ? 'Company Background' : 'Latar Belakang Laman Teknologi';
        let sectionSubtitle = '';

        if (headingParagraph) {
            const colonIdx = headingParagraph.indexOf(':');
            if (colonIdx !== -1) {
                const part1 = headingParagraph.substring(0, colonIdx).trim();
                const part2 = headingParagraph.substring(colonIdx + 1).trim();
                
                if (part1.toLowerCase() === 'tentang laman teknologi' || part1.toLowerCase() === 'about laman teknologi') {
                    sectionTitle = (
                        <>
                            {lang === 'en' ? 'Company Background' : 'Latar Belakang'} <span className="text-[var(--gold)]">Laman Teknologi</span>
                        </>
                    );
                } else {
                    sectionTitle = part1;
                }
                sectionSubtitle = part2;
            } else {
                sectionTitle = headingParagraph;
            }
        } else {
            sectionTitle = (
                <>
                    {lang === 'en' ? 'Company Background' : 'Latar Belakang'} <span className="text-[var(--gold)]">Laman Teknologi</span>
                </>
            );
        }

        return {
            title: sectionTitle,
            subtitle: sectionSubtitle,
            paragraphs: bodyParagraphs
        };
    };

    const backgroundContent = getCompanyBackgroundContent();

    const getImageUrl = (path) => {
        if (!path) return '/images/default_avatar.png';
        if (path.startsWith('http') || path.startsWith('/') || path.startsWith('data:')) {
            return path;
        }
        return `/storage/${path}`;
    };

    return (
        <PublicLayout title={lang === 'en' ? 'About Us' : 'Tentang Kami'} settings={settings}>
            {/* Hero / Latar Belakang (Company Background) */}
            <section className="relative pt-40 pb-28 overflow-hidden bg-[#080808] border-b border-white/5 z-10" style={{ clipPath: 'inset(0)' }}>
                {/* Background Ambient Glow & Grid lines & Hero Images */}
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
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-10 pointer-events-none z-0" />
                
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[60px] pointer-events-none z-0" />
                <div className="absolute top-12 left-10 w-72 h-72 rounded-full bg-[var(--gold)]/3 blur-[50px] pointer-events-none z-0" />
                <div className="absolute bottom-12 right-10 w-72 h-72 rounded-full bg-amber-500/3 blur-[50px] pointer-events-none z-0" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Heading */}
                    <div className="text-center mb-16" data-reveal="fade-up">
                        <div className="badge mb-6">{tr.heroBadge}</div>
                        {backgroundContent ? (
                            <>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                                    {isRichText(companyBackground) ? (
                                        <>
                                            {lang === 'en' ? 'Company Background' : 'Latar Belakang'} <span className="text-[var(--gold)]">Laman Teknologi</span>
                                        </>
                                    ) : (
                                        backgroundContent.title
                                    )}
                                </h2>
                                {!isRichText(companyBackground) && backgroundContent.subtitle && (
                                    <p className="text-lg sm:text-xl font-medium text-zinc-400 mt-4 max-w-2xl mx-auto leading-relaxed font-sans">
                                        {backgroundContent.subtitle}
                                    </p>
                                )}
                            </>
                        ) : (
                            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                                {tr.heroTitle} <span className="text-[var(--gold)]">{tr.heroTitleGold}</span>
                            </h1>
                        )}
                        <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent mx-auto mt-6 rounded-full" />
                    </div>

                    {/* Premium Glassmorphic Container for Paragraphs */}
                    {backgroundContent && (
                        <div className="relative p-8 sm:p-12 rounded-3xl border border-white/5 bg-[#0c0c0e]/60 backdrop-blur-md overflow-hidden shadow-2xl" data-reveal="fade-up" data-reveal-delay="200">
                            <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-[var(--gold)]/10 blur-xl pointer-events-none" />
                            <div className="absolute -bottom-12 -left-12 w-24 h-24 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />
                            
                            {isRichText(companyBackground) ? (
                                <div 
                                    className="prose prose-invert max-w-none text-zinc-300 text-base sm:text-lg leading-relaxed relative z-10 font-sans select-text"
                                    dangerouslySetInnerHTML={{ __html: companyBackground }}
                                />
                            ) : (
                                <div className="space-y-6 text-zinc-300 text-base sm:text-lg leading-relaxed text-justify relative z-10 font-sans">
                                    {backgroundContent.paragraphs.map((p, idx) => (
                                        <p key={idx} className="hover:text-zinc-200 transition-colors duration-300">
                                            {p}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Team */}
            <section className="py-28 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16" data-reveal="fade-up">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{tr.teamTitle} <span className="gold-accent">{tr.teamTitleGold}</span></h2>
                        <p className="text-gray-400 max-w-xl mx-auto">{tr.teamDesc}</p>
                    </div>
                    <div className={`grid gap-8 justify-center ${
                        team.length === 1 
                            ? 'grid-cols-1 max-w-sm mx-auto' 
                            : team.length === 2 
                                ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' 
                                : team.length === 3 
                                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto' 
                                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                    }`}>
                        {team.map((member, i) => {
                            const memberRole = (lang === 'en' && member.role_en) ? member.role_en : member.role;
                            return (
                                <div key={member.id || i} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#121214] transition-all duration-300 hover:-translate-y-2 hover:border-[var(--gold)]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]" data-reveal="fade-up" data-reveal-delay={i * 100}>
                                    <div className="aspect-[4/5] w-full overflow-hidden relative bg-[#0c0c0e]/80 flex items-center justify-center">
                                        <img
                                            src={member.media?.url || getImageUrl(member.image_path)}
                                            alt={member.name}
                                            loading="lazy"
                                            className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent opacity-20 z-10" />
                                        <div className="absolute inset-0 border border-white/5 rounded-t-2xl pointer-events-none z-20" />
                                    </div>
                                    <div className="p-6 relative z-20 -mt-8 bg-[#121214] border-t border-white/5">
                                        <h4 className="text-xl font-bold text-white mb-1 group-hover:text-[var(--gold)] transition-colors">{member.name}</h4>
                                        <p className="text-[var(--gold)] text-sm font-semibold tracking-wider uppercase mb-1">{memberRole}</p>
                                        <div className="w-8 h-px bg-[var(--gold)]/30 group-hover:w-full transition-all duration-500" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-24 bg-[#080808] border-b border-white/5 relative overflow-hidden z-10" style={{ clipPath: 'inset(0)' }}>
                {/* Background — bg-fixed static layout */}
                <div 
                    className="absolute md:fixed inset-0 bg-cover bg-center pointer-events-none z-0 opacity-55 md:opacity-45" 
                    style={{ backgroundImage: `url('${homepageBg}')` }}
                />

                {/* Warm Amber-Gold Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)]/5 via-transparent to-amber-500/10 z-0 pointer-events-none" />

                {/* Dark Overlays */}
                <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-[#080808]/75 via-[#080808]/50 to-transparent z-0 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-full lg:w-2/5 bg-gradient-to-l from-[#080808]/30 to-transparent z-0 pointer-events-none" />
                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#080808]/90 to-transparent z-0 pointer-events-none" />

                {/* Technical Line Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />

                {/* Tech Glows */}
                <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-[var(--gold)]/10 blur-[120px] pointer-events-none z-0" />
                <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20" data-reveal="fade-up">
                        <h2 className="section-title">{tr.journeyTitle} <span className="gold-accent">{tr.journeyTitleGold}</span></h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent mx-auto mt-4 rounded-full" />
                    </div>

                    <div className="relative">
                        {/* Timeline Center Line */}
                        <div className="absolute left-4 md:left-1/2 top-2 bottom-2 w-[2px] bg-gradient-to-b from-[var(--gold)] via-amber-500/30 to-transparent -translate-x-1/2 z-10" />

                        <div className="space-y-12 relative z-20">
                            {currentMilestones.map((m, i) => {
                                const isEven = i % 2 === 0;
                                return (
                                    <div 
                                        key={i} 
                                        className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`} 
                                        data-reveal="fade-up" 
                                        data-reveal-delay={i * 100}
                                    >
                                        {/* Connector point on center line */}
                                        <div className="absolute left-4 md:left-1/2 top-6 md:top-1/2 w-4 h-4 rounded-full bg-[#080808] border-2 border-[var(--gold)] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center timeline-dot-pulse">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                                        </div>

                                        {/* Card content */}
                                        <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                                            <div className="premium-timeline-card p-6 rounded-2xl group cursor-pointer">
                                                {/* Soft inner glow gradient */}
                                                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[var(--gold)]/0 via-[var(--gold)]/0 to-[var(--gold)]/0 group-hover:from-[var(--gold)]/5 group-hover:to-transparent transition-all duration-500 pointer-events-none -z-10" />
                                                
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="px-3 py-1 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/20 text-[var(--gold)] font-bold text-xs">
                                                        {m.year}
                                                    </div>
                                                    <h4 className="text-lg font-bold text-white group-hover:text-[var(--gold)] transition-colors duration-300">{m.title}</h4>
                                                </div>
                                                <p className="text-zinc-400 text-sm leading-relaxed">{m.desc}</p>
                                            </div>
                                        </div>

                                        {/* Empty spacer column for desktop */}
                                        <div className="hidden md:block w-1/2" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision, Mission, Values */}
            <section className="py-28 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className={`grid gap-8 justify-center ${
                        currentValues.length === 1 
                            ? 'grid-cols-1 max-w-md mx-auto' 
                            : currentValues.length === 2 
                                ? 'grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto' 
                                : 'grid-cols-1 md:grid-cols-3'
                    }`}>
                        {currentValues.map((v, i) => (
                            <div 
                                key={i} 
                                className="premium-glow-card p-8 rounded-2xl group cursor-pointer relative overflow-hidden min-h-[280px] flex flex-col justify-between" 
                                data-reveal="scale-in" 
                                data-reveal-delay={i * 100}
                                style={{ clipPath: 'inset(0)' }}
                            >
                                {/* Static background image inside card */}
                                <div 
                                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-20 group-hover:opacity-35 group-hover:scale-105 pointer-events-none" 
                                    style={{ 
                                        backgroundImage: `url(${v.bg})`,
                                    }} 
                                />
                                {/* Dark overlay mask */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e]/95 via-[#0c0c0e]/75 to-[#0c0c0e]/50 z-0 pointer-events-none" />

                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <div className="w-14 h-14 rounded-2xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center mb-6 group-hover:bg-[var(--gold)] group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(234,179,8,0.1)] group-hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                                            <v.icon className="w-7 h-7 text-[var(--gold)] group-hover:text-[#080808] transition-colors duration-300" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[var(--gold)] transition-colors duration-300">{v.title}</h3>
                                    </div>
                                    <p className="text-zinc-400 group-hover:text-zinc-200 transition-colors duration-300 leading-relaxed text-sm mt-2">{v.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
