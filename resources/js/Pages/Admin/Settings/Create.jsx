import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save } from 'lucide-react';
import ImageUploadZone from '@/Components/Admin/ImageUploadZone';
import useTranslation from '@/Hooks/useTranslation';

export default function Create() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        key: '',
        label: '',
        label_en: '',
        group: 'general',
        type: 'text',
        value: '',
    });

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
        post(route('admin.settings.store'));
    };

    return (
        <AdminLayout header={t('add_setting')}>
            <Head title={`${t('add_setting')} | Admin`} />

            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center">
                    <Link href={route('admin.settings.index')} className="text-zinc-500 hover:text-[var(--gold)] flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        {t('back_to_settings_list')}
                    </Link>
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
                                    <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--gold)] peer-checked:after:bg-white peer-checked:after:border-white"></div>
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
                                        placeholder="cth: site_name, contact_email"
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] font-mono"
                                        required
                                    />
                                    <p className="mt-1 text-xs text-zinc-500">{t('setting_key_desc')}</p>
                                    {errors.key && <p className="mt-1 text-sm text-red-600">{errors.key}</p>}
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
                    <Link
                        href={route('admin.settings.index')}
                        className="inline-flex items-center px-4 py-2 border border-white/10 text-sm font-medium rounded-lg text-zinc-300 bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        {t('cancel')}
                    </Link>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={processing}
                        className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[#080808] font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gold)] disabled:opacity-50 transition-colors"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {processing ? t('saving') : t('save_setting')}
                    </button>
                </div>

            </div>
            
            <div className="h-20"></div>

        </AdminLayout>
    );
}
