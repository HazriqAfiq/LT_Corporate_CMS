import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const navLinks = [
    { name: 'Utama', href: '/' },
    { name: 'Tentang Kami', href: '/tentang-kami' },
    { name: 'Perkhidmatan', href: '/perkhidmatan' },
    { name: 'Produk', href: '/produk' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Artikel', href: '/artikel' },
    { name: 'Hubungi Kami', href: '/hubungi-kami' },
];

export default function Navbar() {
    const { url } = usePage();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[var(--navy)]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-lg bg-[var(--gold)] flex items-center justify-center font-bold text-[var(--navy)] text-lg transition-transform group-hover:scale-110">
                            LT
                        </div>
                        <div className="hidden sm:block">
                            <span className="block text-white font-bold text-sm leading-tight">Laman</span>
                            <span className="block text-[var(--gold)] font-bold text-sm leading-tight">Teknologi</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`nav-link ${url === link.href ? 'text-[var(--gold)] active' : 'text-gray-300 hover:text-white'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="hidden lg:flex items-center gap-4">
                        <Link href="/hubungi-kami" className="btn-primary text-xs px-5 py-2.5">
                            Minta Sebut Harga
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden text-white p-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <div className="bg-[var(--navy)] border-t border-white/10 px-4 py-4 space-y-2">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                url === link.href
                                    ? 'bg-[var(--gold)]/10 text-[var(--gold)]'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link href="/hubungi-kami" className="btn-primary w-full text-center mt-4 block">
                        Minta Sebut Harga
                    </Link>
                </div>
            </div>
        </nav>
    );
}
