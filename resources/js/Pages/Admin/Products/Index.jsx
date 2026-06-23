import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import { Search, Plus, Edit, Trash, Package } from 'lucide-react';
import { debounce } from 'lodash-es';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';
import usePermissions from '@/Hooks/usePermissions';

export default function Index({ products, filters }) {
    const { t, lang } = useTranslation();
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
                                        fetchProducts(search, tab.key);
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
                    { (hasPermission('create_products') ) && (
<Link
                            href={route('admin.products.create')}
                            className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:bg-[var(--gold-light)] transition-all duration-200"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('add_product')}
                        </Link>
                    )}
                </div>

                {/* Desktop View */}
                <div className="overflow-x-auto flex-1 hidden md:block">
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
                                            {lang === 'en' && product.name_en ? product.name_en : product.name}
                                            {product.is_featured && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">{t('featured')}</span>}
                                        </div>
                                        <div className="text-xs text-zinc-500 mt-1 line-clamp-1 max-w-xs">
                                            {lang === 'en' && product.description_en ? product.description_en : product.description}
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
                                            { (hasPermission('edit_products') ) && (
                                                <Link
                                                    href={route('admin.products.edit', product.id)}
                                                    className="p-2 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-lg transition-colors border border-white/5"
                                                    title={t('edit_product')}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            )}
                                            { (hasPermission('delete_products') ) && (
                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
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

                {/* Mobile View */}
                <div className="md:hidden flex-1 divide-y divide-white/[0.04] p-4 space-y-4">
                    {products.data.map((product) => (
                        <div key={product.id} className="p-4 bg-[#080808]/40 border border-white/5 rounded-2xl flex flex-col gap-4 hover:border-[var(--gold)]/20 transition-all duration-300">
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded overflow-hidden bg-[#080808] flex items-center justify-center shrink-0 border border-white/5 p-1">
                                    {product.icon ? (
                                        <img src={`/storage/${product.icon}`} alt="" className="w-full h-full object-contain" />
                                    ) : (
                                        <Package className="w-6 h-6 text-zinc-600" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-white truncate">{lang === 'en' && product.name_en ? product.name_en : product.name}</p>
                                        {product.is_featured && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-100/10 text-amber-400 border border-amber-400/25 uppercase shrink-0">{t('featured')}</span>}
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-1 line-clamp-1 truncate">{lang === 'en' && product.description_en ? product.description_en : product.description}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-3 text-xs border-t border-white/5 pt-3">
                                <div>
                                    <p className="text-[9px] text-zinc-500 font-medium uppercase tracking-wider">{t('category')}</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20 mt-0.5">
                                        {product.category || t('none')}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[9px] text-zinc-500 font-medium uppercase tracking-wider">{t('price_rm')}</p>
                                    <p className="text-xs text-zinc-300 font-semibold font-mono mt-0.5">
                                        {product.price ? `RM ${parseFloat(product.price).toFixed(2)}` : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-zinc-500 font-medium uppercase tracking-wider">{t('order_label')}</p>
                                    <p className="text-xs text-zinc-300 font-mono mt-0.5">#{product.order}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between border-t border-white/5 pt-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${product.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {product.is_active ? t('active') : t('inactive')}
                                </span>
                                
                                {(hasPermission('edit_products') || hasPermission('delete_products')) && (
                                    <div className="flex gap-2">
                                        {hasPermission('edit_products') && (
                                            <Link
                                                href={route('admin.products.edit', product.id)}
                                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-xl transition-colors border border-white/5 text-xs font-semibold"
                                                title={t('edit_product')}
                                            >
                                                <Edit className="h-3.5 w-3.5" />
                                                {t('edit')}
                                            </Link>
                                        )}
                                        {hasPermission('delete_products') && (
                                            <button
                                                onClick={() => handleDelete(product.id, product.name)}
                                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/60 rounded-xl transition-colors border border-red-900/20 text-xs font-semibold"
                                                title={t('delete')}
                                            >
                                                <Trash className="h-3.5 w-3.5" />
                                                {t('delete')}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {products.data.length === 0 && (
                        <div className="py-12 text-center text-zinc-500 text-sm">
                            {t('no_products')}
                        </div>
                    )}
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
