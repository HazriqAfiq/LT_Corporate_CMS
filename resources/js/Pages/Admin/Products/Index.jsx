import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import { Search, Plus, Edit, Trash, Package } from 'lucide-react';
import debounce from 'lodash/debounce';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';
import usePermissions from '@/Hooks/usePermissions';

export default function Index({ products, filters }) {
    const { t } = useTranslation();
    const { hasPermission } = usePermissions();
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.is_active || '');
    const [deleteTarget, setDeleteTarget] = useState(null);

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

    const handleDelete = (id, name) => {
        setDeleteTarget({ id, name });
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            router.delete(`/admin/products/${deleteTarget.id}`, {
                onSuccess: () => setDeleteTarget(null)
            });
        }
    };

    return (
        <AdminLayout header={t('products')}>
            <Head title={`${t('products')} | Admin`} />

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
                                placeholder={t('search_products')}
                                value={search}
                                onChange={onSearchChange}
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={onStatusChange}
                            className="block w-full sm:w-40 py-2 pl-3 pr-10 border border-white/10 bg-[#080808] text-white rounded-md focus:outline-none focus:ring-1 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] sm:text-sm"
                        >
                            <option value="">{t('all_status')}</option>
                            <option value="true">{t('active')}</option>
                            <option value="false">{t('inactive')}</option>
                        </select>
                    </div>
                    {hasPermission('create_products') ? (
                        <Link
                            href={route('admin.products.create')}
                            className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:bg-[var(--gold-light)] transition-all duration-200"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('add_product')}
                        </Link>
                    ) : (
                        <button
                            disabled
                            title={t('no_permission', 'You do not have permission')}
                            className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('add_product')}
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-3 font-semibold w-12">{t('icon')}</th>
                                <th className="px-6 py-3 font-semibold">{t('product_name')}</th>
                                <th className="px-6 py-3 font-semibold">{t('category')}</th>
                                <th className="px-6 py-3 font-semibold text-right">{t('price_rm')}</th>
                                <th className="px-6 py-3 font-semibold text-center">{t('order_label')}</th>
                                <th className="px-6 py-3 font-semibold text-center">{t('status')}</th>
                                <th className="px-6 py-3 font-semibold text-right">{t('action')}</th>
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
                                            {product.is_featured && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">{t('featured')}</span>}
                                        </div>
                                        <div className="text-xs text-zinc-500 mt-1 line-clamp-1 max-w-xs">
                                            {product.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20">
                                            {product.category || t('none')}
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
                                            {product.is_active ? t('active') : t('inactive')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {hasPermission('edit_products') ? (
                                                <Link
                                                    href={route('admin.products.edit', product.id)}
                                                    className="p-2 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-lg transition-colors border border-white/5"
                                                    title={t('edit_product')}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            ) : (
                                                <button disabled className="p-2 bg-zinc-900/50 text-zinc-700 cursor-not-allowed rounded-lg border border-white/5" title={t('no_permission', 'You do not have permission')}>
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                            )}
                                            {hasPermission('delete_products') ? (
                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    className="p-2 bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/60 rounded-lg transition-colors border border-red-900/20"
                                                    title={t('delete')}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </button>
                                            ) : (
                                                <button disabled className="p-2 bg-zinc-900/50 text-zinc-700 cursor-not-allowed rounded-lg border border-red-900/10" title={t('no_permission', 'You do not have permission')}>
                                                    <Trash className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.data.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-zinc-500">
                                        {t('no_products')}
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

            <DeleteConfirmModal
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                url={deleteTarget ? `/admin/products/${deleteTarget.id}` : null}
                title={t('delete_product_confirm_title')}
                message={t('delete_product_confirm_dynamic', { name: deleteTarget?.name })}
            />
        </AdminLayout>
    );
}
