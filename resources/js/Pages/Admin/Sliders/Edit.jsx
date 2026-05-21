import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save, UploadCloud, Trash, Info } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export default function Edit({ slider }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: slider.title || '',
        title_en: slider.title_en || '',
        subtitle: slider.subtitle || '',
        subtitle_en: slider.subtitle_en || '',
        description: slider.description || '',
        description_en: slider.description_en || '',
        image: null,
        button_text: slider.button_text || '',
        button_text_en: slider.button_text_en || '',
        button_url: slider.button_url || '',
        order: slider.order || 0,
        is_active: !!slider.is_active,
    });

    const [imagePreview, setImagePreview] = useState(slider.image ? `/storage/${slider.image}` : null);
    const [imageSize, setImageSize] = useState(null);

    const handleImageDrop = (file) => {
        if (!file) { setData('image', null); setImagePreview(slider.image ? `/storage/${slider.image}` : null); setImageSize(null); return; }
        setData('image', file);
        const url = URL.createObjectURL(file);
        setImagePreview(url);
        const img = new Image();
        img.onload = () => setImageSize(`${img.naturalWidth}×${img.naturalHeight}px`);
        img.src = url;
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
        maxSize: 5 * 1024 * 1024,
        multiple: false,
        onDrop: (accepted) => accepted[0] && handleImageDrop(accepted[0]),
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.sliders.update', slider.id));
    };

    const handleDelete = () => {
        if (confirm('Anda pasti ingin memadam slider ini?')) {
            router.delete(route('admin.sliders.destroy', slider.id));
        }
    };

    return (
        <AdminLayout header="Edit Slider">
            <Head title="Edit Slider | Admin" />

            <div className="max-w-5xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <Link href={route('admin.sliders.index')} className="text-zinc-500 hover:text-[var(--gold)] flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Kembali ke Senarai Slider
                    </Link>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent rounded  text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                        <Trash className="h-4 w-4 mr-1" />
                        Padam Slider
                    </button>
                </div>

                <form onSubmit={submit} className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Left Column (Main Content) */}
                    <div className="flex-1 space-y-6">
                        
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">Maklumat Kandungan</h2>
                                <p className="text-sm text-zinc-500 mt-1">Kandungan teks yang akan dipaparkan di atas imej slider.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Tajuk (BM) *</label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            required
                                        />
                                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Tajuk (EN)</label>
                                        <input
                                            type="text"
                                            value={data.title_en}
                                            onChange={e => setData('title_en', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Subtajuk (BM)</label>
                                        <input
                                            type="text"
                                            value={data.subtitle}
                                            onChange={e => setData('subtitle', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Subtajuk (EN)</label>
                                        <input
                                            type="text"
                                            value={data.subtitle_en}
                                            onChange={e => setData('subtitle_en', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Deskripsi / Teks Panjang (BM)</label>
                                        <textarea
                                            rows="3"
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Deskripsi / Teks Panjang (EN)</label>
                                        <textarea
                                            rows="3"
                                            value={data.description_en}
                                            onChange={e => setData('description_en', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        ></textarea>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">Butang Tindakan (Call to Action)</h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Teks Butang (BM)</label>
                                        <input
                                            type="text"
                                            value={data.button_text}
                                            onChange={e => setData('button_text', e.target.value)}
                                            placeholder="Cth: Ketahui Lebih Lanjut"
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Teks Butang (EN)</label>
                                        <input
                                            type="text"
                                            value={data.button_text_en}
                                            onChange={e => setData('button_text_en', e.target.value)}
                                            placeholder="Cth: Learn More"
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">URL Butang</label>
                                    <input
                                        type="url"
                                        value={data.button_url}
                                        onChange={e => setData('button_url', e.target.value)}
                                        placeholder="https://..."
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Sidebar Settings) */}
                    <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
                        
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5">
                                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Status & Susunan</h2>
                            </div>
                            <div className="p-4 space-y-4">
                                
                                <div className="flex items-center justify-between">
                                    <label htmlFor="is_active" className="text-sm font-medium text-zinc-300">
                                        Aktif
                                    </label>
                                    <input
                                        id="is_active"
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={e => setData('is_active', e.target.checked)}
                                        className="h-4 w-4 accent-[var(--gold)] border-white/10 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Susunan (Order)</label>
                                    <input
                                        type="number"
                                        value={data.order}
                                        onChange={e => setData('order', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-bold text-white uppercase tracking-wide">Imej Slider</h2>
                                    <p className="text-xs text-zinc-500 mt-0.5">Disyorkan: 1920×1080 px (16:9)</p>
                                </div>
                                {imageSize && (
                                    <span className="text-[10px] font-mono text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5 rounded-full border border-[var(--gold)]/20">
                                        {imageSize}
                                    </span>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                    <div className="absolute inset-0 rounded-xl overflow-hidden border-2 border-dashed border-white/10">
                                        {imagePreview ? (
                                            <div className="relative w-full h-full group">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '33.33% 33.33%' }} />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                    <label className="px-4 py-2 bg-[var(--gold)] text-[#080808] text-xs font-bold rounded-lg cursor-pointer">
                                                        Ganti Imej
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files[0] && handleImageDrop(e.target.files[0])} />
                                                    </label>
                                                    <button type="button" onClick={() => handleImageDrop(null)} className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg">Buang</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div {...getRootProps()} className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-colors ${ isDragActive ? 'bg-[var(--gold)]/5' : 'hover:bg-white/[0.02]' }`}>
                                                <input {...getInputProps()} />
                                                <UploadCloud className={`w-10 h-10 mb-2 ${isDragActive ? 'text-[var(--gold)]' : 'text-zinc-600'}`} />
                                                <p className="text-sm text-zinc-400 font-medium">{isDragActive ? 'Lepaskan imej...' : 'Tarik & lepas atau klik'}</p>
                                                <p className="text-xs text-zinc-600 mt-1">JPG, PNG, WEBP — Maks 5 MB</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {errors.image && <p className="mt-2 text-xs text-red-500">{errors.image}</p>}
                                <div className="mt-3 flex items-start gap-2 text-[11px] text-zinc-600">
                                    <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                    <span>Imej asal akan diganti sekiranya anda muat naik imej baru.</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </form>

                <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-[#080808] border-t border-white/5 p-4 px-6 flex justify-end gap-3 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button
                        type="button"
                        onClick={submit}
                        disabled={processing}
                        className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg  text-sm font-medium text-white bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[#080808] font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gold)] disabled:opacity-50 transition-colors"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>

            </div>
            
            <div className="h-20"></div>

        </AdminLayout>
    );
}
