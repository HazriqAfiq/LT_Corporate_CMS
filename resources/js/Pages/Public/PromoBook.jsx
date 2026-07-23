import { useForm, usePage, Link } from '@inertiajs/react';
import PromoLayout from '@/Layouts/PromoLayout';
import {
    ArrowRight, ShieldCheck, ArrowLeft, CreditCard,
    User, Mail, Phone, Building2, FileText, CheckCircle2, Sparkles
} from 'lucide-react';

export default function PromoBook() {
    const {
        settings = {},
        currentPrice = 1000.00,
        remainingSlots = 20,
        stripeConfigured = false,
        chipConfigured = false,
        errors: flashErrors = {}
    } = usePage().props;

    const isSlotsFull = remainingSlots <= 0;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        notes: '',
        payment_gateway: 'chip',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/promosi/tempah');
    };

    const inputClass = (field) =>
        `w-full px-4 py-3 rounded-xl border ${errors[field] ? 'border-red-500/60 bg-red-500/5' : 'border-zinc-800 bg-zinc-900/50'} text-white text-sm placeholder-zinc-600 focus:border-yellow-500/60 focus:ring-2 focus:ring-yellow-500/15 outline-none transition-all duration-200`;

    return (
        <PromoLayout title="Tempah Sekarang — Promosi Landing Page Profesional" settings={settings} hideNavbar={true}>

            {/* Back link */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
                <Link
                    href="/promosi"
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors duration-200"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Laman Promosi</span>
                </Link>
            </div>

            <section className="relative pb-20 overflow-hidden z-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">

                    {/* Page header */}
                    <div className="text-center pt-2 pb-6">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
                            Tempah Slot Anda <span className="text-yellow-400">Sekarang</span>
                        </h1>
                        <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
                            Isi maklumat di bawah untuk meneruskan proses tempahan dan pembayaran. Slot terhad — jangan tunggu lagi!
                        </p>
                    </div>

                    {/* Main booking form card */}
                    <div className="relative rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-2xl overflow-hidden">
                        {/* Gold top accent */}
                        <div className="h-1 w-full bg-gradient-to-r from-yellow-400 to-amber-500" />

                        <div className="p-8 sm:p-10">

                            {/* Price summary */}
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 mb-8">
                                <div>
                                    <p className="text-zinc-400 text-xs mb-0.5">Pakej yang dipilih</p>
                                    <p className="text-white font-bold text-sm">Landing Page Profesional Khas</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-zinc-500 text-xs line-through">RM2,500</p>
                                    <p className="text-white font-extrabold text-xl">
                                        RM{currentPrice.toLocaleString('ms-MY', { minimumFractionDigits: 0 })}
                                    </p>
                                    {!isSlotsFull && (
                                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">JIMAT RM1,500</span>
                                    )}
                                </div>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Section: Personal Info */}
                                <div>
                                    <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                                        <User className="w-4 h-4 text-yellow-400" />
                                        Maklumat Peribadi
                                    </h3>

                                    <div className="space-y-4">
                                        {/* Name */}
                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                                                Nama Penuh <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                id="book-name"
                                                type="text"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                className={inputClass('name')}
                                                placeholder="cth: Hazriq Afiq"
                                                required
                                            />
                                            {errors.name && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><span>⚠</span>{errors.name}</p>}
                                        </div>

                                        {/* Email & Phone */}
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                                                    <span className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-zinc-400" />Emel <span className="text-red-400">*</span></span>
                                                </label>
                                                <input
                                                    id="book-email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={e => setData('email', e.target.value)}
                                                    className={inputClass('email')}
                                                    placeholder="nama@syarikat.com"
                                                    required
                                                />
                                                {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                                                    <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-zinc-400" />No. Telefon <span className="text-red-400">*</span></span>
                                                </label>
                                                <input
                                                    id="book-phone"
                                                    type="tel"
                                                    value={data.phone}
                                                    onChange={e => setData('phone', e.target.value)}
                                                    className={inputClass('phone')}
                                                    placeholder="cth: 0123456789"
                                                    required
                                                />
                                                {errors.phone && <p className="text-red-400 text-xs mt-1.5">{errors.phone}</p>}
                                            </div>
                                        </div>

                                        {/* Company */}
                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                                                <span className="flex items-center gap-1.5"><Building2 className="w-3 h-3 text-zinc-400" />Nama Syarikat / Organisasi <span className="text-zinc-600 font-normal">(Opsional)</span></span>
                                            </label>
                                            <input
                                                id="book-company"
                                                type="text"
                                                value={data.company}
                                                onChange={e => setData('company', e.target.value)}
                                                className={inputClass('company')}
                                                placeholder="cth: Laman Teknologi Sdn Bhd"
                                            />
                                            {errors.company && <p className="text-red-400 text-xs mt-1.5">{errors.company}</p>}
                                        </div>

                                        {/* Notes */}
                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                                                <span className="flex items-center gap-1.5"><FileText className="w-3 h-3 text-zinc-400" />Nota / Keperluan Tambahan <span className="text-zinc-600 font-normal">(Opsional)</span></span>
                                            </label>
                                            <textarea
                                                id="book-notes"
                                                value={data.notes}
                                                onChange={e => setData('notes', e.target.value)}
                                                rows={3}
                                                className={`${inputClass('notes')} resize-none`}
                                                placeholder="cth: Saya memerlukan laman web untuk perniagaan butik fesyen..."
                                            />
                                            {errors.notes && <p className="text-red-400 text-xs mt-1.5">{errors.notes}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Submit */}
                                <div>
                                    <button
                                        id="book-submit"
                                        type="submit"
                                        disabled={processing}
                                        className="group w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-extrabold text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                                </svg>
                                                <span>Memproses...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Teruskan ke Pembayaran</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>

                                    <div className="flex items-center justify-center gap-2 mt-4 text-zinc-500 text-xs">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        <span>Maklumat anda dilindungi dan disulitkan sepenuhnya</span>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                        {[
                            { icon: ShieldCheck, label: 'Pembayaran Selamat', sub: 'SSL & Enkripsi penuh' },
                            { icon: CheckCircle2, label: 'Slot Terhad', sub: `${remainingSlots} lagi tersedia` },
                            { icon: Sparkles, label: 'Jaminan Kualiti', sub: 'Standard profesional' },
                        ].map((t, i) => {
                            const Icon = t.icon;
                            return (
                                <div key={i} className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/20">
                                    <Icon className="w-5 h-5 text-yellow-400 mb-1" />
                                    <p className="text-white font-semibold text-[11px]">{t.label}</p>
                                    <p className="text-zinc-500 text-[10px]">{t.sub}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </PromoLayout>
    );
}
