import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import { ArrowLeft, Save, Trash, Check } from 'lucide-react';
import MediaSelectorInput from '@/Components/Media/MediaSelectorInput';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';
import UnsavedChangesModal from '@/Components/Admin/UnsavedChangesModal';
import ToggleSwitch from '@/Components/Admin/ToggleSwitch';

const PREDEFINED_URLS = [
    { label: 'Hubungi Kami (Contact Us)', value: '/hubungi-kami' },
    { label: 'Produk (Products)', value: '/produk' },
    { label: 'Portfolio (Projects)', value: '/portfolio' },
    { label: 'Artikel & Berita (News)', value: '/artikel' },
    { label: 'Tentang Kami (About Us)', value: '/tentang-kami' },
    { label: 'Perkhidmatan (Services)', value: '/perkhidmatan' },
];

export default function Edit({ slider }) {
    const { t } = useTranslation();
    const { data, setData, processing, errors, setError, clearErrors, isDirty } = useForm({
        _method: 'PUT',
        title: slider.title || '',
        title_en: slider.title_en || '',
        subtitle: slider.subtitle || '',
        subtitle_en: slider.subtitle_en || '',
        description: slider.description || '',
        description_en: slider.description_en || '',
        media_id: slider.media_id || null,
        button_text: slider.button_text || '',
        button_text_en: slider.button_text_en || '',
        button_url: slider.button_url || '',
        order: slider.order || 0,
        is_active: !!slider.is_active,
    });

    const [showUnsavedModal, setShowUnsavedModal] = React.useState(false);
    const [pendingNavUrl, setPendingNavUrl] = React.useState(null);

    const handleBackNav = (e) => {
        e.preventDefault();
        if (isDirty) {
            setPendingNavUrl(route('admin.sliders.index'));
            setShowUnsavedModal(true);
        } else {
            router.visit(route('admin.sliders.index'));
        }
    };

    const handleNavDiscard = () => {
        setShowUnsavedModal(false);
        router.visit(pendingNavUrl || route('admin.sliders.index'));
    };


    const isPredefined = PREDEFINED_URLS.some(opt => opt.value === (slider.button_url || '/hubungi-kami')) || !slider.button_url;
    const [urlType, setUrlType] = useState(isPredefined ? 'predefined' : 'custom');
    const [showTick, setShowTick] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const touched = React.useRef({
        title: !!slider.title,
        title_en: !!slider.title_en,
        subtitle: !!slider.subtitle,
        subtitle_en: !!slider.subtitle_en,
        description: !!slider.description,
        description_en: !!slider.description_en,
        button_text: !!slider.button_text,
        button_text_en: !!slider.button_text_en,
    });

    const [mirrorEnabled, setMirrorEnabled] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('mirror_enabled') !== 'false' : true));

    const handleMirrorToggle = (checked) => {
        setMirrorEnabled(checked);
        localStorage.setItem('mirror_enabled', checked ? 'true' : 'false');
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

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        clearErrors();
        window.axios.post(route('admin.sliders.update', slider.id, false), data)
            .then(() => {
                setShowTick(true);
                setTimeout(() => {
                    setShowTick(false);
                    router.visit(route('admin.sliders.index'));
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

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(route('admin.sliders.destroy', slider.id), {
            onSuccess: () => setShowDeleteModal(false)
        });
    };

    return (
        <AdminLayout header={t('edit_slider')}>
            <Head title={`${t('edit_slider')} | Admin`} />

            <div className="mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <button type="button" onClick={handleBackNav} className="text-zinc-500 hover:text-[var(--gold)] flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        {t('back_to_sliders_list')}
                    </button>
                </div>

                <form onSubmit={submit} className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Left Column (Main Content) */}
                    <div className="flex-1 space-y-6">
                        
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">{t('content_information')}</h2>
                                <p className="text-sm text-zinc-500 mt-1">{t('content_information_desc')}</p>
                            </div>
                            <div className="p-6 space-y-6">
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('title_bm')} *</label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={e => handleBilingualChange('title', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            required
                                        />
                                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('title_en')}</label>
                                        <input
                                            type="text"
                                            value={data.title_en}
                                            onChange={e => handleBilingualChange('title_en', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('subtitle_bm')}</label>
                                        <input
                                            type="text"
                                            value={data.subtitle}
                                            onChange={e => handleBilingualChange('subtitle', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('subtitle_en')}</label>
                                        <input
                                            type="text"
                                            value={data.subtitle_en}
                                            onChange={e => handleBilingualChange('subtitle_en', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('description_bm')}</label>
                                        <textarea
                                            rows="3"
                                            value={data.description}
                                            onChange={e => handleBilingualChange('description', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('description_en')}</label>
                                        <textarea
                                            rows="3"
                                            value={data.description_en}
                                            onChange={e => handleBilingualChange('description_en', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        ></textarea>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">{t('call_to_action')}</h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('button_text_bm')}</label>
                                        <input
                                            type="text"
                                            value={data.button_text}
                                            onChange={e => handleBilingualChange('button_text', e.target.value)}
                                            placeholder={t('button_text_bm_placeholder')}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('button_text_en')}</label>
                                        <input
                                            type="text"
                                            value={data.button_text_en}
                                            onChange={e => handleBilingualChange('button_text_en', e.target.value)}
                                            placeholder={t('button_text_en_placeholder')}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                                            Jenis Pautan Butang (Button URL Type)
                                        </label>
                                        <select
                                            value={urlType}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setUrlType(val);
                                                if (val === 'predefined') {
                                                    setData('button_url', '/hubungi-kami');
                                                } else {
                                                    setData('button_url', '');
                                                }
                                            }}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] text-sm"
                                        >
                                            <option value="predefined">Halaman Sedia Ada (Predefined Page)</option>
                                            <option value="custom">Pautan Khas / Lain-lain (Custom Link)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('button_url_label')}</label>
                                        {urlType === 'predefined' ? (
                                            <select
                                                value={data.button_url || '/hubungi-kami'}
                                                onChange={e => setData('button_url', e.target.value)}
                                                className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] text-sm"
                                            >
                                                {PREDEFINED_URLS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={data.button_url}
                                                onChange={e => setData('button_url', e.target.value)}
                                                placeholder="https://... or /custom-path"
                                                className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] text-sm"
                                            />
                                        )}
                                        {errors.button_url && <p className="mt-1 text-sm text-red-600">{errors.button_url}</p>}
                                    </div>
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
                                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">{t('status_order')}</h2>
                            </div>
                            <div className="p-4 space-y-4">
                                
                                <ToggleSwitch
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={checked => setData('is_active', checked)}
                                    label={t('active')}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('order')}</label>
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
                            <div className="px-5 py-4 border-b border-white/5">
                                <h2 className="text-sm font-bold text-white uppercase tracking-wide">{t('slider_image')}</h2>
                                <p className="text-xs text-zinc-500 mt-0.5">{t('recommend_ratio_16_9')}</p>
                            </div>
                            <div className="p-4">
                                <MediaSelectorInput
                                    label={t('main_slider_image')}
                                    value={data.media_id}
                                    onChange={val => setData('media_id', val)}
                                    collection="sliders"
                                    initialMedia={slider.media || null}
                                    error={errors.media_id}
                                />
                            </div>
                        </div>

                    </div>

                </form>

                <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-[#080808] border-t border-white/5 p-4 px-6 flex justify-between items-center z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
                    <div>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 border border-red-500/20 rounded-lg text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <Trash className="h-4 w-4 mr-2" />
                            {t('delete_slider')}
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={handleBackNav} className="inline-flex items-center px-5 py-2.5 border border-white/10 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/[0.02] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500">
                            {t('cancel')}
                        </button>
                        <button
                            type="button"
                            onClick={submit}
                            disabled={!isDirty || processing || showTick || !data.media_id || !data.title?.trim() || !data.subtitle?.trim() || !data.description?.trim() || !data.button_text?.trim() || !data.button_url?.trim()}
                            className={`inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gold)] ${
                                showTick
                                    ? 'btn-submit-success'
                                    : isDirty && !processing && data.media_id && data.title?.trim() && data.subtitle?.trim() && data.description?.trim() && data.button_text?.trim() && data.button_url?.trim()
                                        ? 'bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[#080808] cursor-pointer'
                                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-40'
                            }`}
                        >
                            {showTick ? (
                                <>
                                    <Check className="h-4 w-4 mr-2 animate-bounce text-black" />
                                    {t('saved_successfully')}
                                </>
                            ) : processing ? (
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
                url={route('admin.sliders.destroy', slider.id)}
                redirectUrl={route('admin.sliders.index')}
                title={t('delete_slider_confirm_title')}
                message={t('delete_slider_confirm_message')}
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

