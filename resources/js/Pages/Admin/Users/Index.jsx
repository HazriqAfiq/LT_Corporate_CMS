import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import { Search, Plus, Edit, Trash } from 'lucide-react';
import debounce from 'lodash/debounce';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';
import usePermissions from '@/Hooks/usePermissions';

export default function Index({ users, filters }) {
    const { t } = useTranslation();
    const { hasPermission } = usePermissions();
    const [search, setSearch] = useState(filters.search || '');
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const handleSearch = debounce((value) => {
        router.get('/admin/users', { search: value }, { preserveState: true, replace: true });
    }, 300);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
    };

    const handleDelete = (id) => {
        setDeleteTargetId(id);
    };

    const confirmDelete = () => {
        if (deleteTargetId) {
            router.delete(`/admin/users/${deleteTargetId}`, {
                onSuccess: () => setDeleteTargetId(null)
            });
        }
    };

    return (
        <AdminLayout header={t('users')}>
            <Head title={`${t('users_title')} | Admin`} />

            <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 flex flex-col min-h-[500px]">
                <div className="px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-zinc-500" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 bg-[#080808] border border-white/10 text-white rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-colors"
                            placeholder={t('search_users')}
                            value={search}
                            onChange={onSearchChange}
                        />
                    </div>
                    { (hasPermission('create_users') ) && (
<Link
                            href={route('admin.users.create')}
                            className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:bg-[var(--gold-light)] transition-all duration-200"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('add_user')}
                        </Link>
)}
                </div>

                <div className="overflow-x-auto flex-1 hidden md:block">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-3 font-semibold w-12">{t('avatar')}</th>
                                <th className="px-6 py-3 font-semibold">{t('name_email')}</th>
                                <th className="px-6 py-3 font-semibold">{t('role')}</th>
                                <th className="px-6 py-3 font-semibold">{t('status')}</th>
                                <th className="px-6 py-3 font-semibold text-right">{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center shrink-0 border border-white/5 dark:border-gray-600">
                                            {user.avatar ? (
                                                <img src={`/storage/${user.avatar}`} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=F5A623&color=1a1a2e`} alt="" className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-white">
                                            {user.name}
                                        </div>
                                        <div className="text-sm text-zinc-500">
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-1 flex-wrap">
                                            {user.roles && user.roles.length > 0 ? (
                                                user.roles.map(role => (
                                                    <span key={role.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20 uppercase tracking-wide">
                                                        {role.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-zinc-500">-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${user.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                            {user.is_active ? t('active') : t('inactive')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            { (hasPermission('edit_users') ) && (
<Link
                                                    href={route('admin.users.edit', user.id)}
                                                    className="p-2 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-lg transition-colors border border-white/5"
                                                    title={t('edit')}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            )}
                                            { (hasPermission('delete_users') ) && (
<button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/60 rounded-lg transition-colors border border-red-900/20"
                                                    title={t('delete')}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.data.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
                                        {t('no_users')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden flex-1 divide-y divide-white/[0.04] p-4 space-y-4">
                    {users.data.map((user) => (
                        <div key={user.id} className="p-4 bg-[#080808]/40 border border-white/5 rounded-2xl flex flex-col gap-4 hover:border-[var(--gold)]/20 transition-all duration-300">
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center shrink-0 border border-white/5">
                                    {user.avatar ? (
                                        <img src={`/storage/${user.avatar}`} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=F5A623&color=1a1a2e`} alt="" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                                    <p className="text-xs text-zinc-500 truncate mt-0.5">{user.email}</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-zinc-500 font-medium tracking-wider uppercase">{t('role')}:</span>
                                    <div className="flex gap-1 flex-wrap">
                                        {user.roles && user.roles.length > 0 ? (
                                            user.roles.map(role => (
                                                <span key={role.id} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20 uppercase tracking-wide">
                                                    {role.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-zinc-500">-</span>
                                        )}
                                    </div>
                                </div>
                                
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${user.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {user.is_active ? t('active') : t('inactive')}
                                </span>
                            </div>
                            
                            {(hasPermission('edit_users') || hasPermission('delete_users')) && (
                                <div className="flex justify-end gap-2 border-t border-white/5 pt-3">
                                    {hasPermission('edit_users') && (
                                        <Link
                                            href={route('admin.users.edit', user.id)}
                                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-xl transition-colors border border-white/5 text-xs font-semibold"
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                            {t('edit')}
                                        </Link>
                                    )}
                                    {hasPermission('delete_users') && (
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/60 rounded-xl transition-colors border border-red-900/20 text-xs font-semibold"
                                        >
                                            <Trash className="h-3.5 w-3.5" />
                                            {t('delete')}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {users.data.length === 0 && (
                        <div className="py-12 text-center text-zinc-500 text-sm">
                            {t('no_users')}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {users.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-white/5 bg-[#080808]/30">
                        <div className="flex flex-wrap gap-1">
                            {users.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 rounded text-sm ${
                                        link.active 
                                            ? 'bg-[var(--gold)] text-[#080808] font-bold' 
                                            : !link.url 
                                                ? 'text-gray-400 cursor-not-allowed' 
                                                : 'bg-white dark:bg-gray-800 text-zinc-300 border border-white/10 hover:bg-[#080808] dark:hover:bg-white/5'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <DeleteConfirmModal
                show={!!deleteTargetId}
                onClose={() => setDeleteTargetId(null)}
                url={deleteTargetId ? `/admin/users/${deleteTargetId}` : null}
                title={t('delete_user_confirm_title')}
                message={t('delete_user_confirm_message')}
            />
        </AdminLayout>
    );
}
