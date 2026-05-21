import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function PortfolioDetail({ project, settings = {} }) {
    const techs = Array.isArray(project.technologies) ? project.technologies : [];
    return (
        <PublicLayout 
            title={project.seo_title || project.title} 
            description={project.seo_description || project.description}
            keywords={Array.isArray(project.technologies) ? project.technologies.join(', ') : ''}
            settings={settings}
        >
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

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href="/portfolio" className="text-gray-400 hover:text-[var(--gold)] text-sm mb-6 inline-block transition-colors">← Kembali ke Portfolio</Link>
                    <div className="badge mb-6">{project.category || 'Projek'}</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{project.title}</h1>
                    <p className="text-gray-300 text-lg max-w-3xl leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-3 mt-6">
                        {techs.map((t, i) => (
                            <span key={i} className="text-xs bg-white/5 text-gray-300 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                                {t}
                            </span>
                        ))}
                    </div>
                    {project.client && <p className="mt-6 text-[var(--gold)] font-medium">Klien: {project.client}</p>}
                </div>
            </section>

            {/* Content Section (Charcoal section with centered glow & gold divider lines) */}
            {project.content && (
                <section className="py-24 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                    {/* Soft top-centered amber radial glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                    
                    {/* Gold Accent Divider Lines */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

                    <div className="max-w-4xl mx-auto px-4 relative z-10">
                        <div className="prose prose-lg max-w-none prose-invert prose-headings:text-white prose-a:text-[var(--gold)]" dangerouslySetInnerHTML={{ __html: project.content }} />
                    </div>
                </section>
            )}

            {/* Testimonial Section (Deep Charcoal / Black) */}
            {project.testimonial && (
                <section className="py-20 relative bg-[#080808] border-b border-white/5 z-10 overflow-hidden">
                    <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
                        {/* Quote icon/mark */}
                        <div className="text-5xl text-[var(--gold)]/20 mb-6 font-serif">“</div>
                        <p className="text-xl md:text-2xl italic text-gray-200 mb-6 leading-relaxed">"{project.testimonial}"</p>
                        {project.testimonial_author && <p className="text-[var(--gold)] font-semibold tracking-wider">— {project.testimonial_author}</p>}
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
