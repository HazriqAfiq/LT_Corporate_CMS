import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Database, Download, RefreshCw, Clock, HardDrive, CheckCircle2, AlertCircle, Check, Loader2 } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

export default function BackupIndex({ backups, storageUsed, storageRaw, storageLimit, storagePct }) {
    const { t } = useTranslation();
    const { csrf_token } = usePage().props;
    const [status, setStatus] = useState('idle'); // 'idle' | 'running' | 'success' | 'failed'
    const [errorMsg, setErrorMsg] = useState('');

    const handleRunBackup = async () => {
        setStatus('running');
        try {
            const res = await fetch(route('admin.backup.run', undefined, false), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrf_token,
                    'Accept': 'application/json',
                },
            });
            const data = await res.json();
            if (data.success) {
                setStatus('success');
                router.reload();
                setTimeout(() => setStatus('idle'), 4000);
            } else {
                setStatus('failed');
                setErrorMsg(data.message || t('backup_failed'));
                setTimeout(() => setStatus('idle'), 6000);
            }
        } catch (e) {
            setStatus('failed');
            setErrorMsg(t('backup_failed'));
            setTimeout(() => setStatus('idle'), 6000);
        }
    };

    const storageUsedMB = (storageRaw / 1048576).toFixed(2);
    const storageLimitMB = (storageLimit / 1048576).toFixed(0);

    return (
        <AdminLayout header={t('backup_title')}>
            <Head title={`${t('backup_title')} | Admin`} />

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <button
                    onClick={handleRunBackup}
                    disabled={status === 'running'}
                    className={`bg-[#0c0c0e] rounded-2xl p-6 flex flex-col items-center gap-3 transition-all duration-300 group disabled:cursor-not-allowed w-full text-center border ${
                        status === 'running'
                            ? 'border-[var(--gold)]/20 opacity-75'
                            : status === 'success'
                            ? 'border-emerald-500/30 bg-emerald-950/5 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                            : status === 'failed'
                            ? 'border-red-500/30 bg-red-950/5 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.05)]'
                            : 'border-[var(--gold)]/20 hover:border-[var(--gold)]/40 hover:bg-[#121215]'
                    }`}
                >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                        status === 'running'
                            ? 'bg-[var(--gold)]/10 text-[var(--gold)] animate-pulse'
                            : status === 'success'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : status === 'failed'
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-[var(--gold)]/10 text-[var(--gold)] group-hover:bg-[var(--gold)]/20'
                    }`}>
                        {status === 'running' && <Loader2 className="w-6 h-6 text-[var(--gold)] animate-spin" />}
                        {status === 'success' && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
                        {status === 'failed' && <AlertCircle className="w-6 h-6 text-red-400" />}
                        {status === 'idle' && <Database className="w-6 h-6 text-[var(--gold)]" />}
                    </div>
                    <div className="text-center">
                        <p className={`font-bold text-sm transition-colors duration-300 ${
                            status === 'success'
                                ? 'text-emerald-400'
                                : status === 'failed'
                                ? 'text-red-400'
                                : 'text-white'
                        }`}>
                            {status === 'running' && t('backup_running')}
                            {status === 'success' && t('backup_success')}
                            {status === 'failed' && (lang === 'en' ? 'Backup Failed' : 'Backup Gagal')}
                            {status === 'idle' && t('generate_backup_now')}
                        </p>
                        <p className={`text-xs mt-0.5 transition-colors duration-300 ${
                            status === 'success'
                                ? 'text-emerald-500/80'
                                : status === 'failed'
                                ? 'text-red-500/80'
                                : 'text-zinc-500'
                        }`}>
                            {status === 'failed' ? errorMsg : t('create_manual_backup_desc')}
                        </p>
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
                    <span className="text-zinc-400 text-xs">{storageUsed} / 1 GB</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[var(--gold)] to-amber-500 rounded-full" style={{ width: `${Math.min(storagePct, 100)}%` }} />
                </div>
                <p className="text-zinc-600 text-xs mt-2">{storagePct}% {t('of_storage_used')}</p>
            </div>

            {/* Backup History */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5">
                    <h2 className="text-white font-bold text-sm">{t('backup_history')}</h2>
                </div>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-3">{t('filename')}</th>
                                <th className="px-6 py-3">{t('size')}</th>
                                <th className="px-6 py-3">{t('date')}</th>
                                <th className="px-6 py-3 text-right">{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {backups.map((b, i) => (
                                <tr key={i} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-3.5 text-sm text-zinc-300 font-mono max-w-xs truncate">{b.name}</td>
                                    <td className="px-6 py-3.5 text-sm text-zinc-400">{b.size}</td>
                                    <td className="px-6 py-3.5 text-xs text-zinc-500 font-mono">{b.date}</td>
                                    <td className="px-6 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <a
                                                href={route('admin.backup.download', b.name, false)}
                                                className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-[var(--gold)] transition-colors"
                                            >
                                                <Download className="w-3.5 h-3.5" /> {t('download')}
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {backups.length === 0 && (
                                <tr><td colSpan="4" className="px-6 py-16 text-center text-zinc-500 text-sm">
                                    <Database className="w-10 h-10 mx-auto mb-3 text-zinc-700" />
                                    {t('no_backups_found')}
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-white/[0.04] p-4 space-y-4">
                    {backups.map((b, i) => (
                        <div key={i} className="p-4 bg-[#080808]/40 border border-white/5 rounded-2xl flex flex-col gap-3.5 hover:border-[var(--gold)]/20 transition-all duration-300">
                            <div>
                                <p className="text-xs text-zinc-500 font-medium tracking-wider uppercase mb-1">{t('filename')}:</p>
                                <p className="text-sm text-zinc-300 font-mono break-all">{b.name}</p>
                            </div>
                            
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{t('size')}</p>
                                        <p className="text-xs text-zinc-300 font-semibold mt-0.5">{b.size}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{t('date')}</p>
                                        <p className="text-xs text-zinc-300 mt-0.5 font-mono">{b.date}</p>
                                    </div>
                                </div>
                                
                                <a
                                    href={route('admin.backup.download', b.name, false)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-xl transition-colors border border-white/5 text-xs font-semibold"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    {t('download')}
                                </a>
                            </div>
                        </div>
                    ))}
                    {backups.length === 0 && (
                        <div className="py-12 text-center text-zinc-500 text-sm">
                            <Database className="w-10 h-10 mx-auto mb-3 text-zinc-700" />
                            {t('no_backups_found')}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
