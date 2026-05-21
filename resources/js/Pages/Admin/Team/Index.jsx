import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Plus, Edit, Trash, Image as ImageIcon, Check, GripVertical, ToggleLeft, ToggleRight } from 'lucide-react';
import debounce from 'lodash/debounce';

export default function Index({ members, filters }) {
    const [search, setSearch]             = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.is_active || '');
    const [toggling, setToggling]         = useState(null);
    const [toast, setToast]               = useState(null);
    const [list, setList]                 = useState(members.data);
    const [draggedIndex, setDraggedIndex] = useState(null);

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
        if (confirm(`Anda pasti ingin memadam ahli pasukan "${name}"?`)) {
            router.delete(`/admin/team-members/${id}`, {
                onSuccess: () => showToast(`Ahli pasukan "${name}" dipadam.`),
            });
        }
    };

    const handleToggle = async (member) => {
        setToggling(member.id);
        const res = await fetch(route('admin.team-members.toggle', member.id), {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
            },
        });
        if (res.ok) {
            router.reload({ only: ['members'] });
            showToast(`Status "${member.name}" dikemaskini.`);
        }
        setToggling(null);
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
            showToast('Susunan ahli pasukan berjaya dikemaskini.');
            router.reload({ only: ['members'] });
        } else {
            showToast('Gagal mengemaskini susunan ahli pasukan.');
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
        <AdminLayout header="Pasukan Kami">
            <Head title="Urus Pasukan | Admin" />

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
                                placeholder="Cari nama atau peranan..."
                                value={search}
                                onChange={onSearchChange}
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={onStatusChange}
                            className="block w-full sm:w-40 py-2 pl-3 pr-10 border border-white/10 bg-[#080808] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] sm:text-sm"
                        >
                            <option value="">Semua Status</option>
                            <option value="true">Aktif</option>
                            <option value="false">Tidak Aktif</option>
                        </select>
                    </div>
                    <Link
                        href={route('admin.team-members.create')}
                        className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:opacity-90 transition-all shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Tambah Ahli Pasukan
                    </Link>
                </div>

                {/* Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-4 py-3 w-10 text-center"></th>
                                <th className="px-6 py-3 w-28">Profil</th>
                                <th className="px-6 py-3">Nama</th>
                                <th className="px-6 py-3">Peranan (BM)</th>
                                <th className="px-6 py-3">Peranan (EN)</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-right">Tindakan</th>
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
                                                    src={getImageUrl(member.image_path)}
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
                                            <button
                                                onClick={() => handleToggle(member)}
                                                disabled={toggling === member.id}
                                                className={`transition-colors focus:outline-none ${
                                                    member.is_active
                                                        ? 'text-[var(--gold)]'
                                                        : 'text-zinc-600'
                                                }`}
                                            >
                                                {member.is_active ? (
                                                    <ToggleRight className="w-9 h-9" />
                                                ) : (
                                                    <ToggleLeft className="w-9 h-9" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('admin.team-members.edit', member.id)}
                                                    className="p-2 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-lg transition-colors border border-white/5"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(member.id, member.name)}
                                                    className="p-2 bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/60 rounded-lg transition-colors border border-red-900/20"
                                                    title="Padam"
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
                                        Tiada ahli pasukan dijumpai.
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
                            Menunjukkan <span className="font-semibold text-zinc-300">{members.from || 0}</span> hingga <span className="font-semibold text-zinc-300">{members.to || 0}</span> daripada <span className="font-semibold text-zinc-300">{members.total}</span> ahli.
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
        </AdminLayout>
    );
}
