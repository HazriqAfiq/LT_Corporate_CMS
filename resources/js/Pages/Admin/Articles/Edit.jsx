import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save, Trash } from 'lucide-react';
import RichTextEditor from '@/Components/Admin/RichTextEditor';
import ImageUploadZone from '@/Components/Admin/ImageUploadZone';

export default function Edit({ article }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: article.title || '',
        title_en: article.title_en || '',
        excerpt: article.excerpt || '',
        excerpt_en: article.excerpt_en || '',
        content: article.content || '',
        content_en: article.content_en || '',
        is_published: !!article.is_published,
        published_at: article.published_at ? article.published_at.slice(0, 16) : '',
        meta_title: article.meta_title || '',
        meta_description: article.meta_description || '',
        featured_image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.articles.update', article.id));
    };

    const handleDelete = () => {
        if (confirm('Adakah anda pasti ingin memadam artikel ini?')) {
            router.delete(route('admin.articles.destroy', article.id));
        }
    };

    return (
        <AdminLayout header="Edit Artikel">
            <Head title={`Edit ${article.title} | Admin`} />

            <div className="max-w-5xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <Link href={route('admin.articles.index')} className="text-zinc-500 hover:text-[var(--gold)] flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Kembali ke Senarai Artikel
                    </Link>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-colors"
                    >
                        <Trash className="h-4 w-4 mr-2" />
                        Padam Artikel
                    </button>
                </div>

                <form onSubmit={submit} className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Left Column (Main Content) */}
                    <div className="flex-1 space-y-6">
                        
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">Maklumat Artikel</h2>
                                <p className="text-sm text-zinc-500 mt-1">Masukkan tajuk dan penerangan ringkas artikel.</p>
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Petikan Ringkas / Excerpt (BM)</label>
                                        <textarea
                                            rows="3"
                                            value={data.excerpt}
                                            onChange={e => setData('excerpt', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            placeholder="Ringkasan ringkas artikel..."
                                        ></textarea>
                                        {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Petikan Ringkas / Excerpt (EN)</label>
                                        <textarea
                                            rows="3"
                                            value={data.excerpt_en}
                                            onChange={e => setData('excerpt_en', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            placeholder="Brief article summary..."
                                        ></textarea>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">Kandungan Utama</h2>
                                <p className="text-sm text-zinc-500 mt-1">Tulis kandungan penuh artikel untuk kedua-dua bahasa.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">Kandungan (BM)</label>
                                    <RichTextEditor
                                        value={data.content}
                                        onChange={content => setData('content', content)}
                                    />
                                    {errors.content && <p className="mt-2 text-sm text-red-600">{errors.content}</p>}
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">Kandungan (EN)</label>
                                    <RichTextEditor
                                        value={data.content_en}
                                        onChange={content => setData('content_en', content)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">SEO (Search Engine Optimization)</h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Meta Title</label>
                                    <input
                                        type="text"
                                        value={data.meta_title}
                                        onChange={e => setData('meta_title', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        placeholder="Tajuk SEO..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Meta Description</label>
                                    <textarea
                                        rows="2"
                                        value={data.meta_description}
                                        onChange={e => setData('meta_description', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        placeholder="Penerangan SEO..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Sidebar Settings) */}
                    <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
                        
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5">
                                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Status & Penerbitan</h2>
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

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Tarikh Terbit (Penjadualan)</label>
                                    <input
                                        type="datetime-local"
                                        value={data.published_at}
                                        onChange={e => setData('published_at', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-4">
                                <ImageUploadZone
                                    label="Imej Utama Artikel"
                                    value={data.featured_image || (article.featured_image ? `/storage/${article.featured_image}` : null)}
                                    onChange={file => setData('featured_image', file)}
                                    recommendedSize="1200×630"
                                    error={errors.featured_image}
                                />
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
