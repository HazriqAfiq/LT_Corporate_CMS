import { usePage, Head, Link } from '@inertiajs/react';
import PromoLayout from '@/Layouts/PromoLayout';
import { XCircle, RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function PromoCancel() {
    const { order = {}, settings = {} } = usePage().props;

    return (
        <PromoLayout title="Transaksi Gagal / Dibatalkan" settings={settings} hideNavbar={true}>
            <Head>
                <title>Tempahan Dibatalkan | Laman Teknologi</title>
            </Head>

            <section className="relative pt-16 pb-24 overflow-hidden bg-[#08080a] min-h-[85vh] flex items-center z-10">
                <div className="max-w-xl w-full mx-auto px-4 relative z-10">
                    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />

                        {/* Glowing Cancel/Error Icon */}
                        <div className="inline-flex p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mb-6">
                            <XCircle className="w-10 h-10" />
                        </div>

                        <h2 className="text-3xl font-extrabold text-white mb-2">Transaksi Dibatalkan</h2>
                        <p className="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
                            Proses pembayaran tidak diselesaikan atau telah dibatalkan oleh pengguna. Sila pastikan maklumat kad atau akaun anda adalah tepat sebelum mencuba semula.
                        </p>

                        {/* Order Summary Reference */}
                        <div className="mt-8 p-6 bg-zinc-900/40 border border-zinc-900 rounded-2xl text-left space-y-3 max-w-md mx-auto">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500">Rujukan Tempahan:</span>
                                <span className="text-white font-mono font-semibold truncate pl-4" title={order.uuid}>{order.uuid}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500">Jumlah Tempahan:</span>
                                <span className="text-white font-bold">
                                    RM{parseFloat(order.amount).toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        {/* Reassurance text */}
                        <div className="mt-6 flex items-center justify-center gap-1.5 text-zinc-500 text-xs">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <span>Tiada sebarang caj dikenakan ke atas akaun anda.</span>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            <Link 
                                href={`/promosi/checkout/retry/${order.uuid}`} 
                                className="px-6 py-3.5 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 transition-all cursor-pointer"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Cuba Semula</span>
                            </Link>

                            <Link 
                                href="/promosi" 
                                className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-zinc-800 transition-all cursor-pointer"
                            >
                                <Home className="w-4 h-4 text-zinc-500" />
                                <span>Kembali ke Laman Promosi</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </PromoLayout>
    );
}
