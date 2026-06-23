import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    MessageSquare,
    Image,
    Settings,
    Users,
    LogOut,
    Menu,
    X,
    Package,
    Check,
    Globe,
    ChevronRight,
    ChevronDown,
    User,
    FolderOpen,
    Mail,
    ShieldCheck,
    BarChart2,
    Activity,
    Database,
    Server,
    Paintbrush,
    SlidersHorizontal,
    Sun,
    Moon,
    Wrench,
    AlertTriangle,
} from 'lucide-react';
import usePermissions from '@/Hooks/usePermissions';

const NAV_GROUPS = [
    {
        label: 'Dashboard',
        items: [
            { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, permission: 'access_dashboard' },
        ],
    },
    {
        label: 'Pengurusan Kandungan',
        items: [
            { name: 'Artikel',  href: '/admin/articles', icon: FileText, permission: ['create_articles', 'edit_articles', 'delete_articles'], manageOwnModule: 'articles' },
            { name: 'Slider Utama',       href: '/admin/sliders',  icon: SlidersHorizontal, permission: ['create_sliders', 'edit_sliders', 'delete_sliders'] },
            { name: 'Pasukan Kami',       href: '/admin/team-members', icon: Users, permission: ['create_team', 'edit_team', 'delete_team'] },
            { name: 'Perpustakaan Media', href: '/admin/media',    icon: FolderOpen, permission: ['manage_media'] },
        ],
    },
    {
        label: 'Produk & Portfolio',
        items: [
            { name: 'Produk Digital',   href: '/admin/products', icon: Package, permission: ['create_products', 'edit_products', 'delete_products'] },
            { name: 'Perkhidmatan',     href: '/admin/services', icon: Wrench,  permission: ['create_services', 'edit_services', 'delete_services'] },
            { name: 'Portfolio Projek', href: '/admin/projects', icon: Briefcase, permission: ['create_projects', 'edit_projects', 'delete_projects'] },
        ],
    },
    {
        label: 'Komunikasi',
        items: [
            { name: 'Inquiry',    href: '/admin/inquiries',  icon: MessageSquare, permission: ['edit_inquiries', 'delete_inquiries'], notifyKey: 'inquiries' },
            { name: 'Newsletter', href: '/admin/newsletter', icon: Mail, permission: 'access_newsletter', notifyKey: 'newsletters' },
        ],
    },
    {
        label: 'Pengguna & Akses',
        items: [
            { name: 'Pengguna',           href: '/admin/users',  icon: Users, permission: ['create_users', 'edit_users', 'delete_users'] },
            { name: 'Roles & Permissions', href: '/admin/roles',  icon: ShieldCheck, permission: 'Super Admin Only' },
        ],
    },
    {
        label: 'SEO & Analytics',
        items: [
            { name: 'SEO',       href: '/admin/seo-settings', icon: Globe, permission: 'access_seo' },
            { name: 'Analytics', href: '/admin/analytics',    icon: BarChart2, permission: 'access_analytics' },
        ],
    },
    {
        label: 'Sistem',
        items: [
            { name: 'Log Aktiviti',    href: '/admin/activity-logs', icon: Activity, permission: 'access_activity_logs', notifyKey: 'activity_logs' },
            { name: 'Backup',          href: '/admin/backup',        icon: Database, permission: 'access_backup', notifyKey: 'backups' },
            { name: 'Maklumat Sistem', href: '/admin/system-info',   icon: Server, permission: 'access_system_info' },
        ],
    },
    {
        label: 'Tetapan',
        items: [
            { name: 'Tetapan Umum', href: '/admin/settings', icon: Settings, permission: 'access_settings' },
            { name: 'Imej & Branding', href: '/admin/branding', icon: Image, permission: 'access_branding' },
        ],
    },
];

export default function AdminLayout({ children, header }) {
    const { auth, unread_notifications } = usePage().props;
    const currentUrl = usePage().url;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [showLangDropdown, setShowLangDropdown] = useState(false);
    const [lang, setLang] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('lang') || 'bm' : 'bm'));
    const [theme, setTheme] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('theme') || 'dark' : 'dark'));

    const langRef = useRef(null);
    const userMenuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (langRef.current && !langRef.current.contains(event.target)) {
                setShowLangDropdown(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'light') {
            root.classList.add('light');
        } else {
            root.classList.remove('light');
        }
        localStorage.setItem('theme', theme);

        return () => {
            root.classList.remove('light');
        };
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    const { hasPermission, hasManageOwn, hasRole } = usePermissions();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const el = entry.target;
                if (entry.isIntersecting) {
                    const delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
                    const duration = parseInt(el.getAttribute('data-reveal-duration') || '560', 10);

                    const reveal = () => {
                        el.setAttribute('data-sr-state', 'revealing');
                        el.dataset.srRevealed = 'true';

                        setTimeout(() => {
                            el.removeAttribute('data-sr-state');
                            el.style.removeProperty('--sr-duration');
                        }, duration + 100);
                    };

                    if (delay > 0) {
                        setTimeout(reveal, delay);
                    } else {
                        reveal();
                    }

                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

        document.querySelectorAll('[data-reveal]').forEach((el) => {
            if (el.dataset.srRevealed === 'true') return;
            el.setAttribute('data-sr-state', 'hidden');
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, [currentUrl]);

    useEffect(() => {
        const storedLang = localStorage.getItem('lang') || 'bm';
        setLang(storedLang);

        const handleLangChange = () => {
            setLang(localStorage.getItem('lang') || 'bm');
        };
        window.addEventListener('languageChange', handleLangChange);

        return () => {
            window.removeEventListener('languageChange', handleLangChange);
        };
    }, []);

    const toggleLanguage = (newLang) => {
        localStorage.setItem('lang', newLang);
        setLang(newLang);
        window.dispatchEvent(new Event('languageChange'));
    };

    const NAV_GROUPS_TRANSLATIONS = {
        bm: {
            'Dashboard': 'Dashboard',
            'Pengurusan Kandungan': 'Pengurusan Kandungan',
            'Artikel': 'Artikel',
            'Slider Utama': 'Slider Utama',
            'Pasukan Kami': 'Pasukan Kami',
            'Perpustakaan Media': 'Perpustakaan Media',
            'Produk & Portfolio': 'Produk & Portfolio',
            'Produk Digital': 'Produk Digital',
            'Perkhidmatan': 'Perkhidmatan',
            'Portfolio Projek': 'Portfolio Projek',
            'Komunikasi': 'Komunikasi',
            'Inquiry': 'Inquiry',
            'Newsletter': 'Newsletter',
            'Pengguna & Akses': 'Pengguna & Akses',
            'Pengguna': 'Pengguna',
            'Roles & Permissions': 'Roles & Permissions',
            'SEO & Analytics': 'SEO & Analytics',
            'SEO': 'SEO',
            'Analytics': 'Analytics',
            'Sistem': 'Sistem',
            'Log Aktiviti': 'Log Aktiviti',
            'Backup': 'Backup',
            'Maklumat Sistem': 'Maklumat Sistem',
            'Tetapan': 'Tetapan',
            'Tetapan Website': 'Tetapan Website',
            'Tetapan Umum': 'Tetapan Umum',
            'Imej & Branding': 'Imej & Branding',
        },
        en: {
            'Dashboard': 'Dashboard',
            'Pengurusan Kandungan': 'Content Management',
            'Artikel': 'Articles',
            'Slider Utama': 'Sliders',
            'Pasukan Kami': 'Our Team',
            'Perpustakaan Media': 'Media Library',
            'Produk & Portfolio': 'Products & Portfolio',
            'Produk Digital': 'Digital Products',
            'Perkhidmatan': 'Services',
            'Portfolio Projek': 'Project Portfolio',
            'Komunikasi': 'Communication',
            'Inquiry': 'Inquiries',
            'Newsletter': 'Newsletter',
            'Pengguna & Akses': 'Users & Access',
            'Pengguna': 'Users',
            'Roles & Permissions': 'Roles & Permissions',
            'SEO & Analytics': 'SEO & Analytics',
            'SEO': 'SEO',
            'Analytics': 'Analytics',
            'Sistem': 'System',
            'Log Aktiviti': 'Activity Logs',
            'Backup': 'Backup',
            'Maklumat Sistem': 'System Info',
            'Tetapan': 'Settings',
            'Tetapan Website': 'Website Settings',
            'Tetapan Umum': 'General Settings',
            'Imej & Branding': 'Images & Branding',
        }
    };

    const layoutTranslations = {
        bm: {
            user: 'Pengguna',
            myProfile: 'Profil Saya',
            websiteSettings: 'Tetapan Website',
            logout: 'Log Keluar',
            adminPanel: 'Admin Panel',
        },
        en: {
            user: 'User',
            myProfile: 'My Profile',
            websiteSettings: 'Website Settings',
            logout: 'Logout',
            adminPanel: 'Admin Panel',
        }
    };

    const translatedNavGroups = NAV_GROUPS.map((group) => {
        const permittedItems = group.items.filter((item) => {
            return hasPermission(item.permission) || (item.manageOwnModule && hasManageOwn(item.manageOwnModule));
        }).map((item) => ({
            ...item,
            name: NAV_GROUPS_TRANSLATIONS[lang]?.[item.name] || item.name,
        }));

        return {
            label: NAV_GROUPS_TRANSLATIONS[lang]?.[group.label] || group.label,
            items: permittedItems,
        };
    }).filter((group) => group.items.length > 0);

    const lt = layoutTranslations[lang] || layoutTranslations.bm;

    const isActive = (href) => {
        if (href === '/admin/settings') {
            return currentUrl === '/admin/settings' || currentUrl.startsWith('/admin/settings?');
        }
        if (href === '/admin/branding') {
            return currentUrl === '/admin/branding' || currentUrl.startsWith('/admin/branding?');
        }
        return currentUrl.startsWith(href);
    };

    const NavItem = ({ item, onClick }) => {
        const active = isActive(item.href);
        const permitted = hasPermission(item.permission) || (item.manageOwnModule && hasManageOwn(item.manageOwnModule));
        const notificationCount = unread_notifications?.[item.notifyKey] || 0;

        if (!permitted) {
            return null;
        }

        return (
            <Link
                href={item.href}
                onClick={onClick}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300 group ${
                    active
                        ? 'bg-gradient-to-r from-[var(--gold)]/12 to-[var(--gold)]/[0.02] text-[var(--gold)] border border-[var(--gold)]/15 shadow-sm shadow-[var(--gold)]/[0.02]'
                        : 'text-zinc-400 hover:bg-white/[0.03] hover:text-white border border-transparent hover:translate-x-1'
                }`}
            >
                {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-yellow-400 to-amber-500 rounded-r-full shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                )}
                <item.icon className={`w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110 ${active ? 'text-[var(--gold)] filter drop-shadow-[0_0_2px_rgba(251,191,36,0.3)]' : 'text-zinc-500 group-hover:text-amber-400/80'}`} />
                <span className="truncate transition-colors duration-300">{item.name}</span>
                {notificationCount > 0 && !active && (
                    <span className="absolute right-3.5 w-2 h-2 rounded-full bg-[var(--gold)] shadow-[0_0_8px_rgba(251,191,36,0.7)] animate-pulse" />
                )}
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto shrink-0 text-[var(--gold)]/60 transition-transform duration-300 group-hover:translate-x-0.5" />}
            </Link>
        );
    };

    const SidebarContent = ({ onItemClick }) => (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5 shrink-0">
                <div className="relative">
                    <div className="absolute -inset-1.5 rounded-xl bg-[var(--gold)]/20 blur-md pointer-events-none animate-pulse" />
                    <div className="relative w-9 h-9 rounded-xl bg-[#080808] border border-[var(--gold)]/20 flex items-center justify-center overflow-hidden">
                        <ApplicationLogo variant="dark" className="h-7 w-7 object-contain" />
                    </div>
                </div>
                <div>
                    <p className="text-white font-bold text-sm leading-tight">Laman Teknologi</p>
                    <p className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase">Admin CMS</p>
                </div>
            </div>

            {/* Navigation groups — scrollable */}
            <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5
                [scrollbar-width:thin] [scrollbar-color:#27272a_transparent]
                [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                {translatedNavGroups.map((group) => (
                    <div key={group.label}>
                        <p className="px-3 mb-2 text-[10px] font-extrabold text-zinc-500 tracking-wider uppercase select-none flex items-center justify-between">
                            <span>{group.label}</span>
                            <span className="h-[1px] flex-1 bg-white/[0.04] ml-3" />
                        </p>
                        <div className="space-y-0.5">
                            {group.items.map((item) => (
                                <NavItem key={item.href} item={item} onClick={onItemClick} />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </div>
    );

    const isZeroPermission = auth?.user?.permissions?.length === 0 && !hasRole('Super Admin');

    if (isZeroPermission) {
        return (
            <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center p-4 relative font-sans">
                {/* Background ambient glows */}
                <div className="admin-glow-top fixed top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-yellow-500/8 to-amber-500/4 blur-[60px] lg:blur-[130px] pointer-events-none z-0" />
                <div className="admin-glow-bottom fixed bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-yellow-600/6 to-amber-600/3 blur-[50px] lg:blur-[110px] pointer-events-none z-0" />
                <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-12 pointer-events-none z-0" />

                <div className="cannot-delete-modal relative w-full max-w-md bg-[#0c0c0e] border border-white/5 rounded-3xl p-6 shadow-2xl transform transition-all z-10">
                    <div className="modal-glow absolute top-[-20%] left-[-20%] w-[200px] h-[200px] rounded-full bg-amber-500/10 blur-[80px] pointer-events-none z-0" />
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="relative mb-5 mt-2">
                            <div className="icon-badge-glow absolute -inset-2 bg-amber-500/20 rounded-full blur-md opacity-75" />
                            <div className="icon-badge-bg relative w-14 h-14 rounded-full bg-[#141416] border border-amber-500/20 flex items-center justify-center">
                                <AlertTriangle className="icon-badge-icon w-6 h-6 text-amber-500" />
                            </div>
                        </div>
                        <h3 className="text-zinc-500 text-xs font-mono tracking-widest uppercase mb-1">
                            RALAT 403
                        </h3>
                        <h3 className="modal-title text-xl font-bold text-white mb-2 leading-tight">
                            {lang === 'en' ? 'Access Denied' : 'Akses Dihalang'}
                        </h3>
                        <p className="modal-desc text-zinc-300 text-sm leading-relaxed px-2 mb-6 whitespace-pre-wrap">
                            {lang === 'en' ? 'You do not have any permissions assigned. Please contact the system administrator.' : 'Anda tidak mempunyai sebarang kebenaran yang diberikan. Sila hubungi pentadbir sistem.'}
                        </p>
                        <div className="flex w-full mt-2">
                            <button
                                type="button"
                                onClick={() => router.post('/logout')}
                                className="btn-action flex-1 inline-flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                            >
                                {lt.logout}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080808] text-white font-sans antialiased relative">
            {/* Background: ambient glows + grid only, no image */}
            <div className="admin-glow-top fixed top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-yellow-500/8 to-amber-500/4 blur-[60px] lg:blur-[130px] pointer-events-none z-0" />
            <div className="admin-glow-bottom fixed bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-yellow-600/6 to-amber-600/3 blur-[50px] lg:blur-[110px] pointer-events-none z-0" />
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-12 pointer-events-none z-0" />

            {/* Mobile sidebar overlay */}
            <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop overlay */}
                <div 
                    className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
                    onClick={() => setSidebarOpen(false)} 
                />
                
                {/* Slide-out Drawer Panel */}
                <div 
                    className={`fixed inset-y-0 left-0 w-64 bg-[#0c0c0e] border-r border-white/5 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="absolute top-4 right-4 p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/10 transition-all z-10 active:scale-95"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <SidebarContent onItemClick={() => setSidebarOpen(false)} />
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex lg:flex-col bg-[#0c0c0e] border-r border-white/5 shadow-2xl z-30">
                <SidebarContent onItemClick={undefined} />
            </div>

            {/* Main content area */}
            <div className="lg:pl-64 flex flex-col min-h-screen relative z-10">
                {/* Topbar */}
                <header className="bg-[#0c0c0e]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40 shadow-lg">
                    <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            {header && (
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-5 bg-[var(--gold)] rounded-full hidden sm:block" />
                                    <h1 className="text-base font-bold text-white truncate">{header}</h1>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-emerald-400 text-xs font-mono font-medium">LIVE</span>
                            </div>
                            
                            {/* Language Switcher Dropdown */}
                            <div className="relative" ref={langRef}>
                                <button
                                    onClick={() => setShowLangDropdown(!showLangDropdown)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all duration-200"
                                >
                                    <Globe className="w-3.5 h-3.5 text-[var(--gold)]" />
                                    <span>{lang === 'en' ? 'EN' : 'BM'}</span>
                                    <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${showLangDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                {showLangDropdown && (
                                    <div className="absolute right-0 mt-2 w-36 rounded-xl bg-[#0c0c0e] border border-white/5 shadow-2xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                                        <button
                                            onClick={() => {
                                                toggleLanguage('bm');
                                                setShowLangDropdown(false);
                                            }}
                                            className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                            <span>Bahasa Melayu</span>
                                            {lang === 'bm' && <Check className="w-3.5 h-3.5 text-[var(--gold)]" />}
                                        </button>
                                        <button
                                            onClick={() => {
                                                toggleLanguage('en');
                                                setShowLangDropdown(false);
                                            }}
                                            className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                            <span>English</span>
                                            {lang === 'en' && <Check className="w-3.5 h-3.5 text-[var(--gold)]" />}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Theme Switcher */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all backdrop-blur-md"
                                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                {theme === 'dark' ? (
                                    <Sun className="w-4 h-4 text-[var(--gold)]" />
                                ) : (
                                    <Moon className="w-4 h-4 text-zinc-400" />
                                )}
                            </button>

                            {/* User Profile Dropdown */}
                            <div className="relative pl-3 border-l border-white/10" ref={userMenuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all duration-200 text-left focus:outline-none"
                                >
                                    <div className="w-7 h-7 rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/30 flex items-center justify-center shrink-0 overflow-hidden">
                                        {auth?.user?.avatar_url ? (
                                            <img src={auth.user.avatar_url} alt={auth.user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-[var(--gold)] text-xs font-bold">
                                                {(auth?.user?.name || 'A').charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-xs font-bold text-white leading-none mb-0.5">
                                            {auth?.user?.name || 'Admin'}
                                        </p>
                                        <p className="text-[9px] text-zinc-500 font-mono tracking-wide leading-none">
                                            {auth?.user?.roles?.[0] || 'Super Admin'}
                                        </p>
                                    </div>
                                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500 transition-transform duration-200" style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'none' }} />
                                </button>

                                {/* Dropdown Menu */}
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0c0c0e] border border-white/5 shadow-2xl z-50 py-2 overflow-hidden origin-top-right animate-in fade-in slide-in-from-top-1 duration-150">
                                        <div className="px-4 py-2.5 border-b border-white/5">
                                            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold font-mono mb-1">{lt.user}</p>
                                            <p className="text-sm font-bold text-white truncate">{auth?.user?.name || 'Admin'}</p>
                                            <p className="text-xs text-zinc-400 truncate">{auth?.user?.email || ''}</p>
                                        </div>
                                        
                                        <Link
                                            href={route('profile.edit')}
                                            onClick={() => setUserMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                            <User className="w-4 h-4 text-zinc-500" />
                                            {lt.myProfile}
                                        </Link>
                                        
                                        <Link
                                            href="/admin/settings"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                            <Settings className="w-4 h-4 text-zinc-500" />
                                            {lt.websiteSettings}
                                        </Link>
                                        
                                        <div className="h-px bg-white/5 my-1.5" />
                                        
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            {lt.logout}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>

                <footer className="px-8 py-4 border-t border-white/5 text-center">
                    <p className="text-zinc-600 text-xs font-mono">
                        © {new Date().getFullYear()} Laman Teknologi · {lt.adminPanel}
                    </p>
                </footer>
            </div>
        </div>
    );
}
