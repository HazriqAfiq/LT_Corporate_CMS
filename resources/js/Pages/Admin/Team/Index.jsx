import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import { Search, Plus, Edit, Trash, Image as ImageIcon, Check, GripVertical } from 'lucide-react';
import debounce from 'lodash/debounce';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';

export default function Index({ members, filters }) {
    const { t } = useTranslation();
    const [search, setSearch]             = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.is_active || '');
    const [toggling, setToggling]         = useState(null);
    const [toast, setToast]               = useState(null);
    const [list, setList]                 = useState(members.data);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        setList(members.data);
    }, [members.data]);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2500);
    };

    const fetchMembers = (searchValue, statusValue) => {
        const query = {};
        if (searchValue) query.search = searchValue;
        if (statusValue !== '') query.is_active = statusValue;
        router.get('/admin/team-members', query, { preserveState: true, replace: true });
    };

    const handleSearch = debounce((value, statusValue) => fetchMembers(value, statusValue), 300);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
        handleSearch(e.target.value, statusFilter);
    };

    const onStatusChange = (e) => {
        setStatusFilter(e.target.value);
        fetchMembers(search, e.target.value);
    };

    const handleDelete = (id, name) => {
        setDeleteTarget({ id, name });
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            router.delete(`/admin/team-members/${deleteTarget.id}`, {
                onSuccess: () => {
                    showToast(t('team_member_deleted', { name: deleteTarget.name }));
                    setDeleteTarget(null);
                },
            });
        }
    };

    const handleToggle = async (member) => {
        const originalStatus = member.is_active;
        setList(prev => prev.map(item => item.id === member.id ? { ...item, is_active: !item.is_active } : item));

        try {
            const res = await fetch(route('admin.team-members.toggle', member.id), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
            });
            if (res.ok) {
                router.reload({ only: ['members'] });
                showToast(t('member_status_updated', { name: member.name }));
            } else {
                setList(prev => prev.map(item => item.id === member.id ? { ...item, is_active: originalStatus } : item));
                showToast('Ralat berlaku');
            }
        } catch (e) {
            setList(prev => prev.map(item => item.id === member.id ? { ...item, is_active: originalStatus } : item));
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
            order: idx + 1,
        }));
        
        const res = await fetch(route('admin.team-members.reorder'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
            },
            body: JSON.stringify({ items: reorderedItems }),
        });
        
        if (res.ok) {
            showToast(t('team_order_updated'));
            router.reload({ only: ['members'] });
        } else {
            showToast(t('team_order_failed'));
        }
    };

    const getImageUrl = (path) => {
        if (!path) return '/images/default_avatar.png';
        if (path.startsWith('http') || path.startsWith('/') || path.startsWith('data:')) {
            return path;
        }
        return `/storage/${path}`;
    };

    return (
        <AdminLayout header={t('our_team')}>
            <Head title={`${t('manage_team')} | Admin`} />

            {toast && (
                <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl bg-emerald-500 text-white text-sm font-medium flex items-center gap-2 shadow-xl animate-fade-in-right">
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
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 bg-[#080808] border border-white/10 text-white rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-colors"
                                placeholder={t('search_name_role_placeholder')}
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
                                        fetchMembers(search, tab.key);
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
                    <Link
                        href={route('admin.team-members.create')}
                        className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:opacity-90 transition-all shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                    >
                        <Plus className="h-4 w-4 mr-2" /> {t('add_team_member')}
                    </Link>
                </div>

                {/* Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-4 py-3 w-10 text-center"></th>
                                <th className="px-6 py-3 w-28">{t('profile')}</th>
                                <th className="px-6 py-3">{t('name')}</th>
                                <th className="px-6 py-3">{t('role_bm')}</th>
                                <th className="px-6 py-3">{t('role_en')}</th>
                                <th className="px-6 py-3 text-center">{t('status')}</th>
                                <th className="px-6 py-3 text-right">{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {list.length > 0 ? (
                                list.map((member, idx) => (
                                    <tr
                                        key={member.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, idx)}
                                        onDragOver={(e) => handleDragOver(e, idx)}
                                        onDrop={(e) => handleDrop(e, idx)}
                                        onDragEnd={handleDragEnd}
                                        className={`transition-all ${
                                            draggedIndex === idx
                                                ? 'bg-zinc-800/40 border-2 border-dashed border-[var(--gold)]'
                                                : 'hover:bg-white/[0.02]'
                                        }`}
                                    >
                                        <td className="px-4 py-4 text-center cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-300">
                                            <GripVertical className="w-4 h-4 mx-auto" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-[#0c0c0e] flex items-center justify-center">
                                                <img
                                                    src={member.media?.url || '/images/default_avatar.png'}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-white">
                                            {member.name}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-300">
                                            {member.role}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400">
                                            {member.role_en || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <label className="relative inline-flex items-center select-none cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={member.is_active}
                                                    onChange={() => handleToggle(member)}
                                                    className="sr-only peer"
                                                />
                                                <div className="switch-toggle-track toggle-gold"></div>
                                            </label>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('admin.team-members.edit', member.id)}
                                                    className="p-2 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-lg transition-colors border border-white/5"
                                                    title={t('edit')}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(member.id, member.name)}
                                                    className="p-2 bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/60 rounded-lg transition-colors border border-red-900/20"
                                                    title={t('delete')}
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-12 text-zinc-600">
                                        {t('no_team_members')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {members.links && members.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-white/5 flex justify-between items-center bg-[#080808]/20">
                        <p className="text-xs text-zinc-500">
                            {t('showing')} <span className="font-semibold text-zinc-300">{members.from || 0}</span> {t('to_page')} <span className="font-semibold text-zinc-300">{members.to || 0}</span> {t('of_total')} <span className="font-semibold text-zinc-300">{members.total}</span> {t('members_unit')}.
                        </p>
                        <div className="flex items-center gap-1">
                            {members.links.map((link, i) => {
                                if (link.url === null) return null;
                                return (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                            link.active
                                                ? 'bg-[var(--gold)] text-[#080808] border-[var(--gold)]'
                                                : 'bg-transparent text-zinc-400 border-white/10 hover:border-white/20'
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <DeleteConfirmModal
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                url={deleteTarget ? `/admin/team-members/${deleteTarget.id}` : null}
                title={t('delete_team_member_confirm_title')}
                message={t('delete_team_member_confirm_message', { name: deleteTarget?.name })}
            />
        </AdminLayout>
    );
}
