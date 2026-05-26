import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Mail, Search, Trash, Download, Users, TrendingUp } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

const mockSubscribers = [
    { id: 1, name: 'Ahmad Razif', email: 'ahmad@example.com', date: '2026-05-20', status: 'Aktif' },
    { id: 2, name: 'Nurul Aisyah', email: 'nurul@example.com', date: '2026-05-18', status: 'Aktif' },
    { id: 3, name: 'Muhammad Hafiz', email: 'hafiz@example.com', date: '2026-05-15', status: 'Aktif' },
    { id: 4, name: 'Siti Aminah', email: 'siti@example.com', date: '2026-05-10', status: 'Tidak Aktif' },
    { id: 5, name: 'Rizwan Kamal', email: 'rizwan@example.com', date: '2026-05-05', status: 'Aktif' },
];

export default function NewsletterIndex() {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');

    const filtered = mockSubscribers.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout header={t('newsletter_title')}>
            <Head title={`${t('newsletter_title')} | Admin`} />

            {/* Dev Banner */}
            <div className="mb-6 flex items-center gap-3 px-5 py-3.5 bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-2xl">
                <Mail className="w-5 h-5 text-[var(--gold)] shrink-0" />
                <div>
                    <p className="text-[var(--gold)] font-semibold text-sm">{t('module_in_development')}</p>
                    <p className="text-zinc-400 text-xs mt-0.5">{t('newsletter_dev_banner_desc')}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                    { icon: Users, label: t('total_subscribers'), value: '1,284', color: 'text-[var(--gold)]', bg: 'bg-[var(--gold)]/10' },
                    { icon: TrendingUp, label: t('new_subscribers_this_month'), value: '+48', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { icon: Mail, label: t('emails_sent'), value: '3,920', color: 'text-sky-400', bg: 'bg-sky-500/10' },
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
                    <h2 className="text-white font-bold text-sm">{t('subscriber_list')}</h2>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder={t('search_subscribers_placeholder')}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-[#080808] border border-white/10 text-white text-sm rounded-xl placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] w-52"
                            />
                        </div>
                        <button className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--gold)] text-[#080808] font-bold text-sm rounded-xl hover:opacity-90 transition-all">
                            <Download className="w-4 h-4" /> {t('export_label')}
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-3">{t('name')}</th>
                                <th className="px-6 py-3">{t('email_address')}</th>
                                <th className="px-6 py-3">{t('registration_date')}</th>
                                <th className="px-6 py-3">{t('status')}</th>
                                <th className="px-6 py-3 text-right">{t('action')}</th>
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
                                            {sub.status === 'Aktif' ? t('active') : t('inactive')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-right">
                                        <div className="flex items-center justify-end">
                                            <button 
                                                className="p-2 bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/60 rounded-lg transition-colors border border-red-900/20 inline-flex items-center justify-center"
                                                title={t('delete')}
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-zinc-600 text-sm">{t('no_subscribers_found')}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
