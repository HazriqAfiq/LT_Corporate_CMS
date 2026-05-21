import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Plus, Edit, Trash, Image as ImageIcon, Check, GripVertical } from 'lucide-react';
import debounce from 'lodash/debounce';

export default function Index({ sliders, filters }) {
    const [search, setSearch]             = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.is_active || '');
    const [toggling, setToggling]         = useState(null);
    const [toast, setToast]               = useState(null);
    const [list, setList]                 = useState(sliders.data);
    const [draggedIndex, setDraggedIndex] = useState(null);

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
        if (confirm('Anda pasti ingin memadam slider ini?')) {
            router.delete(`/admin/sliders/${id}`, { onSuccess: () => showToast('Slider dipadam.') });
        }
    };

    const handleToggle = async (slider) => {
        setToggling(slider.id);
        const res = await fetch(route('admin.sliders.toggle', slider.id), {
            method: 'POST',
            headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
        });
        if (res.ok) {
            router.reload({ only: ['sliders'] });
            showToast(`Slider "${slider.title}" ${slider.is_active ? 'disembunyikan' : 'diterbitkan'}.`);
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
            order: idx + 1
        }));
        
        const res = await fetch(route('admin.sliders.reorder'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
            },
            body: JSON.stringify({ items: reorderedItems }),
        });
        
        if (res.ok) {
            showToast('Susunan slider berjaya dikemaskini.');
            router.reload({ only: ['sliders'] });
        } else {
            showToast('Gagal mengemaskini susunan slider.');
        }
    };

    return (
        <AdminLayout header="Slider Utama">
            <Head title="Slider | Admin" />

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
                            <input type="text" className="block w-full pl-10 pr-3 py-2 bg-[#080808] border border-white/10 text-white rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-colors" placeholder="Cari tajuk..." value={search} onChange={onSearchChange} />
                        </div>
                        <select value={statusFilter} onChange={onStatusChange} className="block w-full sm:w-40 py-2 pl-3 pr-10 border border-white/10 bg-[#080808] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--gold)] sm:text-sm">
                            <option value="">Semua Status</option>
                            <option value="true">Aktif</option>
                            <option value="false">Tidak Aktif</option>
                        </select>
                    </div>
                    <Link href={route('admin.sliders.create')} className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:opacity-90 transition-all">
                        <Plus className="h-4 w-4 mr-2" /> Tambah Slider
                    </Link>
                </div>

                {/* Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-4 py-3 w-10 text-center"></th>
                                <th className="px-6 py-3 w-28">Imej</th>
                                <th className="px-6 py-3">Kandungan</th>
                                <th className="px-6 py-3 text-center">Susunan</th>
                                <th className="px-6 py-3 text-center">Terbit</th>
                                <th className="px-6 py-3 text-right">Tindakan</th>
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
                                            {slider.image
                                                ? <img src={`/storage/${slider.image}`} alt="" className="w-full h-full object-cover" />
                                                : <ImageIcon className="w-6 h-6 text-zinc-600" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-white">{slider.title}</div>
                                        <div className="text-xs text-zinc-500 mt-0.5 line-clamp-1 max-w-sm">{slider.subtitle || slider.description}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-zinc-500 font-mono">{slider.order}</td>
                                    <td className="px-6 py-4 text-center">
                                        {/* Toggle switch */}
                                        <button onClick={() => handleToggle(slider)} disabled={toggling === slider.id} title={slider.is_active ? 'Klik untuk sembunyikan' : 'Klik untuk terbitkan'} className="inline-flex items-center gap-2 focus:outline-none">
                                            <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${slider.is_active ? 'bg-emerald-500/80' : 'bg-white/10'} ${toggling === slider.id ? 'opacity-50' : ''}`}>
                                                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${slider.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </div>
                                            <span className={`text-xs font-semibold ${slider.is_active ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                                {slider.is_active ? 'Aktif' : 'Sembunyi'}
                                            </span>
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={route('admin.sliders.edit', slider.id)} className="text-zinc-500 hover:text-[var(--gold)] transition p-1.5 rounded-lg hover:bg-white/5"><Edit className="h-4 w-4" /></Link>
                                            <button onClick={() => handleDelete(slider.id)} className="text-zinc-500 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-red-500/10"><Trash className="h-4 w-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {list.length === 0 && (
                                <tr><td colSpan="6" className="px-6 py-16 text-center text-zinc-500"><ImageIcon className="w-10 h-10 mx-auto mb-3 text-zinc-700" /><p>Tiada slider dijumpai.</p></td></tr>
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
        </AdminLayout>
    );
}
