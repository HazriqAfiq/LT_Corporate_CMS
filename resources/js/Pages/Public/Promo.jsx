import { usePage } from '@inertiajs/react';
import PromoLayout from '@/Layouts/PromoLayout';
import {
    Laptop, Smartphone, MessageCircle, FileInput, Globe2, Clock,
    Check, ArrowRight, ShieldCheck, Zap,
    Building2, Store, User2, Stethoscope, Package,
    MessageSquare, PenTool, Eye, Rocket,
    CalendarCheck, ChevronDown
} from 'lucide-react';


export default function Promo() {
    const {
        settings = {},
        slotsCount = 0,
        remainingSlots = 20,
        currentPrice = 1000.00,
    } = usePage().props;

    const homepageBg = '/storage/uploads/promo_hero_bg.png';
    const isSlotsFull = remainingSlots <= 0;
    const progressPercent = Math.min(100, (slotsCount / 20) * 100);

    const features = [
        { icon: Laptop,       title: 'Rekabentuk Moden & Premium',   desc: 'Rekabentuk eksklusif, menarik dan disesuaikan dengan identiti jenama anda.' },
        { icon: Smartphone,   title: 'Mobile Friendly',               desc: 'Paparan sempurna di semua peranti. Tingkatkan pengalaman pengguna.' },
        { icon: MessageCircle,title: 'WhatsApp Button',               desc: 'Mudah untuk pelanggan berhubung terus dengan anda melalui WhatsApp.' },
        { icon: FileInput,    title: 'Contact Form',                  desc: 'Dilengkapi borang hubungi berfungsi untuk bantu tukar prospek.' },
        { icon: Zap,          title: 'SEO Basic Setup',               desc: 'Struktur SEO asas untuk bantu website mudah ditemui di Google.' },
        { icon: Globe2,       title: 'Domain & Hosting (1 Tahun)*',   desc: 'Kami sediakan domain & hosting selama 1 tahun secara percuma.' },
        { icon: Clock,        title: 'Siap Dalam Tempoh Dipersetujui', desc: 'Kami komited mengikut jadual yang dipersetujui tanpa kelewatan.' },
    ];

    const audiences = [
        { icon: Building2,    label: 'Syarikat' },
        { icon: Store,        label: 'SME' },
        { icon: User2,        label: 'Usahawan' },
        { icon: Stethoscope,  label: 'Servis Profesional' },
        { icon: Package,      label: 'Produk & Perkhidmatan' },
    ];

    const steps = [
        { number: '1', icon: MessageSquare, title: 'Konsultasi',    desc: 'Kami faham keperluan dan matlamat bisnes anda.' },
        { number: '2', icon: PenTool,       title: 'Reka & Bina',   desc: 'Kami reka dan bina landing page yang moden, menarik & berkesan.' },
        { number: '3', icon: Eye,           title: 'Semak & Lulus', desc: 'Anda semak dan maklum balas sebelum kami terbitkan.' },
        { number: '4', icon: Rocket,        title: 'Terbit & Siap', desc: 'Landing page siap digunakan untuk tarik lebih ramai pelanggan!' },
    ];

    const checkItems = [
        'Rekabentuk moden & premium',
        'Mobile Friendly',
        'WhatsApp Button',
        'Contact Form',
        'SEO Basic Setup',
        'Domain & Hosting (1 Tahun)*',
        'Siap dalam tempoh yang dipersetujui',
    ];

    const faqs = [
        { q: 'Berapa lama masa pembangunan?',           a: 'Tempoh pembangunan akan dipersetujui bersama sebelum kerja bermula. Biasanya antara 5–14 hari bekerja bergantung kepada keperluan projek.' },
        { q: 'Domain & Hosting apa yang disertakan?',   a: 'Anda mendapat pendaftaran domain percuma (.com/.com.my) dan hosting berprestasi tinggi selama 12 bulan pertama. Pembaharuan berikutnya dikenakan yuran standard.' },
        { q: 'Boleh saya kemaskini kandungan sendiri?', a: 'Ya! Kami akan menyediakan sistem pengurusan kandungan (CMS) yang mudah digunakan supaya anda boleh kemaskini teks dan gambar sendiri.' },
        { q: 'Apa berlaku selepas bayaran?',            a: 'Pasukan kami akan menghubungi anda dalam masa 24 jam untuk berbincang tentang reka bentuk, kandungan, dan keperluan teknikal laman web anda.' },
    ];

    return (
        <PromoLayout title="Promosi Khas Landing Page Profesional" settings={settings}>

            {/* ═══════════════════════════════════════════════════════
                HERO
            ═══════════════════════════════════════════════════════ */}
            <section id="hero" className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden bg-[#0a0a14]" style={{ clipPath: 'inset(0)' }}>
                {/* Background image */}
                <img
                    src={homepageBg}
                    alt=""
                    fetchpriority="high"
                    loading="eager"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-60"
                />
                {/* Dark overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a14] via-[#0a0a14]/60 to-transparent z-0" />
                {/* Subtle grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-12 lg:py-16">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-8 items-center">

                        {/* ── Left column ── */}
                        <div data-reveal="fade-right" className="max-w-xl">
                            {/* Simple Badge */}
                            <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest block mb-4">
                                PROMOSI KHAS
                            </span>

                            {/* Headline */}
                            <h1 className="text-5xl sm:text-6xl font-black text-white leading-none mb-6 uppercase">
                                Landing Page<br />
                                <span className="text-yellow-400">Profesional</span>
                            </h1>

                            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-8">
                                Nak website yang nampak profesional, laju dan mampu meyakinkan pelanggan?
                                Kini anda boleh milikinya dengan <span className="text-yellow-400 font-bold">harga istimewa!</span>
                            </p>

                            {/* Price */}
                            <div className="flex items-baseline gap-4 mb-8">
                                <span className="text-4xl sm:text-5xl font-black text-white leading-none">
                                    RM{currentPrice.toLocaleString('ms-MY', { minimumFractionDigits: 0 })}
                                </span>
                                <span className="text-zinc-400 text-sm font-bold uppercase">SAHAJA</span>
                                <span className="text-zinc-600 text-sm font-medium ml-2">
                                    Biasa: <span className="line-through">RM2,500</span>
                                </span>
                            </div>

                            {/* CTA */}
                            <div className="mb-8">
                                <a
                                    id="hero-cta"
                                    href="/promosi/tempah"
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-sm uppercase tracking-wider transition-all duration-200"
                                >
                                    Dapatkan Sekarang
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>

                            {/* Slots warning & Minimal Progress */}
                            <div className="space-y-3 border-t border-white/5 pt-6 text-zinc-400 text-xs">
                                <div className="flex items-center justify-between font-medium">
                                    <span>Terhad kepada <strong className="text-white">{remainingSlots > 0 ? remainingSlots : 0} slot terawal sahaja!</strong></span>
                                    <span className="text-yellow-400 font-bold">{slotsCount}/20 Slot Terisi</span>
                                </div>
                                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400 rounded-full transition-all duration-1000"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                                <p className="text-zinc-600 text-[10px]">
                                    Selepas slot dipenuhi, yuran akan kembali kepada harga asal RM2,500.
                                </p>
                            </div>
                        </div>



                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                APA YANG ANDA DAPAT?
            ═══════════════════════════════════════════════════════ */}
            <section id="keistimewaan" className="py-20 bg-white/[0.02] border-t border-white/5 relative z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14" data-reveal="fade-up">
                        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase mb-2">
                            Apa Yang <span className="text-yellow-400">Anda Dapat?</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                        {features.map((feat, i) => {
                            const IconComp = feat.icon;
                            return (
                                <div
                                    key={i}
                                    className="flex flex-col items-center text-center p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/30 hover:border-yellow-400/30 hover:bg-zinc-900/50 transition-all duration-300 group"
                                    data-reveal="fade-up"
                                    data-reveal-delay={i * 60}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-yellow-400/10 transition-colors duration-300">
                                        <IconComp className="w-6 h-6 text-yellow-400" />
                                    </div>
                                    <h3 className="text-white font-bold text-xs mb-2 leading-snug">{feat.title}</h3>
                                    <p className="text-zinc-500 text-[10px] leading-relaxed">{feat.desc}</p>
                                </div>
                            );
                        })}
                        {/* Last item — spans 2 cols on mobile to fill */}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                SESUAI UNTUK
            ═══════════════════════════════════════════════════════ */}
            <section className="py-16 border-t border-white/5 bg-[#0a0a14] relative z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10" data-reveal="fade-up">
                        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase mb-2">
                            Sesuai <span className="text-yellow-400">Untuk:</span>
                        </h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 sm:gap-10" data-reveal="fade-up" data-reveal-delay="80">
                        {audiences.map((aud, i) => {
                            const IconComp = aud.icon;
                            return (
                                <div key={i} className="flex flex-col items-center gap-3 group">
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-yellow-400/40 group-hover:bg-zinc-900/80 transition-all duration-300">
                                        <IconComp className="w-7 h-7 text-zinc-300 group-hover:text-yellow-400 transition-colors duration-300" />
                                    </div>
                                    <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors text-center max-w-[80px] leading-snug">{aud.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                PROSES MUDAH & PANTAS
            ═══════════════════════════════════════════════════════ */}
            <section id="proses" className="py-20 border-t border-white/5 bg-white/[0.02] relative z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14" data-reveal="fade-up">
                        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase mb-2">
                            Proses <span className="text-yellow-400">Mudah & Pantas</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative">
                        {/* Connector line — desktop only */}
                        <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent z-0" />

                        {steps.map((step, i) => {
                            const IconComp = step.icon;
                            return (
                                <div
                                    key={i}
                                    className="relative flex flex-col items-center text-center group"
                                    data-reveal="fade-up"
                                    data-reveal-delay={i * 100}
                                >
                                    {/* Arrow between steps (mobile) */}
                                    {i < steps.length - 1 && (
                                        <div className="lg:hidden absolute -right-3 top-10 z-10 text-yellow-400/50 text-xl">›</div>
                                    )}
                                    <div className="relative w-20 h-20 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center mb-5 z-10 group-hover:border-yellow-400 transition-all duration-300 shadow-lg">
                                        <IconComp className="w-8 h-8 text-yellow-400" />
                                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-400 text-black text-[10px] font-black flex items-center justify-center">
                                            {step.number}
                                        </div>
                                    </div>
                                    <h3 className="text-white font-extrabold text-sm mb-2 uppercase">{step.number}. {step.title}</h3>
                                    <p className="text-zinc-500 text-xs leading-relaxed">{step.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════

            {/* ═══════════════════════════════════════════════════════
                FAQ
            ═══════════════════════════════════════════════════════ */}
            <section id="faq" className="py-20 border-t border-white/5 bg-white/[0.02] relative z-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12" data-reveal="fade-up">
                        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase mb-2">
                            Soalan <span className="text-yellow-400">Lazim</span>
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-xl border border-zinc-800/80 bg-zinc-900/30 hover:border-yellow-400/20 transition-all duration-200"
                                data-reveal="fade-up"
                                data-reveal-delay={i * 60}
                            >
                                <h4 className="text-white font-bold text-sm mb-2 flex items-start gap-2">
                                    <span className="text-yellow-400 flex-shrink-0">Q.</span>
                                    {faq.q}
                                </h4>
                                <p className="text-zinc-400 text-xs leading-relaxed pl-5">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                FINAL CTA BAND
            ═══════════════════════════════════════════════════════ */}
            <section className="border-t border-white/5 bg-[#0a0a14] relative z-10">
                <div
                    className="relative overflow-hidden"
                    data-reveal="fade-up"
                >
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/10 px-8 py-8">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-zinc-850 border border-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <CalendarCheck className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div>
                                    <h2 className="text-white font-extrabold text-xl uppercase mb-1">
                                        Jangan Lepaskan Peluang Ini!!
                                    </h2>
                                    <p className="text-zinc-400 text-sm">
                                        Tingkatkan jenama anda dan tarik lebih ramai pelanggan sekarang.
                                    </p>
                                </div>
                            </div>

                            <a
                                id="final-cta"
                                href="/promosi/tempah"
                                className="flex-shrink-0 inline-flex items-center gap-2 px-8 py-3.5 rounded-md bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-sm uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
                            >
                                Dapatkan Sekarang
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

        </PromoLayout>
    );
}
