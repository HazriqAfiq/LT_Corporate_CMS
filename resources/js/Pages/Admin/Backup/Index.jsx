import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Database, Download, RefreshCw, Clock, HardDrive, CheckCircle2, AlertCircle, Check, Loader2 } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

export default function BackupIndex({ backups, storageUsed, storageRaw, storageLimit, storagePct }) {
    const { t } = useTranslation();
    const [running, setRunning]           = useState(false);
    const [toast, setToast]               = useState(null);
    const [toastError, setToastError]     = useState(false);

    const showToast = (msg, isError = false) => {
        setToast(msg); setToastError(isError);
        setTimeout(() => setToast(null), 3000);
    };

    const handleRunBackup = async () => {
        setRunning(true);
        try {
            const res = await fetch(route('admin.backup.run'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    'Accept': 'application/json',
                },
            });
            const data = await res.json();
            if (data.success) {
                showToast(t('backup_success'));
                router.reload({ only: ['backups', 'storageUsed', 'storageRaw', 'storageLimit', 'storagePct'] });
            } else {
                showToast(data.message || t('backup_failed'), true);
            }
        } catch (e) {
            showToast(t('backup_failed'), true);
        } finally {
            setRunning(false);
        }
    };

    const storageUsedMB = (storageRaw / 1048576).toFixed(2);
    const storageLimitMB = (storageLimit / 1048576).toFixed(0);

    return (
        <AdminLayout header={t('backup_title')}>
            <Head title={`${t('backup_title')} | Admin`} />

            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium flex items-center gap-2 shadow-xl ${toastError ? 'bg-red-500' : 'bg-emerald-500'}`}>
                    {toastError ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />} {toast}
                </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <button
                    onClick={handleRunBackup}
                    disabled={running}
                    className="bg-[#0c0c0e] border border-[var(--gold)]/20 hover:border-[var(--gold)]/40 rounded-2xl p-6 flex flex-col items-center gap-3 transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <div className="w-12 h-12 rounded-2xl bg-[var(--gold)]/10 flex items-center justify-center group-hover:bg-[var(--gold)]/20 transition-colors">
                        {running ? <Loader2 className="w-6 h-6 text-[var(--gold)] animate-spin" /> : <Database className="w-6 h-6 text-[var(--gold)]" />}
                    </div>
                    <div className="text-center">
                        <p className="text-white font-bold text-sm">{running ? t('backup_running') : t('generate_backup_now')}</p>
                        <p className="text-zinc-500 text-xs mt-0.5">{t('create_manual_backup_desc')}</p>
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
                <div className="overflow-x-auto">
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
                                                href={route('admin.backup.download', b.name)}
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
            </div>
        </AdminLayout>
    );
}
