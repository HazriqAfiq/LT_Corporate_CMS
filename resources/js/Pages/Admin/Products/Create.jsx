import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import { ArrowLeft, Save, Plus, X, Check } from 'lucide-react';
import RichTextEditor from '@/Components/Admin/RichTextEditor';
import MediaSelectorInput from '@/Components/Media/MediaSelectorInput';
import ToggleSwitch from '@/Components/Admin/ToggleSwitch';
import UnsavedChangesModal from '@/Components/Admin/UnsavedChangesModal';

export default function Create() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, isDirty, setError, clearErrors } = useForm({
        name: '',
        name_en: '',
        category: '',
        description: '',
        description_en: '',
        content: '',
        content_en: '',
        features: [],
        features_en: [],
        price: '',
        demo_url: '',
        order: 0,
        is_active: true,
        is_featured: false,
        meta_title: '',
        meta_description: '',
        icon: null,
        featured_media_id: null,
        gallery_media_ids: [],
    });

    const [showUnsavedModal, setShowUnsavedModal] = React.useState(false);
    const [pendingNavUrl, setPendingNavUrl] = React.useState(null);
    const [showTick, setShowTick] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleBackNav = (e) => {
        e.preventDefault();
        if (isDirty) {
            setPendingNavUrl(route('admin.products.index'));
            setShowUnsavedModal(true);
        } else {
            router.visit(route('admin.products.index'));
        }
    };

    const handleNavDiscard = () => {
        setShowUnsavedModal(false);
        router.visit(pendingNavUrl || route('admin.products.index'));
    };


    const touched = React.useRef({});

    const [mirrorEnabled, setMirrorEnabled] = React.useState(() => (typeof window !== 'undefined' ? localStorage.getItem('mirror_enabled') !== 'false' : true));

    const handleMirrorToggle = (checked) => {
        setMirrorEnabled(checked);
        localStorage.setItem('mirror_enabled', checked ? 'true' : 'false');
    };
    const [iconPreview, setIconPreview] = useState(null);
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

    const handleBilingualChange = (field, val) => {
        touched.current[field] = true;
        const isEn = field.endsWith('_en');
        const counterpart = isEn ? field.slice(0, -3) : `${field}_en`;
        
        if (mirrorEnabled && !touched.current[counterpart]) {
            setData(prev => ({
                ...prev,
                [field]: val,
                [counterpart]: val
            }));
        } else {
            setData(field, val);
        }
    };

    const addFeature = (e, lang) => {
        e.preventDefault();
        if (lang === 'ms' && featureInput.trim()) {
            const val = featureInput.trim();
            setFeatureInput('');
            setTouched(prev => ({ ...prev, features: true }));
            setData(prev => {
                if (!touched.features_en) {
                    return {
                        ...prev,
                        features: [...prev.features, val],
                        features_en: [...prev.features_en, val]
                    };
                }
                return {
                    ...prev,
                    features: [...prev.features, val]
                };
            });
        } else if (lang === 'en' && featureEnInput.trim()) {
            const val = featureEnInput.trim();
            setFeatureEnInput('');
            setTouched(prev => ({ ...prev, features_en: true }));
            setData(prev => {
                if (!touched.features) {
                    return {
                        ...prev,
                        features_en: [...prev.features_en, val],
                        features: [...prev.features, val]
                    };
                }
                return {
                    ...prev,
                    features_en: [...prev.features_en, val]
                };
            });
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
        setLoading(true);
        clearErrors();

        window.axios.post(route('admin.products.store'), data)
            .then(() => {
                setShowTick(true);
                setTimeout(() => {
                    setShowTick(false);
                    router.visit(route('admin.products.index'));
                }, 1500);
            })
            .catch(err => {
                setLoading(false);
                if (err.response && err.response.status === 422) {
                    const validationErrors = err.response.data.errors;
                    const formattedErrors = {};
                    Object.keys(validationErrors).forEach(key => {
                        formattedErrors[key] = validationErrors[key][0];
                    });
                    setError(formattedErrors);
                } else {
                    alert('Gagal menyimpan maklumat.');
                }
            });
    };

    return (
        <AdminLayout header={t('add_product')}>
            <Head title={`${t('add_product')} | Admin`} />

            <div className="max-w-6xl mx-auto">
                <div className="mb-6 flex items-center">
                    <button type="button" onClick={handleBackNav} className="text-zinc-500 hover:text-[var(--gold)] flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        {t('back_to_product_list')}
                    </button>
                </div>

                <form onSubmit={submit} className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Left Column (Main Content) */}
                    <div className="flex-1 space-y-6">
                        
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">{t('product_info')}</h2>
                                <p className="text-sm text-zinc-500 mt-1">{t('product_info_desc')}</p>
                            </div>
                            <div className="p-6 space-y-6">
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('product_name_bm')}</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => handleBilingualChange('name', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            required
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('product_name_en')}</label>
                                        <input
                                            type="text"
                                            value={data.name_en}
                                            onChange={e => handleBilingualChange('name_en', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        />
                                        {errors.name_en && <p className="mt-1 text-sm text-red-600">{errors.name_en}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('category')}</label>
                                        <select
                                            value={data.category}
                                            onChange={e => setData('category', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        >
                                            <option value="">{t('select_category')}</option>
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
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('price_rm')}</label>
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
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('demo_url')}</label>
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
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('short_desc_bm')}</label>
                                    <textarea
                                        rows="2"
                                        value={data.description}
                                        onChange={e => handleBilingualChange('description', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        placeholder="Ringkasan ringkas produk..."
                                    ></textarea>
                                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('short_desc_en')}</label>
                                    <textarea
                                        rows="2"
                                        value={data.description_en}
                                        onChange={e => handleBilingualChange('description_en', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        placeholder="Brief product summary..."
                                    ></textarea>
                                    {errors.description_en && <p className="mt-1 text-sm text-red-600">{errors.description_en}</p>}
                                </div>

                            </div>
                        </div>

                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">{t('main_content')}</h2>
                                <p className="text-sm text-zinc-500 mt-1">{t('main_content_desc')}</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">{t('full_content_bm')}</label>
                                    <RichTextEditor
                                        value={data.content}
                                        onChange={c => handleBilingualChange('content', c)}
                                    />
                                    {errors.content && <p className="mt-2 text-sm text-red-600">{errors.content}</p>}
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">{t('full_content_en')}</label>
                                    <RichTextEditor
                                        value={data.content_en}
                                        onChange={c => handleBilingualChange('content_en', c)}
                                    />
                                    {errors.content_en && <p className="mt-2 text-sm text-red-600">{errors.content_en}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">{t('product_features')}</h2>
                                <p className="text-sm text-zinc-500 mt-1">{t('product_features_desc')}</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    
                                    {/* Features BM */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('features_bm')}</label>
                                        <div className="flex mb-2">
                                            <input
                                                type="text"
                                                value={featureInput}
                                                onChange={e => setFeatureInput(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && addFeature(e, 'ms')}
                                                className="flex-1 rounded-l-md border border-white/10 bg-[#080808] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                                placeholder={t('add_feature_placeholder')}
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
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('features_en')}</label>
                                        <div className="flex mb-2">
                                            <input
                                                type="text"
                                                value={featureEnInput}
                                                onChange={e => setFeatureEnInput(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && addFeature(e, 'en')}
                                                className="flex-1 rounded-l-md border border-white/10 bg-[#080808] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                                placeholder={t('add_feature_en_placeholder')}
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
                                <h2 className="text-base font-bold text-white">{t('seo_settings')}</h2>
                                <p className="text-sm text-zinc-500 mt-1">{t('seo_desc')}</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('meta_title')}</label>
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
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('meta_description')}</label>
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
                        
                        {/* Penterjemahan Pintar (Auto-Fill Toggle) */}
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5">
                                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">{t('smart_translate')}</h2>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label htmlFor="mirror_enabled" className="text-sm font-medium text-zinc-300 block font-semibold">
                                            {t('auto_copy')}
                                        </label>
                                        <span className="text-xs text-zinc-500 block mt-0.5">{t('auto_copy_desc')}</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer select-none">
                                        <input
                                            id="mirror_enabled"
                                            type="checkbox"
                                            checked={mirrorEnabled}
                                            onChange={e => handleMirrorToggle(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="switch-toggle-track toggle-gold"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5">
                                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">{t('status_settings')}</h2>
                            </div>
                            <div className="p-4 space-y-4">
                                
                                <ToggleSwitch
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={checked => setData('is_active', checked)}
                                    label={t('active')}
                                />

                                <ToggleSwitch
                                    id="is_featured"
                                    checked={data.is_featured}
                                    onChange={checked => setData('is_featured', checked)}
                                    label={t('featured_option')}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('order_label')}</label>
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
                                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">{t('media_images')}</h2>
                            </div>
                            <div className="p-4 space-y-6">
                                
                                {/* Product Icon Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">{t('product_icon')}</label>
                                    <div className="flex items-center gap-4 bg-[#080808] border border-white/10 rounded-xl p-4">
                                        <div className="w-16 h-16 rounded-xl border border-white/10 bg-[#0c0c0e] flex items-center justify-center overflow-hidden shrink-0">
                                            {iconPreview ? (
                                                <img src={iconPreview} alt="Icon" className="w-full h-full object-contain p-1" />
                                            ) : (
                                                <span className="text-[10px] text-zinc-500">{t('no_icon')}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <label className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-white hover:bg-white/10 border border-white/10 cursor-pointer transition-colors">
                                                <span>{t('select_icon')}</span>
                                                <input type="file" onChange={handleIconChange} accept="image/*" className="hidden" />
                                            </label>
                                            <p className="text-[9px] text-zinc-500">{t('icon_size_recommendation')}</p>
                                            {errors.icon && <p className="mt-1 text-xs text-red-500">{errors.icon}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Banner Upload */}
                                <div className="pt-4 border-t border-white/5">
                                    <MediaSelectorInput
                                        label={t('main_image_banner')}
                                        value={data.featured_media_id}
                                        onChange={val => setData('featured_media_id', val)}
                                        collection="products"
                                        error={errors.featured_media_id}
                                    />
                                </div>

                                {/* Gallery Section */}
                                <div className="pt-4 border-t border-white/5">
                                    <MediaSelectorInput
                                        label={t('product_image_gallery')}
                                        multiple={true}
                                        value={data.gallery_media_ids}
                                        onChange={val => setData('gallery_media_ids', val)}
                                        collection="products"
                                        error={errors.gallery_media_ids}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                </form>

                <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-[#080808] border-t border-white/5 p-4 px-6 flex justify-between items-center z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
                    <div />
                    <div className="flex gap-3">
                        <button type="button" onClick={handleBackNav} className="inline-flex items-center px-5 py-2.5 border border-white/10 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/[0.02] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500">
                            {t('cancel')}
                        </button>
                        <button
                            type="button"
                            onClick={submit}
                            disabled={!isDirty || loading || showTick}
                            className={`inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gold)] ${
                                showTick
                                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                                    : isDirty && !loading
                                        ? 'bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[#080808] cursor-pointer'
                                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-40'
                            }`}
                        >
                            {showTick ? (
                                <>
                                    <Check className="h-4 w-4 mr-2 animate-bounce text-black" />
                                    {t('saved_successfully')}
                                </>
                            ) : loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                                    {t('saving')}
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    {t('save_product')}
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>
            
            <div className="h-24"></div>
            <UnsavedChangesModal
                show={showUnsavedModal}
                onClose={() => setShowUnsavedModal(false)}
                onDiscard={handleNavDiscard}
                processing={processing}
            />

        </AdminLayout>
    );
}

