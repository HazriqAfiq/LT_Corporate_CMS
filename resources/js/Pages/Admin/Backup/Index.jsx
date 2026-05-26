import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Database, Download, RefreshCw, Clock, HardDrive, CheckCircle2, AlertCircle } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

const history = [
    { name: 'backup_2026-05-21_030000.sql.gz', size: '12.4 MB', date: '2026-05-21 03:00:00', type: 'Auto', status: 'success' },
    { name: 'backup_2026-05-20_030000.sql.gz', size: '12.1 MB', date: '2026-05-20 03:00:00', type: 'Auto', status: 'success' },
    { name: 'backup_2026-05-19_manual.sql.gz',  size: '11.9 MB', date: '2026-05-19 14:22:11', type: 'Manual', status: 'success' },
    { name: 'backup_2026-05-18_030000.sql.gz', size: '11.8 MB', date: '2026-05-18 03:00:00', type: 'Auto', status: 'success' },
    { name: 'backup_2026-05-17_030000.sql.gz', size: '11.7 MB', date: '2026-05-17 03:00:00', type: 'Auto', status: 'failed' },
];

export default function BackupIndex() {
    const { t } = useTranslation();

    return (
        <AdminLayout header={t('backup_title')}>
            <Head title={`${t('backup_title')} | Admin`} />

            {/* Dev Banner */}
            <div className="mb-6 flex items-center gap-3 px-5 py-3.5 bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-2xl">
                <Database className="w-5 h-5 text-[var(--gold)] shrink-0" />
                <div>
                    <p className="text-[var(--gold)] font-semibold text-sm">{t('module_in_development')}</p>
                    <p className="text-zinc-400 text-xs mt-0.5">{t('backup_dev_banner_desc')}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <button className="bg-[#0c0c0e] border border-[var(--gold)]/20 hover:border-[var(--gold)]/40 rounded-2xl p-6 flex flex-col items-center gap-3 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--gold)]/10 flex items-center justify-center group-hover:bg-[var(--gold)]/20 transition-colors">
                        <Database className="w-6 h-6 text-[var(--gold)]" />
                    </div>
                    <div className="text-center">
                        <p className="text-white font-bold text-sm">{t('generate_backup_now')}</p>
                        <p className="text-zinc-500 text-xs mt-0.5">{t('create_manual_backup_desc')}</p>
                    </div>
                </button>
                <button className="bg-[#0c0c0e] border border-violet-500/20 hover:border-violet-500/40 rounded-2xl p-6 flex flex-col items-center gap-3 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                        <RefreshCw className="w-6 h-6 text-violet-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-white font-bold text-sm">{t('restore_backup')}</p>
                        <p className="text-zinc-500 text-xs mt-0.5">{t('restore_backup_desc')}</p>
                    </div>
                </button>
                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-sky-400" />
                        <p className="text-white font-bold text-sm">{t('auto_backup')}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400 text-xs">{t('schedule_label')}</span>
                        <span className="text-white text-xs font-mono">{t('every_day_0300')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400 text-xs">{t('backups_retained')}</span>
                        <span className="text-white text-xs font-mono">{t('14_days')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400 text-xs">{t('status')}</span>
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {t('active')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Storage */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-zinc-400" />
                        <h2 className="text-white font-bold text-sm">{t('storage_usage')}</h2>
                    </div>
                    <span className="text-zinc-400 text-xs">58.8 MB / 1 GB</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[var(--gold)] to-amber-500 rounded-full" style={{ width: '5.88%' }} />
                </div>
                <p className="text-zinc-600 text-xs mt-2">{t('x_of_storage_limit', { pct: '5.88%' })}</p>
            </div>

            {/* History table */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5">
                    <h2 className="text-white font-bold text-sm">{t('backup_history')}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-3">{t('filename')}</th>
                                <th className="px-6 py-3">{t('size')}</th>
                                <th className="px-6 py-3">{t('role')}</th>
                                <th className="px-6 py-3">{t('date')}</th>
                                <th className="px-6 py-3">{t('status')}</th>
                                <th className="px-6 py-3 text-right">{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((b, i) => (
                                <tr key={i} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-3.5 text-sm text-zinc-300 font-mono">{b.name}</td>
                                    <td className="px-6 py-3.5 text-sm text-zinc-400">{b.size}</td>
                                    <td className="px-6 py-3.5">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${b.type === 'Manual' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' : 'bg-sky-500/10 text-sky-400 border-sky-500/20'}`}>
                                            {b.type === 'Manual' ? t('manual') : t('auto')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-xs text-zinc-500 font-mono">{b.date}</td>
                                    <td className="px-6 py-3.5">
                                        {b.status === 'success'
                                            ? <div className="flex items-center gap-1.5 text-emerald-400 text-xs"><CheckCircle2 className="w-3.5 h-3.5" /> {t('success')}</div>
                                            : <div className="flex items-center gap-1.5 text-red-400 text-xs"><AlertCircle className="w-3.5 h-3.5" /> {t('failed')}</div>}
                                    </td>
                                    <td className="px-6 py-3.5 text-right">
                                        <button className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-[var(--gold)] transition-colors">
                                            <Download className="w-3.5 h-3.5" /> {t('download')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
