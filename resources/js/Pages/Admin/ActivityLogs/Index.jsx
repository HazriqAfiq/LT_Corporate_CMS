import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Activity, Search, Filter, LogIn, Edit, Trash, Upload, Settings } from 'lucide-react';

const TYPE_ICONS = {
    login:  { icon: LogIn,    color: 'text-sky-400',          bg: 'bg-sky-500/10' },
    update: { icon: Edit,     color: 'text-[var(--gold)]',    bg: 'bg-[var(--gold)]/10' },
    delete: { icon: Trash,    color: 'text-red-400',          bg: 'bg-red-500/10' },
    upload: { icon: Upload,   color: 'text-violet-400',       bg: 'bg-violet-500/10' },
    system: { icon: Settings, color: 'text-emerald-400',      bg: 'bg-emerald-500/10' },
};

const logs = [
    { id: 1, user: 'Ahmad Razif', action: 'Login ke sistem', type: 'login',  entity: 'Auth',      date: '2026-05-21 10:32:04' },
    { id: 2, user: 'Ahmad Razif', action: 'Update artikel "Penyelesaian AI 2026"', type: 'update', entity: 'Artikel', date: '2026-05-21 10:35:18' },
    { id: 3, user: 'Nurul Aisyah', action: 'Upload gambar produk', type: 'upload', entity: 'Media', date: '2026-05-21 09:58:42' },
    { id: 4, user: 'Ahmad Razif', action: 'Padam slider lama', type: 'delete', entity: 'Slider',  date: '2026-05-21 09:40:11' },
    { id: 5, user: 'Sistem', action: 'Auto backup berjaya', type: 'system', entity: 'Backup',     date: '2026-05-21 03:00:00' },
    { id: 6, user: 'Nurul Aisyah', action: 'Login ke sistem', type: 'login', entity: 'Auth',      date: '2026-05-20 16:22:55' },
    { id: 7, user: 'Muhammad Hafiz', action: 'Cipta halaman baharu "FAQ"', type: 'update', entity: 'Halaman', date: '2026-05-20 15:11:30' },
    { id: 8, user: 'Ahmad Razif', action: 'Update tetapan website', type: 'update', entity: 'Tetapan', date: '2026-05-20 14:05:00' },
];

const TYPE_LABELS = { login: 'Login', update: 'Update', delete: 'Padam', upload: 'Upload', system: 'Sistem' };

export default function ActivityLogsIndex() {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');

    const filtered = logs.filter(l => {
        const matchSearch = l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase());
        const matchType = filterType === 'all' || l.type === filterType;
        return matchSearch && matchType;
    });

    return (
        <AdminLayout header="Log Aktiviti">
            <Head title="Log Aktiviti | Admin" />

            {/* Dev Banner */}
            <div className="mb-6 flex items-center gap-3 px-5 py-3.5 bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-2xl">
                <Activity className="w-5 h-5 text-[var(--gold)] shrink-0" />
                <div>
                    <p className="text-[var(--gold)] font-semibold text-sm">Modul Dalam Pembangunan</p>
                    <p className="text-zinc-400 text-xs mt-0.5">Log di bawah adalah contoh. Backend logging akan dihubungkan kemudian.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h2 className="text-white font-bold text-sm">Log Aktiviti Sistem</h2>
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Type filter */}
                        <div className="flex items-center gap-1 bg-[#080808] border border-white/10 rounded-xl px-1 py-1">
                            {['all', 'login', 'update', 'delete', 'upload', 'system'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setFilterType(t)}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${filterType === t ? 'bg-[var(--gold)] text-[#080808]' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    {t === 'all' ? 'Semua' : TYPE_LABELS[t]}
                                </button>
                            ))}
                        </div>
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Cari log..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-[#080808] border border-white/10 text-white text-sm rounded-xl placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] w-48"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-3">Jenis</th>
                                <th className="px-6 py-3">Pengguna</th>
                                <th className="px-6 py-3">Tindakan</th>
                                <th className="px-6 py-3">Modul</th>
                                <th className="px-6 py-3 text-right">Tarikh & Masa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(log => {
                                const t = TYPE_ICONS[log.type];
                                return (
                                    <tr key={log.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-3.5">
                                            <div className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${t.bg}`}>
                                                <t.icon className={`w-3.5 h-3.5 ${t.color}`} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center shrink-0">
                                                    <span className="text-[var(--gold)] text-[9px] font-bold">{log.user.charAt(0)}</span>
                                                </div>
                                                <span className="text-sm text-white">{log.user}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5 text-sm text-zinc-300 max-w-xs truncate">{log.action}</td>
                                        <td className="px-6 py-3.5">
                                            <span className="inline-flex px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-zinc-400 font-medium">{log.entity}</span>
                                        </td>
                                        <td className="px-6 py-3.5 text-right text-xs text-zinc-500 font-mono">{log.date}</td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-zinc-600 text-sm">Tiada log ditemui.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
