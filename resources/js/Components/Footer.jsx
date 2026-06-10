import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { MapPin, Mail, Phone, Globe } from 'lucide-react';
import useLanguage from '@/Hooks/useLanguage';

const footerLinks = {
    bm: {
        syarikat: {
            title: 'Syarikat',
            links: [
                { name: 'Tentang Kami', href: '/tentang-kami' },
                { name: 'Perkhidmatan', href: '/perkhidmatan' },
                { name: 'Portfolio', href: '/portfolio' },
                { name: 'Kerjaya', href: '#' },
            ],
        },
        produk: {
            title: 'Produk',
            links: [
                { name: 'LamanHR', href: '/produk/lamanhr' },
                { name: 'LamanAI', href: '/produk/lamanai' },
                { name: 'LamanCRM', href: '/produk/lamancrm' },
                { name: 'LamanSupport', href: '/produk/lamansupport' },
            ],
        },
        sumber: {
            title: 'Sumber',
            links: [
                { name: 'Artikel', href: '/artikel' },
                { name: 'Hubungi Kami', href: '/hubungi-kami' },
                { name: 'Sitemap Visual', href: '/peta-laman' },
                { name: 'Dasar Privasi', href: '/dasar-privasi' },
                { name: 'Terma & Syarat', href: '/terma-syarat' },
            ],
        },
    },
    en: {
        syarikat: {
            title: 'Company',
            links: [
                { name: 'About Us', href: '/tentang-kami' },
                { name: 'Services', href: '/perkhidmatan' },
                { name: 'Portfolio', href: '/portfolio' },
                { name: 'Careers', href: '#' },
            ],
        },
        produk: {
            title: 'Products',
            links: [
                { name: 'LamanHR', href: '/produk/lamanhr' },
                { name: 'LamanAI', href: '/produk/lamanai' },
                { name: 'LamanCRM', href: '/produk/lamancrm' },
                { name: 'LamanSupport', href: '/produk/lamansupport' },
            ],
        },
        sumber: {
            title: 'Resources',
            links: [
                { name: 'Articles', href: '/artikel' },
                { name: 'Contact Us', href: '/hubungi-kami' },
                { name: 'Sitemap', href: '/peta-laman' },
                { name: 'Privacy Policy', href: '/dasar-privasi' },
                { name: 'Terms & Conditions', href: '/terma-syarat' },
            ],
        },
    },
};

export default function Footer() {
    const { settings = {} } = usePage().props;
    const { lang } = useLanguage();

    const links = footerLinks[lang] || footerLinks.bm;

    return (
        <footer className="bg-[#080808]/80 backdrop-blur-md border-t border-zinc-800/50 text-white relative z-10">
            {/* Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2" data-reveal="fade-left">
                        <div className="flex items-center gap-3 mb-6 group relative">
                            <div className="relative transition-all duration-500 ease-out group-hover:scale-105 flex items-center">
                                <div className="relative">
                                    {/* Removed animate-pulse — was causing constant GPU repaint */}
                                    <ApplicationLogo
                                        variant="footer"
                                        className="
                                            relative z-10
                                            w-[45px] h-[45px] object-contain
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
                        </div>

                        <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-sm font-sans">
                            {(lang === 'en' ? (settings.company_about_en || settings.company_about) : settings.company_about) || (lang === 'en'
                                ? 'The leading technology solutions provider for organizations. We help businesses grow through digital innovation.'
                                : 'Penyedia penyelesaian teknologi terbaik untuk organisasi anda. Kami membantu perniagaan berkembang melalui inovasi digital.')}
                        </p>
                        {(lang === 'en' ? (settings.contact_address_en || settings.contact_address) : settings.contact_address) && (
                            <p className="text-gray-500 text-xs mb-6 flex items-start gap-2 max-w-sm font-sans leading-relaxed">
                                <MapPin className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
                                <span>{lang === 'en' ? (settings.contact_address_en || settings.contact_address) : settings.contact_address}</span>
                            </p>
                        )}
                        <div className="flex gap-3">
                            {['facebook', 'instagram', 'linkedin', 'twitter', 'tiktok'].map(social => {
                                const renderIcon = (name, className) => {
                                    switch (name) {
                                        case 'facebook':
                                            return (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                                </svg>
                                            );
                                        case 'instagram':
                                            return (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                                </svg>
                                            );
                                        case 'linkedin':
                                            return (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                                    <rect width="4" height="12" x="2" y="9" />
                                                    <circle cx="4" cy="4" r="2" />
                                                </svg>
                                            );
                                        case 'twitter':
                                            return (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                                </svg>
                                            );
                                        case 'tiktok':
                                            return (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                                                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                                </svg>
                                            );
                                        default:
                                            return <Globe className={className} />;
                                    }
                                };
                                return (
                                    <a
                                        key={social}
                                        href={settings[`social_${social}`] || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[var(--gold)] hover:text-[var(--navy)] hover:border-[var(--gold)] transition-all duration-300 shadow-md hover:scale-105"
                                        title={social.toUpperCase()}
                                    >
                                        {renderIcon(social, "w-4.5 h-4.5")}
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.values(links).map((section, sectionIdx) => (
                        <div key={section.title} data-reveal="fade-up" data-reveal-delay={sectionIdx * 100}>
                            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">{section.title}</h4>
                            <ul className="space-y-3">
                                {section.links.map(link => (
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
            <div className="border-t border-zinc-800/50" data-reveal="fade-in" data-reveal-delay="150">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                        <p>
                            {(lang === 'en' ? (settings.footer_text_en || settings.footer_text) : settings.footer_text) || '© 2026 Laman Teknologi Sdn. Bhd. Hak Cipta Terpelihara.'}
                            {settings.company_registration && ` (${settings.company_registration})`}
                        </p>
                        <div className="flex flex-wrap gap-6 items-center">
                            {settings.contact_email && (
                                <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-1.5 hover:text-[var(--gold)] text-gray-500 transition-colors">
                                    <Mail className="w-4 h-4 text-[var(--gold)]" />
                                    <span>{settings.contact_email}</span>
                                </a>
                            )}
                            {settings.contact_phone && (
                                <span className="flex items-center gap-1.5 text-gray-500">
                                    <Phone className="w-4 h-4 text-[var(--gold)]" />
                                    <span>{settings.contact_phone}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

