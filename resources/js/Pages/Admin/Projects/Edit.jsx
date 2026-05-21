import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save, Trash } from 'lucide-react';
import RichTextEditor from '@/Components/Admin/RichTextEditor';
import ImageUploadZone from '@/Components/Admin/ImageUploadZone';
import ImageGallery from '@/Components/Admin/ImageGallery';

export default function Edit({ project }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: project.title || '',
        title_en: project.title_en || '',
        client: project.client || '',
        category: project.category || '',
        url: project.url || '',
        description: project.description || '',
        description_en: project.description_en || '',
        content: project.content || '',
        content_en: project.content_en || '',
        testimonial: project.testimonial || '',
        testimonial_en: project.testimonial_en || '',
        testimonial_author: project.testimonial_author || '',
        is_published: !!project.is_published,
        is_featured: !!project.is_featured,
        completed_at: project.completed_at ? project.completed_at.slice(0, 10) : '',
        order: project.order || 0,
        featured_image: null,
        gallery_images: [],
        keep_gallery: project.images || [],
        technologies: project.technologies || [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.projects.update', project.id));
    };

    const handleDelete = () => {
        if (confirm('Anda pasti ingin memadam projek ini?')) {
            router.delete(route('admin.projects.destroy', project.id));
        }
    };

    return (
        <AdminLayout header="Edit Projek">
            <Head title={`Edit ${project.title} | Admin`} />

            <div className="max-w-6xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <Link href={route('admin.projects.index')} className="text-zinc-500 hover:text-[var(--gold)] flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Kembali ke Senarai Projek
                    </Link>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-colors"
                    >
                        <Trash className="h-4 w-4 mr-2" />
                        Padam Projek
                    </button>
                </div>

                <form onSubmit={submit} className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Left Column (Main Content) */}
                    <div className="flex-1 space-y-6">
                        
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">Maklumat Projek</h2>
                                <p className="text-sm text-zinc-500 mt-1">Masukkan butiran utama, klien, kategori, dan URL projek.</p>
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
                                        {errors.title_en && <p className="mt-1 text-sm text-red-600">{errors.title_en}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Klien</label>
                                        <input
                                            type="text"
                                            value={data.client}
                                            onChange={e => setData('client', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        />
                                        {errors.client && <p className="mt-1 text-sm text-red-600">{errors.client}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Kategori</label>
                                        <select
                                            value={data.category}
                                            onChange={e => setData('category', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        >
                                            <option value="">Pilih Kategori</option>
                                            <option value="web">Pembangunan Web</option>
                                            <option value="mobile">Aplikasi Mudah Alih</option>
                                            <option value="system">Sistem</option>
                                            <option value="design">Rekabentuk UI/UX</option>
                                            <option value="cloud">Cloud & Hosting</option>
                                            <option value="ai">AI & Automasi</option>
                                        </select>
                                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">URL Projek</label>
                                        <input
                                            type="url"
                                            value={data.url}
                                            onChange={e => setData('url', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            placeholder="https://..."
                                        />
                                        {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Penerangan Ringkas (BM)</label>
                                    <textarea
                                        rows="2"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        placeholder="Ringkasan ringkas projek..."
                                    ></textarea>
                                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Penerangan Ringkas (EN)</label>
                                    <textarea
                                        rows="2"
                                        value={data.description_en}
                                        onChange={e => setData('description_en', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        placeholder="Brief project summary..."
                                    ></textarea>
                                    {errors.description_en && <p className="mt-1 text-sm text-red-600">{errors.description_en}</p>}
                                </div>

                            </div>
                        </div>

                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">Kandungan Utama</h2>
                                <p className="text-sm text-zinc-500 mt-1">Masukkan penerangan lengkap tentang projek.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">Kandungan Penuh (BM)</label>
                                    <RichTextEditor
                                        value={data.content}
                                        onChange={c => setData('content', c)}
                                    />
                                    {errors.content && <p className="mt-2 text-sm text-red-600">{errors.content}</p>}
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">Kandungan Penuh (EN)</label>
                                    <RichTextEditor
                                        value={data.content_en}
                                        onChange={c => setData('content_en', c)}
                                    />
                                    {errors.content_en && <p className="mt-2 text-sm text-red-600">{errors.content_en}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Testimonial Section */}
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">Testimoni Klien</h2>
                                <p className="text-sm text-zinc-500 mt-1">Masukkan maklum balas klien untuk projek ini.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Pemberi Testimoni</label>
                                    <input
                                        type="text"
                                        value={data.testimonial_author}
                                        onChange={e => setData('testimonial_author', e.target.value)}
                                        className="w-full md:w-1/2 rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        placeholder="Nama & Jawatan klien..."
                                    />
                                    {errors.testimonial_author && <p className="mt-1 text-sm text-red-600">{errors.testimonial_author}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Testimoni (BM)</label>
                                        <textarea
                                            rows="3"
                                            value={data.testimonial}
                                            onChange={e => setData('testimonial', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            placeholder="Maklum balas dalam BM..."
                                        ></textarea>
                                        {errors.testimonial && <p className="mt-1 text-sm text-red-600">{errors.testimonial}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Testimoni (EN)</label>
                                        <textarea
                                            rows="3"
                                            value={data.testimonial_en}
                                            onChange={e => setData('testimonial_en', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            placeholder="Maklum balas dalam EN..."
                                        ></textarea>
                                        {errors.testimonial_en && <p className="mt-1 text-sm text-red-600">{errors.testimonial_en}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Sidebar Settings) */}
                    <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
                        
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5">
                                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Status & Tetapan</h2>
                            </div>
                            <div className="p-4 space-y-4">
                                
                                <div className="flex items-center justify-between">
                                    <label htmlFor="is_published" className="text-sm font-medium text-zinc-300">
                                        Diterbitkan
                                    </label>
                                    <input
                                        id="is_published"
                                        type="checkbox"
                                        checked={data.is_published}
                                        onChange={e => setData('is_published', e.target.checked)}
                                        className="h-4 w-4 accent-[var(--gold)] border-white/10 rounded"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label htmlFor="is_featured" className="text-sm font-medium text-zinc-300">
                                        Pilihan Utama (Featured)
                                    </label>
                                    <input
                                        id="is_featured"
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={e => setData('is_featured', e.target.checked)}
                                        className="h-4 w-4 accent-[var(--gold)] border-white/10 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Tarikh Siap</label>
                                    <input
                                        type="date"
                                        value={data.completed_at}
                                        onChange={e => setData('completed_at', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                    />
                                    {errors.completed_at && <p className="mt-1 text-sm text-red-600">{errors.completed_at}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Susunan (Order)</label>
                                    <input
                                        type="number"
                                        value={data.order}
                                        onChange={e => setData('order', parseInt(e.target.value) || 0)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                    />
                                    {errors.order && <p className="mt-1 text-sm text-red-600">{errors.order}</p>}
                                </div>

                            </div>
                        </div>

                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5">
                                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Media & Imej</h2>
                            </div>
                            <div className="p-4 space-y-6">
                                
                                {/* Banner Upload */}
                                <div>
                                    <ImageUploadZone
                                        label="Imej Utama Projek"
                                        value={data.featured_image || (project.featured_image ? `/storage/${project.featured_image}` : null)}
                                        onChange={file => setData('featured_image', file)}
                                        recommendedSize="1920×1080"
                                        error={errors.featured_image}
                                    />
                                </div>

                                {/* Gallery Section */}
                                <div className="pt-4 border-t border-white/5">
                                    <ImageGallery
                                        label="Galeri Projek"
                                        existingImages={data.keep_gallery}
                                        newFiles={data.gallery_images}
                                        onAddFiles={(files) => setData('gallery_images', [...data.gallery_images, ...files].slice(0, 15))}
                                        onRemoveNew={(idx) => setData('gallery_images', data.gallery_images.filter((_, i) => i !== idx))}
                                        onRemoveExisting={(path) => setData('keep_gallery', data.keep_gallery.filter(p => p !== path))}
                                        maxImages={15}
                                    />
                                    {errors.gallery_images && <p className="mt-1 text-xs text-red-500">{errors.gallery_images}</p>}
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
                        className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[#080808] font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gold)] disabled:opacity-50 transition-colors"
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
