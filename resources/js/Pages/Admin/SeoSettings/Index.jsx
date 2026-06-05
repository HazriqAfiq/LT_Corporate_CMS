import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Plus, Edit, Trash, Globe } from 'lucide-react';
import debounce from 'lodash/debounce';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';
import useTranslation from '@/Hooks/useTranslation';

export default function Index({ settings, filters }) {
    const { t, lang } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleSearch = debounce((value) => {
        router.get('/admin/seo-settings', { search: value }, { preserveState: true, replace: true });
    }, 300);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
    };

    const handleDelete = (id, key) => {
        setDeleteTarget({ id, key });
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            router.delete(`/admin/seo-settings/${deleteTarget.id}`, {
                onSuccess: () => setDeleteTarget(null)
            });
        }
    };

    return (
        <AdminLayout header={t('seo_settings_title')}>
            <Head title={`${t('seo_settings_title')} | Admin`} />

            <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 flex flex-col min-h-[500px]">
                <div className="px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-zinc-500" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 bg-[#080808] border border-white/10 text-white rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-colors"
                            placeholder={t('search_seo_placeholder')}
                            value={search}
                            onChange={onSearchChange}
                        />
                    </div>
                    <Link
                        href={route('admin.seo-settings.create')}
                        className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:bg-[var(--gold-light)] transition-all duration-200"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        {t('add_seo_setting')}
                    </Link>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-3 font-semibold">{t('setting_key')}</th>
                                <th className="px-6 py-3 font-semibold">{t('label')}</th>
                                <th className="px-6 py-3 font-semibold">{t('setting_type')}</th>
                                <th className="px-6 py-3 font-semibold">{t('setting_value')}</th>
                                <th className="px-6 py-3 font-semibold text-right">{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {settings.data.map((setting) => (
                                <tr key={setting.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Globe className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-sm font-medium text-white font-mono">{setting.key}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-zinc-300">
                                            {lang === 'en' ? (setting.label_en || setting.label || '-') : (setting.label || '-')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#080808] text-gray-800 dark:bg-gray-700 text-zinc-300 uppercase tracking-wide">
                                            {setting.type === 'text' ? t('short_text') : setting.type === 'textarea' ? t('long_text') : setting.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-zinc-500 truncate max-w-[300px]" title={setting.value}>
                                            {setting.value || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={route('admin.seo-settings.edit', setting.id)}
                                                className="p-2 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-lg transition-colors border border-white/5 inline-flex items-center justify-center"
                                                title={t('view_edit')}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(setting.id, setting.key)}
                                                className="p-2 bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/60 rounded-lg transition-colors border border-red-900/20 inline-flex items-center justify-center"
                                                title={t('delete')}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {settings.data.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
                                        {t('no_seo_found')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {settings.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-white/5 bg-[#080808]/30">
                        <div className="flex flex-wrap gap-1">
                            {settings.links.map((link, idx) => (
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
                url={deleteTarget ? `/admin/seo-settings/${deleteTarget.id}` : null}
                title={t('delete_seo_confirm_title')}
                message={t('delete_seo_confirm_message', { key: deleteTarget?.key })}
            />
        </AdminLayout>
    );
}
