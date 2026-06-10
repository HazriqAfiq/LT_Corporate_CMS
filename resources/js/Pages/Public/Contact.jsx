import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { MapPin } from 'lucide-react';
import useLanguage from '@/Hooks/useLanguage';

const t = {
    bm: {
        heroBadge: 'Hubungi Kami',
        heroTitle: 'Mari',
        heroTitleGold: 'Berhubung',
        heroDesc: 'Ada soalan? Ingin mendapatkan sebut harga? Hubungi kami dan kami akan membantu anda.',
        contactInfoTitle: 'Maklumat Hubungan',
        emailLabel: 'Emel',
        phoneLabel: 'Telefon',
        addressLabel: 'Alamat',
        hoursTitle: 'Waktu Operasi',
        monFri: 'Isnin - Jumaat: 9:00 AM - 6:00 PM',
        sat: 'Sabtu: 9:00 AM - 1:00 PM',
        sunPh: 'Ahad & Cuti Umum: Tutup',
        formTitle: 'Hantar Mesej',
        nameLabel: 'Nama *',
        emailFormLabel: 'Emel *',
        phoneFormLabel: 'Telefon',
        companyLabel: 'Syarikat',
        subjectLabel: 'Subjek *',
        messageLabel: 'Mesej *',
        submitBtn: 'Hantar Mesej →',
        submitting: 'Menghantar...',
    },
    en: {
        heroBadge: 'Contact Us',
        heroTitle: 'Get In',
        heroTitleGold: 'Touch',
        heroDesc: 'Have a question? Want to get a quote? Contact us and we will be happy to help.',
        contactInfoTitle: 'Contact Information',
        emailLabel: 'Email',
        phoneLabel: 'Phone',
        addressLabel: 'Address',
        hoursTitle: 'Business Hours',
        monFri: 'Monday - Friday: 9:00 AM - 6:00 PM',
        sat: 'Saturday: 9:00 AM - 1:00 PM',
        sunPh: 'Sunday & Public Holidays: Closed',
        formTitle: 'Send a Message',
        nameLabel: 'Name *',
        emailFormLabel: 'Email *',
        phoneFormLabel: 'Phone',
        companyLabel: 'Company',
        subjectLabel: 'Subject *',
        messageLabel: 'Message *',
        submitBtn: 'Send Message →',
        submitting: 'Sending...',
    },
};

export default function Contact() {
    const { settings = {}, flash = {} } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', phone: '', company: '', subject: '', message: '',
    });
    const { lang } = useLanguage();

    const tr = t[lang] || t.bm;

    const submit = (e) => {
        e.preventDefault();
        post('/hubungi-kami', { onSuccess: () => reset() });
    };

    const contactAddress = lang === 'en' ? (settings.contact_address_en || settings.contact_address) : settings.contact_address;

    const contactDetails = [
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>), label: tr.emailLabel, value: settings.contact_email || 'info@lamanteknologi.com' },
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>), label: tr.phoneLabel, value: settings.contact_phone || '+60-123456789' },
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>), label: tr.addressLabel, value: contactAddress || 'Kuala Lumpur, Malaysia' },
    ];

    const formFields = [
        { name: 'name', label: tr.nameLabel, type: 'text' },
        { name: 'email', label: tr.emailFormLabel, type: 'email' },
        { name: 'phone', label: tr.phoneFormLabel, type: 'tel' },
        { name: 'company', label: tr.companyLabel, type: 'text' },
    ];

    return (
        <PublicLayout title={lang === 'en' ? 'Contact Us' : 'Hubungi Kami'} settings={settings}>
            {/* Hero Banner — bg-scroll on mobile for performance */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-[#080808] border-b border-white/5 z-10">
                <div className="absolute inset-0 bg-cover bg-center bg-scroll md:bg-fixed pointer-events-none z-0 opacity-45" style={{ backgroundImage: "url('/storage/digital_kl_bg.png')" }} />
                <div className="absolute inset-0 bg-cover bg-center bg-scroll pointer-events-none z-0 opacity-40" style={{ backgroundImage: "url('/storage/hero_laptop_city.png')", filter: 'blur(110px) brightness(0.65)' }} />
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)]/5 via-transparent to-amber-500/10 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-full lg:w-2/3 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-[#080808]/40 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-full lg:w-1/3 bg-gradient-to-l from-[#080808] via-[#080808]/60 to-[#080808]/40 z-0 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />
                <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-[var(--gold)]/10 blur-[100px] pointer-events-none z-0" />
                <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-[var(--gold)]/5 blur-[90px] pointer-events-none z-0" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center" data-reveal="fade-up">
                    <div className="badge mb-6">{tr.heroBadge}</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{tr.heroTitle} <span className="text-[var(--gold)]">{tr.heroTitleGold}</span></h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">{tr.heroDesc}</p>
                </div>
            </section>

            {/* Contact Details & Form */}
            <section className="py-28 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-5 gap-16">
                        {/* Contact Info */}
                        <div className="lg:col-span-2 space-y-8">
                            <div data-reveal="fade-up">
                                <h3 className="text-xl font-bold text-white mb-6">{tr.contactInfoTitle}</h3>
                                <div className="space-y-6">
                                    {contactDetails.map((c, i) => (
                                        <div key={i} className="flex gap-4 group cursor-pointer" data-reveal="fade-up" data-reveal-delay={i * 100}>
                                            <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 text-[var(--gold)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--gold)] group-hover:text-[#080808] transition-all duration-300">
                                                {c.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm text-[var(--gray-400)]">{c.label}</p>
                                                <p className="text-white font-medium group-hover:text-[var(--gold)] transition-colors duration-300">{c.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="card p-8 relative z-10" data-reveal="scale-in" data-reveal-delay="200">
                                <h4 className="text-white font-bold mb-3">{tr.hoursTitle}</h4>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <p>{tr.monFri}</p>
                                    <p>{tr.sat}</p>
                                    <p>{tr.sunPh}</p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="lg:col-span-3" data-reveal="fade-up" data-reveal-delay="200">
                            {flash?.success && (
                                <div className="mb-6 p-4 rounded-xl bg-green-950/40 border border-green-500/30 text-green-400 text-sm">{flash.success}</div>
                            )}
                            <form onSubmit={submit} className="card p-8 space-y-6">
                                <h3 className="text-xl font-bold text-white mb-2">{tr.formTitle}</h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {formFields.map(field => (
                                        <div key={field.name}>
                                            <label className="block text-sm font-medium text-white mb-2">{field.label}</label>
                                            <input type={field.type} value={data[field.name]} onChange={e => setData(field.name, e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.02] text-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 outline-none transition-all text-sm" />
                                            {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">{tr.subjectLabel}</label>
                                    <input type="text" value={data.subject} onChange={e => setData('subject', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.02] text-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 outline-none transition-all text-sm" />
                                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">{tr.messageLabel}</label>
                                    <textarea value={data.message} onChange={e => setData('message', e.target.value)} rows={5}
                                        className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.02] text-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 outline-none transition-all text-sm resize-none" />
                                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                </div>
                                <button type="submit" disabled={processing} className="btn-primary w-full py-4 text-base disabled:opacity-50">
                                    {processing ? tr.submitting : tr.submitBtn}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Google Map Section — always visible */}
            <section className="relative w-full border-t border-white/5 z-10 bg-[#080808] py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-reveal="fade-up" data-reveal-delay="100">
                    {/* Section header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/10 text-[var(--gold)] flex items-center justify-center border border-[var(--gold)]/20">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">
                                    {lang === 'en' ? 'Our Location' : 'Lokasi Kami'}
                                </h3>
                                {contactAddress && (
                                    <p className="text-xs text-zinc-400 mt-0.5">{contactAddress}</p>
                                )}
                            </div>
                        </div>
                        {settings.contact_map_url && (
                            <a
                                href={
                                    settings.contact_map_url.includes('iframe')
                                        ? settings.contact_map_url.match(/src="([^"]+)"/)?.[1] || settings.contact_map_url
                                        : settings.contact_map_url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 text-[var(--gold)] text-xs font-bold hover:bg-[var(--gold)] hover:text-[#080808] transition-all duration-300 font-sans self-start sm:self-auto"
                            >
                                <span>{lang === 'en' ? 'Open in Google Maps' : 'Buka di Google Maps'}</span>
                                <span>↗</span>
                            </a>
                        )}
                    </div>

                    {/* Map iframe */}
                    <div className="relative rounded-2xl overflow-hidden border border-white/5 shadow-xl" style={{ height: '300px' }}>
                        {/* Gradient overlays */}
                        <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#080808] to-transparent z-10 pointer-events-none" />
                        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#080808] to-transparent z-10 pointer-events-none" />

                        {(() => {
                            const mapUrl = settings.contact_map_url || '';
                            // Extract src if user pasted raw iframe HTML
                            const extractedSrc = mapUrl.includes('<iframe')
                                ? mapUrl.match(/src="([^"]+)"/)?.[1] || ''
                                : mapUrl;
                            // Only iframe a proper Google Maps embed URL — regular links refuse to connect
                            const isEmbedUrl = extractedSrc.includes('/maps/embed') || extractedSrc.includes('/maps/d/embed');

                            if (isEmbedUrl) {
                                return (
                                    <iframe
                                        src={extractedSrc}
                                        className="w-full h-full border-none"
                                        style={{ filter: 'invert(90%) hue-rotate(180deg) saturate(0.8) brightness(0.85)' }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title={lang === 'en' ? 'Office Location Map' : 'Peta Lokasi Pejabat'}
                                    />
                                );
                            }

                            // Fallback: OpenStreetMap — always embeddable, no API key needed
                            return (
                                <iframe
                                    src="https://www.openstreetmap.org/export/embed.html?bbox=101.65,3.10,101.75,3.18&layer=mapnik&marker=3.14,101.70"
                                    className="w-full h-full border-none"
                                    style={{ filter: 'invert(90%) hue-rotate(180deg) saturate(0.8) brightness(0.85)' }}
                                    loading="lazy"
                                    title={lang === 'en' ? 'Office Location Map' : 'Peta Lokasi Pejabat'}
                                />
                            );
                        })()}
                    </div>

                    {/* Hint: only shown when no valid embed URL is set */}
                    {(() => {
                        const mapUrl = settings.contact_map_url || '';
                        const src = mapUrl.includes('<iframe') ? mapUrl.match(/src="([^"]+)"/)?.[1] || '' : mapUrl;
                        const isEmbedUrl = src.includes('/maps/embed') || src.includes('/maps/d/embed');
                        if (!isEmbedUrl) return (
                            <p className="text-center text-xs text-zinc-600 mt-3 font-sans">
                                {lang === 'en'
                                    ? 'To show your exact Google Maps location: Admin → Settings → Contact Details → paste the embed src URL (Google Maps → Share → Embed a map).'
                                    : 'Untuk papar lokasi Google Maps tepat: Admin → Tetapan → Maklumat Hubungan → tampal URL src embed (Google Maps → Kongsi → Embed peta).'}
                            </p>
                        );
                        return null;
                    })()}
                </div>
            </section>
        </PublicLayout>
    );
}
