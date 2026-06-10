import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Server, CheckCircle2, AlertCircle, HardDrive, Database, Cpu, Layers, RefreshCw } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { router } from '@inertiajs/react';

export default function SystemInfoIndex({ systemInfo }) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = React.useState(false);
    const { php_version, laravel_version, db_version, web_server, health, storage, server } = systemInfo;

    const handleRefresh = () => {
        setIsLoading(true);
        router.reload({
            onFinish: () => setIsLoading(false)
        });
    };

    const versionCards = [
        { label: t('system_info_php_version'),     value: php_version,     icon: Cpu,      color: 'text-violet-400', bg: 'bg-violet-500/10' },
        { label: t('system_info_laravel_version'), value: laravel_version, icon: Layers,   color: 'text-[var(--gold)]', bg: 'bg-[var(--gold)]/10' },
        { label: t('system_info_database'),        value: db_version,      icon: Database, color: 'text-sky-400',    bg: 'bg-sky-500/10' },
        { label: t('system_info_web_server'),      value: web_server,      icon: Server,   color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    ];

    const healthItems = [
        { label: t('system_info_database'),         status: health.database.status,  detail: health.database.detail },
        { label: t('system_info_cache'),            status: health.cache.status,     detail: health.cache.detail },
        { label: t('system_info_storage_writable'), status: health.storage.status,   detail: health.storage.detail },
        { label: t('system_info_debug_mode'),       status: health.debug,            detail: health.debug ? t('sys_health_debug_ok') : 'APP_DEBUG = true (not production safe)' },
        { label: t('system_info_mail'),             status: health.mail,             detail: health.mail ? t('sys_health_mail_ok') : t('sys_health_mail_err') },
        { label: t('system_info_queue'),            status: true,                    detail: health.queue },
    ];

    const serverRows = [
        [t('environment_label'),       server.environment],
        [t('app_url_label'),           server.app_url],
        [t('timezone_label'),          server.timezone],
        [t('max_upload_size_label'),   server.max_upload],
        [t('max_execution_time_label'),server.max_exec_time],
        [t('memory_limit_label'),      server.memory_limit],
        [t('php_extensions_label'),    server.php_extensions],
        ['OS',                         server.os],
    ];

    return (
        <AdminLayout header={t('system_info_title')}>
            <Head title={`${t('system_info_title')} | Admin`} />

            {/* Refresh Button */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="btn-system-refresh"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[var(--gold)]' : ''}`} /> {t('refresh_system_info')}
                </button>
            </div>

            {/* Version Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {versionCards.map((item, i) => (
                    <div key={i} className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-5">
                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${item.bg} mb-4`}>
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <p className="text-zinc-500 text-xs tracking-wider uppercase mb-1">{item.label}</p>
                        <p className="text-white font-bold text-lg font-mono break-all">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Health + Storage */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                {/* System Health */}
                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5">
                        <h2 className="text-white font-bold text-sm">{t('system_health_status')}</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">{t('system_health_desc')}</p>
                    </div>
                    <div className="p-4 space-y-2">
                        {healthItems.map((h, i) => (
                            <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-3">
                                    {h.status
                                        ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        : <AlertCircle  className="w-4 h-4 text-red-400 shrink-0" />}
                                    <span className="text-sm text-white font-medium">{h.label}</span>
                                </div>
                                <span className="text-xs text-zinc-500">{h.detail}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Storage Usage */}
                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5">
                        <h2 className="text-white font-bold text-sm">{t('storage_usage')}</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">{t('device_breakdown_desc')}</p>
                    </div>
                    <div className="p-6 space-y-6">
                        {storage.items.map((s, i) => {
                            // Show bar relative to 500 MB for visual context
                            const maxBytes = 500 * 1024 * 1024;
                            const pct = Math.min((s.bytes / maxBytes) * 100, 100).toFixed(1);
                            return (
                                <div key={i}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <HardDrive className="w-4 h-4 text-zinc-500" />
                                            <span className="text-sm text-zinc-300 font-medium">{s.label}</span>
                                        </div>
                                        <span className="text-xs text-zinc-500 font-mono">{s.used}</span>
                                    </div>
                                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className={`h-full bg-gradient-to-r ${s.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}

                        {/* Disk total */}
                        <div className="pt-2 border-t border-white/5">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-zinc-500">Total Disk Used / Available</span>
                                <span className="text-xs text-zinc-300 font-mono">{storage.disk_used} / {storage.disk_total}</span>
                            </div>
                            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-2">
                                <div className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full" style={{ width: `${Math.min(storage.disk_pct, 100)}%` }} />
                            </div>
                            <p className="text-zinc-600 text-xs mt-1">{storage.disk_pct}% {t('x_percent_used', { pct: '' }).replace(':pct%', '').trim()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Server Info Table */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5">
                    <h2 className="text-white font-bold text-sm">{t('server_information_title')}</h2>
                </div>
                <div className="p-4">
                    {serverRows.map(([k, v], i) => (
                        <div key={i} className="flex items-start justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.02] transition-colors border-b border-white/[0.03] last:border-0">
                            <span className="text-xs text-zinc-500 font-medium w-44 shrink-0">{k}</span>
                            <span className="text-xs text-zinc-300 font-mono text-right break-all">{v}</span>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
