import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Search, Plus, Trash, Image as ImageIcon, FileText,
    Video, File, Copy, Grid, List, Check, X, Eye,
    UploadCloud, Pencil, Hash, ArrowUpDown, Filter, AlertTriangle
} from 'lucide-react';
import { debounce } from 'lodash-es';
import { useDropzone } from 'react-dropzone';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';
import useTranslation from '@/Hooks/useTranslation';
import usePermissions from '@/Hooks/usePermissions';
import axios from 'axios';

function formatBytes(bytes) {
    if (!+bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileIcon(mimeType, size = 8) {
    const cls = `w-${size} h-${size}`;
    if (!mimeType) return <File className={`${cls} text-zinc-600`} />;
    if (mimeType.startsWith('image/')) return <ImageIcon className={`${cls} text-[var(--gold)]`} />;
    if (mimeType.startsWith('video/')) return <Video className={`${cls} text-purple-400`} />;
    if (mimeType === 'application/pdf') return <FileText className={`${cls} text-red-400`} />;
    return <File className={`${cls} text-zinc-600`} />;
}

const SORT_OPTIONS_KEYS = [
    { value: 'created_at-desc', key: 'sort_newest' },
    { value: 'created_at-asc', key: 'sort_oldest' },
    { value: 'filename-asc', key: 'sort_name_az' },
    { value: 'filename-desc', key: 'sort_name_za' },
    { value: 'size-desc', key: 'sort_largest' },
    { value: 'size-asc', key: 'sort_smallest' },
];

export default function Index({ media, filters, collections, usageTypes, usageData }) {
    const { t } = useTranslation();
    const { hasPermission } = usePermissions();
    const { csrf_token } = usePage().props;

    const SORT_OPTIONS = SORT_OPTIONS_KEYS.map(o => ({ value: o.value, label: t(o.key) }));

    const [search, setSearch]                   = useState(filters.search || '');
    const [usageFilter, setUsageFilter]         = useState(filters.usage || '');
    const [typeFilter, setTypeFilter]           = useState(filters.type || '');
    const [viewMode, setViewMode]               = useState('grid');
    const [selected, setSelected]               = useState([]);
    const [lightbox, setLightbox]               = useState(null);
    const [renamingId, setRenamingId]           = useState(null);
    const [renameValue, setRenameValue]         = useState('');
    const [quickUploading, setQuickUploading]   = useState(false);
    const [copied, setCopied]                   = useState(null);
    const [toast, setToast]                     = useState(null);
    const [deleteTargetId, setDeleteTargetId]   = useState(null);
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
    const [errorBlock, setErrorBlock]           = useState(null);
    const [sortValue, setSortValue]             = useState(
        (filters.sort_by && filters.sort_dir) ? `${filters.sort_by}-${filters.sort_dir}` : 'created_at-desc'
    );

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleDeleteError = (refs) => {
        setErrorBlock(refs);
    };

    const doFetch = (s, u, tVal, sort) => {
        const q = {};
        if (s) q.search = s;
        if (u) q.usage = u;
        if (tVal) q.type = tVal;
        if (sort) {
            const [by, dir] = sort.split('-');
            q.sort_by = by;
            q.sort_dir = dir;
        }
        router.get('/admin/media', q, { preserveState: true, replace: true });
    };

    const debouncedSearch = debounce((v, u, tVal, sort) => doFetch(v, u, tVal, sort), 300);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value, usageFilter, typeFilter, sortValue);
    };
    const onUsageChange = (e) => { setUsageFilter(e.target.value); doFetch(search, e.target.value, typeFilter, sortValue); };
    const onTypeChange = (e) => { setTypeFilter(e.target.value); doFetch(search, usageFilter, e.target.value, sortValue); };
    const onSortChange = (e) => { setSortValue(e.target.value); doFetch(search, usageFilter, typeFilter, e.target.value); };

    const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const selectAll    = () => setSelected(media.data.map(m => m.id));
    const clearSelect  = () => setSelected([]);

    const handleDelete = (id) => setDeleteTargetId(id);

    const confirmSingleDelete = () => {
        if (deleteTargetId) {
            router.delete(`/admin/media/${deleteTargetId}`, {
                onSuccess: () => {
                    setDeleteTargetId(null);
                    showToast(t('file_deleted'));
                },
            });
        }
    };

    const confirmBulkDelete = async () => {
        const res = await fetch(route('admin.media.bulk-delete', undefined, false), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf_token },
            body: JSON.stringify({ ids: selected }),
        });
        const data = await res.json();
        router.reload({ only: ['media'] });
        clearSelect();
        setShowBulkDeleteModal(false);
        showToast(data.message || t('files_deleted_dynamic', { count: selected.length }));
    };

    const handleCopy = (item) => {
        navigator.clipboard.writeText(`/storage/${item.path}`);
        setCopied(item.id);
        showToast(t('url_copied'));
        setTimeout(() => setCopied(null), 2000);
    };

    const startRename = (item) => {
        setRenamingId(item.id);
        setRenameValue(item.title || item.original_filename);
    };
    const commitRename = async (id) => {
        if (!renameValue.trim()) { setRenamingId(null); return; }
        await fetch(route('admin.media.rename', id, false), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf_token,
            },
            body: JSON.stringify({ title: renameValue }),
        });
        router.reload({ only: ['media'] });
        setRenamingId(null);
        showToast(t('name_updated'));
    };

    const onQuickDrop = useCallback((acceptedFiles) => {
        if (!acceptedFiles.length) return;

        // Client-side file size validation (max 10MB)
        const MAX_SIZE = 10 * 1024 * 1024;
        for (let i = 0; i < acceptedFiles.length; i++) {
            if (acceptedFiles[i].size > MAX_SIZE) {
                showToast(t('upload_error_too_large'), 'error');
                return;
            }
        }

        setQuickUploading(true);
        const formData = new FormData();
        acceptedFiles.forEach(f => formData.append('files[]', f));
        formData.append('collection', 'branding');

        axios.post(route('admin.media.store'), formData, {
            headers: {
                'X-CSRF-TOKEN': csrf_token || '',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                // Do NOT set Content-Type — browser sets multipart/form-data boundary automatically
            },
        }).then(() => {
            router.reload({ only: ['media'] });
            showToast(t('files_uploaded_dynamic', { count: acceptedFiles.length }));
        }).catch((err) => {
            const errorMsg = err.response?.data?.message || t('upload_error_generic');
            showToast(errorMsg, 'error');
        }).finally(() => setQuickUploading(false));
    }, [t]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onQuickDrop,
        accept: { 'image/*': [], 'application/pdf': [], 'video/*': [] },
        maxSize: 10 * 1024 * 1024,
        multiple: true,
    });

    // ── Build usage filter groups ──
    const usageGroups = [
        { label: t('usage_group_general'), options: [
            { value: '', label: t('filter_all_images') },
            { value: 'unused', label: t('filter_unused_images') },
        ]},
        { label: t('usage_group_branding'), options: [
            { value: 'branding', label: t('filter_branding') },
        ]},
        { label: t('usage_group_articles'), options: [
            { value: 'article_gallery', label: t('filter_article_gallery') },
            { value: 'article_content', label: t('filter_article_content') },
        ]},
        { label: t('usage_group_products'), options: [
            { value: 'product_icon', label: t('filter_product_icon') },
            { value: 'product_gallery', label: t('filter_product_gallery') },
            { value: 'product_content', label: t('filter_product_content') },
        ]},
        { label: t('usage_group_projects'), options: [
            { value: 'project_gallery', label: t('filter_project_gallery') },
            { value: 'project_content', label: t('filter_project_content') },
        ]},
        { label: t('usage_group_services'), options: [
            { value: 'service_image', label: t('filter_service_image') },
        ]},
        { label: t('usage_group_other'), options: [
            { value: 'slider', label: t('filter_slider') },
            { value: 'team', label: t('filter_team') },
            { value: 'seo', label: t('filter_seo') },
        ]},
    ];

    return (
        <AdminLayout header={t('media_library')}>
            <Head title={`Media | Admin`} />

            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2 transition-all ${
                    toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}>
                    <Check className="w-4 h-4" />
                    {toast.msg}
                </div>
            )}

            {errorBlock && createPortal(
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setErrorBlock(null)}>
                    <div className="cannot-delete-modal relative w-full max-w-md bg-[#0c0c0e] border border-white/5 rounded-3xl p-6 shadow-2xl transform transition-all z-10" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-glow absolute top-[-20%] left-[-20%] w-[200px] h-[200px] rounded-full bg-amber-500/10 blur-[80px] pointer-events-none z-0" />
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="relative mb-5 mt-2">
                                <div className="icon-badge-glow absolute -inset-2 bg-amber-500/20 rounded-full blur-md opacity-75" />
                                <div className="icon-badge-bg relative w-14 h-14 rounded-full bg-[#141416] border border-amber-500/20 flex items-center justify-center">
                                    <AlertTriangle className="icon-badge-icon w-6 h-6 text-amber-500" />
                                </div>
                            </div>
                            <h3 className="modal-title text-lg font-bold text-white mb-2 leading-tight">
                                {t('cannot_delete_title')}
                            </h3>
                            <p className="modal-desc text-zinc-300 text-sm leading-relaxed px-2 mb-6 whitespace-pre-wrap">
                                {t('cannot_delete_image_message', { refs: errorBlock })}
                            </p>
                            <div className="flex w-full mt-2">
                                <button
                                    type="button"
                                    onClick={() => setErrorBlock(null)}
                                    className="btn-action flex-1 inline-flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                                >
                                    {t('ok_understood')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {lightbox && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
                    <button className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20" onClick={() => setLightbox(null)}>
                        <X className="w-6 h-6" />
                    </button>
                    <img src={`/storage/${lightbox.path}`} alt={lightbox.original_filename} className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 px-6 py-2 rounded-full text-white text-sm">
                        {lightbox.original_filename}
                        {lightbox.width && <span className="ml-3 text-zinc-400">{lightbox.width}×{lightbox.height}px</span>}
                    </div>
                </div>
            )}
            <div className="space-y-5">
                {hasPermission('manage_media') && (
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-2xl px-6 py-5 flex items-center gap-4 cursor-pointer transition-all ${
                            isDragActive ? 'border-[var(--gold)] bg-[var(--gold)]/5' : 'border-white/10 hover:border-[var(--gold)]/30 hover:bg-white/[0.015]'
                        }`}
                    >
                        <input {...getInputProps()} />
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isDragActive ? 'bg-[var(--gold)]/20' : 'bg-white/5'}`}>
                            {quickUploading ? <div className="w-5 h-5 border-2 border-[var(--gold)]/30 border-t-[var(--gold)] rounded-full animate-spin" /> : <UploadCloud className={`w-6 h-6 ${isDragActive ? 'text-[var(--gold)]' : 'text-zinc-500'}`} />}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-zinc-300">{isDragActive ? t('drop_files_to_upload') : t('quick_upload_drag_drop')}</p>
                            <p className="text-xs text-zinc-600">{t('or_use_upload_button_desc')}</p>
                        </div>
                    </div>
                )}

                <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 flex flex-col min-h-[500px]">
                    <div className="px-6 py-4 border-b border-white/5 flex flex-col gap-3">
                        <div className="flex flex-col gap-3">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-3 py-2 bg-[#080808] border border-white/10 text-white rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-colors"
                                    placeholder={t('search_media_placeholder')}
                                    value={search}
                                    onChange={onSearchChange}
                                />
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
                                <select value={usageFilter} onChange={onUsageChange} className="py-2 pl-3 pr-8 border border-white/10 bg-[#080808] text-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[var(--gold)]">
                                    {usageGroups.map(group => (
                                        <optgroup key={group.label} label={group.label}>
                                            {group.options.map(o => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                                <select value={typeFilter} onChange={onTypeChange} className="py-2 pl-3 pr-8 border border-white/10 bg-[#080808] text-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[var(--gold)]">
                                    <option value="">{t('type_all')}</option>
                                    <option value="image">{t('type_image')}</option>
                                    <option value="video">{t('type_video')}</option>
                                    <option value="document">{t('type_document')}</option>
                                </select>
                                <select value={sortValue} onChange={onSortChange} className="py-2 pl-3 pr-8 border border-white/10 bg-[#080808] text-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[var(--gold)]">
                                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                                <div className="flex gap-1 bg-[#080808] border border-white/10 rounded-xl p-1 justify-center">
                                    <button onClick={() => setViewMode('grid')} className={`p-1 py-1.5 px-3 flex-1 flex justify-center rounded-lg transition ${viewMode === 'grid' ? 'bg-[var(--gold)] text-[#080808]' : 'text-zinc-500 hover:text-white'}`}><Grid className="w-4 h-4" /></button>
                                    <button onClick={() => setViewMode('list')} className={`p-1 py-1.5 px-3 flex-1 flex justify-center rounded-lg transition ${viewMode === 'list' ? 'bg-[var(--gold)] text-[#080808]' : 'text-zinc-500 hover:text-white'}`}><List className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                            <div className="flex items-center gap-3">
                                {selected.length > 0 ? (
                                    <>
                                        <span className="text-sm text-zinc-400">{t('selected_count', { count: selected.length })}</span>
                                        {hasPermission('manage_media') && (
                                            <button onClick={() => setShowBulkDeleteModal(true)} className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center gap-1.5 hover:bg-red-600/30 transition">
                                                <Trash className="w-3.5 h-3.5" /> {t('delete_selected')}
                                            </button>
                                        )}
                                        <button onClick={clearSelect} className="text-xs text-zinc-500 hover:text-zinc-300">{t('cancel_selection')}</button>
                                    </>
                                ) : (
                                    <button onClick={selectAll} className="text-xs text-zinc-500 hover:text-[var(--gold)] transition">{t('select_all')}</button>
                                )}
                            </div>
                            {hasPermission('manage_media') && (
                                <Link href={route('admin.media.create')} className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:opacity-90 transition w-full sm:w-auto">
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t('upload_media')}
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="p-6 flex-1">
                        {media.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                                <ImageIcon className="h-14 w-14 mb-3 text-zinc-700" />
                                <p className="font-medium">{t('no_media_found')}</p>
                                <p className="text-sm mt-1">{t('change_filters_or_upload_desc')}</p>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {media.data.map((item) => {
                                    const isSelected = selected.includes(item.id);
                                    const isRenaming = renamingId === item.id;
                                    const displayName = item.title || item.original_filename;
                                    const ud = usageData?.[item.id];
                                    const usageCount = ud?.count || 0;

                                    return (
                                        <div key={item.id} className={`media-card group relative bg-[#0a0a0c] rounded-xl border overflow-hidden transition-all ${isSelected ? 'border-[var(--gold)] ring-2 ring-[var(--gold)]/20' : 'border-white/5 hover:border-white/15'}`}>
                                            <div className="aspect-square bg-[#080808] flex items-center justify-center relative overflow-hidden cursor-pointer" onClick={() => item.is_image && setLightbox(item)}>
                                                {item.is_image ? (
                                                    <img src={`/storage/${item.path}`} alt={displayName} className="w-full h-full object-cover" loading="lazy" />
                                                ) : (
                                                    getFileIcon(item.mime_type, 10)
                                                )}
                                                <div className="absolute inset-0 bg-black/65 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {item.is_image && <button type="button" onClick={(e) => { e.stopPropagation(); setLightbox(item); }} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white" title={t('preview')}><Eye className="w-4 h-4" /></button>}
                                                    <button type="button" onClick={(e) => { e.stopPropagation(); handleCopy(item); }} className={`p-2 rounded-full text-white ${copied === item.id ? 'bg-emerald-500' : 'bg-white/10 hover:bg-white/20'}`} title={t('copy_url')}>{copied === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
                                                    {hasPermission('manage_media') && (
                                                        <>
                                                            <Link href={route('admin.media.edit', item.id)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white" title={t('edit')} onClick={(e) => e.stopPropagation()}><Pencil className="w-4 h-4" /></Link>
                                                            <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="p-2 bg-red-600/70 rounded-full hover:bg-red-600 text-white" title={t('delete')}><Trash className="w-4 h-4" /></button>
                                                        </>
                                                    )}
                                                </div>
                                                <div className={`absolute top-2 left-2 w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-all ${isSelected ? 'bg-[var(--gold)] border-[var(--gold)]' : 'bg-black/50 border-white/30 opacity-0 group-hover:opacity-100'}`} onClick={(e) => { e.stopPropagation(); toggleSelect(item.id); }}>
                                                    {isSelected && <Check className="w-3 h-3 text-[#080808]" />}
                                                </div>
                                            </div>
                                            <div className="px-3 py-2">
                                                {isRenaming && hasPermission('manage_media') ? (
                                                    <input autoFocus className="w-full text-xs text-white bg-transparent border-b border-[var(--gold)] outline-none pb-0.5" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onBlur={() => commitRename(item.id)} onKeyDown={(e) => { if (e.key === 'Enter') commitRename(item.id); if (e.key === 'Escape') setRenamingId(null); }} />
                                                ) : (
                                                    <p className="text-[11px] text-white truncate cursor-pointer hover:text-[var(--gold)] transition" title={displayName} onDoubleClick={() => hasPermission('manage_media') && startRename(item)}>{displayName}</p>
                                                )}
                                                <div className="flex justify-between items-center mt-0.5">
                                                    <span className="text-[9px] text-zinc-600 font-mono">{formatBytes(item.size)}</span>
                                                    <span className="text-[9px] text-zinc-500">{item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
                                                </div>
                                                {usageCount > 0 && (
                                                    <div className="flex items-center gap-1 text-[9px] text-[var(--gold)] font-semibold mt-1">
                                                        <Hash className="w-2.5 h-2.5" />
                                                        <span>{t('uses_count', { count: usageCount })}</span>
                                                    </div>
                                                )}
                                                {ud?.summary && (
                                                    <p className="text-[8px] text-zinc-500 mt-0.5 truncate leading-tight" title={ud.summary}>{ud.summary}</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 text-zinc-500 text-xs uppercase tracking-wider">
                                            <th className="py-3 px-3 w-8"><input type="checkbox" className="accent-[var(--gold)]" onChange={(e) => e.target.checked ? selectAll() : clearSelect()} /></th>
                                            <th className="py-3 px-3 w-14">{t('table_header_file')}</th>
                                            <th className="py-3 px-3">{t('table_header_name')}</th>
                                            <th className="py-3 px-3">{t('table_header_usage')}</th>
                                            <th className="py-3 px-3">{t('table_header_dimension')}</th>
                                            <th className="py-3 px-3">{t('table_header_size')}</th>
                                            <th className="py-3 px-3">{t('table_header_date')}</th>
                                            <th className="py-3 px-3 text-right">{t('action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.04]">
                                        {media.data.map((item) => {
                                            const isSelected = selected.includes(item.id);
                                            const displayName = item.title || item.original_filename;
                                            const ud = usageData?.[item.id];
                                            return (
                                                <tr key={item.id} className={`group hover:bg-white/[0.02] ${isSelected ? 'bg-[var(--gold)]/5' : ''}`}>
                                                    <td className="py-3 px-3"><input type="checkbox" checked={isSelected} onChange={() => toggleSelect(item.id)} className="accent-[var(--gold)]" /></td>
                                                    <td className="py-3 px-3">
                                                        <div className="w-12 h-9 rounded overflow-hidden bg-[#080808] flex items-center justify-center border border-white/5">
                                                            {item.is_image ? <img src={`/storage/${item.path}`} alt="" className="w-full h-full object-cover" loading="lazy" /> : getFileIcon(item.mime_type, 5)}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-3 max-w-xs">
                                                        <p className="text-white text-sm truncate font-medium">{displayName}</p>
                                                        <p className="text-zinc-600 text-xs truncate">{item.original_filename}</p>
                                                    </td>
                                                    <td className="py-3 px-3">
                                                        {ud ? (
                                                            <div>
                                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${ud.count > 0 ? 'bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20' : 'bg-white/5 text-zinc-500 border border-white/10'}`}>
                                                                    <Hash className="w-3 h-3" />{ud.count}
                                                                </span>
                                                                {ud.summary && <p className="text-[9px] text-zinc-500 mt-0.5 truncate max-w-[180px]" title={ud.summary}>{ud.summary}</p>}
                                                            </div>
                                                        ) : <span className="text-zinc-600 text-xs">—</span>}
                                                    </td>
                                                    <td className="py-3 px-3 text-zinc-500 text-xs font-mono">{item.width ? `${item.width}×${item.height}` : '—'}</td>
                                                    <td className="py-3 px-3 text-zinc-500 text-xs font-mono">{formatBytes(item.size)}</td>
                                                    <td className="py-3 px-3 text-zinc-500 text-xs">{item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</td>
                                                    <td className="py-3 px-3">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => handleCopy(item)} className={`p-2 bg-zinc-800 ${copied === item.id ? 'text-emerald-400 border-emerald-500/20' : 'text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60'} rounded-lg transition-colors border border-white/5 inline-flex items-center justify-center`} title={t('copy_url')}>
                                                                {copied === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                            </button>
                                                            {hasPermission('manage_media') && (
                                                                <>
                                                                    <Link href={route('admin.media.edit', item.id)} className="p-2 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-lg transition-colors border border-white/5 inline-flex items-center justify-center" title={t('edit')}>
                                                                        <Pencil className="w-4 h-4" />
                                                                    </Link>
                                                                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/60 rounded-lg transition-colors border border-red-900/20 inline-flex items-center justify-center" title={t('delete')}>
                                                                        <Trash className="w-4 h-4" />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {media.links?.length > 3 && (
                        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-xs text-zinc-500">
                                {t('showing_files_pagination', { from: media.from, to: media.to, total: media.total })}
                            </span>
                            <div className="flex flex-wrap gap-1">
                                {media.links.map((link, idx) => (
                                    <Link key={idx} href={link.url || '#'} className={`px-3 py-1 rounded-lg text-sm ${
                                        link.active ? 'bg-[var(--gold)] text-[#080808] font-bold' : !link.url ? 'text-zinc-700 cursor-not-allowed' : 'bg-[#080808] text-zinc-300 border border-white/10 hover:border-[var(--gold)]/30'
                                    }`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <DeleteConfirmModal
                show={!!deleteTargetId}
                onClose={() => setDeleteTargetId(null)}
                onError={handleDeleteError}
                url={deleteTargetId ? `/admin/media/${deleteTargetId}` : null}
                title={t('delete_file_confirm_title')}
                message={t('delete_file_confirm_message')}
            />

            <DeleteConfirmModal
                show={showBulkDeleteModal}
                onClose={() => { setShowBulkDeleteModal(false); clearSelect(); }}
                onError={handleDeleteError}
                url={route('admin.media.bulk-delete')}
                method="post"
                data={{ ids: selected }}
                title={t('delete_multiple_files_confirm_title', { count: selected.length })}
                message={t('delete_multiple_files_confirm_message', { count: selected.length })}
            />
        </AdminLayout>
    );
}
