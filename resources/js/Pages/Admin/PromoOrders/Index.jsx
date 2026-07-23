import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import { Search, Trash, Check, X, ShieldAlert, BadgePercent, Landmark, RefreshCw, Layers, Eye } from 'lucide-react';

export default function Index() {
    const { orders = {}, filters = {}, stats = {}, flash = {} } = usePage().props;

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Handle search input and dropdown filter changes with debounce
    useEffect(() => {
        const query = {};
        if (search) query.search = search;
        if (status) query.status = status;

        const timer = setTimeout(() => {
            router.get('/admin/promo-orders', query, {
                preserveState: true,
                replace: true
            });
        }, 400);

        return () => clearTimeout(timer);
    }, [search, status]);


    const handleDelete = (id, name) => {
        if (window.confirm(`Adakah anda pasti mahu memadam tempahan "${name}"? Tindakan ini tidak boleh diundur.`)) {
            router.delete(`/admin/promo-orders/${id}`, {
                preserveScroll: true
            });
        }
    };

    const resetFilters = () => {
        setSearch('');
        setStatus('');
    };

    const statusBadges = {
        paid: 'bg-green-500/10 border-green-500/20 text-green-400',
        pending: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
        failed: 'bg-red-500/10 border-red-500/20 text-red-400',
    };

    const statusLabels = {
        paid: 'Berjaya / Paid',
        pending: 'Menunggu / Pending',
        failed: 'Gagal / Cancelled',
    };

    return (
        <AdminLayout header={<h2 className="font-bold text-xl text-white">Laporan & Tempahan Promosi Khas</h2>}>
            <Head title="Tempahan Promosi Khas | Admin Dashboard" />

            <div className="space-y-6">
                
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-semibold">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-semibold">
                        {flash.error}
                    </div>
                )}

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Revenue Card */}
                    <div className="p-6 bg-[#0c0c0e] border border-white/5 rounded-2xl flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <Landmark className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Total Revenue</p>
                            <h3 className="text-2xl font-black text-white mt-1">
                                RM{stats.totalRevenue.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                    </div>

                    {/* Slots Counter Card */}
                    <div className="p-6 bg-[#0c0c0e] border border-white/5 rounded-2xl flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Promo Slots Sold</p>
                                <h3 className="text-2xl font-black text-white mt-0.5">
                                    {stats.paidCount} / 20
                                </h3>
                            </div>
                            <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                                <BadgePercent className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-[var(--gold)] rounded-full transition-all duration-1000"
                                style={{ width: `${Math.min(100, (stats.paidCount / 20) * 100)}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-2 font-medium">
                            {stats.slotsRemaining} slots remaining at RM1,000.
                        </p>
                    </div>

                    {/* Pending bookings Card */}
                    <div className="p-6 bg-[#0c0c0e] border border-white/5 rounded-2xl flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                            <RefreshCw className="w-5 h-5 animate-spin-slow" />
                        </div>
                        <div>
                            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Pending Bookings</p>
                            <h3 className="text-2xl font-black text-white mt-1">
                                {stats.pendingCount}
                            </h3>
                        </div>
                    </div>

                    {/* Total Bookings Card */}
                    <div className="p-6 bg-[#0c0c0e] border border-white/5 rounded-2xl flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/20 text-zinc-400">
                            <Layers className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Total Orders</p>
                            <h3 className="text-2xl font-black text-white mt-1">
                                {orders.total || 0}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Filter and Table Panel */}
                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl flex flex-col min-h-[400px] overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-zinc-500" />
                                </div>
                                <input 
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 bg-[#080808] border border-white/10 text-white rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-colors"
                                    placeholder="Search name, email, phone..."
                                />
                            </div>

                            <div className="flex bg-[#080808] p-1 rounded-xl border border-white/10 flex-wrap gap-1">
                                {[
                                    { key: '', label: 'Semua Status' },
                                    { key: 'paid', label: 'Berjaya (Paid)' },
                                    { key: 'pending', label: 'Menunggu (Pending)' },
                                    { key: 'failed', label: 'Gagal (Failed)' }
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => setStatus(tab.key)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                            status === tab.key
                                                ? 'bg-zinc-800 text-white shadow-sm border border-white/5'
                                                : 'text-zinc-500 hover:text-zinc-300'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {(search || status) && (
                                <button
                                    onClick={resetFilters}
                                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold transition-all border border-white/5"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto flex-1">
                        <table className="min-w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                    <th className="px-6 py-3">Pelanggan</th>
                                    <th className="px-6 py-3">Hubungan</th>
                                    <th className="px-6 py-3">Amaun</th>
                                    <th className="px-6 py-3">Kaedah</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Rujukan ID</th>
                                    <th className="px-6 py-3">Tarikh</th>
                                    <th className="px-6 py-3 text-right">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04] text-sm text-zinc-300">
                                {orders.data && orders.data.length > 0 ? (
                                    orders.data.map(order => (
                                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-white">{order.name}</div>
                                                {order.company && (
                                                    <div className="text-[10px] text-zinc-500 font-semibold uppercase mt-0.5">{order.company}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs">{order.email}</div>
                                                <div className="text-xs text-zinc-500 mt-0.5">{order.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-white font-mono">
                                                RM{parseFloat(order.amount).toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold uppercase text-zinc-500">
                                                    {order.payment_gateway === 'stripe' ? 'Stripe' : (order.payment_gateway === 'chip' ? 'CHIP' : 'Mock')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${statusBadges[order.status] || 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
                                                    {statusLabels[order.status] || order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-mono text-xs text-zinc-500 truncate max-w-[120px]" title={order.payment_id}>
                                                    {order.payment_id || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-zinc-400">
                                                {new Date(order.created_at).toLocaleDateString('ms-MY', {
                                                    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="p-2 bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700/60 rounded-lg transition-colors border border-white/5 cursor-pointer"
                                                        title="Perincian Tempahan"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(order.id, order.name)}
                                                        className="p-2 bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/60 rounded-lg transition-colors border border-red-900/20 cursor-pointer"
                                                        title="Padam Tempahan"
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-zinc-500">
                                            Tiada rekod tempahan dijumpai.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Links */}
                    {orders.links && orders.links.length > 3 && (
                        <div className="p-6 border-t border-white/5 flex justify-center gap-1.5 bg-[#080808]/50">
                            {orders.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                        link.active
                                            ? 'bg-[var(--gold)] text-black font-bold border border-[var(--gold)]'
                                            : 'bg-[#080808] border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800'
                                    } ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                                    onClick={e => !link.url && e.preventDefault()}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Review Info Modal */}
            <Modal show={selectedOrder !== null} onClose={() => setSelectedOrder(null)} maxWidth="lg">
                {selectedOrder && (
                    <div className="p-6 bg-[#0c0c0e] border border-white/5 text-white rounded-2xl">
                        <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                            <h3 className="text-base font-bold text-white uppercase tracking-wider">Perincian Maklumat Tempahan</h3>
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="text-zinc-500 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 text-sm text-zinc-300">
                            <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/[0.03]">
                                <span className="font-semibold text-zinc-500">Nama Pelanggan</span>
                                <span className="col-span-2 text-white font-bold">{selectedOrder.name}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/[0.03]">
                                <span className="font-semibold text-zinc-500">Emel</span>
                                <span className="col-span-2 text-white font-mono">{selectedOrder.email}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/[0.03]">
                                <span className="font-semibold text-zinc-500">No. Telefon</span>
                                <span className="col-span-2 text-white font-mono">{selectedOrder.phone}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/[0.03]">
                                <span className="font-semibold text-zinc-500">Syarikat</span>
                                <span className="col-span-2 text-white">{selectedOrder.company || '-'}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/[0.03]">
                                <span className="font-semibold text-zinc-500">Jumlah Bayaran</span>
                                <span className="col-span-2 text-[var(--gold)] font-bold font-mono">
                                    RM{parseFloat(selectedOrder.amount).toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/[0.03]">
                                <span className="font-semibold text-zinc-500">Kaedah Bayaran</span>
                                <span className="col-span-2 text-white uppercase font-bold text-xs">{selectedOrder.payment_gateway}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/[0.03]">
                                <span className="font-semibold text-zinc-500">Status</span>
                                <span className="col-span-2">
                                    <span className={`inline-flex px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${statusBadges[selectedOrder.status] || 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
                                        {statusLabels[selectedOrder.status] || selectedOrder.status}
                                    </span>
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/[0.03]">
                                <span className="font-semibold text-zinc-500">Rujukan ID</span>
                                <span className="col-span-2 text-white font-mono text-xs">{selectedOrder.payment_id || '-'}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/[0.03]">
                                <span className="font-semibold text-zinc-500">Tarikh Tempahan</span>
                                <span className="col-span-2 text-white">
                                    {new Date(selectedOrder.created_at).toLocaleString('ms-MY', {
                                        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </span>
                            </div>

                            <div className="pt-2">
                                <span className="font-semibold text-zinc-500 block mb-1.5">Nota / Keperluan Khas Pelanggan</span>
                                <div className="p-4 bg-[#080808] border border-white/5 rounded-xl text-xs text-white whitespace-pre-wrap leading-relaxed min-h-[80px]">
                                    {selectedOrder.notes || 'Tiada nota tambahan disediakan.'}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold border border-white/5 transition-colors cursor-pointer"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
