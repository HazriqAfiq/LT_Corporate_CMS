import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

const footerLinks = {
    syarikat: [
        { name: 'Tentang Kami', href: '/tentang-kami' },
        { name: 'Perkhidmatan', href: '/perkhidmatan' },
        { name: 'Portfolio', href: '/portfolio' },
        { name: 'Kerjaya', href: '#' },
    ],
    produk: [
        { name: 'LamanHR', href: '/produk/lamanhr' },
        { name: 'LamanAI', href: '/produk/lamanai' },
        { name: 'LamanCRM', href: '/produk/lamancrm' },
        { name: 'LamanSupport', href: '/produk/lamansupport' },
    ],
    sumber: [
        { name: 'Artikel', href: '/artikel' },
        { name: 'Hubungi Kami', href: '/hubungi-kami' },
        { name: 'Sitemap Visual', href: '/peta-laman' },
        { name: 'Dasar Privasi', href: '/dasar-privasi' },
        { name: 'Terma & Syarat', href: '/terma-syarat' },
    ],
};

export default function Footer({ settings = {} }) {
    return (
        <footer className="bg-[#080808]/80 backdrop-blur-md border-t border-zinc-800/50 text-white relative z-10">
            {/* CTA Banner */}
            <div className="border-b border-zinc-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Bersedia Untuk <span className="text-[var(--gold)]">Transformasi Digital?</span>
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto mb-8">
                        Hubungi kami hari ini untuk mendapatkan penyelesaian teknologi terbaik untuk organisasi anda.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/hubungi-kami" className="btn-primary">
                            Hubungi Kami Sekarang
                        </Link>
                        <Link href="/produk" className="btn-outline">
                            Lihat Produk Kami
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6 group relative">
                            <div className="relative transition-all duration-500 ease-out group-hover:scale-105">
                                {/* Subtle Glow Behind Logo */}
                                <div className="absolute inset-0 bg-white/5 blur-xl scale-110 rounded-full animate-pulse pointer-events-none" />
                                
                                <ApplicationLogo
                                    className="
                                        relative z-10
                                        w-[100px] h-[60px] object-contain
                                        transition-all duration-500 ease-out
                                        group-hover:brightness-110
                                        filter
                                        drop-shadow-[0_0_3px_rgba(255,255,255,0.7)]
                                        drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]
                                        group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]
                                    "
                                />
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                            {settings.company_about || 'Penyedia penyelesaian teknologi terbaik untuk organisasi anda. Kami membantu perniagaan berkembang melalui inovasi digital.'}
                        </p>
                        <div className="flex gap-3">
                            {['facebook', 'instagram', 'linkedin', 'twitter'].map(social => (
                                <a
                                    key={social}
                                    href={settings[`social_${social}`] || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[var(--gold)] hover:text-[var(--navy)] hover:border-[var(--gold)] transition-all duration-300"
                                >
                                    <span className="text-xs font-bold uppercase">{social[0]}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">{title}</h4>
                            <ul className="space-y-3">
                                {links.map(link => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-gray-400 text-sm hover:text-[var(--gold)] transition-colors duration-200">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-zinc-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                        <p>{settings.footer_text || '© 2026 Laman Teknologi Sdn. Bhd. Hak Cipta Terpelihara.'}</p>
                        <div className="flex gap-6">
                            <a href={`mailto:${settings.contact_email || 'info@lamanteknologi.com'}`} className="hover:text-[var(--gold)] transition-colors">
                                {settings.contact_email || 'info@lamanteknologi.com'}
                            </a>
                            <span className="hover:text-[var(--gold)] transition-colors">
                                {settings.contact_phone || '+60-123456789'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
