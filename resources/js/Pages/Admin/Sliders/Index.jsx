import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import { Search, Plus, Edit, Trash, Image as ImageIcon, Check, GripVertical } from 'lucide-react';
import debounce from 'lodash/debounce';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';
import usePermissions from '@/Hooks/usePermissions';

export default function Index({ sliders, filters }) {
    const { t, lang } = useTranslation();
    const { csrf_token } = usePage().props;
    const { hasPermission } = usePermissions();
    const [search, setSearch]             = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.is_active || '');
    const [toggling, setToggling]         = useState(null);
    const [toast, setToast]               = useState(null);
    const [list, setList]                 = useState(sliders.data);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    useEffect(() => {
        setList(sliders.data);
    }, [sliders.data]);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

    const fetchSliders = (searchValue, statusValue) => {
        const query = {};
        if (searchValue) query.search = searchValue;
        if (statusValue !== '') query.is_active = statusValue;
        router.get('/admin/sliders', query, { preserveState: true, replace: true });
    };

    const handleSearch = debounce((value, statusValue) => fetchSliders(value, statusValue), 300);

    const onSearchChange = (e) => { setSearch(e.target.value); handleSearch(e.target.value, statusFilter); };
    const onStatusChange = (e) => { setStatusFilter(e.target.value); fetchSliders(search, e.target.value); };

    const handleDelete = (id) => {
        setDeleteTargetId(id);
    };

    const confirmDelete = () => {
        if (deleteTargetId) {
            router.delete(`/admin/sliders/${deleteTargetId}`, {
                onSuccess: () => {
                    setDeleteTargetId(null);
                    showToast(t('slider_deleted'));
                }
            });
        }
    };

    const handleToggle = async (slider) => {
        const originalStatus = slider.is_active;
        setList(prev => prev.map(item => item.id === slider.id ? { ...item, is_active: !item.is_active } : item));
        
        try {
            const res = await fetch(route('admin.sliders.toggle', slider.id, false), {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': csrf_token },
            });
            if (res.ok) {
                router.reload({ only: ['sliders'] });
                showToast(t(!originalStatus ? 'slider_published_msg' : 'slider_hidden_msg', { title: slider.title }));
            } else {
                setList(prev => prev.map(item => item.id === slider.id ? { ...item, is_active: originalStatus } : item));
                showToast('Ralat berlaku');
            }
        } catch (e) {
            setList(prev => prev.map(item => item.id === slider.id ? { ...item, is_active: originalStatus } : item));
            showToast('Ralat berlaku');
        }
    };

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        
        const newList = [...list];
        const draggedItem = newList[draggedIndex];
        newList.splice(draggedIndex, 1);
        newList.splice(index, 0, draggedItem);
        
        setDraggedIndex(index);
        setList(newList);
    };

    const handleDrop = async (e, index) => {
        e.preventDefault();
        
        const reorderedItems = list.map((item, idx) => ({
            id: item.id,
            order: idx + 1
        }));
        
        const res = await fetch(route('admin.sliders.reorder', undefined, false), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf_token,
            },
            body: JSON.stringify({ items: reorderedItems }),
        });
        
        if (res.ok) {
            showToast(t('slider_order_updated'));
            router.reload({ only: ['sliders'] });
        } else {
            showToast(t('slider_order_failed'));
        }
    };

    return (
        <AdminLayout header={t('main_sliders')}>
            <Head title={`${t('sliders_title_page')} | Admin`} />

            {toast && (
                <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl bg-emerald-500 text-white text-sm font-medium flex items-center gap-2 shadow-xl">
                    <Check className="w-4 h-4" /> {toast}
                </div>
            )}

            <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 flex flex-col min-h-[500px]">
                {/* Toolbar */}
                <div className="px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-zinc-500" />
                            </div>
                            <input type="text" className="block w-full pl-10 pr-3 py-2 bg-[#080808] border border-white/10 text-white rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-colors" placeholder={t('search_title_placeholder')} value={search} onChange={onSearchChange} />
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
                                        fetchSliders(search, tab.key);
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
                    { hasPermission('create_sliders') && (
                        <Link href={route('admin.sliders.create')} className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:opacity-90 transition-all">
                            <Plus className="h-4 w-4 mr-2" /> {t('add_slider')}
                        </Link>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-4 py-3 w-10 text-center"></th>
                                <th className="px-6 py-3 w-28">{t('image')}</th>
                                <th className="px-6 py-3">{t('content')}</th>
                                <th className="px-6 py-3 text-center">{t('order')}</th>
                                <th className="px-6 py-3 text-center">{t('publish')}</th>
                                <th className="px-6 py-3 text-right">{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {list.map((slider, idx) => (
                                <tr 
                                    key={slider.id} 
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, idx)}
                                    onDragOver={(e) => handleDragOver(e, idx)}
                                    onDragEnd={handleDragEnd}
                                    onDrop={(e) => handleDrop(e, idx)}
                                    className={`hover:bg-white/[0.02] transition-colors group cursor-grab active:cursor-grabbing ${draggedIndex === idx ? 'bg-white/[0.04] opacity-50' : ''}`}
                                >
                                    <td className="px-4 py-4 text-center">
                                        <GripVertical className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors mx-auto cursor-grab" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-24 h-16 rounded-xl overflow-hidden bg-[#080808] flex items-center justify-center border border-white/5">
                                            {slider.media?.url
                                                ? <img src={slider.media.url} alt="" className="w-full h-full object-cover" />
                                                : <ImageIcon className="w-6 h-6 text-zinc-600" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-white">{lang === 'en' && slider.title_en ? slider.title_en : slider.title}</div>
                                        <div className="text-xs text-zinc-500 mt-0.5 line-clamp-1 max-w-sm">{lang === 'en' && (slider.subtitle_en || slider.description_en) ? (slider.subtitle_en || slider.description_en) : (slider.subtitle || slider.description)}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-zinc-500 font-mono">{slider.order}</td>
                                    <td className="px-6 py-4 text-center">
                                        <label className={`relative inline-flex items-center select-none ${hasPermission('edit_sliders') ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`} title={!hasPermission('edit_sliders') ? t('no_permission', 'You do not have permission') : ''}>
                                            <input
                                                type="checkbox"
                                                checked={slider.is_active}
                                                onChange={() => hasPermission('edit_sliders') && handleToggle(slider)}
                                                className="sr-only peer"
                                                disabled={!hasPermission('edit_sliders')}
                                            />
                                            <div className="switch-toggle-track toggle-gold"></div>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {hasPermission('edit_sliders') && (
                                                <Link
                                                    href={route('admin.sliders.edit', slider.id)}
                                                    className="p-2 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-lg transition-colors border border-white/5"
                                                    title={t('edit')}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            )}
                                            {hasPermission('delete_sliders') && (
                                                <button
                                                    onClick={() => handleDelete(slider.id)}
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
                            {list.length === 0 && (
                                <tr><td colSpan="6" className="px-6 py-16 text-center text-zinc-500"><ImageIcon className="w-10 h-10 mx-auto mb-3 text-zinc-700" /><p>{t('no_sliders')}</p></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {sliders.links?.length > 3 && (
                    <div className="px-6 py-4 border-t border-white/5 flex flex-wrap gap-1">
                        {sliders.links.map((link, idx) => (
                            <Link key={idx} href={link.url || '#'} className={`px-3 py-1 rounded-lg text-sm ${link.active ? 'bg-[var(--gold)] text-[#080808] font-bold' : !link.url ? 'text-zinc-700 cursor-not-allowed' : 'bg-[#080808] text-zinc-300 border border-white/10 hover:border-[var(--gold)]/30'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>

            <DeleteConfirmModal
                show={!!deleteTargetId}
                onClose={() => setDeleteTargetId(null)}
                url={deleteTargetId ? `/admin/sliders/${deleteTargetId}` : null}
                title={t('delete_slide_confirm_title')}
                message={t('delete_slide_confirm_message')}
            />
        </AdminLayout>
    );
}
