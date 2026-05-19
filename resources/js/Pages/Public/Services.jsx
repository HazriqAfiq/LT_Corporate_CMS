import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

const services = [
    { icon: '🖥️', title: 'Pembangunan Sistem Web', desc: 'Sistem web korporat, e-dagang, portal dalaman dan aplikasi web progressif (PWA) yang dibina khas menggunakan teknologi terkini.', features: ['Laravel & React', 'API Integration', 'Real-time Dashboard', 'Scalable Architecture'] },
    { icon: '📱', title: 'Pembangunan Aplikasi Mudah Alih', desc: 'Aplikasi iOS dan Android yang responsif menggunakan Flutter atau React Native untuk pengalaman pengguna yang lancar.', features: ['Cross-platform', 'Push Notifications', 'Offline Support', 'App Store Publishing'] },
    { icon: '🎨', title: 'Rekabentuk UI/UX', desc: 'Rekabentuk antara muka pengguna yang moden, intuitif dan menarik menggunakan prinsip design thinking.', features: ['User Research', 'Wireframing', 'Prototyping', 'Design System'] },
    { icon: '☁️', title: 'Cloud & Hosting', desc: 'Infrastruktur awan yang selamat dan berprestasi tinggi untuk aplikasi kritikal perniagaan anda.', features: ['AWS & Azure', '99.9% Uptime', 'Auto Scaling', 'Daily Backup'] },
    { icon: '🤖', title: 'AI & Automasi', desc: 'Penyelesaian kecerdasan buatan termasuk chatbot, analitik ramalan dan automasi proses.', features: ['NLP Processing', 'Machine Learning', 'Chatbot AI', 'Data Analytics'] },
    { icon: '🔒', title: 'Keselamatan Siber', desc: 'Perlindungan menyeluruh terhadap ancaman siber termasuk audit keselamatan dan pemantauan.', features: ['Security Audit', 'Penetration Testing', 'SSL Certificate', '24/7 Monitoring'] },
    { icon: '📊', title: 'Business Intelligence', desc: 'Analitik data dan papan pemuka pintar untuk membantu membuat keputusan perniagaan yang lebih baik.', features: ['Custom Dashboard', 'Data Visualization', 'Automated Reports', 'KPI Tracking'] },
    { icon: '🔧', title: 'Sokongan & Penyelenggaraan', desc: 'Perkhidmatan sokongan teknikal berterusan untuk memastikan sistem anda sentiasa optimum.', features: ['24/7 Support', 'Bug Fixes', 'Performance Tuning', 'Version Updates'] },
];

export default function Services({ settings = {} }) {
    return (
        <PublicLayout title="Perkhidmatan" settings={settings}>
            <section className="pt-32 pb-20 bg-navy-gradient relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute bottom-20 left-40 w-80 h-80 rounded-full bg-[var(--gold)] blur-[100px]" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="badge mb-6">Perkhidmatan</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Apa Yang <span className="text-[var(--gold)]">Kami Tawarkan</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">Perkhidmatan teknologi menyeluruh dari konsep hingga pelaksanaan.</p>
                </div>
            </section>

            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {services.map((svc, i) => (
                            <div key={i} className="card p-8 group">
                                <div className="flex gap-6">
                                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[var(--gold)]/10 flex items-center justify-center text-2xl group-hover:bg-[var(--gold)] group-hover:scale-110 transition-all duration-300">{svc.icon}</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[var(--navy)] mb-3">{svc.title}</h3>
                                        <p className="text-[var(--gray-500)] text-sm leading-relaxed mb-4">{svc.desc}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {svc.features.map((f, j) => (
                                                <span key={j} className="text-xs bg-[var(--gray-100)] text-[var(--gray-600)] px-3 py-1 rounded-full">{f}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-[var(--gray-50)]">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="section-title">Perlukan Penyelesaian <span className="gold-accent">Khas?</span></h2>
                    <p className="section-subtitle mb-8">Setiap organisasi unik. Beritahu kami keperluan anda dan kami akan menyediakan penyelesaian yang terbaik.</p>
                    <Link href="/hubungi-kami" className="btn-primary px-10 py-4 text-base">Hubungi Kami →</Link>
                </div>
            </section>
        </PublicLayout>
    );
}
