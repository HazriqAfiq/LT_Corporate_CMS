import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Edit, Trash, Check, CheckCircle2 } from 'lucide-react';
import debounce from 'lodash/debounce';

export default function Index({ inquiries, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.is_read || '');

    const fetchInquiries = (searchValue, isReadValue) => {
        const query = {};
        if (searchValue) query.search = searchValue;
        if (isReadValue !== '') query.is_read = isReadValue;
        
        router.get('/admin/inquiries', query, { preserveState: true, replace: true });
    };

    const handleSearch = debounce((value, isReadValue) => {
        fetchInquiries(value, isReadValue);
    }, 300);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
        handleSearch(e.target.value, statusFilter);
    };

    const onStatusChange = (e) => {
        setStatusFilter(e.target.value);
        fetchInquiries(search, e.target.value);
    };

    const handleDelete = (id) => {
        if (confirm('Anda pasti ingin memadam pertanyaan ini?')) {
            router.delete(`/admin/inquiries/${id}`);
        }
    };

    const handleMarkAsRead = (id) => {
        router.post(`/admin/inquiries/${id}/mark-as-read`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout header="Pertanyaan (Inquiries)">
            <Head title="Pertanyaan | Admin" />

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
                                placeholder="Cari nama, emel, subjek..."
                                value={search}
                                onChange={onSearchChange}
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={onStatusChange}
                            className="block w-full sm:w-40 py-2 pl-3 pr-10 border border-white/10 bg-[#080808] text-white rounded-md focus:outline-none focus:ring-1 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] sm:text-sm"
                        >
                            <option value="">Semua Status</option>
                            <option value="true">Telah Dibaca</option>
                            <option value="false">Belum Dibaca</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-3 font-semibold">Nama / Emel</th>
                                <th className="px-6 py-3 font-semibold">Subjek</th>
                                <th className="px-6 py-3 font-semibold text-center">Status</th>
                                <th className="px-6 py-3 font-semibold text-right">Tarikh</th>
                                <th className="px-6 py-3 font-semibold text-right">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {inquiries.data.map((inquiry) => (
                                <tr key={inquiry.id} className={`transition-colors group ${inquiry.is_read ? 'hover:bg-[#080808] dark:hover:bg-white/5/50' : 'bg-white/5/30 dark:bg-blue-900/10 hover:bg-white/5/50 dark:hover:bg-blue-900/20'}`}>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-white">
                                            {inquiry.name}
                                        </div>
                                        <div className="text-sm text-zinc-500">
                                            {inquiry.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-white text-zinc-200 line-clamp-2 max-w-sm">
                                            {inquiry.subject}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {inquiry.is_read ? (
                                            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400">
                                                <CheckCircle2 className="w-5 h-5 mr-1" />
                                                <span className="text-xs font-medium">Dibaca</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20">
                                                Baru
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 text-right">
                                        {new Date(inquiry.created_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            {!inquiry.is_read && (
                                                <button
                                                    onClick={() => handleMarkAsRead(inquiry.id)}
                                                    className="text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-1"
                                                    title="Tandai Dibaca"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                            )}
                                            <Link
                                                href={route('admin.inquiries.edit', inquiry.id)}
                                                className="text-zinc-500 hover:text-[var(--gold)] transition-colors p-1"
                                                title="Lihat / Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(inquiry.id)}
                                                className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
                                                title="Padam"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {inquiries.data.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
                                        Tiada pertanyaan dijumpai.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {inquiries.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-white/5 bg-[#080808]/30">
                        <div className="flex flex-wrap gap-1">
                            {inquiries.links.map((link, idx) => (
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
        </AdminLayout>
    );
}
