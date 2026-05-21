import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save, UploadCloud, Info } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        role: '',
        role_en: '',
        image: null,
        order: 0,
        is_active: true,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [imageSize, setImageSize] = useState(null);

    const handleImageDrop = (file) => {
        if (!file) {
            setData('image', null);
            setImagePreview(null);
            setImageSize(null);
            return;
        }
        setData('image', file);
        const url = URL.createObjectURL(file);
        setImagePreview(url);
        const img = new Image();
        img.onload = () => setImageSize(`${img.naturalWidth}×${img.naturalHeight}px`);
        img.src = url;
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
        maxSize: 2 * 1024 * 1024,
        multiple: false,
        onDrop: (accepted) => accepted[0] && handleImageDrop(accepted[0]),
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.team-members.store'));
    };

    return (
        <AdminLayout header="Tambah Ahli Pasukan">
            <Head title="Tambah Ahli Pasukan | Admin" />

            <div className="max-w-5xl mx-auto">
                <div className="mb-6 flex items-center">
                    <Link
                        href={route('admin.team-members.index')}
                        className="text-zinc-500 hover:text-[var(--gold)] flex items-center transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Kembali ke Senarai Pasukan
                    </Link>
                </div>

                <form onSubmit={submit} className="flex flex-col lg:flex-row gap-6">
                    {/* Left Column - Form Fields */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">Maklumat Ahli Pasukan</h2>
                                <p className="text-sm text-zinc-500 mt-1">Maklumat asas seperti nama dan jawatan ahli pasukan.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Nama Penuh *</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        placeholder="e.g. Ahmad Razif"
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Peranan / Jawatan (BM) *</label>
                                        <input
                                            type="text"
                                            value={data.role}
                                            onChange={(e) => setData('role', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            placeholder="e.g. CEO & Pengasas"
                                            required
                                        />
                                        {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Peranan / Jawatan (EN)</label>
                                        <input
                                            type="text"
                                            value={data.role_en}
                                            onChange={(e) => setData('role_en', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            placeholder="e.g. CEO & Founder"
                                        />
                                        {errors.role_en && <p className="mt-1 text-sm text-red-500">{errors.role_en}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Susunan Paparan (Order)</label>
                                        <input
                                            type="number"
                                            value={data.order}
                                            onChange={(e) => setData('order', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            min="0"
                                        />
                                        {errors.order && <p className="mt-1 text-sm text-red-500">{errors.order}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">Status Aktif</label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="is_active"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                                className="w-4 h-4 rounded border-white/10 bg-[#080808] text-[var(--gold)] focus:ring-[var(--gold)] accent-[var(--gold)]"
                                            />
                                            <label htmlFor="is_active" className="text-sm text-zinc-400">
                                                Aktif (Dipaparkan di laman utama)
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Avatar Upload */}
                    <div className="w-full lg:w-[320px] shrink-0">
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-bold text-white uppercase tracking-wide">Gambar Profil *</h2>
                                    <p className="text-[10px] text-zinc-500 mt-0.5">Nisbah 4:5 disyorkan</p>
                                </div>
                                {imageSize && (
                                    <span className="text-[9px] font-mono text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5 rounded-full border border-[var(--gold)]/20">
                                        {imageSize}
                                    </span>
                                )}
                            </div>
                            <div className="p-6 flex flex-col items-center">
                                {/* Circular Avatar Frame Container */}
                                <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-dashed border-white/10 bg-[#080808] flex items-center justify-center transition-all duration-300">
                                    {imagePreview ? (
                                        <div className="relative w-full h-full group">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                <label className="px-3 py-1 bg-[var(--gold)] text-[#080808] text-[10px] font-bold rounded cursor-pointer hover:opacity-90">
                                                    Ganti
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => e.target.files[0] && handleImageDrop(e.target.files[0])}
                                                    />
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleImageDrop(null)}
                                                    className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold rounded hover:bg-red-700"
                                                >
                                                    Buang
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            {...getRootProps()}
                                            className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-colors p-4 rounded-full ${
                                                isDragActive ? 'bg-[var(--gold)]/5' : 'hover:bg-white/[0.02]'
                                            }`}
                                        >
                                            <input {...getInputProps()} />
                                            <UploadCloud className={`w-8 h-8 mb-2 ${isDragActive ? 'text-[var(--gold)]' : 'text-zinc-600'}`} />
                                            <p className="text-xs text-zinc-400 font-medium text-center">
                                                {isDragActive ? 'Lepas...' : 'Tarik & lepas imej'}
                                            </p>
                                            <p className="text-[10px] text-zinc-600 mt-1 text-center">PNG, JPG, WEBP</p>
                                        </div>
                                    )}
                                </div>
                                {errors.image && <p className="mt-3 text-xs text-red-500 text-center">{errors.image}</p>}
                                <div className="mt-4 flex items-start gap-2 text-[11px] text-zinc-600 leading-normal">
                                    <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                    <span>Muat naik foto headshot formal dengan latar belakang solid. Maksimum saiz fail adalah 2 MB.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Floating Bottom Sticky Bar */}
                <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-[#080808] border-t border-white/5 p-4 px-6 flex justify-end gap-3 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <Link
                        href={route('admin.team-members.index')}
                        className="inline-flex items-center px-4 py-2 border border-white/10 rounded-lg text-sm font-medium text-zinc-400 bg-transparent hover:bg-white/5 hover:text-white transition-all"
                    >
                        Batal
                    </Link>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={processing || !data.image}
                        className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg text-sm font-bold text-[#080808] bg-[var(--gold)] hover:opacity-90 disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gold)] shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {processing ? 'Menyimpan...' : 'Simpan Ahli Pasukan'}
                    </button>
                </div>
            </div>

            <div className="h-24"></div>
        </AdminLayout>
    );
}
