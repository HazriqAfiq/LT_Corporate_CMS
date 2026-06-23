import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Eye, Trash, CheckCircle2 } from 'lucide-react';
import { debounce } from 'lodash-es';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';
import useTranslation from '@/Hooks/useTranslation';
import usePermissions from '@/Hooks/usePermissions';

export default function Index({ inquiries, filters }) {
    const { t } = useTranslation();
    const { hasPermission } = usePermissions();
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.is_read || '');
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchInquiries = (searchValue, isReadValue) => {
        const query = {};
        if (searchValue) query.search = searchValue;
        if (isReadValue !== '') query.is_read = isReadValue;
        router.get('/admin/inquiries', query, { preserveState: true, replace: true });
    };

    const handleSearch = debounce((value, isReadValue) => {
        fetchInquiries(value, isReadValue);
    }, 300);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
        handleSearch(e.target.value, statusFilter);
    };

    const onStatusChange = (e) => {
        setStatusFilter(e.target.value);
        fetchInquiries(search, e.target.value);
    };

    const handleDelete = (id, name) => {
        setDeleteTarget({ id, name });
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            router.delete(`/admin/inquiries/${deleteTarget.id}`, {
                onSuccess: () => setDeleteTarget(null)
            });
        }
    };

    return (
        <AdminLayout header={t('inquiries_title')}>
            <Head title={`${t('inquiries_title')} | Admin`} />

            <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 flex flex-col min-h-[500px]">
                <div className="px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-zinc-500" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 bg-[#080808] border border-white/10 text-white rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-colors"
                                placeholder={t('search_inquiries_placeholder')}
                                value={search}
                                onChange={onSearchChange}
                            />
                        </div>
                        <div className="flex bg-[#080808] p-1 rounded-xl border border-white/10 flex-wrap gap-1">
                            {[
                                { key: '', label: t('all_status') },
                                { key: 'false', label: t('status_unread') },
                                { key: 'true', label: t('status_read') },
                                { key: 'replied', label: t('status_replied') }
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => {
                                        setStatusFilter(tab.key);
                                        fetchInquiries(search, tab.key);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                        statusFilter === tab.key
                                            ? 'bg-zinc-800 text-white shadow-sm border border-white/5'
                                            : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto flex-1 hidden md:block">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-3 font-semibold">{t('name_email')}</th>
                                <th className="px-6 py-3 font-semibold">{t('subject')}</th>
                                <th className="px-6 py-3 font-semibold text-center">{t('status')}</th>
                                <th className="px-6 py-3 font-semibold text-right">{t('date')}</th>
                                <th className="px-6 py-3 font-semibold text-right">{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {inquiries.data.map((inquiry) => (
                                <tr key={inquiry.id} className={`transition-colors group ${inquiry.is_read ? 'hover:bg-white/[0.02]' : 'bg-[var(--gold)]/[0.03]'}`}>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-white">
                                            {inquiry.name}
                                        </div>
                                        <div className="text-sm text-zinc-500">
                                            {inquiry.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-zinc-200 line-clamp-2 max-w-sm">
                                            {inquiry.subject}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {inquiry.replied_at ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                {t('status_replied')}
                                            </span>
                                        ) : inquiry.is_read ? (
                                            <span className="inline-flex items-center text-emerald-400">
                                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                                <span className="text-xs font-medium">{t('read_status')}</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20">
                                                {t('new_badge')}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 text-right">
                                        {new Date(inquiry.created_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {hasPermission('edit_inquiries') && (
                                                <Link
                                                    href={route('admin.inquiries.edit', inquiry.id)}
                                                    className="p-2 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-lg transition-colors border border-white/5"
                                                    title={t('view_inquiry')}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            )}
                                            {hasPermission('delete_inquiries') && (
                                                <button
                                                    onClick={() => handleDelete(inquiry.id, inquiry.name)}
                                                    className="p-2 bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/60 rounded-lg transition-colors border border-red-900/20"
                                                    title={t('delete')}
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                             ))}
                            {inquiries.data.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
                                        {t('no_inquiries_found')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden flex-1 divide-y divide-white/[0.04] p-4 space-y-4">
                    {inquiries.data.map((inquiry) => (
                        <div key={inquiry.id} className={`p-4 border rounded-2xl flex flex-col gap-3.5 hover:border-[var(--gold)]/20 transition-all duration-300 ${inquiry.is_read ? 'bg-[#080808]/40 border-white/5' : 'bg-[var(--gold)]/[0.03] border-[var(--gold)]/10'}`}>
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">{inquiry.name}</p>
                                    <p className="text-xs text-zinc-500 truncate mt-0.5">{inquiry.email}</p>
                                </div>
                                <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
                                    {new Date(inquiry.created_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' })}
                                </span>
                            </div>
                            
                            <div>
                                <p className="text-xs text-zinc-400 font-medium tracking-wider uppercase mb-1">{t('subject')}:</p>
                                <p className="text-sm text-zinc-200 line-clamp-3">{inquiry.subject}</p>
                            </div>
                            
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3">
                                <div>
                                    {inquiry.replied_at ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            {t('status_replied')}
                                        </span>
                                    ) : inquiry.is_read ? (
                                        <span className="inline-flex items-center text-emerald-400 text-[10px] font-semibold">
                                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                            {t('read_status')}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20">
                                            {t('new_badge')}
                                        </span>
                                    )}
                                </div>
                                
                                {(hasPermission('edit_inquiries') || hasPermission('delete_inquiries')) && (
                                    <div className="flex gap-2">
                                        {hasPermission('edit_inquiries') && (
                                            <Link
                                                href={route('admin.inquiries.edit', inquiry.id)}
                                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-xl transition-colors border border-white/5 text-xs font-semibold"
                                                title={t('view_inquiry')}
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                {t('view_inquiry')}
                                            </Link>
                                        )}
                                        {hasPermission('delete_inquiries') && (
                                            <button
                                                onClick={() => handleDelete(inquiry.id, inquiry.name)}
                                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/60 rounded-xl transition-colors border border-red-900/20 text-xs font-semibold"
                                                title={t('delete')}
                                            >
                                                <Trash className="w-3.5 h-3.5" />
                                                {t('delete')}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {inquiries.data.length === 0 && (
                        <div className="py-12 text-center text-zinc-500 text-sm">
                            {t('no_inquiries_found')}
                        </div>
                    )}
                </div>

                {inquiries.links?.length > 3 && (
                    <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-xs text-zinc-500">
                            {t('showing_files_pagination', { from: inquiries.from, to: inquiries.to, total: inquiries.total })}
                        </span>
                        <div className="flex flex-wrap gap-1">
                            {inquiries.links.map((link, idx) => (
                                <Link key={idx} href={link.url || '#'} className={`px-3 py-1 rounded-lg text-sm ${
                                    link.active ? 'bg-[var(--gold)] text-[#080808] font-bold' : !link.url ? 'text-zinc-700 cursor-not-allowed' : 'bg-[#080808] text-zinc-300 border border-white/10 hover:border-[var(--gold)]/30'
                                }`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <DeleteConfirmModal
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                url={deleteTarget ? `/admin/inquiries/${deleteTarget.id}` : null}
                title={t('delete_inquiry_confirm_title')}
                message={t('delete_inquiry_confirm_message', { name: deleteTarget?.name })}
            />
        </AdminLayout>
    );
}
