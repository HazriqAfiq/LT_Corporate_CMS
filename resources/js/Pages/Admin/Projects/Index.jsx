import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import { Search, Plus, Edit, Trash, Image as ImageIcon } from 'lucide-react';
import debounce from 'lodash/debounce';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';
import usePermissions from '@/Hooks/usePermissions';

export default function Index({ projects, filters }) {
    const { t, lang } = useTranslation();
    const { hasPermission } = usePermissions();
    const [search, setSearch] = useState(filters.search || '');
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleSearch = debounce((value) => {
        router.get('/admin/projects', { search: value }, { preserveState: true, replace: true });
    }, 300);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
    };

    const handleDelete = (id, title) => {
        setDeleteTarget({ id, title });
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            router.delete(`/admin/projects/${deleteTarget.id}`, {
                onSuccess: () => setDeleteTarget(null)
            });
        }
    };

    return (
        <AdminLayout header={t('projects')}>
            <Head title={`${t('projects')} | Admin`} />

            <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 flex flex-col min-h-[500px]">
                <div className="px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-zinc-500" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 bg-[#080808] border border-white/10 text-white rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-colors"
                            placeholder={t('search_projects_clients')}
                            value={search}
                            onChange={onSearchChange}
                        />
                    </div>
                    { (hasPermission('create_projects') ) && (
<Link
                            href={route('admin.projects.create')}
                            className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:bg-[var(--gold-light)] transition-all duration-200"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('add_project')}
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
                                <th className="px-6 py-3 font-semibold">{t('client')}</th>
                                <th className="px-6 py-3 font-semibold">{t('category')}</th>
                                <th className="px-6 py-3 font-semibold">{t('status')}</th>
                                <th className="px-6 py-3 font-semibold text-right">{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {projects.data.map((project) => (
                                <tr key={project.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5">
                                            {project.featured_media?.url ? (
                                                <img src={project.featured_media.url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-5 h-5 text-zinc-600" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-white line-clamp-2 max-w-md">
                                            {lang === 'en' && project.title_en ? project.title_en : project.title}
                                            {project.is_featured && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">{t('featured')}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                                        {project.client || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#080808] text-zinc-300 uppercase tracking-wide">
                                            {project.category || t('na')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${project.is_published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20'}`}>
                                            {project.is_published ? t('published') : t('draft')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            { (hasPermission('edit_projects') ) && (
                                                <Link
                                                    href={route('admin.projects.edit', project.id)}
                                                    className="p-2 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-lg transition-colors border border-white/5"
                                                    title={t('edit')}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            )}
                                            { (hasPermission('delete_projects') ) && (
                                                <button
                                                    onClick={() => handleDelete(project.id, project.title)}
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
                            {projects.data.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-zinc-500">
                                        {t('no_projects')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden flex-1 divide-y divide-white/[0.04] p-4 space-y-4">
                    {projects.data.map((project) => (
                        <div key={project.id} className="p-4 bg-[#080808]/40 border border-white/5 rounded-2xl flex flex-col gap-4 hover:border-[var(--gold)]/20 transition-all duration-300">
                            <div className="flex gap-3.5">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5">
                                    {project.featured_media?.url ? (
                                        <img src={project.featured_media.url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-5 h-5 text-zinc-600" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-white truncate">{lang === 'en' && project.title_en ? project.title_en : project.title}</p>
                                        {project.is_featured && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-100/10 text-amber-400 border border-amber-400/25 uppercase shrink-0">{t('featured')}</span>}
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-1 truncate">{project.client ? `${t('client')}: ${project.client}` : ''}</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#080808] text-zinc-300 uppercase tracking-wide">
                                    {project.category || t('na')}
                                </span>
                                
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${project.is_published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20'}`}>
                                    {project.is_published ? t('published') : t('draft')}
                                </span>
                            </div>
                            
                            {(hasPermission('edit_projects') || hasPermission('delete_projects')) && (
                                <div className="flex justify-end gap-2 border-t border-white/5 pt-3">
                                    {hasPermission('edit_projects') && (
                                        <Link
                                            href={route('admin.projects.edit', project.id)}
                                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-xl transition-colors border border-white/5 text-xs font-semibold"
                                            title={t('edit')}
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                            {t('edit')}
                                        </Link>
                                    )}
                                    {hasPermission('delete_projects') && (
                                        <button
                                            onClick={() => handleDelete(project.id, project.title)}
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
                    {projects.data.length === 0 && (
                        <div className="py-12 text-center text-zinc-500 text-sm">
                            {t('no_projects')}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {projects.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-white/5 bg-[#080808]/30">
                        <div className="flex flex-wrap gap-1">
                            {projects.links.map((link, idx) => (
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
                url={deleteTarget ? `/admin/projects/${deleteTarget.id}` : null}
                title={t('delete_project_confirm_title')}
                message={t('delete_project_confirm_dynamic').replace(':title', deleteTarget?.title || '')}
            />
        </AdminLayout>
    );
}
