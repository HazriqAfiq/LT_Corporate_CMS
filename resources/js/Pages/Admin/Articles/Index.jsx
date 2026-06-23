import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import { Search, Plus, Edit, Trash, Image as ImageIcon } from 'lucide-react';
import { debounce } from 'lodash-es';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';
import { usePage } from '@inertiajs/react';
import usePermissions from '@/Hooks/usePermissions';
export default function Index({ articles, filters }) {
    const { t, lang } = useTranslation();
    const { auth } = usePage().props;
    const { hasPermission, hasManageOwn } = usePermissions();
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [deleteTarget, setDeleteTarget] = useState(null);

    const updateFilters = (searchTerm, statusValue) => {
        const queryParams = {};
        if (searchTerm) queryParams.search = searchTerm;
        if (statusValue && statusValue !== 'all') queryParams.status = statusValue;

        router.get('/admin/articles', queryParams, { preserveState: true, replace: true });
    };

    const handleSearch = debounce((value) => {
        updateFilters(value, status);
    }, 300);

    const onSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        handleSearch(value);
    };

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        updateFilters(search, newStatus);
    };

    const handleDelete = (id, title) => {
        setDeleteTarget({ id, title });
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            router.delete(`/admin/articles/${deleteTarget.id}`, {
                onSuccess: () => setDeleteTarget(null)
            });
        }
    };

    return (
        <AdminLayout header={t('article_list')}>
            <Head title={`${t('article_list')} | Admin`} />

            <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 flex flex-col min-h-[500px]">
                <div className="px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-zinc-500" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 bg-[#080808] border border-white/10 text-white rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-colors"
                                placeholder={t('search_articles')}
                                value={search}
                                onChange={onSearchChange}
                            />
                        </div>

                        {/* Status Filter Tabs */}
                        <div className="flex bg-[#080808] p-1 rounded-xl border border-white/10 flex-wrap gap-1">
                            {[
                                { key: 'all', label: t('all') },
                                { key: 'published', label: t('published') },
                                { key: 'scheduled', label: t('scheduled') },
                                { key: 'draft', label: t('draft') },
                                { key: 'archived', label: t('archived') }
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => handleStatusChange(tab.key)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                        status === tab.key
                                            ? 'bg-zinc-800 text-white shadow-sm border border-white/5'
                                            : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    { (hasPermission('create_articles') || hasManageOwn('articles')) && (
                        <Link
                            href={route('admin.articles.create')}
                            className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:bg-[var(--gold-light)] transition-all duration-200 shrink-0"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('add_article')}
                        </Link>
                    )}
                </div>

                {/* Desktop View */}
                <div className="overflow-x-auto flex-1 hidden md:block">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-3 font-semibold w-12">{t('image')}</th>
                                <th className="px-6 py-3 font-semibold">{t('title')}</th>
                                <th className="px-6 py-3 font-semibold">{t('status')}</th>
                                <th className="px-6 py-3 font-semibold">{t('author')}</th>
                                <th className="px-6 py-3 font-semibold">{t('date')}</th>
                                <th className="px-6 py-3 font-semibold text-right">{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {articles.data.map((article) => (
                                <tr key={article.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5">
                                            {article.featured_media?.url ? (
                                                <img src={article.featured_media.url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-5 h-5 text-zinc-600" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-white line-clamp-2 max-w-md">
                                            {lang === 'en' && article.title_en ? article.title_en : article.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {(() => {
                                            if (article.is_archived) {
                                                return (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-zinc-800/60 text-zinc-400 border-zinc-700/50">
                                                        {t('archived')}
                                                    </span>
                                                );
                                            }
                                            if (article.is_published) {
                                                const isFuture = article.published_at && new Date(article.published_at) > new Date();
                                                if (isFuture) {
                                                    return (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-blue-500/10 text-blue-400 border-blue-500/20">
                                                            {t('scheduled')}
                                                        </span>
                                                    );
                                                }
                                                return (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                                        {t('published')}
                                                    </span>
                                                );
                                            }
                                            return (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/20">
                                                    {t('draft')}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                                        {article.author?.name || 'Admin'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                        {new Date(article.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            { (hasPermission('edit_articles') || (hasManageOwn('articles') && article.author_id === auth.user.id)) && (
                                                <Link
                                                    href={route('admin.articles.edit', article.id)}
                                                    className="p-2 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-lg transition-colors border border-white/5"
                                                    title={t('edit_article')}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            )}
                                            
                                            { (hasPermission('delete_articles') || (hasManageOwn('articles') && article.author_id === auth.user.id)) && (
                                                <button
                                                    onClick={() => handleDelete(article.id, article.title)}
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
                            {articles.data.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-zinc-500">
                                        {t('no_articles')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden flex-1 divide-y divide-white/[0.04] p-4 space-y-4">
                    {articles.data.map((article) => (
                        <div key={article.id} className="p-4 bg-[#080808]/40 border border-white/5 rounded-2xl flex flex-col gap-4 hover:border-[var(--gold)]/20 transition-all duration-300">
                            <div className="flex gap-3.5">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5">
                                    {article.featured_media?.url ? (
                                        <img src={article.featured_media.url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-5 h-5 text-zinc-600" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-white truncate">{lang === 'en' && article.title_en ? article.title_en : article.title}</p>
                                    <p className="text-xs text-zinc-500 mt-1 truncate">{t('author')}: {article.author?.name || 'Admin'}</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3">
                                <span className="text-xs text-zinc-500 font-mono">
                                    {new Date(article.created_at).toLocaleDateString()}
                                </span>
                                
                                {(() => {
                                    if (article.is_archived) {
                                        return (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-zinc-800/60 text-zinc-400 border-zinc-700/50">
                                                {t('archived')}
                                            </span>
                                        );
                                    }
                                    if (article.is_published) {
                                        const isFuture = article.published_at && new Date(article.published_at) > new Date();
                                        if (isFuture) {
                                            return (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-blue-500/10 text-blue-400 border-blue-500/20">
                                                    {t('scheduled')}
                                                </span>
                                            );
                                        }
                                        return (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                                {t('published')}
                                            </span>
                                        );
                                    }
                                    return (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/20">
                                            {t('draft')}
                                        </span>
                                    );
                                })()}
                            </div>
                            
                            {(hasPermission('edit_articles') || (hasManageOwn('articles') && article.author_id === auth.user.id) || hasPermission('delete_articles') || (hasManageOwn('articles') && article.author_id === auth.user.id)) && (
                                <div className="flex justify-end gap-2 border-t border-white/5 pt-3">
                                    {(hasPermission('edit_articles') || (hasManageOwn('articles') && article.author_id === auth.user.id)) && (
                                        <Link
                                            href={route('admin.articles.edit', article.id)}
                                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-xl transition-colors border border-white/5 text-xs font-semibold"
                                            title={t('edit_article')}
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                            {t('edit')}
                                        </Link>
                                    )}
                                    {(hasPermission('delete_articles') || (hasManageOwn('articles') && article.author_id === auth.user.id)) && (
                                        <button
                                            onClick={() => handleDelete(article.id, article.title)}
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
                    {articles.data.length === 0 && (
                        <div className="py-12 text-center text-zinc-500 text-sm">
                            {t('no_articles')}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {articles.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-white/5 bg-[#080808]/30">
                        <div className="flex flex-wrap gap-1">
                            {articles.links.map((link, idx) => (
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
                url={deleteTarget ? `/admin/articles/${deleteTarget.id}` : null}
                title={t('delete_article_confirm_title')}
                message={t('delete_article_confirm_dynamic', { title: deleteTarget?.title })}
            />
        </AdminLayout>
    );
}
