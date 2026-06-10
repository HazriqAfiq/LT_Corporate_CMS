import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
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
} from 'lucide-react';
import usePermissions from '@/Hooks/usePermissions';

const NAV_GROUPS = [
    {
        label: 'Dashboard',
        items: [
            { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, permission: 'view_dashboard' },
        ],
    },
    {
        label: 'Pengurusan Kandungan',
        items: [
            { name: 'Artikel',  href: '/admin/articles', icon: FileText, permission: 'view_articles', manageOwnModule: 'articles' },
            { name: 'Slider Utama',       href: '/admin/sliders',  icon: SlidersHorizontal, permission: 'view_sliders' },
            { name: 'Pasukan Kami',       href: '/admin/team-members', icon: Users, permission: 'view_sliders' },
            { name: 'Perpustakaan Media', href: '/admin/media',    icon: FolderOpen, permission: 'view_media' },
        ],
    },
    {
        label: 'Produk & Portfolio',
        items: [
            { name: 'Produk Digital',   href: '/admin/products', icon: Package, permission: 'view_products' },
            { name: 'Perkhidmatan',     href: '/admin/services', icon: Wrench,  permission: 'view_services' },
            { name: 'Portfolio Projek', href: '/admin/projects', icon: Briefcase, permission: 'view_projects' },
        ],
    },
    {
        label: 'Komunikasi',
        items: [
            { name: 'Inquiry',    href: '/admin/inquiries',  icon: MessageSquare, permission: 'view_inquiries', notifyKey: 'inquiries' },
            { name: 'Newsletter', href: '/admin/newsletter', icon: Mail, permission: 'view_inquiries', notifyKey: 'newsletters' },
        ],
    },
    {
        label: 'Pengguna & Akses',
        items: [
            { name: 'Pengguna',           href: '/admin/users',  icon: Users, permission: 'view_users' },
            { name: 'Roles & Permissions', href: '/admin/roles',  icon: ShieldCheck, permission: 'view_users' },
        ],
    },
    {
        label: 'SEO & Analytics',
        items: [
            { name: 'SEO',       href: '/admin/seo-settings', icon: Globe, permission: 'view_settings' },
            { name: 'Analytics', href: '/admin/analytics',    icon: BarChart2, permission: 'view_settings' },
        ],
    },
    {
        label: 'Sistem',
        items: [
            { name: 'Log Aktiviti',    href: '/admin/activity-logs', icon: Activity, permission: 'view_settings', notifyKey: 'activity_logs' },
            { name: 'Backup',          href: '/admin/backup',        icon: Database, permission: 'view_settings', notifyKey: 'backups' },
            { name: 'Maklumat Sistem', href: '/admin/system-info',   icon: Server, permission: 'view_settings' },
        ],
    },
    {
        label: 'Tetapan',
        items: [
            { name: 'Tetapan Umum', href: '/admin/settings', icon: Settings, permission: 'view_settings' },
            { name: 'Imej & Branding', href: '/admin/branding', icon: Image, permission: 'view_settings' },
        ],
    },
];

export default function AdminLayout({ children, header }) {
    const { auth, unread_notifications } = usePage().props;
    const currentUrl = usePage().url;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [lang, setLang] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('lang') || 'bm' : 'bm'));
    const [theme, setTheme] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('theme') || 'dark' : 'dark'));

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

    const { hasPermission, hasManageOwn } = usePermissions();

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

    const translatedNavGroups = NAV_GROUPS.map((group) => ({
        label: NAV_GROUPS_TRANSLATIONS[lang]?.[group.label] || group.label,
        items: group.items.map((item) => ({
            ...item,
            name: NAV_GROUPS_TRANSLATIONS[lang]?.[item.name] || item.name,
        })),
    }));

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
            return (
                <div
                    className="relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold opacity-20 grayscale cursor-not-allowed select-none border border-transparent"
                    title={lang === 'en' ? "You do not have permission to access this module" : "Anda tidak mempunyai kebenaran untuk mengakses modul ini"}
                >
                    <item.icon className="w-4 h-4 shrink-0 text-zinc-600" />
                    <span className="truncate text-zinc-500">{item.name}</span>
                </div>
            );
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
                        <ApplicationLogo className="h-7 w-7 object-contain" />
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

    return (
        <div className="min-h-screen bg-[#080808] text-white font-sans antialiased relative">
            {/* Background: ambient glows + grid only, no image */}
            <div className="fixed top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-yellow-500/8 to-amber-500/4 blur-[130px] pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-yellow-600/6 to-amber-600/3 blur-[110px] pointer-events-none z-0" />
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-12 pointer-events-none z-0" />

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <div className="fixed inset-y-0 left-0 w-64 bg-[#0c0c0e] border-r border-white/5 shadow-2xl z-50">
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <SidebarContent onItemClick={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

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
                            
                            {/* Language Switcher */}
                            <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10 backdrop-blur-md">
                                <button
                                    onClick={() => toggleLanguage('bm')}
                                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full transition-all duration-200 ${lang === 'bm' ? 'bg-[var(--gold)] text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
                                >
                                    BM
                                </button>
                                <button
                                    onClick={() => toggleLanguage('en')}
                                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full transition-all duration-200 ${lang === 'en' ? 'bg-[var(--gold)] text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
                                >
                                    EN
                                </button>
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
                            <div className="relative pl-3 border-l border-white/10">
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
                                    <>
                                        {/* Click outside backdrop */}
                                        <div
                                            className="fixed inset-0 z-40 cursor-default"
                                            onClick={() => setUserMenuOpen(false)}
                                        />
                                        
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
                                    </>
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
