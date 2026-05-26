import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import { ArrowLeft, Save, ShieldCheck, Check, Trash, Lock } from 'lucide-react';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';

export default function RolesEdit({ role, permissionGroups }) {
    const isSuperAdmin = role.name === 'Super Admin';
    const { t } = useTranslation();

    const { data, setData, post, processing, errors, isDirty } = useForm({
        _method: 'PUT',
        name: role.name || '',
        permissions: role.permissions || [],
    });

    const [showTick, setShowTick] = useState(false);
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
        post(route('admin.roles.update', role.id), {
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
        router.delete(route('admin.roles.destroy', role.id), {
            onSuccess: () => setShowDeleteModal(false)
        });
    };

    return (
        <AdminLayout header={t('edit_role_name', { name: role.name })}>
            <Head title={`${t('edit_role_name', { name: role.name })} | Admin`} />

            <div className="max-w-4xl mx-auto px-4">
                {/* Back Link */}
                <div className="mb-6">
                    <Link
                        href={route('admin.roles.index')}
                        className="text-zinc-500 hover:text-[var(--gold)] flex items-center gap-1.5 transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('back_to_roles_list')}
                    </Link>
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
                                    const allSelected = perms.every(p => data.permissions.includes(p));
                                    return (
                                        <div key={group}>
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
                                                        {allSelected ? t('deselect_all') : t('select_all')}
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
                                                                {perm}
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
                    <Link
                        href={route('admin.roles.index')}
                        className="inline-flex items-center px-5 py-2.5 border border-white/10 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/[0.02] transition-colors focus:outline-none"
                    >
                        {t('cancel')}
                    </Link>
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

            <DeleteConfirmModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title={t('delete_role_confirm_title')}
                message={t('delete_role_confirm_message_edit', { name: role.name })}
            />

        </AdminLayout>
    );
}
