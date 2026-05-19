import PublicLayout from '@/Layouts/PublicLayout';

const values = [
    { icon: '🎯', title: 'Visi', desc: 'Menjadi peneraju penyelesaian teknologi di Malaysia yang dipercayai oleh organisasi pelbagai saiz.' },
    { icon: '🚀', title: 'Misi', desc: 'Menyediakan penyelesaian teknologi yang inovatif, berkualiti dan mampu milik untuk semua organisasi.' },
    { icon: '💎', title: 'Nilai', desc: 'Integriti, Inovasi, Kecemerlangan, Kerjasama, dan Komitmen terhadap kualiti.' },
];

const team = [
    { name: 'Ahmad Razif', role: 'CEO & Founder', emoji: '👨‍💼' },
    { name: 'Nurul Aisyah', role: 'CTO', emoji: '👩‍💻' },
    { name: 'Muhammad Hafiz', role: 'Lead Developer', emoji: '👨‍💻' },
    { name: 'Siti Aminah', role: 'UI/UX Designer', emoji: '👩‍🎨' },
];

const milestones = [
    { year: '2020', title: 'Penubuhan', desc: 'Laman Teknologi ditubuhkan dengan visi besar.' },
    { year: '2021', title: 'Produk Pertama', desc: 'Pelancaran LamanHR — sistem HR pertama kami.' },
    { year: '2023', title: 'Pengembangan', desc: '30+ klien aktif dan 7 produk digital.' },
    { year: '2025', title: 'Inovasi AI', desc: 'Pelancaran LamanAI untuk automasi pintar.' },
];

export default function About({ settings = {} }) {
    return (
        <PublicLayout title="Tentang Kami" settings={settings}>
            {/* Hero */}
            <section className="pt-32 pb-20 bg-navy-gradient relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 right-40 w-80 h-80 rounded-full bg-[var(--gold)] blur-[100px]" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="badge mb-6">Tentang Kami</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Mengenali <span className="text-[var(--gold)]">Laman Teknologi</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        {settings.company_about || 'Kami adalah syarikat teknologi yang berdedikasi untuk menyediakan penyelesaian digital terbaik bagi organisasi di Malaysia.'}
                    </p>
                </div>
            </section>

            {/* Vision, Mission, Values */}
            <section className="py-24 bg-[var(--gray-50)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((v, i) => (
                            <div key={i} className="card p-8 text-center">
                                <div className="text-4xl mb-5">{v.icon}</div>
                                <h3 className="text-xl font-bold text-[var(--navy)] mb-4">{v.title}</h3>
                                <p className="text-[var(--gray-500)] leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-24">
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
                                    <h4 className="text-lg font-bold text-[var(--navy)] mb-1">{m.title}</h4>
                                    <p className="text-[var(--gray-500)]">{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-24 bg-navy-gradient">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pasukan <span className="text-[var(--gold)]">Kami</span></h2>
                        <p className="text-gray-400 max-w-xl mx-auto">Individu berdedikasi yang memacu inovasi teknologi.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((t, i) => (
                            <div key={i} className="card-dark p-8 text-center group">
                                <div className="w-20 h-20 mx-auto rounded-full bg-[var(--gold)]/10 flex items-center justify-center text-4xl mb-5 group-hover:bg-[var(--gold)]/20 transition-colors">{t.emoji}</div>
                                <h4 className="text-white font-bold mb-1">{t.name}</h4>
                                <p className="text-[var(--gold)] text-sm">{t.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
