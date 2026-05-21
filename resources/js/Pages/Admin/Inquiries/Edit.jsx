import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save, Trash, Check, CheckCircle2, User, Mail, Phone, Briefcase, Calendar } from 'lucide-react';

export default function Edit({ inquiry }) {
    const { data, setData, put, processing, errors } = useForm({
        is_read: !!inquiry.is_read,
        replied_at: inquiry.replied_at ? inquiry.replied_at.slice(0, 16) : '',
        admin_notes: inquiry.admin_notes || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.inquiries.update', inquiry.id));
    };

    const handleDelete = () => {
        if (confirm('Anda pasti ingin memadam pertanyaan ini?')) {
            router.delete(route('admin.inquiries.destroy', inquiry.id));
        }
    };

    const handleMarkAsRead = () => {
        setData('is_read', true);
        router.post(`/admin/inquiries/${inquiry.id}/mark-as-read`, {}, { 
            preserveScroll: true,
            onSuccess: () => {
                // Form state is updated by the server, but we can optimistically update it here if needed
            }
        });
    };

    return (
        <AdminLayout header="Lihat Pertanyaan">
            <Head title={`Pertanyaan dari ${inquiry.name} | Admin`} />

            <form onSubmit={submit} className="max-w-5xl mx-auto px-4">
                
                {/* Header Back Button */}
                <div className="mb-6 flex justify-between items-center">
                    <Link href={route('admin.inquiries.index')} className="text-zinc-500 hover:text-[var(--gold)] flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        Kembali ke Senarai Pertanyaan
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Left Column (Message Details) */}
                    <div className="flex-1 space-y-6">
                        
                        {/* Sender Info Card */}
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                            <div className="p-4 border-b border-white/5 bg-[#080808]/50">
                                <h2 className="text-sm font-bold text-white uppercase tracking-wide">Maklumat Penghantar</h2>
                            </div>
                            <div className="p-6 bg-[#0c0c0e]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                    <div className="flex items-start">
                                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 border border-white/5">
                                            <User className="w-4.5 h-4.5 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Nama Penuh</p>
                                            <p className="text-sm font-semibold text-white">{inquiry.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 border border-white/5">
                                            <Mail className="w-4.5 h-4.5 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Alamat Emel</p>
                                            <a href={`mailto:${inquiry.email}`} className="text-sm font-semibold text-[var(--gold)] hover:underline transition-colors">{inquiry.email}</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 border border-white/5">
                                            <Phone className="w-4.5 h-4.5 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Nombor Telefon</p>
                                            {inquiry.phone ? (
                                                <a href={`tel:${inquiry.phone}`} className="text-sm font-semibold text-white hover:text-[var(--gold)] transition-colors">{inquiry.phone}</a>
                                            ) : (
                                                <p className="text-sm font-semibold text-zinc-600">-</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 border border-white/5">
                                            <Briefcase className="w-4.5 h-4.5 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Nama Syarikat</p>
                                            <p className="text-sm font-semibold text-white">{inquiry.company || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Message Card */}
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                            <div className="p-4 border-b border-white/5 bg-[#080808]/50 flex justify-between items-center">
                                <h2 className="text-sm font-bold text-white uppercase tracking-wide">Mesej Pertanyaan</h2>
                                <div className="flex items-center text-xs text-zinc-500 font-medium">
                                    <Calendar className="w-4 h-4 mr-1.5" />
                                    {new Date(inquiry.created_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                            <div className="p-6 bg-[#0c0c0e]">
                                <h3 className="text-base font-bold text-white mb-4 border-l-2 border-[var(--gold)] pl-3">{inquiry.subject}</h3>
                                <div className="prose prose-invert max-w-none">
                                    <p className="whitespace-pre-wrap text-zinc-300 text-sm leading-relaxed bg-[#080808] p-4 rounded-xl border border-white/5">{inquiry.message}</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Admin Actions) */}
                    <div className="w-full lg:w-96 flex-shrink-0">
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden shadow-xl sticky top-24">
                            <div className="p-4 border-b border-white/5 bg-[#080808]/50">
                                <h2 className="text-sm font-bold text-white uppercase tracking-wide">Tindakan Pengurusan</h2>
                            </div>
                            <div className="p-6 space-y-6 bg-[#0c0c0e]">
                                
                                <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-[#080808] transition-all duration-300 hover:border-white/10">
                                    <div className="flex items-center">
                                        {data.is_read ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2.5 flex-shrink-0" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-white/10 mr-2.5 flex-shrink-0"></div>
                                        )}
                                        <label htmlFor="is_read" className="text-sm font-semibold text-white cursor-pointer select-none">
                                            Telah Dibaca
                                        </label>
                                    </div>
                                    <input
                                        id="is_read"
                                        type="checkbox"
                                        checked={data.is_read}
                                        onChange={e => setData('is_read', e.target.checked)}
                                        className="h-5 w-5 accent-[var(--gold)] border-white/10 rounded cursor-pointer transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Tarikh Dibalas</label>
                                    <input
                                        type="datetime-local"
                                        value={data.replied_at}
                                        onChange={e => setData('replied_at', e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-[#080808] text-white px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] hover:border-white/20"
                                    />
                                    <p className="mt-1.5 text-[10px] text-zinc-500 leading-normal">Kosongkan sekiranya belum membalas e-mel atau pertanyaan.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Nota Admin (Dalaman)</label>
                                    <textarea
                                        rows="5"
                                        value={data.admin_notes}
                                        onChange={e => setData('admin_notes', e.target.value)}
                                        placeholder="Tulis catatan perbincangan, tindakan susulan atau rujukan..."
                                        className="w-full rounded-lg border border-white/10 bg-[#080808] text-white px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] hover:border-white/20 placeholder-zinc-600"
                                    ></textarea>
                                </div>
                                
                            </div>
                        </div>
                    </div>

                </div>

                {/* Fixed Bottom Save/Cancel/Delete Actions Bar */}
                <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-[#080808] border-t border-white/5 p-4 px-6 flex justify-between items-center z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
                    <div>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 border border-red-500/20 rounded-lg text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <Trash className="h-4 w-4 mr-2" />
                            Padam
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.inquiries.index')}
                            className="inline-flex items-center px-5 py-2.5 border border-white/10 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/[0.02] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
                        >
                            Kembali
                        </Link>
                        {!inquiry.is_read && (
                            <button
                                type="button"
                                onClick={handleMarkAsRead}
                                className="inline-flex items-center px-5 py-2.5 border border-emerald-500/20 rounded-lg text-sm font-bold text-emerald-500 hover:bg-emerald-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                                <Check className="h-4 w-4 mr-2" />
                                Tandai Dibaca
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg text-sm font-bold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[#080808] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gold)] disabled:opacity-50"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </div>

            </form>
            
            <div className="h-24"></div>

        </AdminLayout>
    );
}
