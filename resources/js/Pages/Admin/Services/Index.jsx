import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import { Search, Plus, Edit, Trash, Wrench } from 'lucide-react';
import * as Icons from 'lucide-react';
import debounce from 'lodash/debounce';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';
import usePermissions from '@/Hooks/usePermissions';

export default function Index({ services, filters }) {
    const { t, lang } = useTranslation();
    const { hasPermission } = usePermissions();
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.is_active || '');
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchServices = (searchValue, statusValue) => {
        const query = {};
        if (searchValue) query.search = searchValue;
        if (statusValue !== '') query.is_active = statusValue;
        router.get('/admin/services', query, { preserveState: true, replace: true });
    };

    const handleSearch = debounce((value, statusValue) => {
        fetchServices(value, statusValue);
    }, 300);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
        handleSearch(e.target.value, statusFilter);
    };

    const handleDelete = (id, name) => {
        setDeleteTarget({ id, name });
    };

    return (
        <AdminLayout header={t('services')}>
            <Head title={`${t('services')} | Admin`} />

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
                                placeholder={t('search_services')}
                                value={search}
                                onChange={onSearchChange}
                            />
                        </div>
                        <div className="flex bg-[#080808] p-1 rounded-xl border border-white/10 flex-wrap gap-1">
                            {[
                                { key: '', label: t('all_status') },
                                { key: 'true', label: t('active') },
                                { key: 'false', label: t('inactive') }
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => {
                                        setStatusFilter(tab.key);
                                        fetchServices(search, tab.key);
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
                    { (hasPermission('create_services') ) && (
<Link
                            href={route('admin.services.create')}
                            className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:bg-[var(--gold-light)] transition-all duration-200"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('add_service')}
                        </Link>
)}
                </div>

                {/* Desktop View */}
                <div className="overflow-x-auto flex-1 hidden md:block">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-3 font-semibold w-12">{t('icon')}</th>
                                <th className="px-6 py-3 font-semibold">{t('service_name')}</th>
                                <th className="px-6 py-3 font-semibold text-center">{t('order_label')}</th>
                                <th className="px-6 py-3 font-semibold text-center">{t('status')}</th>
                                <th className="px-6 py-3 font-semibold text-right">{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {services.data.map((service) => (
                                <tr key={service.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-10 h-10 rounded bg-[#080808] flex items-center justify-center shrink-0 border border-white/5">
                                            {service.icon && Icons[service.icon] ? (
                                                React.createElement(Icons[service.icon], { className: "w-5 h-5 text-[var(--gold)]" })
                                            ) : (
                                                <Wrench className="w-5 h-5 text-zinc-600" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-white flex items-center">
                                            {lang === 'en' && service.name_en ? service.name_en : service.name}
                                        </div>
                                        <div className="text-xs text-zinc-500 mt-1 line-clamp-1 max-w-xs">
                                            {lang === 'en' && service.description_en ? service.description_en : service.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-zinc-500">
                                        {service.order}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${service.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-900/30 text-red-400 border-red-900/20'}`}>
                                            {service.is_active ? t('active') : t('inactive')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            { (hasPermission('edit_services') ) && (
                                                <Link
                                                    href={route('admin.services.edit', service.id)}
                                                    className="p-2 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-lg transition-colors border border-white/5"
                                                    title={t('edit_service')}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            )}
                                            { (hasPermission('delete_services') ) && (
                                                <button
                                                    onClick={() => handleDelete(service.id, service.name)}
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
                            {services.data.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-zinc-500">
                                        {t('no_services')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden flex-1 divide-y divide-white/[0.04] p-4 space-y-4">
                    {services.data.map((service) => (
                        <div key={service.id} className="p-4 bg-[#080808]/40 border border-white/5 rounded-2xl flex flex-col gap-4 hover:border-[var(--gold)]/20 transition-all duration-300">
                            <div className="flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded bg-[#080808] flex items-center justify-center shrink-0 border border-white/5">
                                    {service.icon && Icons[service.icon] ? (
                                        React.createElement(Icons[service.icon], { className: "w-5 h-5 text-[var(--gold)]" })
                                    ) : (
                                        <Wrench className="w-5 h-5 text-zinc-600" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-white truncate">{lang === 'en' && service.name_en ? service.name_en : service.name}</p>
                                    <p className="text-xs text-zinc-500 mt-1 line-clamp-1 truncate">{lang === 'en' && service.description_en ? service.description_en : service.description}</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-zinc-500 font-medium font-mono">#{service.order}</span>
                                </div>
                                
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${service.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {service.is_active ? t('active') : t('inactive')}
                                </span>
                            </div>
                            
                            {(hasPermission('edit_services') || hasPermission('delete_services')) && (
                                <div className="flex justify-end gap-2 border-t border-white/5 pt-3">
                                    {hasPermission('edit_services') && (
                                        <Link
                                            href={route('admin.services.edit', service.id)}
                                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-xl transition-colors border border-white/5 text-xs font-semibold"
                                            title={t('edit_service')}
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                            {t('edit')}
                                        </Link>
                                    )}
                                    {hasPermission('delete_services') && (
                                        <button
                                            onClick={() => handleDelete(service.id, service.name)}
                                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/60 rounded-xl transition-colors border border-red-900/20 text-xs font-semibold"
                                            title={t('delete')}
                                        >
                                            <Trash className="h-3.5 w-3.5" />
                                            {t('delete')}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {services.data.length === 0 && (
                        <div className="py-12 text-center text-zinc-500 text-sm">
                            {t('no_services')}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {services.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-white/5 bg-[#080808]/30">
                        <div className="flex flex-wrap gap-1">
                            {services.links.map((link, idx) => (
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
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                url={deleteTarget ? `/admin/services/${deleteTarget.id}` : null}
                title={t('delete_service_confirm_title')}
                message={t('delete_service_confirm_dynamic', { name: deleteTarget?.name })}
            />
        </AdminLayout>
    );
}
