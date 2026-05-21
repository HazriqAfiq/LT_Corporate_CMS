import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Mail, Search, Trash, Download, Users, TrendingUp, ArrowUpRight } from 'lucide-react';

const mockSubscribers = [
    { id: 1, name: 'Ahmad Razif', email: 'ahmad@example.com', date: '2026-05-20', status: 'Aktif' },
    { id: 2, name: 'Nurul Aisyah', email: 'nurul@example.com', date: '2026-05-18', status: 'Aktif' },
    { id: 3, name: 'Muhammad Hafiz', email: 'hafiz@example.com', date: '2026-05-15', status: 'Aktif' },
    { id: 4, name: 'Siti Aminah', email: 'siti@example.com', date: '2026-05-10', status: 'Tidak Aktif' },
    { id: 5, name: 'Rizwan Kamal', email: 'rizwan@example.com', date: '2026-05-05', status: 'Aktif' },
];

export default function NewsletterIndex() {
    const [search, setSearch] = useState('');
    const filtered = mockSubscribers.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout header="Newsletter">
            <Head title="Newsletter | Admin" />

            {/* Dev Banner */}
            <div className="mb-6 flex items-center gap-3 px-5 py-3.5 bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-2xl">
                <Mail className="w-5 h-5 text-[var(--gold)] shrink-0" />
                <div>
                    <p className="text-[var(--gold)] font-semibold text-sm">Modul Dalam Pembangunan</p>
                    <p className="text-zinc-400 text-xs mt-0.5">Data di bawah adalah contoh. Integrasi backend sedang disiapkan.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                    { icon: Users, label: 'Jumlah Subscriber', value: '1,284', color: 'text-[var(--gold)]', bg: 'bg-[var(--gold)]/10' },
                    { icon: TrendingUp, label: 'Subscriber Baru (Bulan Ini)', value: '+48', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { icon: Mail, label: 'Email Dihantar', value: '3,920', color: 'text-sky-400', bg: 'bg-sky-500/10' },
                ].map((s, i) => (
                    <div key={i} className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${s.bg}`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
                        <div>
                            <p className="text-zinc-500 text-xs tracking-wider uppercase">{s.label}</p>
                            <p className="text-2xl font-extrabold text-white">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h2 className="text-white font-bold text-sm">Senarai Subscriber</h2>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Cari subscriber..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-[#080808] border border-white/10 text-white text-sm rounded-xl placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] w-52"
                            />
                        </div>
                        <button className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--gold)] text-[#080808] font-bold text-sm rounded-xl hover:opacity-90 transition-all">
                            <Download className="w-4 h-4" /> Export
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-3">Nama</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Tarikh Daftar</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(sub => (
                                <tr key={sub.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center shrink-0">
                                                <span className="text-[var(--gold)] text-[10px] font-bold">{sub.name.charAt(0)}</span>
                                            </div>
                                            <span className="text-sm text-white font-medium">{sub.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5 text-sm text-zinc-400">{sub.email}</td>
                                    <td className="px-6 py-3.5 text-sm text-zinc-500 font-mono">{sub.date}</td>
                                    <td className="px-6 py-3.5">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${sub.status === 'Aktif' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-right">
                                        <button className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-zinc-600 text-sm">Tiada subscriber ditemui.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
