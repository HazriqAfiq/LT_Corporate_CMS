import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import { ArrowLeft, Save, Plus, X, Trash, Check } from 'lucide-react';
import { ServiceIcons } from '@/Utils/serviceIcons';
import RichTextEditor from '@/Components/Admin/RichTextEditor';
import MediaSelectorInput from '@/Components/Media/MediaSelectorInput';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';
import UnsavedChangesModal from '@/Components/Admin/UnsavedChangesModal';
import ToggleSwitch from '@/Components/Admin/ToggleSwitch';

const AVAILABLE_ICONS = [
    'Monitor', 'Smartphone', 'Palette', 'Cloud', 'Cpu', 'Lock', 'Shield',
    'BarChart3', 'Settings', 'Wrench', 'Database', 'Globe', 'Server',
    'Terminal', 'Code', 'Layers', 'TrendingUp', 'Users', 'MessageSquare',
    'HelpCircle', 'Award', 'Briefcase', 'Heart', 'Zap', 'Activity'
];

export default function Edit({ service }) {
    const { t } = useTranslation();
    const { data, setData, processing, errors, setError, clearErrors, isDirty } = useForm({
        _method: 'PUT',
        name: service.name || '',
        name_en: service.name_en || '',
        description: service.description || '',
        description_en: service.description_en || '',
        content: service.content || '',
        content_en: service.content_en || '',
        features: service.features || [],
        features_en: service.features_en || [],
        order: service.order || 0,
        is_active: !!service.is_active,
        icon: service.icon || '',
        featured_media_id: service.featured_media_id || null,
    });

    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [pendingNavUrl, setPendingNavUrl] = useState(null);

    const handleBackNav = (e) => {
        e.preventDefault();
        if (isDirty) {
            setPendingNavUrl(route('admin.services.index'));
            setShowUnsavedModal(true);
        } else {
            router.visit(route('admin.services.index'));
        }
    };

    const handleNavDiscard = () => {
        setShowUnsavedModal(false);
        router.visit(pendingNavUrl || route('admin.services.index'));
    };

    const [showTick, setShowTick] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const touched = React.useRef({
        name: !!service.name,
        name_en: !!service.name_en,
        description: !!service.description,
        description_en: !!service.description_en,
        content: !!service.content,
        content_en: !!service.content_en,
        features: !!(service.features && service.features.length),
        features_en: !!(service.features_en && service.features_en.length),
    });

    const [mirrorEnabled, setMirrorEnabled] = useState(() =>
        typeof window !== 'undefined' ? localStorage.getItem('mirror_enabled') !== 'false' : true
    );

    const handleMirrorToggle = (checked) => {
        setMirrorEnabled(checked);
        localStorage.setItem('mirror_enabled', checked ? 'true' : 'false');
    };

    const [featureInput, setFeatureInput] = useState('');
    const [featureEnInput, setFeatureEnInput] = useState('');

    const handleBilingualChange = (field, val) => {
        touched.current[field] = true;
        const isEn = field.endsWith('_en');
        const counterpart = isEn ? field.slice(0, -3) : `${field}_en`;

        if (mirrorEnabled && !touched.current[counterpart]) {
            setData(prev => ({ ...prev, [field]: val, [counterpart]: val }));
        } else {
            setData(field, val);
        }
    };

    const addFeature = (e, lang) => {
        e.preventDefault();
        if (lang === 'ms' && featureInput.trim()) {
            const val = featureInput.trim();
            setFeatureInput('');
            setData(prev => {
                const updatedFeatures = [...prev.features, val];
                const updatedFeaturesEn = !touched.current.features_en ? [...prev.features_en, val] : prev.features_en;
                return { ...prev, features: updatedFeatures, features_en: updatedFeaturesEn };
            });
        } else if (lang === 'en' && featureEnInput.trim()) {
            const val = featureEnInput.trim();
            setFeatureEnInput('');
            setData(prev => {
                const updatedFeaturesEn = [...prev.features_en, val];
                const updatedFeatures = !touched.current.features ? [...prev.features, val] : prev.features;
                return { ...prev, features_en: updatedFeaturesEn, features: updatedFeatures };
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

        window.axios.post(route('admin.services.update', service.id), data)
            .then(() => {
                setShowTick(true);
                setTimeout(() => {
                    setShowTick(false);
                    router.visit(route('admin.services.index'));
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
        <AdminLayout header={t('edit_service')}>
            <Head title={`${t('edit_service')} ${service.name} | Admin`} />

            <div className="mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <button type="button" onClick={handleBackNav} className="text-zinc-500 hover:text-[var(--gold)] flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        {t('back_to_service_list')}
                    </button>
                </div>

                <form onSubmit={submit} className="flex flex-col lg:flex-row gap-6">

                    {/* Left Column */}
                    <div className="flex-1 space-y-6">

                        {/* Service Info */}
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">{t('service_info')}</h2>
                                <p className="text-sm text-zinc-500 mt-1">{t('service_info_desc')}</p>
                            </div>
                            <div className="p-6 space-y-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('service_name_bm')}</label>
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
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('service_name_en')}</label>
                                        <input
                                            type="text"
                                            value={data.name_en}
                                            onChange={e => handleBilingualChange('name_en', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        />
                                        {errors.name_en && <p className="mt-1 text-sm text-red-600">{errors.name_en}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('short_desc_bm')}</label>
                                    <textarea
                                        rows="3"
                                        value={data.description}
                                        onChange={e => handleBilingualChange('description', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        placeholder="Ringkasan ringkas perkhidmatan..."
                                    ></textarea>
                                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('short_desc_en')}</label>
                                    <textarea
                                        rows="3"
                                        value={data.description_en}
                                        onChange={e => handleBilingualChange('description_en', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        placeholder="Brief service summary..."
                                    ></textarea>
                                    {errors.description_en && <p className="mt-1 text-sm text-red-600">{errors.description_en}</p>}
                                </div>

                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">{t('main_content')}</h2>
                                <p className="text-sm text-zinc-500 mt-1">{t('main_content_desc')}</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">{t('main_content_bm')}</label>
                                    <RichTextEditor
                                        value={data.content}
                                        onChange={val => handleBilingualChange('content', val)}
                                    />
                                    {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">{t('main_content_en')}</label>
                                    <RichTextEditor
                                        value={data.content_en}
                                        onChange={val => handleBilingualChange('content_en', val)}
                                    />
                                    {errors.content_en && <p className="mt-1 text-sm text-red-600">{errors.content_en}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">{t('service_features')}</h2>
                                <p className="text-sm text-zinc-500 mt-1">{t('service_features_desc')}</p>
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

                    </div>

                    {/* Right Column */}
                    <div className="w-full lg:w-80 space-y-6 flex-shrink-0">

                        {/* Smart Translate */}
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

                        {/* Status & Settings */}
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5">
                                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">{t('status_settings')}</h2>
                            </div>
                            <div className="p-4 space-y-4">

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Slug</label>
                                    <div className="flex bg-[#080808] rounded-md border border-white/10 px-3 py-2">
                                        <span className="text-zinc-500 text-sm whitespace-nowrap overflow-hidden text-ellipsis">/{service.slug}</span>
                                    </div>
                                </div>

                                <ToggleSwitch
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={checked => setData('is_active', checked)}
                                    label={t('active')}
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

                        {/* Media & Images */}
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5">
                                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">{t('media_images')}</h2>
                            </div>
                            <div className="p-4 space-y-6">

                                {/* Predefined Icon Selector */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">{t('service_icon')}</label>
                                    <div className="space-y-3">
                                        <select
                                            value={data.icon}
                                            onChange={e => setData('icon', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        >
                                            <option value="">{t('select_icon')}</option>
                                            {AVAILABLE_ICONS.map(iconName => (
                                                <option key={iconName} value={iconName}>{iconName}</option>
                                            ))}
                                        </select>
                                        
                                        <div className="flex items-center gap-4 bg-[#080808] border border-white/10 rounded-xl p-3">
                                            <div className="w-12 h-12 rounded-xl border border-white/10 bg-[#0c0c0e] flex items-center justify-center overflow-hidden shrink-0">
                                                {data.icon && ServiceIcons[data.icon] ? (
                                                    React.createElement(ServiceIcons[data.icon], { className: "w-6 h-6 text-[var(--gold)]" })
                                                ) : (
                                                    <span className="text-[10px] text-zinc-500">{t('none')}</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-white truncate font-mono">{data.icon || t('no_icon')}</p>
                                                <p className="text-[9px] text-zinc-500">Pratonton Ikon / Icon Preview</p>
                                            </div>
                                        </div>
                                    </div>
                                    {errors.icon && <p className="mt-1 text-xs text-red-500">{errors.icon}</p>}
                                </div>

                                {/* Background Banner Image */}
                                <div className="pt-4 border-t border-white/5">
                                    <MediaSelectorInput
                                        label={t('main_image_banner')}
                                        value={data.featured_media_id}
                                        onChange={val => setData('featured_media_id', val)}
                                        collection="services"
                                        initialMedia={service.featured_media || null}
                                        error={errors.featured_media_id}
                                    />
                                </div>

                            </div>
                        </div>

                    </div>

                </form>

                {/* Sticky Footer Bar */}
                <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-[#080808] border-t border-white/5 p-4 px-6 flex justify-between items-center z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
                    <div>
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="inline-flex items-center px-4 py-2 border border-red-500/20 rounded-lg text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors focus:outline-none"
                        >
                            <Trash className="h-4 w-4 mr-2" />
                            {t('delete_service')}
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={handleBackNav} className="inline-flex items-center px-5 py-2.5 border border-white/10 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/[0.02] transition-colors focus:outline-none">
                            {t('cancel')}
                        </button>
                        <button
                            type="button"
                            onClick={submit}
                            disabled={!isDirty || loading || showTick || !String(data.name || '').trim()}
                            className={`inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg text-sm font-bold transition-all duration-300 focus:outline-none ${
                                showTick
                                    ? 'btn-submit-success'
                                    : isDirty && !loading && String(data.name || '').trim()
                                        ? 'bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[#080808] cursor-pointer'
                                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-40'
                            }`}
                        >
                            {showTick ? (
                                <>
                                    <Check className="h-4 w-4 mr-2 animate-bounce text-black" strokeWidth={3} />
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
                                    {t('save_changes')}
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>

            <div className="h-24"></div>

            <DeleteConfirmModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                url={route('admin.services.destroy', service.id)}
                redirectUrl={route('admin.services.index')}
                title={t('delete_service_confirm_title')}
                message={t('delete_service_confirm_message')}
            />
            <UnsavedChangesModal
                show={showUnsavedModal}
                onClose={() => setShowUnsavedModal(false)}
                onDiscard={handleNavDiscard}
                processing={processing}
            />

        </AdminLayout>
    );
}
