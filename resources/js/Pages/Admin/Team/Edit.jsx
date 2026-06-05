import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import { ArrowLeft, Save, Info, Trash, Check } from 'lucide-react';
import MediaSelectorInput from '@/Components/Media/MediaSelectorInput';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';
import UnsavedChangesModal from '@/Components/Admin/UnsavedChangesModal';
import ToggleSwitch from '@/Components/Admin/ToggleSwitch';

export default function Edit({ member }) {
    const { t } = useTranslation();
    const { data, setData, processing, errors, setError, clearErrors, isDirty } = useForm({
        name: member.name || '',
        role: member.role || '',
        role_en: member.role_en || '',
        media_id: member.media_id || null,
        order: member.order || 0,
        is_active: member.is_active ?? true,
    });

    const [showUnsavedModal, setShowUnsavedModal] = React.useState(false);
    const [pendingNavUrl, setPendingNavUrl] = React.useState(null);

    const handleBackNav = (e) => {
        e.preventDefault();
        if (isDirty) {
            setPendingNavUrl(route('admin.team-members.index'));
            setShowUnsavedModal(true);
        } else {
            router.visit(route('admin.team-members.index'));
        }
    };

    const handleNavDiscard = () => {
        setShowUnsavedModal(false);
        router.visit(pendingNavUrl || route('admin.team-members.index'));
    };


    const [showTick, setShowTick] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const touched = React.useRef({
        role: !!member.role,
        role_en: !!member.role_en,
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

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(route('admin.team-members.destroy', member.id), {
            onSuccess: () => setShowDeleteModal(false)
        });
    };

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        clearErrors();

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', data.name);
        formData.append('role', data.role);
        formData.append('role_en', data.role_en || '');
        formData.append('order', data.order);
        formData.append('is_active', data.is_active ? '1' : '0');
        if (data.media_id) {
            formData.append('media_id', data.media_id);
        }

        window.axios.post(route('admin.team-members.update', member.id), formData)
            .then(() => {
                setShowTick(true);
                setTimeout(() => {
                    setShowTick(false);
                    router.visit(route('admin.team-members.index'));
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
        <AdminLayout header={t('edit_team_member')}>
            <Head title={`${t('edit_team_member')} | Admin`} />

            <div className="max-w-5xl mx-auto">
                <div className="mb-6 flex items-center">
                    <button type="button" onClick={handleBackNav} className="text-zinc-500 hover:text-[var(--gold)] flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        {t('back_to_team_list')}
                    </button>
                </div>

                <form onSubmit={submit} className="flex flex-col lg:flex-row gap-6">
                    {/* Left Column - Form Fields */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">{t('team_member_info')}</h2>
                                <p className="text-sm text-zinc-500 mt-1">{t('team_member_info_desc')}</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('full_name')} *</label>
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
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('role_bm')} *</label>
                                        <input
                                            type="text"
                                            value={data.role}
                                            onChange={(e) => handleBilingualChange('role', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            placeholder="e.g. CEO & Pengasas"
                                            required
                                        />
                                        {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('role_en')}</label>
                                        <input
                                            type="text"
                                            value={data.role_en}
                                            onChange={(e) => handleBilingualChange('role_en', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            placeholder="e.g. CEO & Founder"
                                        />
                                        {errors.role_en && <p className="mt-1 text-sm text-red-500">{errors.role_en}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('display_order')}</label>
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
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">{t('active_status')}</label>
                                        <ToggleSwitch
                                            id="is_active"
                                            checked={data.is_active}
                                            onChange={checked => setData('is_active', checked)}
                                            label={t('active_desc_homepage')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Avatar Upload */}
                    <div className="w-full lg:w-[320px] shrink-0 space-y-6">
                        
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
                            <div className="px-5 py-4 border-b border-white/5">
                                <h2 className="text-sm font-bold text-white uppercase tracking-wide">{t('profile_picture')}</h2>
                                <p className="text-[10px] text-zinc-500 mt-0.5">{t('recommend_ratio_4_5')}</p>
                            </div>
                            <div className="p-4">
                                <MediaSelectorInput
                                    label=""
                                    value={data.media_id}
                                    onChange={val => setData('media_id', val)}
                                    collection="team_members"
                                    initialMedia={member.media || null}
                                    error={errors.media_id}
                                />
                            </div>
                            <div className="px-4 pb-4">
                                <div className="flex items-start gap-2 text-[11px] text-zinc-600 leading-normal">
                                    <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                    <span>{t('upload_photo_desc')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Fixed Bottom Save/Cancel/Delete Actions Bar */}
                <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-[#080808] border-t border-white/5 p-4 px-6 flex justify-between items-center z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
                    <div>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 border border-red-500/20 rounded-lg text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <Trash className="h-4 w-4 mr-2" />
                            {t('delete_team_member')}
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={handleBackNav} className="inline-flex items-center px-5 py-2.5 border border-white/10 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/[0.02] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500">
                            {t('cancel')}
                        </button>
                        <button
                            type="button"
                            onClick={submit}
                            disabled={!isDirty || processing || showTick || !data.name?.trim() || !data.role?.trim()}
                            className={`inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gold)] ${
                                showTick
                                    ? 'btn-submit-success'
                                    : isDirty && !processing && data.name?.trim() && data.role?.trim()
                                        ? 'bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[#080808] cursor-pointer'
                                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-40'
                            }`}
                        >
                            {showTick ? (
                                <>
                                    <Check className="h-4 w-4 mr-2 animate-bounce text-black" strokeWidth={3} />
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
                url={route('admin.team-members.destroy', member.id)}
                redirectUrl={route('admin.team-members.index')}
                title={t('delete_team_member_confirm_title')}
                message={t('delete_team_member_confirm_message_edit')}
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

