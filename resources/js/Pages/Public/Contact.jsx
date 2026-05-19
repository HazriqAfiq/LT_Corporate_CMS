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
            <section className="pt-32 pb-20 bg-navy-gradient">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="badge mb-6">Hubungi Kami</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Mari <span className="text-[var(--gold)]">Berhubung</span></h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">Ada soalan? Ingin mendapatkan sebut harga? Hubungi kami dan kami akan membantu anda.</p>
                </div>
            </section>

            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-5 gap-16">
                        {/* Contact Info */}
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-[var(--navy)] mb-6">Maklumat Hubungan</h3>
                                <div className="space-y-6">
                                    {[
                                        { icon: '📧', label: 'Emel', value: settings.contact_email || 'info@lamanteknologi.com' },
                                        { icon: '📞', label: 'Telefon', value: settings.contact_phone || '+60-123456789' },
                                        { icon: '📍', label: 'Alamat', value: settings.contact_address || 'Kuala Lumpur, Malaysia' },
                                    ].map((c, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 flex items-center justify-center text-xl flex-shrink-0">{c.icon}</div>
                                            <div>
                                                <p className="text-sm text-[var(--gray-400)]">{c.label}</p>
                                                <p className="text-[var(--navy)] font-medium">{c.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="card p-8 bg-navy-gradient">
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
                                <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">{flash.success}</div>
                            )}
                            <form onSubmit={submit} className="card p-8 space-y-6">
                                <h3 className="text-xl font-bold text-[var(--navy)] mb-2">Hantar Mesej</h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {[
                                        { name: 'name', label: 'Nama *', type: 'text' },
                                        { name: 'email', label: 'Emel *', type: 'email' },
                                        { name: 'phone', label: 'Telefon', type: 'tel' },
                                        { name: 'company', label: 'Syarikat', type: 'text' },
                                    ].map(field => (
                                        <div key={field.name}>
                                            <label className="block text-sm font-medium text-[var(--navy)] mb-2">{field.label}</label>
                                            <input type={field.type} value={data[field.name]} onChange={e => setData(field.name, e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg border border-[var(--gray-200)] focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 outline-none transition-all text-sm" />
                                            {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--navy)] mb-2">Subjek *</label>
                                    <input type="text" value={data.subject} onChange={e => setData('subject', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-[var(--gray-200)] focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 outline-none transition-all text-sm" />
                                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--navy)] mb-2">Mesej *</label>
                                    <textarea value={data.message} onChange={e => setData('message', e.target.value)} rows={5}
                                        className="w-full px-4 py-3 rounded-lg border border-[var(--gray-200)] focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 outline-none transition-all text-sm resize-none" />
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
