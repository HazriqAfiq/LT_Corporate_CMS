import { useForm, usePage, Head } from '@inertiajs/react';
import PromoLayout from '@/Layouts/PromoLayout';
import { CreditCard, ArrowLeft, ShieldAlert, BadgePercent, CheckCircle2, XCircle } from 'lucide-react';

export default function MockCheckout() {
    const { order = {}, settings = {} } = usePage().props;
    const { post, processing } = useForm();

    const handlePay = (e) => {
        e.preventDefault();
        post(`/promosi/checkout/mock/${order.uuid}/pay`);
    };

    const handleCancel = (e) => {
        e.preventDefault();
        post(`/promosi/checkout/mock/${order.uuid}/cancel`);
    };

    return (
        <PromoLayout title="Simulasi Pembayaran Sandbox" settings={settings}>
            <Head>
                <title>Gerbang Pembayaran Sandbox | Laman Teknologi</title>
            </Head>

            <section className="relative pt-16 pb-24 overflow-hidden bg-[#0a0a0c] min-h-[85vh] flex items-center z-10">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-yellow-500/5 blur-[120px] pointer-events-none z-0" />
                
                <div className="max-w-md w-full mx-auto px-4 relative z-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex p-3 rounded-full bg-zinc-900 border border-zinc-800 text-[var(--gold)] mb-4">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-white">Gerbang Pembayaran Ujian</h2>
                        <p className="text-zinc-500 text-xs mt-1">Simulasi Pembayaran Selamat (Sandbox Environment)</p>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-2xl space-y-6">
                        {/* Sandbox Alert warning */}
                        <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 text-yellow-400/90 rounded-2xl flex gap-3 text-xs leading-relaxed">
                            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-yellow-500" />
                            <div>
                                <strong>Mod Simulasi Sandbox Aktif:</strong><br />
                                Ini ialah paparan ujian pembayaran. Tiada wang sebenar akan ditolak dari akaun anda. Sila klik <strong>Bayar Sekarang</strong> untuk melengkapkan tempahan.
                            </div>
                        </div>

                        {/* Order Details Invoice */}
                        <div className="border-y border-zinc-900 py-4 space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500">Nama Pelanggan:</span>
                                <span className="text-white font-semibold">{order.name}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500">Emel:</span>
                                <span className="text-white font-semibold">{order.email}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500">No. Telefon:</span>
                                <span className="text-white font-semibold">{order.phone}</span>
                            </div>
                            {order.company && (
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-zinc-500">Syarikat:</span>
                                    <span className="text-white font-semibold">{order.company}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500">Pakej:</span>
                                <span className="text-[var(--gold)] font-bold">Promo Landing Page</span>
                            </div>
                        </div>

                        {/* Amount Box */}
                        <div className="p-4 bg-zinc-900/60 border border-zinc-900 rounded-2xl flex justify-between items-center">
                            <span className="text-sm font-bold text-zinc-300">Jumlah Perlu Dibayar:</span>
                            <span className="text-xl font-black text-white">
                                RM{parseFloat(order.amount).toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        {/* Simulation buttons */}
                        <form onSubmit={handlePay} className="space-y-3">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-600/10 hover:shadow-green-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Bayar Sekarang (Berjaya)</span>
                            </button>
                        </form>

                        <form onSubmit={handleCancel}>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full py-3 border border-zinc-800 bg-transparent text-zinc-400 hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Batalkan Transaksi</span>
                            </button>
                        </form>
                    </div>

                    {/* Back link */}
                    <div className="text-center mt-6">
                        <a 
                            href="/promosi" 
                            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            <span>Kembali ke Laman Promosi</span>
                        </a>
                    </div>
                </div>
            </section>
        </PromoLayout>
    );
}
