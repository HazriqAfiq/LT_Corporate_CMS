import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import { ArrowLeft, Save, Upload, Trash, Check } from 'lucide-react';
import ToggleSwitch from '@/Components/Admin/ToggleSwitch';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';
import UnsavedChangesModal from '@/Components/Admin/UnsavedChangesModal';

export default function Edit({ user, availableRoles }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, isDirty } = useForm({
        _method: 'PUT',
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        is_active: !!user.is_active,
        avatar: null,
        roles: user.roles ? user.roles.map(r => r.id.toString()) : [],
    });

    const [showUnsavedModal, setShowUnsavedModal] = React.useState(false);
    const [pendingNavUrl, setPendingNavUrl] = React.useState(null);

    const handleBackNav = (e) => {
        e.preventDefault();
        if (isDirty) {
            setPendingNavUrl(route('admin.users.index'));
            setShowUnsavedModal(true);
        } else {
            router.visit(route('admin.users.index'));
        }
    };

    const handleNavDiscard = () => {
        setShowUnsavedModal(false);
        router.visit(pendingNavUrl || route('admin.users.index'));
    };


    const [showTick, setShowTick] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [imagePreview, setImagePreview] = useState(user.avatar ? `/storage/${user.avatar}` : null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRoleChange = (e) => {
        const options = e.target.options;
        const selectedRoles = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedRoles.push(options[i].value);
            }
        }
        setData('roles', selectedRoles);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.update', user.id), {
            onSuccess: () => {
                setShowTick(true);
                setTimeout(() => {
                    setShowTick(false);
                }, 1500);
            }
        });
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(route('admin.users.destroy', user.id), {
            onSuccess: () => setShowDeleteModal(false)
        });
    };

    return (
        <AdminLayout header={t('edit_user')}>
            <Head title={`${t('edit_user')} ${user.name} | Admin`} />

            <div className="max-w-5xl mx-auto px-4">
                <div className="mb-6 flex justify-between items-center">
                    <button type="button" onClick={handleBackNav} className="text-zinc-500 hover:text-[var(--gold)] flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        {t('back_to_user_list')}
                    </button>
                </div>

                <form onSubmit={submit} className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Left Column (Main Content) */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                            <div className="p-6 border-b border-white/5 bg-[#080808]/50">
                                <h2 className="text-base font-bold text-white">{t('user_info')}</h2>
                                <p className="text-xs text-zinc-500 mt-1">{t('user_info_desc_edit')}</p>
                            </div>
                            <div className="p-6 space-y-6">
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-zinc-300 mb-1.5">{t('full_name')} *</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full rounded-lg border border-white/10 bg-[#080808] text-white px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] hover:border-white/20"
                                            required
                                        />
                                        {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-zinc-300 mb-1.5">{t('email_address')} *</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full rounded-lg border border-white/10 bg-[#080808] text-white px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] hover:border-white/20"
                                            required
                                        />
                                        {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-zinc-300 mb-1.5">{t('phone_number')}</label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            className="w-full rounded-lg border border-white/10 bg-[#080808] text-white px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] hover:border-white/20"
                                        />
                                        {errors.phone && <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-zinc-300 mb-1.5">{t('password')}</label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            placeholder={t('password_placeholder_edit')}
                                            className="w-full rounded-lg border border-white/10 bg-[#080808] text-white px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] hover:border-white/20"
                                        />
                                        {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Right Column (Sidebar Settings) */}
                    <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
                        
                        {/* Avatar Card */}
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                            <div className="p-4 border-b border-white/5 bg-[#080808]/50">
                                <h2 className="text-sm font-bold text-white uppercase tracking-wide">{t('user_avatar')}</h2>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-center">
                                    <div className="relative group hover:border-[var(--gold)]/50 transition-colors cursor-pointer w-36 h-36 border-2 border-white/10 border-dashed rounded-full flex items-center justify-center p-1 bg-[#080808]">
                                        {imagePreview ? (
                                            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[var(--gold)]/30 group-hover:border-[var(--gold)] transition-all duration-300 shadow-lg shadow-[var(--gold)]/5">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <span className="text-white text-xs font-semibold tracking-wide">{t('change')}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 text-center py-4">
                                                <Upload className="mx-auto h-7 w-7 text-zinc-500 group-hover:text-[var(--gold)] transition-colors duration-300" />
                                                <p className="text-[11px] text-[var(--gold)] font-medium">{t('upload')}</p>
                                            </div>
                                        )}
                                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full" onChange={handleImageChange} accept="image/*" />
                                    </div>
                                </div>
                                {errors.avatar && <p className="mt-2 text-xs text-red-500 text-center">{errors.avatar}</p>}
                                <p className="text-[11px] text-zinc-500 mt-3 text-center">{t('recommended_format')}</p>
                            </div>
                        </div>

                        {/* Settings Card */}
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                            <div className="p-4 border-b border-white/5 bg-[#080808]/50">
                                <h2 className="text-sm font-bold text-white uppercase tracking-wide">{t('roles_status')}</h2>
                            </div>
                            <div className="p-6 space-y-5">
                                
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-1.5">{t('roles_label')}</label>
                                    <select
                                        multiple
                                        value={data.roles}
                                        onChange={handleRoleChange}
                                        className="w-full rounded-lg border border-white/10 bg-[#080808] text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] hover:border-white/20 min-h-[120px] transition-colors"
                                    >
                                        {availableRoles.map(role => (
                                            <option key={role.id} value={role.id.toString()} className="py-1.5 px-2 hover:bg-[var(--gold)]/10 checked:bg-[var(--gold)]/20 rounded">
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="mt-1.5 text-[10px] text-zinc-500 leading-normal">{t('roles_hint')}</p>
                                    {errors.roles && <p className="mt-1.5 text-xs text-red-500">{errors.roles}</p>}
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <ToggleSwitch
                                        id="is_active"
                                        checked={data.is_active}
                                        onChange={checked => setData('is_active', checked)}
                                        label={t('active_account')}
                                    />
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
                            {t('delete_user')}
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={handleBackNav} className="inline-flex items-center px-5 py-2.5 border border-white/10 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/[0.02] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500">
                            {t('cancel')}
                        </button>
                        <button
                            type="button"
                            onClick={submit}
                            disabled={!isDirty || processing || showTick}
                            className={`inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gold)] ${
                                showTick
                                    ? 'bg-emerald-500 text-black'
                                    : isDirty && !processing
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
                url={route('admin.users.destroy', user.id)}
                redirectUrl={route('admin.users.index')}
                title={t('delete_user_confirm_title')}
                message={t('delete_user_confirm_message')}
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

