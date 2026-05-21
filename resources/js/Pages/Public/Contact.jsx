import { useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Contact({ settings = {} }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', phone: '', company: '', subject: '', message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/hubungi-kami', { onSuccess: () => reset() });
    };

    return (
        <PublicLayout title="Hubungi Kami" settings={settings}>
            {/* Hero Banner with Homepage-styled Backdrop */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-[#080808] border-b border-white/5 z-10">
                {/* Master Background Image (Static when scrolling) */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none z-0 opacity-45" 
                    style={{ backgroundImage: "url('/storage/digital_kl_bg.png')" }}
                />

                {/* Ambient Static Warm Golden Blur Glow */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-fixed pointer-events-none z-0 opacity-40" 
                    style={{ 
                        backgroundImage: "url('/storage/hero_laptop_city.png')",
                        filter: 'blur(110px) brightness(0.65)'
                    }}
                />

                {/* Warm Amber-Gold Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold)]/5 via-transparent to-amber-500/10 z-0 pointer-events-none" />

                {/* Dark Overlays */}
                <div className="absolute inset-y-0 left-0 w-full lg:w-2/3 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-[#080808]/40 z-0 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-full lg:w-1/3 bg-gradient-to-l from-[#080808] via-[#080808]/60 to-[#080808]/40 z-0 pointer-events-none" />

                {/* Technical Line Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />
                
                {/* Tech Glows */}
                <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-[var(--gold)]/10 blur-[100px] pointer-events-none z-0" />
                <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-[var(--gold)]/5 blur-[90px] pointer-events-none z-0" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="badge mb-6">Hubungi Kami</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Mari <span className="text-[var(--gold)]">Berhubung</span></h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">Ada soalan? Ingin mendapatkan sebut harga? Hubungi kami dan kami akan membantu anda.</p>
                </div>
            </section>

            {/* Contact Details & Form Section (Premium Charcoal section with ambient glow & gold divider lines) */}
            <section className="py-28 bg-[#0c0c0e] border-y border-white/5 relative overflow-hidden z-10">
                {/* Soft top-centered amber radial glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--gold)]/5 blur-[100px] pointer-events-none z-0" />
                
                {/* Gold Accent Divider Lines */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-5 gap-16">
                        {/* Contact Info */}
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-6">Maklumat Hubungan</h3>
                                <div className="space-y-6">
                                    {[
                                        { 
                                            icon: (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                            ), 
                                            label: 'Emel', 
                                            value: settings.contact_email || 'info@lamanteknologi.com' 
                                        },
                                        { 
                                            icon: (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                            ), 
                                            label: 'Telefon', 
                                            value: settings.contact_phone || '+60-123456789' 
                                        },
                                        { 
                                            icon: (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                            ), 
                                            label: 'Alamat', 
                                            value: settings.contact_address || 'Kuala Lumpur, Malaysia' 
                                        },
                                    ].map((c, i) => (
                                        <div key={i} className="flex gap-4 group cursor-pointer">
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
                            <div className="card p-8 relative z-10">
                                <h4 className="text-white font-bold mb-3">Waktu Operasi</h4>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <p>Isnin - Jumaat: 9:00 AM - 6:00 PM</p>
                                    <p>Sabtu: 9:00 AM - 1:00 PM</p>
                                    <p>Ahad & Cuti Umum: Tutup</p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="lg:col-span-3">
                            {flash?.success && (
                                <div className="mb-6 p-4 rounded-xl bg-green-950/40 border border-green-500/30 text-green-400 text-sm">{flash.success}</div>
                            )}
                            <form onSubmit={submit} className="card p-8 space-y-6">
                                <h3 className="text-xl font-bold text-white mb-2">Hantar Mesej</h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {[
                                        { name: 'name', label: 'Nama *', type: 'text' },
                                        { name: 'email', label: 'Emel *', type: 'email' },
                                        { name: 'phone', label: 'Telefon', type: 'tel' },
                                        { name: 'company', label: 'Syarikat', type: 'text' },
                                    ].map(field => (
                                        <div key={field.name}>
                                            <label className="block text-sm font-medium text-white mb-2">{field.label}</label>
                                            <input type={field.type} value={data[field.name]} onChange={e => setData(field.name, e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.02] text-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 outline-none transition-all text-sm" />
                                            {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">Subjek *</label>
                                    <input type="text" value={data.subject} onChange={e => setData('subject', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.02] text-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 outline-none transition-all text-sm" />
                                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">Mesej *</label>
                                    <textarea value={data.message} onChange={e => setData('message', e.target.value)} rows={5}
                                        className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.02] text-white focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 outline-none transition-all text-sm resize-none" />
                                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                </div>
                                <button type="submit" disabled={processing} className="btn-primary w-full py-4 text-base disabled:opacity-50">
                                    {processing ? 'Menghantar...' : 'Hantar Mesej →'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
