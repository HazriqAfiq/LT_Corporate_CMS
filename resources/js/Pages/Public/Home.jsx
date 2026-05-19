import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

const services = [
    { icon: '🖥️', title: 'Pembangunan Sistem', desc: 'Sistem web dan mobile yang dibina khas untuk keperluan organisasi anda.' },
    { icon: '🎨', title: 'Rekabentuk UI/UX', desc: 'Antara muka pengguna yang moden, mesra dan profesional.' },
    { icon: '☁️', title: 'Cloud & Hosting', desc: 'Infrastruktur awan yang selamat, pantas dan boleh dipercayai.' },
    { icon: '🤖', title: 'AI & Automasi', desc: 'Penyelesaian kecerdasan buatan untuk automasi proses perniagaan.' },
    { icon: '📱', title: 'Aplikasi Mudah Alih', desc: 'Aplikasi iOS dan Android yang responsif and berprestasi tinggi.' },
    { icon: '🔒', title: 'Keselamatan Siber', desc: 'Perlindungan data dan sistem daripada ancaman siber.' },
];

export default function Home({ sliders = [], featuredProducts = [], featuredProjects = [], latestArticles = [], settings = {} }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (sliders.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sliders.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [sliders.length]);

    const slider = sliders[currentSlide];

    return (
        <PublicLayout title="Utama" settings={settings}>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundImage: "url('/storage/digital_kl_bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                {/* Dark Overlay for Readability (Left to Right) */}
                <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#040914]/80 via-[#040914]/40 to-transparent z-0"></div>
                {/* Dark Overlay for Readability (Right to Left) */}
                <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#040914]/80 to-transparent z-0"></div>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-[var(--gold)] blur-[120px]" />
                    <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-blue-500 blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        {/* Left Column (Text) */}
                        <div>
                            <div key={`text-${currentSlide}`} className="fade-up lg:min-h-[300px]">
                                <div className="badge mb-6">🚀 Teknologi Untuk Organisasi</div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                                    {slider?.title || 'Penyelesaian Teknologi'}{' '}
                                    <span className="text-[var(--gold)]">
                                        {slider?.subtitle || 'Untuk Organisasi Anda'}
                                    </span>
                                </h1>
                                <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-lg">
                                    {slider?.description || 'Kami membantu organisasi anda berkembang melalui teknologi moden, sistem pintar, dan penyelesaian digital yang inovatif untuk masa depan yang lebih efisien.'}
                                </p>
                            </div>

                            <div className="fade-up" style={{ animationDelay: '0.2s' }}>
                                <div className="flex flex-wrap gap-4 mb-8">
                                    <Link href="/hubungi-kami" className="btn-primary text-base px-8 py-4 flex items-center gap-2">
                                        Mulakan Sekarang <span className="text-xl">→</span>
                                    </Link>
                                    <Link href="/produk" className="btn-outline text-base px-8 py-4 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                        Lihat Produk
                                    </Link>
                                </div>

                                {/* Features Checklist */}
                                <div className="flex flex-wrap gap-6 text-sm text-gray-400 mt-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[var(--gold)]">✓</span> Teknologi Terkini
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[var(--gold)]">✓</span> Penyelesaian Selamat
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[var(--gold)]">✓</span> Sokongan 24/7
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column (Image) */}
                        <div key={`image-${currentSlide}`} className="hidden lg:block fade-up" style={{ animationDelay: '0.2s' }}>
                            <div className="relative group">
                                {/* Glow Effect Behind */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--gold)] to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                
                                <div className="relative w-full aspect-[4/3] rounded-3xl bg-[#040914] border border-white/10 overflow-hidden">
                                    {slider?.image ? (
                                        <img src={`/storage/${slider.image}`} alt={slider.title} className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <img src="/storage/hero_laptop_city.png" alt="Laman Teknologi" className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105" />
                                    )}
                                </div>

                                {/* Floating Badges */}
                                <div className="absolute -bottom-4 -left-4 bg-[#040914]/90 backdrop-blur-md border border-white/10 rounded-xl px-6 py-4 shadow-xl">
                                    <div className="text-[var(--gold)] font-bold text-lg">99.9%</div>
                                    <div className="text-white/70 text-xs">Uptime Terjamin</div>
                                </div>
                                <div className="absolute -top-4 -right-4 bg-[#040914]/90 backdrop-blur-md border border-white/10 rounded-xl px-6 py-4 shadow-xl">
                                    <div className="text-green-400 font-bold text-lg">24/7</div>
                                    <div className="text-white/70 text-xs">Sokongan Teknikal</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="mt-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                                <svg className="w-6 h-6 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">50+</div>
                                <div className="text-gray-400 text-xs">Projek Siap</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                                <svg className="w-6 h-6 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">30+</div>
                                <div className="text-gray-400 text-xs">Klien Aktif</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                                <svg className="w-6 h-6 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 11m8 4v10l-8-4m0-10v10"></path></svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">7</div>
                                <div className="text-gray-400 text-xs">Produk Digital</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                                <svg className="w-6 h-6 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.381-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"></path></svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">99.9%</div>
                                <div className="text-gray-400 text-xs">Uptime Terjamin</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-24 bg-[var(--gray-50)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="badge mb-4">Perkhidmatan Kami</div>
                        <h2 className="section-title">Penyelesaian Digital <span className="gold-accent">Menyeluruh</span></h2>
                        <p className="section-subtitle">Kami menyediakan rangkaian perkhidmatan teknologi yang lengkap untuk memenuhi keperluan organisasi anda.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((svc, i) => (
                            <div key={i} className="card p-8 text-center group cursor-pointer" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300">{svc.icon}</div>
                                <h3 className="text-lg font-bold text-[var(--navy)] mb-3">{svc.title}</h3>
                                <p className="text-[var(--gray-500)] text-sm leading-relaxed">{svc.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Section */}
            {featuredProducts.length > 0 && (
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <div className="badge mb-4">Produk Digital</div>
                            <h2 className="section-title">Produk <span className="gold-accent">Pilihan Kami</span></h2>
                            <p className="section-subtitle">Penyelesaian perisian yang siap digunakan untuk pelbagai keperluan organisasi.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredProducts.map(product => (
                                <Link key={product.id} href={`/produk/${product.slug}`} className="card group">
                                    <div className="p-8">
                                        <div className="w-14 h-14 rounded-xl bg-[var(--gold)]/10 flex items-center justify-center text-2xl mb-6 group-hover:bg-[var(--gold)] group-hover:text-[var(--navy)] transition-all duration-300">
                                            💡
                                        </div>
                                        <h3 className="text-xl font-bold text-[var(--navy)] mb-3">{product.name}</h3>
                                        <p className="text-[var(--gray-500)] text-sm leading-relaxed mb-6">{product.description}</p>
                                        {product.features && (
                                            <div className="flex flex-wrap gap-2">
                                                {(Array.isArray(product.features) ? product.features : []).slice(0, 3).map((f, i) => (
                                                    <span key={i} className="text-xs bg-[var(--gray-100)] text-[var(--gray-600)] px-3 py-1 rounded-full">{f}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <Link href="/produk" className="btn-navy px-8 py-4">Lihat Semua Produk →</Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Portfolio Section */}
            {featuredProjects.length > 0 && (
                <section className="py-24 bg-navy-gradient">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <div className="badge mb-4">Portfolio</div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Projek <span className="text-[var(--gold)]">Terbaik Kami</span></h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">Lihat projek-projek yang telah kami siapkan untuk klien kami.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {featuredProjects.map(project => (
                                <Link key={project.id} href={`/portfolio/${project.slug}`} className="card-dark group">
                                    <div className="p-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            {project.category && <span className="badge text-xs">{project.category}</span>}
                                            {project.client && <span className="text-gray-500 text-xs">• {project.client}</span>}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[var(--gold)] transition-colors">{project.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-4">{project.description}</p>
                                        {project.technologies && (
                                            <div className="flex flex-wrap gap-2">
                                                {(Array.isArray(project.technologies) ? project.technologies : []).slice(0, 4).map((t, i) => (
                                                    <span key={i} className="text-xs bg-white/5 text-gray-400 px-3 py-1 rounded-full border border-white/10">{t}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <Link href="/portfolio" className="btn-outline px-8 py-4">Lihat Semua Portfolio →</Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Articles Section */}
            {latestArticles.length > 0 && (
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <div className="badge mb-4">Artikel & Berita</div>
                            <h2 className="section-title">Berita <span className="gold-accent">Terkini</span></h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {latestArticles.map(article => (
                                <Link key={article.id} href={`/artikel/${article.slug}`} className="card group">
                                    {article.featured_image && (
                                        <div className="aspect-video bg-[var(--gray-100)] overflow-hidden">
                                            <img src={`/storage/${article.featured_image}`} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        {article.category && <span className="badge text-xs mb-3 inline-block">{article.category}</span>}
                                        <h3 className="text-lg font-bold text-[var(--navy)] mb-2 group-hover:text-[var(--gold)] transition-colors line-clamp-2">{article.title}</h3>
                                        <p className="text-[var(--gray-500)] text-sm line-clamp-2 mb-4">{article.excerpt}</p>
                                        <div className="flex items-center justify-between text-xs text-[var(--gray-400)]">
                                            <span>{article.author_name}</span>
                                            <span>{article.published_at ? new Date(article.published_at).toLocaleDateString('ms-MY') : ''}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
