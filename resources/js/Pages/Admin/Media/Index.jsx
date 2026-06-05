import React, { useState, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Search, Plus, Trash, Image as ImageIcon, FileText,
    Video, File, Copy, Grid, List, Check, X, Eye,
    UploadCloud, Pencil
} from 'lucide-react';
import debounce from 'lodash/debounce';
import { useDropzone } from 'react-dropzone';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';
import useTranslation from '@/Hooks/useTranslation';

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

export default function Index({ media, filters, collections }) {
    const { t } = useTranslation();

    const [search, setSearch]                   = useState(filters.search || '');
    const [collectionFilter, setCollectionFilter] = useState(filters.collection || '');
    const [typeFilter, setTypeFilter]           = useState(filters.type || '');
    const [viewMode, setViewMode]               = useState('grid'); // 'grid' | 'list'
    const [selected, setSelected]               = useState([]);
    const [lightbox, setLightbox]               = useState(null);
    const [renamingId, setRenamingId]           = useState(null);
    const [renameValue, setRenameValue]         = useState('');
    const [quickUploading, setQuickUploading]   = useState(false);
    const [copied, setCopied]                   = useState(null);
    const [toast, setToast]                     = useState(null);
    const [deleteTargetId, setDeleteTargetId]   = useState(null);
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

    const TYPE_LABELS = {
        '': t('all_types'),
        image: t('type_image'),
        video: t('type_video'),
        document: t('type_document')
    };

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // ── Search / filter ──────────────────────────────────────────────────────
    const doFetch = (s, c, tVal) => {
        const q = {};
        if (s) q.search = s;
        if (c) q.collection = c;
        if (tVal) q.type = tVal;
        router.get('/admin/media', q, { preserveState: true, replace: true });
    };

    const debouncedSearch = debounce((v, c, tVal) => doFetch(v, c, tVal), 300);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value, collectionFilter, typeFilter);
    };
    const onCollectionChange = (e) => { setCollectionFilter(e.target.value); doFetch(search, e.target.value, typeFilter); };
    const onTypeChange = (e) => { setTypeFilter(e.target.value); doFetch(search, collectionFilter, e.target.value); };

    // ── Selection ────────────────────────────────────────────────────────────
    const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const selectAll    = () => setSelected(media.data.map(m => m.id));
    const clearSelect  = () => setSelected([]);

    // ── Delete ───────────────────────────────────────────────────────────────
    const handleDelete = (id) => {
        setDeleteTargetId(id);
    };

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

    const handleBulkDelete = async () => {
        setShowBulkDeleteModal(true);
    };

    const confirmBulkDelete = async () => {
        const res = await fetch(route('admin.media.bulk-delete'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
            body: JSON.stringify({ ids: selected }),
        });
        if (res.ok) {
            router.reload({ only: ['media'] });
            clearSelect();
            setShowBulkDeleteModal(false);
            showToast(t('files_deleted_dynamic', { count: selected.length }));
        }
    };

    // ── Copy URL ─────────────────────────────────────────────────────────────
    const handleCopy = (item) => {
        navigator.clipboard.writeText(`/storage/${item.path}`);
        setCopied(item.id);
        showToast(t('url_copied'));
        setTimeout(() => setCopied(null), 2000);
    };

    // ── Inline Rename ────────────────────────────────────────────────────────
    const startRename = (item) => {
        setRenamingId(item.id);
        setRenameValue(item.title || item.original_filename);
    };
    const commitRename = async (id) => {
        if (!renameValue.trim()) { setRenamingId(null); return; }
        await fetch(route('admin.media.rename', id), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
            },
            body: JSON.stringify({ title: renameValue }),
        });
        router.reload({ only: ['media'] });
        setRenamingId(null);
        showToast(t('name_updated'));
    };

    // ── Quick upload drop zone ────────────────────────────────────────────────
    const onQuickDrop = useCallback((acceptedFiles) => {
        if (!acceptedFiles.length) return;
        setQuickUploading(true);
        const formData = new FormData();
        acceptedFiles.forEach(f => formData.append('files[]', f));
        formData.append('collection', collectionFilter || 'branding');
        formData.append('_token', document.querySelector('meta[name="csrf-token"]')?.content);

        fetch(route('admin.media.store'), {
            method: 'POST',
            body: formData,
        }).then(() => {
            router.reload({ only: ['media'] });
            showToast(t('files_uploaded_dynamic', { count: acceptedFiles.length }));
        }).finally(() => setQuickUploading(false));
    }, [collectionFilter, t]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onQuickDrop,
        accept: { 'image/*': [], 'application/pdf': [], 'video/*': [] },
        maxSize: 10 * 1024 * 1024,
        multiple: true,
    });

    return (
        <AdminLayout header={t('media_library')}>
            <Head title={`Media | Admin`} />

            {/* Toast notification */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2 transition-all ${
                    toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}>
                    <Check className="w-4 h-4" />
                    {toast.msg}
                </div>
            )}

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                        onClick={() => setLightbox(null)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <img
                        src={`/storage/${lightbox.path}`}
                        alt={lightbox.original_filename}
                        className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 px-6 py-2 rounded-full text-white text-sm">
                        {lightbox.original_filename}
                        {lightbox.width && <span className="ml-3 text-zinc-400">{lightbox.width}×{lightbox.height}px</span>}
                    </div>
                </div>
            )}

            <div className="space-y-5">
                {/* Quick drop banner */}
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-2xl px-6 py-5 flex items-center gap-4 cursor-pointer transition-all ${
                        isDragActive
                            ? 'border-[var(--gold)] bg-[var(--gold)]/5'
                            : 'border-white/10 hover:border-[var(--gold)]/30 hover:bg-white/[0.015]'
                    }`}
                >
                    <input {...getInputProps()} />
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isDragActive ? 'bg-[var(--gold)]/20' : 'bg-white/5'}`}>
                        {quickUploading
                            ? <div className="w-5 h-5 border-2 border-[var(--gold)]/30 border-t-[var(--gold)] rounded-full animate-spin" />
                            : <UploadCloud className={`w-6 h-6 ${isDragActive ? 'text-[var(--gold)]' : 'text-zinc-500'}`} />
                        }
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-300">
                            {isDragActive ? t('drop_files_to_upload') : t('quick_upload_drag_drop')}
                        </p>
                        <p className="text-xs text-zinc-600">{t('or_use_upload_button_desc')}</p>
                    </div>
                </div>

                {/* Main card */}
                <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 flex flex-col min-h-[500px]">
                    {/* Toolbar */}
                    <div className="px-6 py-4 border-b border-white/5 flex flex-col gap-4">
                        {/* Row 1: search + filters */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-3 py-2 bg-[#080808] border border-white/10 text-white rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-colors"
                                    placeholder={t('search_filename')}
                                    value={search}
                                    onChange={onSearchChange}
                                />
                            </div>
                            <select value={collectionFilter} onChange={onCollectionChange} className="py-2 pl-3 pr-8 border border-white/10 bg-[#080808] text-white rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)]">
                                <option value="">{t('all_collections')}</option>
                                {(collections || []).map(c => (
                                    <option key={c} value={c}>
                                        {t(`media_collection_${c}`)}
                                    </option>
                                ))}
                            </select>
                            <select value={typeFilter} onChange={onTypeChange} className="py-2 pl-3 pr-8 border border-white/10 bg-[#080808] text-white rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)]">
                                {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                            {/* View toggle */}
                            <div className="flex gap-1 bg-[#080808] border border-white/10 rounded-xl p-1">
                                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-[var(--gold)] text-[#080808]' : 'text-zinc-500 hover:text-white'}`}><Grid className="w-4 h-4" /></button>
                                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-[var(--gold)] text-[#080808]' : 'text-zinc-500 hover:text-white'}`}><List className="w-4 h-4" /></button>
                            </div>
                        </div>

                        {/* Row 2: bulk actions + upload button */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {selected.length > 0 ? (
                                    <>
                                        <span className="text-sm text-zinc-400">{t('selected_count', { count: selected.length })}</span>
                                        <button onClick={handleBulkDelete} className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center gap-1.5 hover:bg-red-600/30 transition">
                                            <Trash className="w-3.5 h-3.5" /> {t('delete_selected')}
                                        </button>
                                        <button onClick={clearSelect} className="text-xs text-zinc-500 hover:text-zinc-300">{t('cancel_selection')}</button>
                                    </>
                                ) : (
                                    <button onClick={selectAll} className="text-xs text-zinc-500 hover:text-[var(--gold)] transition">{t('select_all')}</button>
                                )}
                            </div>
                            <Link
                                href={route('admin.media.create')}
                                className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:opacity-90 transition"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {t('upload_media')}
                            </Link>
                        </div>
                    </div>

                    {/* Media content */}
                    <div className="p-6 flex-1">
                        {media.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                                <ImageIcon className="h-14 w-14 mb-3 text-zinc-700" />
                                <p className="font-medium">{t('no_media_found')}</p>
                                <p className="text-sm mt-1">{t('change_filters_or_upload_desc')}</p>
                            </div>
                        ) : viewMode === 'grid' ? (
                            /* ── GRID VIEW ── */
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {media.data.map((item) => {
                                    const isSelected = selected.includes(item.id);
                                    const isRenaming = renamingId === item.id;
                                    const displayName = item.title || item.original_filename;

                                    return (
                                        <div
                                            key={item.id}
                                            className={`group relative bg-[#0a0a0c] rounded-xl border overflow-hidden transition-all ${
                                                isSelected
                                                    ? 'border-[var(--gold)] ring-2 ring-[var(--gold)]/20'
                                                    : 'border-white/5 hover:border-white/15'
                                            }`}
                                        >
                                            {/* Thumbnail */}
                                            <div
                                                className="aspect-square bg-[#080808] flex items-center justify-center relative overflow-hidden cursor-pointer"
                                                onClick={() => item.is_image && setLightbox(item)}
                                            >
                                                {item.is_image ? (
                                                    <img src={`/storage/${item.path}`} alt={displayName} className="w-full h-full object-cover" loading="lazy" />
                                                ) : (
                                                    getFileIcon(item.mime_type, 10)
                                                )}

                                                {/* Hover overlay */}
                                                <div className="absolute inset-0 bg-black/65 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {item.is_image && (
                                                        <button type="button" onClick={(e) => { e.stopPropagation(); setLightbox(item); }} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white" title={t('preview')}>
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button type="button" onClick={(e) => { e.stopPropagation(); handleCopy(item); }} className={`p-2 rounded-full text-white ${copied === item.id ? 'bg-emerald-500' : 'bg-white/10 hover:bg-white/20'}`} title={t('copy_url')}>
                                                        {copied === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                    </button>
                                                    <Link href={route('admin.media.edit', item.id)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white" title={t('edit')} onClick={(e) => e.stopPropagation()}>
                                                        <Pencil className="w-4 h-4" />
                                                    </Link>
                                                    <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="p-2 bg-red-600/70 rounded-full hover:bg-red-600 text-white" title={t('delete')}>
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Select checkbox */}
                                                <div
                                                    className={`absolute top-2 left-2 w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-all ${
                                                        isSelected
                                                            ? 'bg-[var(--gold)] border-[var(--gold)]'
                                                            : 'bg-black/50 border-white/30 opacity-0 group-hover:opacity-100'
                                                    }`}
                                                    onClick={(e) => { e.stopPropagation(); toggleSelect(item.id); }}
                                                >
                                                    {isSelected && <Check className="w-3 h-3 text-[#080808]" />}
                                                </div>
                                            </div>

                                            {/* Info panel */}
                                            <div className="px-3 py-2">
                                                {isRenaming ? (
                                                    <input
                                                        autoFocus
                                                        className="w-full text-xs text-white bg-transparent border-b border-[var(--gold)] outline-none pb-0.5"
                                                        value={renameValue}
                                                        onChange={(e) => setRenameValue(e.target.value)}
                                                        onBlur={() => commitRename(item.id)}
                                                        onKeyDown={(e) => { if (e.key === 'Enter') commitRename(item.id); if (e.key === 'Escape') setRenamingId(null); }}
                                                    />
                                                ) : (
                                                    <p
                                                        className="text-[11px] text-white truncate cursor-pointer hover:text-[var(--gold)] transition"
                                                        title={displayName}
                                                        onDoubleClick={() => startRename(item)}
                                                    >
                                                        {displayName}
                                                    </p>
                                                )}
                                                <div className="flex justify-between items-center mt-0.5">
                                                    <span className="text-[9px] text-zinc-600 uppercase">{t(`media_collection_${item.collection}`)}</span>
                                                    <span className="text-[9px] text-zinc-600 font-mono">{formatBytes(item.size)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* ── LIST VIEW ── */
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 text-zinc-500 text-xs uppercase tracking-wider">
                                            <th className="py-3 px-3 w-8"><input type="checkbox" className="accent-[var(--gold)]" onChange={(e) => e.target.checked ? selectAll() : clearSelect()} /></th>
                                            <th className="py-3 px-3 w-14">{t('files_unit')}</th>
                                            <th className="py-3 px-3">{t('name')}</th>
                                            <th className="py-3 px-3">{t('collection')}</th>
                                            <th className="py-3 px-3">{t('dimension')}</th>
                                            <th className="py-3 px-3">{t('size')}</th>
                                            <th className="py-3 px-3 text-right">{t('action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.04]">
                                        {media.data.map((item) => {
                                            const isSelected = selected.includes(item.id);
                                            const displayName = item.title || item.original_filename;
                                            return (
                                                <tr key={item.id} className={`group hover:bg-white/[0.02] ${isSelected ? 'bg-[var(--gold)]/5' : ''}`}>
                                                    <td className="py-3 px-3"><input type="checkbox" checked={isSelected} onChange={() => toggleSelect(item.id)} className="accent-[var(--gold)]" /></td>
                                                    <td className="py-3 px-3">
                                                        <div className="w-12 h-9 rounded overflow-hidden bg-[#080808] flex items-center justify-center border border-white/5">
                                                            {item.is_image
                                                                ? <img src={`/storage/${item.path}`} alt="" className="w-full h-full object-cover" loading="lazy" />
                                                                : getFileIcon(item.mime_type, 5)
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-3 max-w-xs">
                                                        <p className="text-white text-sm truncate font-medium">{displayName}</p>
                                                        <p className="text-zinc-600 text-xs truncate">{item.original_filename}</p>
                                                    </td>
                                                    <td className="py-3 px-3">
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-zinc-400 border border-white/10">
                                                            {t(`media_collection_${item.collection}`)}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-3 text-zinc-500 text-xs font-mono">
                                                        {item.width ? `${item.width}×${item.height}` : '—'}
                                                    </td>
                                                    <td className="py-3 px-3 text-zinc-500 text-xs font-mono">{formatBytes(item.size)}</td>
                                                    <td className="py-3 px-3">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button 
                                                                onClick={() => handleCopy(item)} 
                                                                className={`p-2 bg-zinc-800 ${copied === item.id ? 'text-emerald-400 border-emerald-500/20' : 'text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60'} rounded-lg transition-colors border border-white/5 inline-flex items-center justify-center`} 
                                                                title={t('copy_url')}
                                                            >
                                                                {copied === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                            </button>
                                                            <Link 
                                                                href={route('admin.media.edit', item.id)} 
                                                                className="p-2 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-lg transition-colors border border-white/5 inline-flex items-center justify-center"
                                                                title={t('edit')}
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Link>
                                                            <button 
                                                                onClick={() => handleDelete(item.id)} 
                                                                className="p-2 bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/60 rounded-lg transition-colors border border-red-900/20 inline-flex items-center justify-center"
                                                                title={t('delete')}
                                                            >
                                                                <Trash className="w-4 h-4" />
                                                            </button>
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

                    {/* Pagination */}
                    {media.links?.length > 3 && (
                        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-xs text-zinc-500">
                                {t('showing_files_pagination', { from: media.from, to: media.to, total: media.total })}
                            </span>
                            <div className="flex flex-wrap gap-1">
                                {media.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 rounded-lg text-sm ${
                                            link.active
                                                ? 'bg-[var(--gold)] text-[#080808] font-bold'
                                                : !link.url
                                                    ? 'text-zinc-700 cursor-not-allowed'
                                                    : 'bg-[#080808] text-zinc-300 border border-white/10 hover:border-[var(--gold)]/30'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Single delete modal */}
            <DeleteConfirmModal
                show={!!deleteTargetId}
                onClose={() => setDeleteTargetId(null)}
                url={deleteTargetId ? `/admin/media/${deleteTargetId}` : null}
                title={t('delete_file_confirm_title')}
                message={t('delete_file_confirm_message')}
            />

            {/* Bulk delete modal */}
            <DeleteConfirmModal
                show={showBulkDeleteModal}
                onClose={() => {
                    setShowBulkDeleteModal(false);
                    clearSelect();
                }}
                url={route('admin.media.bulk-delete')}
                method="post"
                data={{ ids: selected }}
                title={t('delete_multiple_files_confirm_title', { count: selected.length })}
                message={t('delete_multiple_files_confirm_message', { count: selected.length })}
            />
        </AdminLayout>
    );
}
