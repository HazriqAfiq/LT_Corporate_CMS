import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import { getPermissionLabel } from '@/Utils/permissionHelper';
import { ArrowLeft, Save, ShieldCheck, Check } from 'lucide-react';

import UnsavedChangesModal from '@/Components/Admin/UnsavedChangesModal';
export default function RolesCreate({ permissionGroups }) {
    const { t, lang } = useTranslation();
    const { data, setData, post, processing, errors, isDirty, setError, clearErrors } = useForm({
        name: '',
        permissions: [],
    });

    const [showUnsavedModal, setShowUnsavedModal] = React.useState(false);
    const [pendingNavUrl, setPendingNavUrl] = React.useState(null);
    const [showTick, setShowTick] = useState(false);
    const [loading, setLoading] = useState(false);

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


    const togglePermission = (perm) => {
        if (data.permissions.includes(perm)) {
            setData('permissions', data.permissions.filter(p => p !== perm));
        } else {
            setData('permissions', [...data.permissions, perm]);
        }
    };

    const toggleGroup = (perms) => {
        const allSelected = perms.every(p => data.permissions.includes(p));
        if (allSelected) {
            setData('permissions', data.permissions.filter(p => !perms.includes(p)));
        } else {
            const merged = [...new Set([...data.permissions, ...perms])];
            setData('permissions', merged);
        }
    };

    const submit = (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        clearErrors();

        window.axios.post(route('admin.roles.store'), data)
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

    return (
        <AdminLayout header={t('add_new_role')}>
            <Head title={`${t('add_role')} | Admin`} />

            <div className="mx-auto px-4">
                {/* Back Link */}
                <div className="mb-6">
                    <button type="button" onClick={handleBackNav} className="text-zinc-500 hover:text-[var(--gold)] flex items-center gap-1.5 transition-colors text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        {t('back_to_roles_list')}
                    </button>
                </div>

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
                                    {t('role_name')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder={t('role_name_placeholder')}
                                    className="w-full rounded-lg border border-white/10 bg-[#080808] text-white px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] hover:border-white/20"
                                />
                                {errors.name && (
                                    <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
                                )}

                                <div className="mt-5 pt-5 border-t border-white/5">
                                    <p className="text-xs text-zinc-500 leading-relaxed">
                                        {t('role_desc_hint')}
                                    </p>
                                </div>

                                {/* Summary */}
                                <div className="mt-4 px-4 py-3 bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-xl">
                                    <p className="text-xs text-[var(--gold)] font-semibold">
                                        {t('permissions_selected_count', { count: data.permissions.length })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Permission Checkboxes */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                            <div className="p-5 border-b border-white/5 bg-[#080808]/50">
                                <h2 className="text-sm font-bold text-white uppercase tracking-wide">{t('permissions_title')}</h2>
                                <p className="text-xs text-zinc-500 mt-0.5">{t('permissions_desc')}</p>
                            </div>
                            <div className="p-5 space-y-6">
                                {Object.entries(permissionGroups).map(([group, perms]) => {
                                    if (group === 'Artikel') {
                                        const hasManageOwn = data.permissions.includes('manage_own_articles');
                                        const granularPerms = perms.filter(p => p !== 'manage_own_articles');
                                        const allSelected = granularPerms.every(p => data.permissions.includes(p));

                                        const toggleManageOwn = (enabled) => {
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
                                                    {!hasManageOwn && (
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

                                                <div className="mb-6 p-4 rounded-xl border border-slate-200 dark:border-slate-200 bg-slate-100 dark:bg-slate-100 flex items-center justify-between shadow-sm text-slate-900 dark:text-slate-900">
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-900">{t('manage_own_articles_only', 'Manage Own Articles Only')}</p>
                                                        <p className="text-xs text-slate-700 dark:text-slate-700 mt-0.5">{t('manage_own_articles_desc', 'Restrict this role to only managing their own articles. Granular permissions will be locked.')}</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center select-none cursor-pointer shrink-0">
                                                        <input
                                                            type="checkbox"
                                                            checked={hasManageOwn}
                                                            onChange={e => toggleManageOwn(e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="switch-toggle-track toggle-gold"></div>
                                                    </label>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {granularPerms.map(perm => {
                                                        const isChecked = hasManageOwn ? true : data.permissions.includes(perm);
                                                        return (
                                                            <label
                                                                key={perm}
                                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                                                                    hasManageOwn
                                                                        ? 'cursor-not-allowed bg-zinc-50 dark:bg-[#060608]/50 border-zinc-200/80 dark:border-white/5 opacity-80 dark:opacity-40'
                                                                        : isChecked
                                                                            ? 'cursor-pointer bg-[var(--gold)]/10 border-[var(--gold)]/30'
                                                                            : 'cursor-pointer bg-[#080808] border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
                                                                }`}
                                                            >
                                                                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                                                                    isChecked
                                                                        ? (hasManageOwn ? 'bg-zinc-300 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-700' : 'bg-[var(--gold)] border-[var(--gold)]')
                                                                        : 'border-zinc-700 bg-transparent'
                                                                }`}>
                                                                    {isChecked && <Check className={`w-3 h-3 ${hasManageOwn ? 'text-zinc-600 dark:text-zinc-500' : 'text-black'}`} strokeWidth={3} />}
                                                                </div>
                                                                <input
                                                                    type="checkbox"
                                                                    className="sr-only"
                                                                    checked={isChecked}
                                                                    disabled={hasManageOwn}
                                                                    onChange={() => !hasManageOwn && togglePermission(perm)}
                                                                />
                                                                 <span className={`text-xs font-mono ${hasManageOwn ? 'text-zinc-700 dark:text-zinc-600 font-semibold' : (isChecked ? 'text-[var(--gold)]' : 'text-zinc-400')}`}>
                                                                     <span className="font-sans font-medium mr-1.5">{getPermissionLabel(perm, lang)}</span>
                                                                     <span className="text-[10px]">({perm})</span>
                                                                 </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    }

                                    const allSelected = perms.every(p => data.permissions.includes(p));
                                    const someSelected = perms.some(p => data.permissions.includes(p)) && !allSelected;
                                    return (
                                        <div key={group} className="pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                            {/* Group Header */}
                                            <div className="flex items-center justify-between mb-2.5">
                                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                                    {group}
                                                </p>
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
                                            </div>

                                            {/* Permission Items */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {perms.map(perm => {
                                                    const isChecked = data.permissions.includes(perm);
                                                    return (
                                                        <label
                                                            key={perm}
                                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                                                                isChecked
                                                                    ? 'bg-[var(--gold)]/10 border-[var(--gold)]/30'
                                                                    : 'bg-[#080808] border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
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
                                {t('save_role')}
                            </>
                        )}
                    </button>
                </div>
            </div>
            <UnsavedChangesModal
                show={showUnsavedModal}
                onClose={() => setShowUnsavedModal(false)}
                onDiscard={handleNavDiscard}
                processing={processing}
            />

        </AdminLayout>
    );
}

