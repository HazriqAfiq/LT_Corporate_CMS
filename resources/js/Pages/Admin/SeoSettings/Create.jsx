import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        key: '',
        label: '',
        label_en: '',
        type: 'text',
        value: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.seo-settings.store'));
    };

    return (
        <AdminLayout header="Tambah Tetapan SEO">
            <Head title="Tambah Tetapan SEO | Admin" />

            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center">
                    <Link href={route('admin.seo-settings.index')} className="text-zinc-500 hover:text-[var(--gold)] flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Kembali ke Senarai Tetapan SEO
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    
                    <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5">
                            <h2 className="text-base font-bold text-white">Maklumat Tetapan SEO</h2>
                            <p className="text-sm text-zinc-500 mt-1">Sila isi dengan berhati-hati kerana kunci yang salah boleh menyebabkan isu di laman web.</p>
                        </div>
                        <div className="p-6 space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Kunci (Key) *</label>
                                    <input
                                        type="text"
                                        value={data.key}
                                        onChange={e => setData('key', e.target.value)}
                                        placeholder="cth: meta_title_home"
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] font-mono"
                                        required
                                    />
                                    <p className="mt-1 text-xs text-zinc-500">Mestilah unik dan tidak boleh diubah selepas dicipta.</p>
                                    {errors.key && <p className="mt-1 text-sm text-red-600">{errors.key}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Jenis</label>
                                    <select
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                    >
                                        <option value="text">Teks Pendek</option>
                                        <option value="textarea">Teks Panjang</option>
                                        <option value="image">Imej (URL/Path)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Label Paparan (BM)</label>
                                    <input
                                        type="text"
                                        value={data.label}
                                        onChange={e => setData('label', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                    />
                                    {errors.label && <p className="mt-1 text-sm text-red-600">{errors.label}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Label Paparan (EN)</label>
                                    <input
                                        type="text"
                                        value={data.label_en}
                                        onChange={e => setData('label_en', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                    />
                                    {errors.label_en && <p className="mt-1 text-sm text-red-600">{errors.label_en}</p>}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <label className="block text-sm font-medium text-zinc-300 mb-1">Nilai</label>
                                {data.type === 'textarea' ? (
                                    <textarea
                                        rows="4"
                                        value={data.value}
                                        onChange={e => setData('value', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] font-mono text-sm"
                                        placeholder="Masukkan kod meta tag atau teks panjang..."
                                    ></textarea>
                                ) : (
                                    <input
                                        type="text"
                                        value={data.value}
                                        onChange={e => setData('value', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        placeholder="Masukkan nilai..."
                                    />
                                )}
                                {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value}</p>}
                            </div>

                        </div>
                    </div>

                </form>

                <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-[#080808] border-t border-white/5 p-4 px-6 flex justify-end gap-3 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <Link
                        href={route('admin.seo-settings.index')}
                        className="inline-flex items-center px-4 py-2 border border-white/10 text-sm font-medium rounded-lg text-zinc-300 bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        Batal
                    </Link>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={processing}
                        className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[#080808] font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gold)] disabled:opacity-50 transition-colors"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {processing ? 'Menyimpan...' : 'Simpan Tetapan SEO'}
                    </button>
                </div>

            </div>
            
            <div className="h-20"></div>

        </AdminLayout>
    );
}
