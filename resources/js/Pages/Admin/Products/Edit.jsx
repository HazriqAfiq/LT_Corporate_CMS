import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save, Plus, X, Trash } from 'lucide-react';
import RichTextEditor from '@/Components/Admin/RichTextEditor';
import ImageUploadZone from '@/Components/Admin/ImageUploadZone';
import ImageGallery from '@/Components/Admin/ImageGallery';

export default function Edit({ product }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: product.name || '',
        name_en: product.name_en || '',
        category: product.category || '',
        description: product.description || '',
        description_en: product.description_en || '',
        content: product.content || '',
        content_en: product.content_en || '',
        features: product.features || [],
        features_en: product.features_en || [],
        price: product.price || '',
        demo_url: product.demo_url || '',
        order: product.order || 0,
        is_active: !!product.is_active,
        is_featured: !!product.is_featured,
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
        icon: null,
        featured_image: null,
        gallery_images: [],
        keep_gallery: Array.isArray(product.gallery_images) ? product.gallery_images : [],
    });

    const [iconPreview, setIconPreview] = useState(product.icon ? `/storage/${product.icon}` : null);
    const [featureInput, setFeatureInput] = useState('');
    const [featureEnInput, setFeatureEnInput] = useState('');

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('icon', file);
            const reader = new FileReader();
            reader.onloadend = () => setIconPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const addFeature = (e, lang) => {
        e.preventDefault();
        if (lang === 'ms' && featureInput.trim()) {
            setData('features', [...data.features, featureInput.trim()]);
            setFeatureInput('');
        } else if (lang === 'en' && featureEnInput.trim()) {
            setData('features_en', [...data.features_en, featureEnInput.trim()]);
            setFeatureEnInput('');
        }
    };

    const removeFeature = (index, lang) => {
        if (lang === 'ms') {
            const newFeatures = [...data.features];
            newFeatures.splice(index, 1);
            setData('features', newFeatures);
        } else {
            const newFeatures = [...data.features_en];
            newFeatures.splice(index, 1);
            setData('features_en', newFeatures);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.products.update', product.id));
    };

    const handleDelete = () => {
        if (confirm('Anda pasti ingin memadam produk ini?')) {
            router.delete(route('admin.products.destroy', product.id));
        }
    };

    return (
        <AdminLayout header="Edit Produk">
            <Head title={`Edit ${product.name} | Admin`} />

            <div className="max-w-6xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <Link href={route('admin.products.index')} className="text-zinc-500 hover:text-[var(--gold)] flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Kembali ke Senarai Produk
                    </Link>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-colors"
                    >
                        <Trash className="h-4 w-4 mr-2" />
                        Padam Produk
                    </button>
                </div>

                <form onSubmit={submit} className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Left Column (Main Content) */}
                    <div className="flex-1 space-y-6">
                        
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">Maklumat Produk</h2>
                                <p className="text-sm text-zinc-500 mt-1">Masukkan nama, harga, kategori, dan penerangan produk.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Nama Produk (BM) *</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            required
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Nama Produk (EN)</label>
                                        <input
                                            type="text"
                                            value={data.name_en}
                                            onChange={e => setData('name_en', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        />
                                        {errors.name_en && <p className="mt-1 text-sm text-red-600">{errors.name_en}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Kategori</label>
                                        <select
                                            value={data.category}
                                            onChange={e => setData('category', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        >
                                            <option value="">Pilih Kategori</option>
                                            <option value="Pengurusan">Pengurusan</option>
                                            <option value="Sokongan">Sokongan</option>
                                            <option value="AI">AI</option>
                                            <option value="Kolaborasi">Kolaborasi</option>
                                            <option value="Jualan">Jualan</option>
                                            <option value="Acara">Acara</option>
                                            <option value="Pematuhan">Pematuhan</option>
                                        </select>
                                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Harga (RM)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.price}
                                            onChange={e => setData('price', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            placeholder="Cth: 199.00"
                                        />
                                        {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">URL Demo</label>
                                        <input
                                            type="url"
                                            value={data.demo_url}
                                            onChange={e => setData('demo_url', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            placeholder="https://..."
                                        />
                                        {errors.demo_url && <p className="mt-1 text-sm text-red-600">{errors.demo_url}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Penerangan Ringkas (BM)</label>
                                    <textarea
                                        rows="2"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        placeholder="Ringkasan ringkas produk..."
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
                                        placeholder="Brief product summary..."
                                    ></textarea>
                                    {errors.description_en && <p className="mt-1 text-sm text-red-600">{errors.description_en}</p>}
                                </div>

                            </div>
                        </div>

                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">Kandungan Utama</h2>
                                <p className="text-sm text-zinc-500 mt-1">Masukkan penerangan lengkap tentang produk.</p>
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

                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">Ciri-ciri Produk (Features)</h2>
                                <p className="text-sm text-zinc-500 mt-1">Tambah senarai ciri utama produk anda.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    
                                    {/* Features BM */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Ciri-ciri (BM)</label>
                                        <div className="flex mb-2">
                                            <input
                                                type="text"
                                                value={featureInput}
                                                onChange={e => setFeatureInput(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && addFeature(e, 'ms')}
                                                className="flex-1 rounded-l-md border border-white/10 bg-[#080808] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                                placeholder="Tambah ciri dan tekan Enter"
                                            />
                                            <button
                                                type="button"
                                                onClick={e => addFeature(e, 'ms')}
                                                className="bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[#080808] font-bold transition-all duration-200 px-3 py-2 rounded-r-md flex items-center justify-center shrink-0"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {data.features.map((feature, idx) => (
                                                <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20">
                                                    {feature}
                                                    <button type="button" onClick={() => removeFeature(idx, 'ms')} className="ml-1.5 text-[var(--gold)] hover:text-white transition-colors">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        {errors.features && <p className="mt-1 text-sm text-red-600">{errors.features}</p>}
                                    </div>

                                    {/* Features EN */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">Ciri-ciri (EN)</label>
                                        <div className="flex mb-2">
                                            <input
                                                type="text"
                                                value={featureEnInput}
                                                onChange={e => setFeatureEnInput(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && addFeature(e, 'en')}
                                                className="flex-1 rounded-l-md border border-white/10 bg-[#080808] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                                placeholder="Tambah ciri (EN) dan tekan Enter"
                                            />
                                            <button
                                                type="button"
                                                onClick={e => addFeature(e, 'en')}
                                                className="bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[#080808] font-bold transition-all duration-200 px-3 py-2 rounded-r-md flex items-center justify-center shrink-0"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {data.features_en.map((feature, idx) => (
                                                <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20">
                                                    {feature}
                                                    <button type="button" onClick={() => removeFeature(idx, 'en')} className="ml-1.5 text-[var(--gold)] hover:text-white transition-colors">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        {errors.features_en && <p className="mt-1 text-sm text-red-600">{errors.features_en}</p>}
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* SEO Section */}
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">SEO (Search Engine Optimization)</h2>
                                <p className="text-sm text-zinc-500 mt-1">Tetapan mesra enjin carian untuk produk ini.</p>
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
                                    {errors.meta_title && <p className="mt-1 text-sm text-red-600">{errors.meta_title}</p>}
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
                                    {errors.meta_description && <p className="mt-1 text-sm text-red-600">{errors.meta_description}</p>}
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
                                
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Slug</label>
                                    <div className="flex bg-[#080808] rounded-md border border-white/10 px-3 py-2">
                                        <span className="text-zinc-500 text-sm whitespace-nowrap overflow-hidden text-ellipsis">/{product.slug}</span>
                                    </div>
                                </div>

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
                                
                                {/* Product Icon Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">Ikon Produk</label>
                                    <div className="flex items-center gap-4 bg-[#080808] border border-white/10 rounded-xl p-4">
                                        <div className="w-16 h-16 rounded-xl border border-white/10 bg-[#0c0c0e] flex items-center justify-center overflow-hidden shrink-0">
                                            {iconPreview ? (
                                                <img src={iconPreview} alt="Icon" className="w-full h-full object-contain p-1" />
                                            ) : (
                                                <span className="text-[10px] text-zinc-500">Tiada Ikon</span>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <label className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-white hover:bg-white/10 border border-white/10 cursor-pointer transition-colors">
                                                <span>Pilih Ikon</span>
                                                <input type="file" onChange={handleIconChange} accept="image/*" className="hidden" />
                                            </label>
                                            <p className="text-[9px] text-zinc-500">Cadangan saiz: 256x256px (PNG/SVG)</p>
                                            {errors.icon && <p className="mt-1 text-xs text-red-500">{errors.icon}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Banner Upload */}
                                <div className="pt-4 border-t border-white/5">
                                    <ImageUploadZone
                                        label="Imej Utama / Banner"
                                        value={data.featured_image || (product.featured_image ? `/storage/${product.featured_image}` : null)}
                                        onChange={file => setData('featured_image', file)}
                                        recommendedSize="1920×1080"
                                        error={errors.featured_image}
                                    />
                                </div>

                                {/* Gallery Section */}
                                <div className="pt-4 border-t border-white/5">
                                    <ImageGallery
                                        label="Galeri Imej Produk"
                                        existingImages={data.keep_gallery}
                                        newFiles={data.gallery_images}
                                        onAddFiles={(files) => setData('gallery_images', [...data.gallery_images, ...files].slice(0, 10))}
                                        onRemoveNew={(idx) => setData('gallery_images', data.gallery_images.filter((_, i) => i !== idx))}
                                        onRemoveExisting={(path) => setData('keep_gallery', data.keep_gallery.filter(p => p !== path))}
                                        maxImages={10}
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
