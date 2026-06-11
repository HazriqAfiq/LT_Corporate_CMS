import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save, Trash } from 'lucide-react';
import ImageUploadZone from '@/Components/Admin/ImageUploadZone';
import useTranslation from '@/Hooks/useTranslation';

import UnsavedChangesModal from '@/Components/Admin/UnsavedChangesModal';
export default function Edit({ setting }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, isDirty } = useForm({
        _method: 'PUT',
        key: setting.key,
        label: setting.label || '',
        label_en: setting.label_en || '',
        group: setting.group || 'general',
        type: setting.type || 'text',
        value: setting.type === 'image' && setting.value
            ? (setting.value.startsWith('http') || setting.value.startsWith('/storage') ? setting.value : `/storage/${setting.value}`)
            : (setting.value || ''),
    });

    const [showUnsavedModal, setShowUnsavedModal] = React.useState(false);
    const [pendingNavUrl, setPendingNavUrl] = React.useState(null);

    const handleBackNav = (e) => {
        e.preventDefault();
        if (isDirty) {
            setPendingNavUrl(route('admin.settings.index'));
            setShowUnsavedModal(true);
        } else {
            router.visit(route('admin.settings.index'));
        }
    };

    const handleNavDiscard = () => {
        setShowUnsavedModal(false);
        router.visit(pendingNavUrl || route('admin.settings.index'));
    };


    const touched = React.useRef({
        label: !!setting.label,
        label_en: !!setting.label_en,
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
        clearErrors();
        window.axios.post(route('admin.settings.update', setting.id, false), data)
            .then(() => {
                router.visit(route('admin.settings.index'));
            })
            .catch(err => {
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
        if (confirm(t('delete_setting_confirm'))) {
            router.delete(route('admin.settings.destroy', setting.id));
        }
    };

    return (
        <AdminLayout header={t('edit_setting')}>
            <Head title={`${t('edit_setting')}: ${setting.key} | Admin`} />

            <div className="mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <button type="button" onClick={handleBackNav} className="text-zinc-500 hover:text-[var(--gold)] flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        {t('back_to_settings_list')}
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-colors"
                    >
                        <Trash className="h-4 w-4 mr-2" />
                        {t('delete_setting')}
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
                        </div>
                        <div className="p-6 space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('setting_key')}</label>
                                    <input
                                        type="text"
                                        value={data.key}
                                        disabled
                                        className="w-full rounded-md border border-white/5 bg-[#080808]/50 text-zinc-500 px-3 py-2 cursor-not-allowed font-mono"
                                    />
                                    <p className="mt-1 text-xs text-zinc-500">{t('setting_key_unchangeable')}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('setting_group')}</label>
                                        <select
                                            value={data.group}
                                            onChange={e => setData('group', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        >
                                            <option value="general">{t('group_general')}</option>
                                            <option value="contact">{t('group_contact')}</option>
                                            <option value="social">{t('group_social')}</option>
                                            <option value="company">{t('group_company')}</option>
                                            <option value="footer">{t('group_footer')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('setting_type')}</label>
                                        <select
                                            value={data.type}
                                            onChange={e => {
                                                setData(prev => ({
                                                    ...prev,
                                                    type: e.target.value,
                                                    value: e.target.value === 'image' ? null : ''
                                                }));
                                            }}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        >
                                            <option value="text">{t('short_text')}</option>
                                            <option value="textarea">{t('long_text')}</option>
                                            <option value="image">{t('image_setting')}</option>
                                        </select>
                                    </div>
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
                                {data.type === 'textarea' ? (
                                    <>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('setting_value')}</label>
                                        <textarea
                                            rows="4"
                                            value={data.value || ''}
                                            onChange={e => setData('value', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] font-mono text-sm"
                                            placeholder={t('setting_value_textarea_placeholder')}
                                        ></textarea>
                                    </>
                                ) : data.type === 'image' ? (
                                    <ImageUploadZone
                                        label={t('value_image')}
                                        value={data.value}
                                        onChange={file => setData('value', file)}
                                        recommendedSize={t('recommended_upload_size')}
                                        error={errors.value}
                                    />
                                ) : (
                                    <>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('setting_value')}</label>
                                        <input
                                            type="text"
                                            value={data.value || ''}
                                            onChange={e => setData('value', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            placeholder={t('setting_value_placeholder')}
                                        />
                                    </>
                                )}
                                {data.type !== 'image' && errors.value && <p className="mt-1 text-sm text-red-600">{errors.value}</p>}
                            </div>

                        </div>
                    </div>

                </form>

                <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-[#080808] border-t border-white/5 p-4 px-6 flex justify-end gap-3 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button type="button" onClick={handleBackNav} className="inline-flex items-center px-4 py-2 border border-white/10 text-sm font-medium rounded-lg text-zinc-300 bg-white/5 hover:bg-white/10 hover:text-white transition-colors">
                        {t('cancel')}
                    </button>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={!isDirty || processing}
                        className={`inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gold)] ${
                            isDirty && !processing
                                ? 'bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[#080808] cursor-pointer'
                                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-40'
                        }`}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {processing ? t('saving') : t('save_changes')}
                    </button>
                </div>

            </div>
            
            <div className="h-20"></div>
            <UnsavedChangesModal
                show={showUnsavedModal}
                onClose={() => setShowUnsavedModal(false)}
                onDiscard={handleNavDiscard}
                processing={processing}
            />

        </AdminLayout>
    );
}

