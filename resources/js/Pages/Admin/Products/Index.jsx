import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Plus, Edit, Trash, Package } from 'lucide-react';
import debounce from 'lodash/debounce';

export default function Index({ products, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.is_active || '');

    const fetchProducts = (searchValue, statusValue) => {
        const query = {};
        if (searchValue) query.search = searchValue;
        if (statusValue !== '') query.is_active = statusValue;
        
        router.get('/admin/products', query, { preserveState: true, replace: true });
    };

    const handleSearch = debounce((value, statusValue) => {
        fetchProducts(value, statusValue);
    }, 300);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
        handleSearch(e.target.value, statusFilter);
    };

    const onStatusChange = (e) => {
        setStatusFilter(e.target.value);
        fetchProducts(search, e.target.value);
    };

    const handleDelete = (id) => {
        if (confirm('Anda pasti ingin memadam produk ini?')) {
            router.delete(`/admin/products/${id}`);
        }
    };

    return (
        <AdminLayout header="Produk (Products)">
            <Head title="Produk | Admin" />

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
                                placeholder="Cari nama produk..."
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
                            <option value="true">Aktif</option>
                            <option value="false">Tidak Aktif</option>
                        </select>
                    </div>
                    <Link
                        href={route('admin.products.create')}
                        className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:bg-[var(--gold-light)] transition-all duration-200"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Produk
                    </Link>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-3 font-semibold w-12">Ikon</th>
                                <th className="px-6 py-3 font-semibold">Nama Produk</th>
                                <th className="px-6 py-3 font-semibold">Kategori</th>
                                <th className="px-6 py-3 font-semibold text-right">Harga (RM)</th>
                                <th className="px-6 py-3 font-semibold text-center">Susunan</th>
                                <th className="px-6 py-3 font-semibold text-center">Status</th>
                                <th className="px-6 py-3 font-semibold text-right">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {products.data.map((product) => (
                                <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-10 h-10 rounded overflow-hidden bg-[#080808] dark:bg-[#080808] flex items-center justify-center shrink-0 border border-white/5 p-1">
                                            {product.icon ? (
                                                <img src={`/storage/${product.icon}`} alt="" className="w-full h-full object-contain" />
                                            ) : (
                                                <Package className="w-5 h-5 text-zinc-600" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-white flex items-center">
                                            {product.name}
                                            {product.is_featured && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">Utama</span>}
                                        </div>
                                        <div className="text-xs text-zinc-500 mt-1 line-clamp-1 max-w-xs">
                                            {product.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20">
                                            {product.category || 'Tiada'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-sm text-zinc-300">
                                        {product.price ? parseFloat(product.price).toFixed(2) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-zinc-500">
                                        {product.order}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${product.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                            {product.is_active ? 'Aktif' : 'Tidak Aktif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={route('admin.products.edit', product.id)}
                                                className="text-zinc-500 hover:text-[var(--gold)] transition-colors p-1"
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
                                                title="Delete"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.data.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-zinc-500">
                                        Tiada produk dijumpai.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {products.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-white/5 bg-[#080808]/30">
                        <div className="flex flex-wrap gap-1">
                            {products.links.map((link, idx) => (
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
