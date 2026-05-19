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
            <section className="pt-32 pb-20 bg-navy-gradient">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/portfolio" className="text-gray-400 hover:text-[var(--gold)] text-sm mb-6 inline-block">← Kembali ke Portfolio</Link>
                    <div className="badge mb-6">{project.category || 'Projek'}</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{project.title}</h1>
                    <p className="text-gray-400 text-lg max-w-3xl">{project.description}</p>
                    <div className="flex flex-wrap gap-3 mt-6">
                        {techs.map((t, i) => <span key={i} className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full border border-white/10">{t}</span>)}
                    </div>
                    {project.client && <p className="mt-6 text-[var(--gold)] font-medium">Klien: {project.client}</p>}
                </div>
            </section>
            {project.content && (
                <section className="py-24">
                    <div className="max-w-4xl mx-auto px-4"><div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: project.content }} /></div>
                </section>
            )}
            {project.testimonial && (
                <section className="py-20 bg-[var(--gray-50)]">
                    <div className="max-w-3xl mx-auto px-4 text-center">
                        <p className="text-xl italic text-[var(--navy)] mb-4">"{project.testimonial}"</p>
                        {project.testimonial_author && <p className="text-[var(--gold)] font-semibold">— {project.testimonial_author}</p>}
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
