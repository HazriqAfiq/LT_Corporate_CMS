import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Portfolio({ projects = [], settings = {} }) {
    return (
        <PublicLayout title="Portfolio" settings={settings}>
            <section className="pt-32 pb-20 bg-navy-gradient">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="badge mb-6">Portfolio</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Projek <span className="text-[var(--gold)]">Kami</span></h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">Projek yang telah kami siapkan untuk klien di pelbagai industri.</p>
                </div>
            </section>
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map(project => (
                            <Link key={project.id} href={`/portfolio/${project.slug}`} className="card group">
                                {project.featured_image ? (
                                    <div className="aspect-video bg-[var(--gray-100)] overflow-hidden">
                                        <img src={`/storage/${project.featured_image}`} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-[var(--gray-100)] flex items-center justify-center bg-navy-gradient">
                                        <span className="text-4xl">🖥️</span>
                                    </div>
                                )}
                                <div className="p-6">
                                    {project.category && <span className="badge text-xs mb-3 inline-block">{project.category}</span>}
                                    <h3 className="text-lg font-bold text-[var(--navy)] mb-2 group-hover:text-[var(--gold)] transition-colors">{project.title}</h3>
                                    <p className="text-[var(--gray-500)] text-sm line-clamp-2">{project.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {projects.length === 0 && <p className="text-center py-20 text-[var(--gray-400)]">Projek akan dikemaskini tidak lama lagi.</p>}
                </div>
            </section>
        </PublicLayout>
    );
}
