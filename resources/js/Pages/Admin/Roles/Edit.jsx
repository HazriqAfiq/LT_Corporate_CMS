import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import { getPermissionLabel } from '@/Utils/permissionHelper';
import { ArrowLeft, Save, ShieldCheck, Check, Trash, Lock } from 'lucide-react';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';
import UnsavedChangesModal from '@/Components/Admin/UnsavedChangesModal';

export default function RolesEdit({ role, permissionGroups }) {
    const isSuperAdmin = role.name === 'Super Admin';
    const { t, lang } = useTranslation();

    const { data, setData, processing, errors, setError, clearErrors, isDirty } = useForm({
        _method: 'PUT',
        name: role.name || '',
        permissions: role.permissions || [],
    });

    const [showUnsavedModal, setShowUnsavedModal] = React.useState(false);
    const [pendingNavUrl, setPendingNavUrl] = React.useState(null);

    const handleBackNav = (e) => {
        e.preventDefault();
        if (isDirty) {
            setPendingNavUrl(route('admin.roles.index'));
            setShowUnsavedModal(true);
        } else {
            router.visit(route('admin.roles.index'));
        }
    };

    const handleNavDiscard = () => {
        setShowUnsavedModal(false);
        router.visit(pendingNavUrl || route('admin.roles.index'));
    };


    const [showTick, setShowTick] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const togglePermission = (perm) => {
        if (isSuperAdmin) return; // Super Admin permissions are immutable
        if (data.permissions.includes(perm)) {
            setData('permissions', data.permissions.filter(p => p !== perm));
        } else {
            setData('permissions', [...data.permissions, perm]);
        }
    };

    const toggleGroup = (perms) => {
        if (isSuperAdmin) return;
        const allSelected = perms.every(p => data.permissions.includes(p));
        if (allSelected) {
            setData('permissions', data.permissions.filter(p => !perms.includes(p)));
        } else {
            const merged = [...new Set([...data.permissions, ...perms])];
            setData('permissions', merged);
        }
    };

    const submit = () => {
        setLoading(true);
        clearErrors();
        window.axios.post(route('admin.roles.update', role.id), data)
            .then(() => {
                setShowTick(true);
                setTimeout(() => {
                    setShowTick(false);
                    router.visit(route('admin.roles.index'));
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
        router.delete(route('admin.roles.destroy', role.id), {
            onSuccess: () => setShowDeleteModal(false)
        });
    };

    return (
        <AdminLayout header={t('edit_role_name', { name: role.name })}>
            <Head title={`${t('edit_role_name', { name: role.name })} | Admin`} />

            <div className="mx-auto px-4">
                {/* Back Link */}
                <div className="mb-6">
                    <button type="button" onClick={handleBackNav} className="text-zinc-500 hover:text-[var(--gold)] flex items-center gap-1.5 transition-colors text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        {t('back_to_roles_list')}
                    </button>
                </div>

                {/* Super Admin notice */}
                {isSuperAdmin && (
                    <div className="mb-6 flex items-start gap-3 px-5 py-4 bg-[var(--gold)]/8 border border-[var(--gold)]/20 rounded-2xl">
                        <Lock className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[var(--gold)] font-semibold text-sm">{t('protected_role')}</p>
                            <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">
                                {t('super_admin_protected_desc')}
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Role Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                            <div className="p-5 border-b border-white/5 bg-[#080808]/50">
                                <h2 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-[var(--gold)]" />
                                    {t('role_information')}
                                </h2>
                            </div>
                            <div className="p-5">
                                <label className="block text-sm font-semibold text-zinc-300 mb-1.5">
                                    {t('role_name')} {!isSuperAdmin && <span className="text-red-500">*</span>}
                                </label>
                                {isSuperAdmin ? (
                                    <div className="w-full rounded-lg border border-white/5 bg-[#060606] text-zinc-500 px-3 py-2.5 text-sm flex items-center gap-2 cursor-not-allowed">
                                        <Lock className="w-3.5 h-3.5 shrink-0" />
                                        {role.name}
                                    </div>
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full rounded-lg border border-white/10 bg-[#080808] text-white px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] hover:border-white/20"
                                        />
                                        {errors.name && (
                                            <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
                                        )}
                                    </>
                                )}

                                <div className="mt-5 pt-5 border-t border-white/5">
                                    {/* Summary */}
                                    <div className="px-4 py-3 bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-xl">
                                        <p className="text-xs text-[var(--gold)] font-semibold">
                                            {isSuperAdmin ? `${data.permissions.length}${t('all_bracket')}` : t('permissions_selected_count', { count: data.permissions.length })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Permission Checkboxes */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                            <div className="p-5 border-b border-white/5 bg-[#080808]/50">
                                <h2 className="text-sm font-bold text-white uppercase tracking-wide">{t('permissions_title')}</h2>
                                <p className="text-xs text-zinc-500 mt-0.5">
                                    {isSuperAdmin
                                        ? t('super_admin_permissions_desc')
                                        : t('permissions_desc')
                                    }
                                </p>
                            </div>
                            <div className="p-5 space-y-6">
                                {Object.entries(permissionGroups).map(([group, perms]) => {
                                    if (group === 'Artikel') {
                                        const hasManageOwn = data.permissions.includes('manage_own_articles');
                                        const granularPerms = perms.filter(p => p !== 'manage_own_articles');
                                        const allSelected = granularPerms.every(p => data.permissions.includes(p));

                                        const toggleManageOwn = (enabled) => {
                                            if (isSuperAdmin) return;
                                            let currentPerms = [...data.permissions];
                                            
                                            // Remove all Artikel granular perms and the manage_own_articles perm
                                            currentPerms = currentPerms.filter(p => !perms.includes(p) && p !== 'manage_own_articles');
                                            
                                            if (enabled) {
                                                currentPerms.push('manage_own_articles');
                                            }
                                            
                                            setData('permissions', currentPerms);
                                        };

                                        return (
                                            <div key={group} className="pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                                <div className="flex items-center justify-between mb-4">
                                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{group}</p>
                                                    {!hasManageOwn && !isSuperAdmin && (
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleGroup(granularPerms)}
                                                            className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                                                                allSelected
                                                                    ? 'text-[var(--gold)] bg-[var(--gold)]/10 hover:bg-[var(--gold)]/20'
                                                                    : 'text-zinc-500 hover:text-white'
                                                            }`}
                                                        >
                                                            {allSelected ? t('deselect_all', 'Deselect All') : t('select_all', 'Select All')}
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="mb-6 p-4 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#080808]/50 flex items-center justify-between shadow-sm dark:shadow-none">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('manage_own_articles_only', 'Manage Own Articles Only')}</p>
                                                        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5">{t('manage_own_articles_desc', 'Restrict this role to only managing their own articles. Granular permissions will be locked.')}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        disabled={isSuperAdmin}
                                                        onClick={() => toggleManageOwn(!hasManageOwn)}
                                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none shrink-0 ${isSuperAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${hasManageOwn ? 'bg-[var(--gold)]' : 'bg-[#cbd5e1]'}`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasManageOwn ? 'translate-x-4.5' : 'translate-x-0.5'}`}
                                                        />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {granularPerms.map(perm => {
                                                        const isChecked = hasManageOwn ? true : data.permissions.includes(perm);
                                                        return (
                                                            <label
                                                                key={perm}
                                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                                                                    isSuperAdmin
                                                                        ? 'cursor-not-allowed opacity-70 bg-[var(--gold)]/5 border-[var(--gold)]/15'
                                                                        : hasManageOwn
                                                                            ? 'opacity-40 cursor-not-allowed bg-[#060608] border-white/5'
                                                                            : isChecked
                                                                                ? 'cursor-pointer bg-[var(--gold)]/10 border-[var(--gold)]/30'
                                                                                : 'cursor-pointer bg-[#080808] border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
                                                                }`}
                                                            >
                                                                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                                                                    isChecked
                                                                        ? (hasManageOwn ? 'bg-zinc-800 border-zinc-700' : 'bg-[var(--gold)] border-[var(--gold)]')
                                                                        : 'border-zinc-700 bg-transparent'
                                                                }`}>
                                                                    {isChecked && <Check className={`w-3 h-3 ${hasManageOwn ? 'text-zinc-500' : 'text-black'}`} strokeWidth={3} />}
                                                                </div>
                                                                <input
                                                                    type="checkbox"
                                                                    className="sr-only"
                                                                    checked={isChecked}
                                                                    disabled={hasManageOwn || isSuperAdmin}
                                                                    onChange={() => !hasManageOwn && togglePermission(perm)}
                                                                />
                                                                 <span className={`text-xs font-mono ${hasManageOwn ? 'text-zinc-600' : (isChecked ? 'text-[var(--gold)]' : 'text-zinc-400')}`}>
                                                                     <span className="font-sans font-medium mr-1.5">{getPermissionLabel(perm, lang)}</span>
                                                                     <span className="text-zinc-600 text-[10px]">({perm})</span>
                                                                 </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    }

                                    const allSelected = perms.every(p => data.permissions.includes(p));
                                    return (
                                        <div key={group} className="pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                            {/* Group Header */}
                                            <div className="flex items-center justify-between mb-2.5">
                                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                                    {group}
                                                </p>
                                                {!isSuperAdmin && (
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleGroup(perms)}
                                                        className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                                                            allSelected
                                                                ? 'text-[var(--gold)] bg-[var(--gold)]/10 hover:bg-[var(--gold)]/20'
                                                                : 'text-zinc-500 hover:text-white'
                                                        }`}
                                                    >
                                                        {allSelected ? t('deselect_all', 'Deselect All') : t('select_all', 'Select All')}
                                                    </button>
                                                )}
                                            </div>

                                            {/* Permission Items */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {perms.map(perm => {
                                                    const isChecked = data.permissions.includes(perm);
                                                    return (
                                                        <label
                                                            key={perm}
                                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                                                                isSuperAdmin
                                                                    ? 'cursor-default opacity-70 bg-[var(--gold)]/5 border-[var(--gold)]/15'
                                                                    : isChecked
                                                                        ? 'cursor-pointer bg-[var(--gold)]/10 border-[var(--gold)]/30'
                                                                        : 'cursor-pointer bg-[#080808] border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
                                                            }`}
                                                        >
                                                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                                                                isChecked
                                                                    ? 'bg-[var(--gold)] border-[var(--gold)]'
                                                                    : 'border-zinc-700 bg-transparent'
                                                            }`}>
                                                                {isChecked && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                                                            </div>
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only"
                                                                checked={isChecked}
                                                                onChange={() => togglePermission(perm)}
                                                                disabled={isSuperAdmin}
                                                            />
                                                             <span className={`text-xs font-mono ${isChecked ? 'text-[var(--gold)]' : 'text-zinc-400'}`}>
                                                                 <span className="font-sans font-medium mr-1.5">{getPermissionLabel(perm, lang)}</span>
                                                                 <span className="text-zinc-600 text-[10px]">({perm})</span>
                                                             </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-24" />

            {/* Fixed Bottom Bar */}
            <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-[#080808] border-t border-white/5 p-4 px-6 flex justify-between items-center z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
                {/* Left: Delete */}
                <div>
                    {!isSuperAdmin && (
                        <button
                             type="button"
                             onClick={handleDelete}
                             className="inline-flex items-center px-4 py-2 border border-red-500/20 rounded-lg text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors focus:outline-none"
                        >
                            <Trash className="h-4 w-4 mr-2" />
                            {t('delete_role')}
                        </button>
                    )}
                </div>

                {/* Right: Cancel + Save */}
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
                                ? 'btn-submit-success'
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

            <DeleteConfirmModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                url={route('admin.roles.destroy', role.id)}
                redirectUrl={route('admin.roles.index')}
                title={t('delete_role_confirm_title')}
                message={t('delete_role_confirm_message_edit', { name: role.name })}
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

