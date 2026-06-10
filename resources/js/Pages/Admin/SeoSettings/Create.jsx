import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save, Check } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

import UnsavedChangesModal from '@/Components/Admin/UnsavedChangesModal';
import MediaSelectorInput from '@/Components/Media/MediaSelectorInput';
export default function Create() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, isDirty, setError, clearErrors } = useForm({
        key: '',
        label: '',
        label_en: '',
        type: 'text',
        value: '',
    });

    const [showUnsavedModal, setShowUnsavedModal] = React.useState(false);
    const [pendingNavUrl, setPendingNavUrl] = React.useState(null);
    const [showTick, setShowTick] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleBackNav = (e) => {
        e.preventDefault();
        if (isDirty) {
            setPendingNavUrl(route('admin.seo-settings.index'));
            setShowUnsavedModal(true);
        } else {
            router.visit(route('admin.seo-settings.index'));
        }
    };

    const handleNavDiscard = () => {
        setShowUnsavedModal(false);
        router.visit(pendingNavUrl || route('admin.seo-settings.index'));
    };


    const touched = React.useRef({});

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

        window.axios.post(route('admin.seo-settings.store'), data)
            .then(() => {
                setShowTick(true);
                setTimeout(() => {
                    setShowTick(false);
                    router.visit(route('admin.seo-settings.index'));
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
        <AdminLayout header={t('add_seo_setting')}>
            <Head title={`${t('add_seo_setting')} | Admin`} />

            <div className="mx-auto">
                <div className="mb-6 flex items-center">
                    <button type="button" onClick={handleBackNav} className="text-zinc-500 hover:text-[var(--gold)] flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        {t('back_to_seo_list')}
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    
                    {/* Penterjemahan Pintar (Auto-Fill Toggle) */}
                    <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                        <div className="p-4 px-6">
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
                        <div className="p-6 border-b border-white/5">
                            <h2 className="text-base font-bold text-white">{t('setting_information')}</h2>
                            <p className="text-sm text-zinc-500 mt-1">{t('setting_create_warning')}</p>
                        </div>
                        <div className="p-6 space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('setting_key')} *</label>
                                    <input
                                        type="text"
                                        value={data.key}
                                        onChange={e => setData('key', e.target.value)}
                                        placeholder="cth: meta_title_home"
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] font-mono"
                                        required
                                    />
                                    <p className="mt-1 text-xs text-zinc-500">{t('setting_key_desc')}</p>
                                    {errors.key && <p className="mt-1 text-sm text-red-600">{errors.key}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('setting_type')}</label>
                                    <select
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                    >
                                        <option value="text">{t('short_text')}</option>
                                        <option value="textarea">{t('long_text')}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('setting_label_bm')}</label>
                                    <input
                                        type="text"
                                        value={data.label}
                                        onChange={e => handleBilingualChange('label', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                    />
                                    {errors.label && <p className="mt-1 text-sm text-red-600">{errors.label}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('setting_label_en')}</label>
                                    <input
                                        type="text"
                                        value={data.label_en}
                                        onChange={e => handleBilingualChange('label_en', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                    />
                                    {errors.label_en && <p className="mt-1 text-sm text-red-600">{errors.label_en}</p>}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <label className="block text-sm font-medium text-zinc-300 mb-1">{t('setting_value')}</label>
                                {data.type === 'textarea' ? (
                                    <textarea
                                        rows="4"
                                        value={data.value}
                                        onChange={e => setData('value', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] font-mono text-sm"
                                        placeholder={t('setting_value_textarea_placeholder')}
                                    ></textarea>
                                ) : (
                                    <input
                                        type="text"
                                        value={data.value}
                                        onChange={e => setData('value', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        placeholder={t('setting_value_placeholder')}
                                    />
                                )}
                                {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value}</p>}
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
                                    ? 'btn-submit-success'
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
                                    {t('save_setting')}
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

