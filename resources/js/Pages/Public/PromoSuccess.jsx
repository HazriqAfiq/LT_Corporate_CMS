import { usePage, Head, Link } from '@inertiajs/react';
import PromoLayout from '@/Layouts/PromoLayout';
import { CheckCircle2, MessageCircle, Home, Calendar, Mail, Phone, ChevronRight } from 'lucide-react';

export default function PromoSuccess() {
    const { order = {}, settings = {} } = usePage().props;

    // Build clean WhatsApp link
    const rawPhone = settings.contact_phone || '+60123456789';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const defaultWA = cleanPhone.startsWith('60') ? cleanPhone : '60' + cleanPhone.replace(/^0/, '');
    
    const waText = encodeURIComponent(`Hai Laman Teknologi, saya telah membuat tempahan promosi Landing Page Khas. \n\nNama: ${order.name}\nEmel: ${order.email}\nUUID: ${order.uuid}`);
    const whatsappUrl = `https://wa.me/${defaultWA}?text=${waText}`;

    return (
        <PromoLayout title="Pembayaran Berjaya" settings={settings} hideNavbar={true}>
            <Head>
                <title>Tempahan Berjaya | Laman Teknologi</title>
            </Head>

            <section className="relative pt-16 pb-24 overflow-hidden bg-[#08080a] min-h-[90vh] flex items-center z-10">
                <div className="max-w-xl w-full mx-auto px-4 relative z-10">
                    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />

                        {/* Success Icon */}
                        <div className="inline-flex p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>

                        <h2 className="text-3xl font-extrabold text-white mb-2">Tempahan Anda Diterima!</h2>
                        <p className="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
                            Pembayaran anda telah disahkan. Terima kasih kerana memilih Laman Teknologi sebagai rakan digital anda.
                        </p>

                        {/* Invoice Receipt details card */}
                        <div className="mt-8 p-6 bg-zinc-900/40 border border-zinc-900 rounded-2xl text-left space-y-4">
                            <h4 className="text-white font-bold text-sm border-b border-zinc-800 pb-2">Ringkasan Tempahan</h4>
                            
                            <div className="grid grid-cols-2 gap-y-3 text-xs">
                                <span className="text-zinc-500">Nama Pelanggan:</span>
                                <span className="text-white font-semibold text-right">{order.name}</span>
                                
                                <span className="text-zinc-500">Jumlah Bayaran:</span>
                                <span className="text-emerald-400 font-bold text-right">
                                    RM{parseFloat(order.amount).toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                                </span>
                                
                                <span className="text-zinc-500">Kaedah Bayaran:</span>
                                <span className="text-white font-semibold text-right uppercase">
                                    {order.payment_gateway === 'stripe' ? 'Stripe Gateway' : (order.payment_gateway === 'chip' ? 'CHIP Gateway' : 'Simulasi Sandbox')}
                                </span>

                                <span className="text-zinc-500">Rujukan ID:</span>
                                <span className="text-zinc-400 font-mono text-[10px] text-right truncate pl-4" title={order.payment_id}>
                                    {order.payment_id || '-'}
                                </span>

                                <span className="text-zinc-500">Tarikh Transaksi:</span>
                                <span className="text-white text-right">
                                    {new Date(order.created_at).toLocaleDateString('ms-MY', { 
                                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Next steps instruction alert */}
                        <div className="mt-6 p-4 rounded-2xl bg-zinc-900/20 border border-zinc-800 text-left text-xs leading-relaxed space-y-2">
                            <p className="text-zinc-300 font-bold flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-[var(--gold)]" />
                                Langkah Seterusnya:
                            </p>
                            <p className="text-zinc-400">
                                Pasukan teknikal kami akan menghubungi anda melalui telefon/emel dalam masa 24 jam untuk berbincang mengenai pemilihan nama domain, reka bentuk, dan keperluan kandungan.
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-8 flex justify-center">
                            <Link 
                                href="/promosi" 
                                className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-zinc-800 transition-all cursor-pointer"
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
