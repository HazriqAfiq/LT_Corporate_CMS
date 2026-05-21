import { useState } from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function SitemapVisual({ settings = {} }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAdmin, setShowAdmin] = useState(true);

    // Sitemap hierarchy data representing the website's architecture
    const sitemapData = [
        {
            id: 'about',
            title: 'Tentang Kami',
            icon: '🎯',
            href: '/tentang-kami',
            desc: 'Maklumat korporat, profil, misi, visi, dan pasukan kami.',
            color: 'from-amber-500/20 to-orange-500/5',
            glowColor: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
            nodes: [
                { name: 'Profil Syarikat', slug: '/tentang-kami', desc: 'Latar belakang korporat Laman Teknologi.' },
                { name: 'Visi & Misi', slug: '/tentang-kami', desc: 'Misi dan hala tuju inovasi digital.' },
                { name: 'Nilai Kami', slug: '/tentang-kami', desc: 'Integriti, Inovasi & Kecemerlangan.' },
                { name: 'Pasukan Kami', slug: '/tentang-kami', desc: 'Barisan pakar & kepimpinan utama kami.' },
                { name: 'Kerjaya', slug: '#', desc: 'Peluang pekerjaan & membina kerjaya bersama kami.' },
            ]
        },
        {
            id: 'services',
            title: 'Perkhidmatan',
            icon: '⚙️',
            href: '/perkhidmatan',
            desc: 'Penyelesaian digital menyeluruh daripada pembangunan sistem ke automasi AI.',
            color: 'from-blue-500/20 to-indigo-500/5',
            glowColor: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
            nodes: [
                { name: 'Pembangunan Sistem', slug: '/perkhidmatan', desc: 'Sistem web perusahaan & automasi perniagaan.' },
                { name: 'Rekabentuk UI/UX', slug: '/perkhidmatan', desc: 'Rekabentuk antaramuka moden yang mesra pengguna.' },
                { name: 'Integrasi API', slug: '/perkhidmatan', desc: 'Penyambungan data antara platform pihak ketiga.' },
                { name: 'Cloud & Hosting', slug: '/perkhidmatan', desc: 'Infrastruktur cloud berprestasi tinggi & selamat.' },
                { name: 'Penyelenggaraan', slug: '/perkhidmatan', desc: 'Sokongan teknikal & kemas kini berkala.' },
                { name: 'AI Automation', slug: '/perkhidmatan', desc: 'Automasi pintar menggunakan ejen kecerdasan buatan.' },
            ]
        },
        {
            id: 'products',
            title: 'Produk Kami',
            icon: '📦',
            href: '/produk',
            desc: 'Sistem SaaS premium buatan tempatan untuk memacu kecekapan organisasi.',
            color: 'from-emerald-500/20 to-teal-500/5',
            glowColor: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
            nodes: [
                { name: 'LamanHR', slug: '/produk', desc: 'Sistem pengurusan sumber manusia serba lengkap.' },
                { name: 'LamanSupport', slug: '/produk', desc: 'Portal tiket bantuan & khidmat pelanggan.' },
                { name: 'LamanAI', slug: '/produk', desc: 'Enjin automasi perniagaan pintar dipacu AI.' },
                { name: 'LamanTeam', slug: '/produk', desc: 'Platform kolaborasi pasukan & pengurusan tugasan.' },
                { name: 'LamanCRM', slug: '/produk', desc: 'Sistem pengurusan hubungan & jualan pelanggan.' },
                { name: 'LamanEvent', slug: '/produk', desc: 'Sistem pendaftaran dan pengurusan acara digital.' },
                { name: 'LamanRisk', slug: '/produk', desc: 'Platform pengurusan & audit risiko organisasi.' },
            ]
        },
        {
            id: 'portfolio',
            title: 'Portfolio',
            icon: '💼',
            href: '/portfolio',
            desc: 'Koleksi projek digital dan kisah kejayaan klien-klien kami.',
            color: 'from-purple-500/20 to-fuchsia-500/5',
            glowColor: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]',
            nodes: [
                { name: 'Senarai Projek', slug: '/portfolio', desc: 'Galeri & dokumentasi projek sedia ada.' },
                { name: 'Kajian Kes', slug: '/portfolio', desc: 'Analisis mendalam penyelesaian cabaran teknikal.' },
                { name: 'Testimoni Pelanggan', slug: '/portfolio', desc: 'Maklum balas & ulasan ikhlas daripada klien.' },
                { name: 'Teknologi Digunakan', slug: '/portfolio', desc: 'Stack pembangunan moden yang diaplikasikan.' },
            ]
        },
        {
            id: 'articles',
            title: 'Artikel',
            icon: '📰',
            href: '/artikel',
            desc: 'Perkongsian berita teknologi terkini, tips pengaturcaraan, dan tutorial.',
            color: 'from-rose-500/20 to-pink-500/5',
            glowColor: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]',
            nodes: [
                { name: 'Senarai Artikel', slug: '/artikel', desc: 'Ulasan teknologi, blog, dan tutorial terkini.' },
                { name: 'Kategori Artikel', slug: '/artikel', desc: 'Artikel diasingkan mengikut topik pengkhususan.' },
                { name: 'Artikel Terkini', slug: '/artikel', desc: 'Hantaran terbaru dari meja editor kami.' },
                { name: 'Carian Artikel', slug: '/artikel', desc: 'Enjin carian pantas artikel mengikut kata kunci.' },
            ]
        },
        {
            id: 'contact',
            title: 'Hubungi Kami',
            icon: '📞',
            href: '/hubungi-kami',
            desc: 'Talian sokongan, alamat pejabat, dan borang maklum balas.',
            color: 'from-cyan-500/20 to-sky-500/5',
            glowColor: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
            nodes: [
                { name: 'Maklumat Hubungi', slug: '/hubungi-kami', desc: 'No. Telefon, e-mel rasmi dan lokasi pejabat.' },
                { name: 'Borang Pertanyaan', slug: '/hubungi-kami', desc: 'Hantar mesej sokongan atau sebut harga terus.' },
                { name: 'Lokasi & Peta', slug: '/hubungi-kami', desc: 'Peta interaktif navigasi ke pejabat kami.' },
                { name: 'Soalan Lazim (FAQ)', slug: '/hubungi-kami', desc: 'Jawapan segera bagi kemusykilan umum anda.' },
            ]
        },
    ];

    const adminData = {
        id: 'admin',
        title: 'LOGIN / CMS (Admin)',
        icon: '🔐',
        desc: 'Sistem pengurusan kandungan (CMS) dan kawalan pentadbiran Laman Teknologi.',
        color: 'from-red-500/20 to-stone-500/5',
        glowColor: 'group-hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]',
        nodes: [
            { name: 'Dashboard', slug: '/admin/dashboard', desc: 'Paparan ringkasan analitik dan status laman.' },
            { name: 'Slider Manager', slug: '/admin/sliders', desc: 'Uruskan slaid gambar hero di halaman utama.' },
            { name: 'Artikel Manager', slug: '/admin/articles', desc: 'Tulis, sunting, dan terbitkan artikel blog.' },
            { name: 'Media Library', slug: '/admin/media', desc: 'Urus storan gambar, fail, dan dokumen sistem.' },
            { name: 'Produk & Servis', slug: '/admin/products', desc: 'Urus tawaran pakej dan perincian perkhidmatan.' },
            { name: 'Borang & Inquiry', slug: '/admin/inquiries', desc: 'Semak dan maklum balas inquiry borang hubungi kami.' },
            { name: 'Pengguna & Role', slug: '/admin/users', desc: 'Urus kelayakan kakitangan, peranan, dan profil.' },
            { name: 'Tetapan Web', slug: '/admin/settings', desc: 'Konfigurasi nama syarikat, maklumat hubungan & SEO.' },
        ]
    };

    const systemData = {
        id: 'system',
        title: 'Halaman Sistem & Utiliti',
        icon: '🛡️',
        desc: 'Polisi penggunaan, keselamatan privasi, dan halaman bantuan kecemasan.',
        color: 'from-slate-500/20 to-zinc-500/5',
        glowColor: 'group-hover:shadow-[0_0_20px_rgba(100,116,139,0.15)]',
        nodes: [
            { name: 'Dasar Privasi', slug: '/dasar-privasi', desc: 'Polisi perlindungan data peribadi pengguna.' },
            { name: 'Terma & Syarat', slug: '/terma-syarat', desc: 'Syarat penggunaan perkhidmatan dan platform.' },
            { name: 'Peta Laman (Sitemap)', slug: '/sitemap.xml', desc: 'Peta indeks XML untuk enjin carian Google/Bing.' },
            { name: '404 Tidak Dijumpai', slug: '/halaman-tiada', desc: 'Paparan visual ralat apabila url tidak wujud.' },
        ]
    };

    // Helper function to check if a node matches the search query
    const isNodeMatch = (node) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return node.name.toLowerCase().includes(query) || node.desc.toLowerCase().includes(query);
    };

    // Helper function to check if a category matches
    const isCategoryMatch = (cat) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        if (cat.title.toLowerCase().includes(query) || cat.desc.toLowerCase().includes(query)) return true;
        return cat.nodes.some(node => isNodeMatch(node));
    };

    return (
        <PublicLayout title="Sitemap Visual" settings={settings}>
            {/* Hero Banner with Digital Telemetry Backdrop */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-[#080808] border-b border-white/5 z-10">
                {/* Master Background Image (Static) */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none z-0 opacity-40" 
                    style={{ backgroundImage: "url('/storage/digital_kl_bg.png')" }}
                />

                {/* Warm Ambient Static Golden Radial Glow */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none z-0 opacity-35" 
                    style={{ 
                        backgroundImage: "url('/storage/hero_laptop_city.png')",
                        filter: 'blur(110px) brightness(0.6)'
                    }}
                />

                {/* Golden & Amber Sci-Fi Overlays */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)]/5 via-transparent to-amber-500/10 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-full lg:w-2/3 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-[#080808]/40 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-full lg:w-1/3 bg-gradient-to-l from-[#080808] via-[#080808]/60 to-[#080808]/40 z-0 pointer-events-none" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />
                
                {/* Visual Accent Glows */}
                <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-[var(--gold)]/10 blur-[100px] pointer-events-none z-0" />
                <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-[var(--gold)]/5 blur-[90px] pointer-events-none z-0" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="badge mb-6">Peta Laman</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Sitemap <span className="text-[var(--gold)]">Visual</span>
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
                        Terokai struktur pemetaan halaman utama, modul perniagaan, portal artikel, serta ekosistem sistem pengurusan (CMS) Laman Teknologi.
                    </p>
                </div>
            </section>

            {/* Main Interactive Mapping Section */}
            <section className="py-24 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                {/* Soft top-centered amber radial glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                
                {/* Gold Accent Divider Lines */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    
                    {/* Control Panel (Search Bar & CMS Toggle Filter) */}
                    <div className="mb-16 flex flex-col md:flex-row gap-6 justify-between items-center bg-[#080808]/60 p-6 rounded-2xl border border-white/5 backdrop-blur-sm relative">
                        <div className="w-full md:max-w-md relative">
                            <span className="absolute inset-y-0 left-4 flex items-center text-gray-500">🔍</span>
                            <input 
                                type="text"
                                placeholder="Cari halaman, perkhidmatan atau slug..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-[#0c0c0e]/80 text-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 outline-none transition-all text-sm placeholder-gray-500"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-white text-xs"
                                >
                                    Batal
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400 font-medium">Urusan CMS Pentadbiran</span>
                            <button
                                onClick={() => setShowAdmin(!showAdmin)}
                                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-350 ease-in-out focus:outline-none ${
                                    showAdmin ? 'bg-[var(--gold)]' : 'bg-zinc-800'
                                }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-[#080808] shadow ring-0 transition duration-350 ease-in-out ${
                                        showAdmin ? 'translate-x-7' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Visual Central Master HOME Node */}
                    {!searchQuery && (
                        <div className="flex flex-col items-center mb-16 relative">
                            {/* Central Home Card Node */}
                            <Link 
                                href="/" 
                                className="group relative px-8 py-5 rounded-2xl bg-[#080808] border border-[var(--gold)]/30 hover:border-[var(--gold)] text-center transition-all duration-300 shadow-[0_0_15px_rgba(234,179,8,0.05)] hover:shadow-[0_0_25px_rgba(234,179,8,0.15)] z-20 cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--gold)]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-300">🏠</div>
                                <h3 className="text-lg font-bold text-white tracking-wide uppercase">HOME</h3>
                                <p className="text-[10px] font-mono text-[var(--gold)] mt-0.5 font-bold tracking-wider">Halaman Utama</p>
                            </Link>

                            {/* SVG Network Connector Lines (Desktop Only) */}
                            <div className="hidden lg:block absolute top-[90px] left-0 right-0 w-full h-[50px] z-0 pointer-events-none">
                                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="rgba(234,179,8,0.2)" strokeWidth="2" strokeDasharray="4 4" />
                                    <line x1="8.3%" y1="100%" x2="91.7%" y2="100%" stroke="rgba(234,179,8,0.15)" strokeWidth="2" />
                                    {/* Drop connection dots */}
                                    <circle cx="50%" cy="100%" r="4" fill="var(--gold)" />
                                </svg>
                            </div>
                        </div>
                    )}

                    {/* Interactive Public Page Mapping Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                        {sitemapData.map((cat) => {
                            const isMatch = isCategoryMatch(cat);
                            if (!isMatch) return null;

                            return (
                                <div 
                                    key={cat.id} 
                                    className={`group rounded-3xl border border-white/5 bg-[#080808]/60 p-6 backdrop-blur-sm transition-all duration-500 relative flex flex-col justify-between ${cat.glowColor} ${
                                        searchQuery && !cat.title.toLowerCase().includes(searchQuery.toLowerCase()) && !cat.nodes.some(n => n.name.toLowerCase().includes(searchQuery.toLowerCase())) ? 'opacity-55' : 'opacity-100'
                                    }`}
                                >
                                    {/* Tech Aesthetic Accent Glow Strip */}
                                    <div className={`absolute top-0 inset-x-0 h-1 rounded-t-3xl bg-gradient-to-r ${cat.color} opacity-40 group-hover:opacity-100 transition-opacity duration-300`} />

                                    <div>
                                        {/* Category Header */}
                                        <div className="flex gap-4 items-center mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-300">
                                                {cat.icon}
                                            </div>
                                            <div>
                                                <Link href={cat.href} className="text-lg font-bold text-white hover:text-[var(--gold)] transition-colors inline-block cursor-pointer">
                                                    {cat.title}
                                                </Link>
                                                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">{cat.href}</p>
                                            </div>
                                        </div>

                                        <p className="text-gray-400 text-xs leading-relaxed mb-6 border-b border-white/5 pb-4">
                                            {cat.desc}
                                        </p>

                                        {/* Nested Nodes / Pages */}
                                        <div className="space-y-3.5">
                                            {cat.nodes.map((node, i) => {
                                                const matchesSearch = searchQuery ? isNodeMatch(node) : false;
                                                return (
                                                    <Link 
                                                        key={i} 
                                                        href={cat.href === '#' ? '#' : `${cat.href}`}
                                                        className={`flex gap-3 items-start p-2.5 rounded-xl border transition-all duration-300 group/node cursor-pointer ${
                                                            matchesSearch 
                                                                ? 'bg-[var(--gold)]/10 border-[var(--gold)]/40 shadow-[0_0_10px_rgba(234,179,8,0.1)]' 
                                                                : 'bg-[#0c0c0e]/40 border-transparent hover:bg-white/[0.03] hover:border-white/5'
                                                        }`}
                                                    >
                                                        <span className={`text-[10px] font-bold mt-1 transition-colors duration-300 ${
                                                            matchesSearch ? 'text-[var(--gold)]' : 'text-zinc-600 group-hover/node:text-[var(--gold)]'
                                                        }`}>
                                                            {i + 1}.
                                                        </span>
                                                        <div>
                                                            <h4 className={`text-sm font-semibold transition-colors duration-300 ${
                                                                matchesSearch ? 'text-[var(--gold)] font-bold' : 'text-white group-hover/node:text-[var(--gold)]'
                                                            }`}>
                                                                {node.name}
                                                            </h4>
                                                            <p className="text-[11px] text-zinc-500 leading-normal mt-0.5">
                                                                {node.desc}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Optional CMS Admin Pages Column */}
                        {showAdmin && isCategoryMatch(adminData) && (
                            <div 
                                className={`group rounded-3xl border border-red-500/10 bg-[#080808]/60 p-6 backdrop-blur-sm transition-all duration-500 relative flex flex-col justify-between ${adminData.glowColor}`}
                            >
                                <div className="absolute top-0 inset-x-0 h-1 rounded-t-3xl bg-gradient-to-r from-red-500/20 to-stone-500/5 opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <div>
                                    <div className="flex gap-4 items-center mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-red-950/20 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-300">
                                            {adminData.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">
                                                {adminData.title}
                                            </h3>
                                            <p className="text-[10px] font-mono text-red-500 uppercase tracking-widest mt-0.5">CMS SISTEM</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-xs leading-relaxed mb-6 border-b border-white/5 pb-4">
                                        {adminData.desc}
                                    </p>

                                    <div className="space-y-3.5">
                                        {adminData.nodes.map((node, i) => {
                                            const matchesSearch = searchQuery ? isNodeMatch(node) : false;
                                            return (
                                                <div 
                                                    key={i} 
                                                    className={`flex gap-3 items-start p-2.5 rounded-xl border transition-all duration-300 group/node ${
                                                        matchesSearch 
                                                            ? 'bg-red-500/10 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.1)]' 
                                                            : 'bg-[#0c0c0e]/40 border-transparent hover:bg-white/[0.03] hover:border-white/5'
                                                    }`}
                                                >
                                                    <span className="text-[10px] text-zinc-600 font-bold mt-1">
                                                        🔑
                                                    </span>
                                                    <div>
                                                        <h4 className={`text-sm font-semibold transition-colors duration-300 ${
                                                            matchesSearch ? 'text-red-400 font-bold' : 'text-white group-hover/node:text-red-400'
                                                        }`}>
                                                            {node.name}
                                                        </h4>
                                                        <p className="text-[11px] text-zinc-500 leading-normal mt-0.5">
                                                            {node.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Optional System Utilities Column */}
                        {isCategoryMatch(systemData) && (
                            <div 
                                className={`group rounded-3xl border border-white/5 bg-[#080808]/60 p-6 backdrop-blur-sm transition-all duration-500 relative flex flex-col justify-between ${systemData.glowColor}`}
                            >
                                <div className="absolute top-0 inset-x-0 h-1 rounded-t-3xl bg-gradient-to-r from-slate-500/20 to-zinc-500/5 opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <div>
                                    <div className="flex gap-4 items-center mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-300">
                                            {systemData.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">
                                                {systemData.title}
                                            </h3>
                                            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">SISTEM & LAIN-LAIN</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-xs leading-relaxed mb-6 border-b border-white/5 pb-4">
                                        {systemData.desc}
                                    </p>

                                    <div className="space-y-3.5">
                                        {systemData.nodes.map((node, i) => {
                                            const matchesSearch = searchQuery ? isNodeMatch(node) : false;
                                            return (
                                                <Link 
                                                    key={i} 
                                                    href={node.slug}
                                                    className={`flex gap-3 items-start p-2.5 rounded-xl border transition-all duration-300 group/node cursor-pointer ${
                                                        matchesSearch 
                                                            ? 'bg-slate-500/10 border-slate-500/40 shadow-[0_0_10px_rgba(100,116,139,0.1)]' 
                                                            : 'bg-[#0c0c0e]/40 border-transparent hover:bg-white/[0.03] hover:border-white/5'
                                                    }`}
                                                >
                                                    <span className="text-[10px] text-zinc-600 font-bold mt-1">
                                                        📄
                                                    </span>
                                                    <div>
                                                        <h4 className={`text-sm font-semibold transition-colors duration-300 ${
                                                            matchesSearch ? 'text-slate-400 font-bold' : 'text-white group-hover/node:text-slate-400'
                                                        }`}>
                                                            {node.name}
                                                        </h4>
                                                        <p className="text-[11px] text-zinc-500 leading-normal mt-0.5">
                                                            {node.desc}
                                                        </p>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Informational Footer Note */}
                    <div className="mt-16 bg-[#080808]/60 p-8 rounded-3xl border border-white/5 backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[var(--gold)]/5 blur-xl pointer-events-none" />
                        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                            <span>ℹ️</span> Nota Pemetaan Laman Web
                        </h4>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-4xl">
                            Sitemap Visual ini disusun untuk memberikan gambaran keseluruhan seni bina maklumat laman web Laman Teknologi. Modul pentadbiran (CMS) memerlukan akses keselamatan khas (Auth Guard) untuk dilawati, manakala pautan awam lain sedia dilawati terus oleh pelawat awam.
                        </p>
                    </div>

                </div>
            </section>
        </PublicLayout>
    );
}
