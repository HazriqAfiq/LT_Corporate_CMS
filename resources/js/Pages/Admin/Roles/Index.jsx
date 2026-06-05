import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import {
    ShieldCheck, Plus, Edit, Trash, Check, X,
    Users, Lock, ChevronDown, ChevronUp
} from 'lucide-react';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';

// Role colour mapping
const ROLE_STYLES = {
    'Super Admin': { color: 'text-[var(--gold)]',   bg: 'bg-[var(--gold)]/10',   border: 'border-[var(--gold)]/20' },
    'Admin':       { color: 'text-violet-400',       bg: 'bg-violet-500/10',       border: 'border-violet-500/20' },
    'Editor':      { color: 'text-sky-400',          bg: 'bg-sky-500/10',          border: 'border-sky-500/20' },
    'Viewer':      { color: 'text-zinc-400',         bg: 'bg-zinc-500/10',         border: 'border-zinc-500/20' },
};

const DEFAULT_STYLE = { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };

function getRoleStyle(name) {
    return ROLE_STYLES[name] || DEFAULT_STYLE;
}

const Tick = ({ v }) => v
    ? <Check className="w-4 h-4 text-emerald-400 mx-auto" />
    : <X className="w-4 h-4 text-zinc-700 mx-auto" />;

export default function RolesIndex({ roles, permissionGroups }) {
    const { flash } = usePage().props;
    const { t } = useTranslation();
    const [expandedMatrix, setExpandedMatrix] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleDelete = (role) => {
        setDeleteTarget(role);
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            router.delete(route('admin.roles.destroy', deleteTarget.id), {
                onSuccess: () => setDeleteTarget(null)
            });
        }
    };

    // Build ordered list of all permission names for matrix columns
    const allPermNames = Object.values(permissionGroups).flat();

    return (
        <AdminLayout header={t('roles_permissions')}>
            <Head title={`${t('roles_permissions')} | Admin`} />

            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-6 flex items-center gap-3 px-5 py-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <p className="text-emerald-400 text-sm font-medium">{flash.success}</p>
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 flex items-center gap-3 px-5 py-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl">
                    <X className="w-4 h-4 text-red-400 shrink-0" />
                    <p className="text-red-400 text-sm font-medium">{flash.error}</p>
                </div>
            )}

            {/* Page Header */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white">{t('roles_list')}</h2>
                    <p className="text-zinc-500 text-sm mt-0.5">{t('roles_count', { count: roles.length })}</p>
                </div>
                <Link
                    href={route('admin.roles.create')}
                    className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:bg-[var(--gold-light)] transition-all duration-200"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('add_role')}
                </Link>
            </div>

            {/* Role Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {roles.map((role) => {
                    const style = getRoleStyle(role.name);
                    const isSuperAdmin = role.name === 'Super Admin';
                    return (
                        <div key={role.id} className={`bg-[#0c0c0e] border ${style.border} rounded-2xl p-5 relative group transition-all hover:shadow-lg hover:shadow-black/20`}>
                            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${style.bg} mb-4`}>
                                <ShieldCheck className={`w-5 h-5 ${style.color}`} />
                            </div>
                            <h3 className={`font-bold text-base mb-1 ${style.color} flex items-center gap-2`}>
                                {role.name}
                                {isSuperAdmin && (
                                    <Lock className="w-3.5 h-3.5 text-zinc-600" title={t('protected')} />
                                )}
                            </h3>
                            <p className="text-zinc-500 text-xs leading-relaxed mb-3">
                                {t('permissions_selected_count', { count: role.permissions.length })}
                            </p>
                            <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                                <Users className="w-3.5 h-3.5 text-zinc-600" />
                                <span><span className="text-white font-bold">{role.user_count}</span> {t('users_label')}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 flex gap-1.5">
                                <Link
                                    href={route('admin.roles.edit', role.id)}
                                    className="p-2 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-lg transition-colors border border-white/5 inline-flex items-center justify-center"
                                    title={t('edit')}
                                >
                                    <Edit className="w-3.5 h-3.5" />
                                </Link>
                                {!isSuperAdmin && (
                                    <button
                                        onClick={() => handleDelete(role)}
                                        className="p-2 bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/60 rounded-lg transition-colors border border-red-900/20 inline-flex items-center justify-center"
                                        title={t('delete')}
                                    >
                                        <Trash className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Permission Matrix */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden">
                <button
                    className="w-full px-6 py-4 border-b border-white/5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                    onClick={() => setExpandedMatrix(!expandedMatrix)}
                >
                    <div className="text-left">
                        <h2 className="text-white font-bold text-sm">{t('permission_matrix')}</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">{t('permission_matrix_desc')}</p>
                    </div>
                    {expandedMatrix
                        ? <ChevronUp className="w-4 h-4 text-zinc-500" />
                        : <ChevronDown className="w-4 h-4 text-zinc-500" />
                    }
                </button>

                {expandedMatrix && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-[#080808]/50 text-xs font-semibold uppercase tracking-wider">
                                    <th className="px-6 py-3 text-zinc-500 min-w-[200px]">{t('permission')}</th>
                                    {roles.map(r => {
                                        const s = getRoleStyle(r.name);
                                        return (
                                            <th key={r.id} className={`px-4 py-3 text-center ${s.color} whitespace-nowrap`}>
                                                {r.name}
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(permissionGroups).map(([group, perms]) => (
                                    <React.Fragment key={group}>
                                        <tr className="bg-[#080808]/40">
                                            <td
                                                colSpan={roles.length + 1}
                                                className="px-6 py-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest"
                                            >
                                                {group}
                                            </td>
                                        </tr>
                                        {perms.map(perm => (
                                            <tr key={perm} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                                                <td className="px-6 py-2.5 text-xs text-zinc-400 font-mono">{perm}</td>
                                                {roles.map(r => (
                                                    <td key={r.id} className="px-4 py-2.5">
                                                        <Tick v={r.permissions.includes(perm)} />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <DeleteConfirmModal
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                url={deleteTarget ? route('admin.roles.destroy', deleteTarget.id) : null}
                title={t('delete_role_confirm_title')}
                message={t('delete_role_confirm_dynamic', { name: deleteTarget?.name })}
            />
        </AdminLayout>
    );
}
