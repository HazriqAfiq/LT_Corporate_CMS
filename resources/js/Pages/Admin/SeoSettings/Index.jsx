import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Plus, Edit, Trash, Globe } from 'lucide-react';
import debounce from 'lodash/debounce';

export default function Index({ settings, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = debounce((value) => {
        router.get('/admin/seo-settings', { search: value }, { preserveState: true, replace: true });
    }, 300);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
    };

    const handleDelete = (id) => {
        if (confirm('Anda pasti ingin memadam tetapan SEO ini?')) {
            router.delete(`/admin/seo-settings/${id}`);
        }
    };

    return (
        <AdminLayout header="Tetapan SEO (SEO Settings)">
            <Head title="Tetapan SEO | Admin" />

            <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 flex flex-col min-h-[500px]">
                <div className="px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-zinc-500" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 bg-[#080808] border border-white/10 text-white rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-colors"
                            placeholder="Cari kunci atau label..."
                            value={search}
                            onChange={onSearchChange}
                        />
                    </div>
                    <Link
                        href={route('admin.seo-settings.create')}
                        className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:bg-[var(--gold-light)] transition-all duration-200"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Tetapan
                    </Link>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-3 font-semibold">Kunci (Key)</th>
                                <th className="px-6 py-3 font-semibold">Label</th>
                                <th className="px-6 py-3 font-semibold">Jenis</th>
                                <th className="px-6 py-3 font-semibold">Nilai</th>
                                <th className="px-6 py-3 font-semibold text-right">Tindakan</th>
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
                                            {setting.label || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#080808] text-gray-800 dark:bg-gray-700 text-zinc-300 uppercase tracking-wide">
                                            {setting.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-zinc-500 truncate max-w-[300px]" title={setting.value}>
                                            {setting.value || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={route('admin.seo-settings.edit', setting.id)}
                                                className="text-zinc-500 hover:text-[var(--gold)] transition-colors p-1"
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(setting.id)}
                                                className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
                                                title="Delete"
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
                                        Tiada tetapan SEO dijumpai.
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
        </AdminLayout>
    );
}
