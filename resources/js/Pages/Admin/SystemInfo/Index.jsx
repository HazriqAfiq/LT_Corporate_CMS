import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Server, CheckCircle2, AlertCircle, HardDrive, Database, Cpu, Layers } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

export default function SystemInfoIndex() {
    const { t } = useTranslation();

    const info = [
        { label: t('system_info_php_version'),        value: '8.2.21',        icon: Cpu,      color: 'text-violet-400', bg: 'bg-violet-500/10' },
        { label: t('system_info_laravel_version'),    value: '11.44.0',        icon: Layers,   color: 'text-[var(--gold)]', bg: 'bg-[var(--gold)]/10' },
        { label: t('system_info_database'),   value: 'MySQL 8.0.36',   icon: Database, color: 'text-sky-400',    bg: 'bg-sky-500/10' },
        { label: t('system_info_web_server'),       value: 'Nginx 1.26.2',   icon: Server,   color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    ];

    const health = [
        { label: t('system_info_database'),         status: true,  detail: t('sys_health_db_ok') },
        { label: t('system_info_cache'),            status: true,  detail: t('sys_health_cache_ok') },
        { label: t('system_info_queue'),            status: true,  detail: t('sys_health_queue_ok') },
        { label: t('system_info_storage_writable'), status: true,  detail: t('sys_health_storage_ok') },
        { label: t('system_info_mail'),             status: false, detail: t('sys_health_mail_err') },
        { label: t('system_info_debug_mode'),       status: false, detail: t('sys_health_debug_ok') },
    ];

    const storageItems = [
        { label: t('media_uploads'),  used: 45.2, total: 500,  color: 'from-[var(--gold)] to-amber-500' },
        { label: t('system_info_database'),       used: 12.4, total: 100,  color: 'from-violet-500 to-purple-600' },
        { label: t('backup_files'),   used: 58.8, total: 1024, color: 'from-sky-500 to-blue-600' },
    ];

    return (
        <AdminLayout header={t('system_info_title')}>
            <Head title={`${t('system_info_title')} | Admin`} />

            {/* Version Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {info.map((item, i) => (
                    <div key={i} className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-5">
                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${item.bg} mb-4`}>
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <p className="text-zinc-500 text-xs tracking-wider uppercase mb-1">{item.label}</p>
                        <p className="text-white font-bold text-lg font-mono">{item.value}</p>
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
                        {health.map((h, i) => (
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
                        {storageItems.map((s, i) => {
                            const pct = ((s.used / s.total) * 100).toFixed(1);
                            return (
                                <div key={i}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <HardDrive className="w-4 h-4 text-zinc-500" />
                                            <span className="text-sm text-zinc-300 font-medium">{s.label}</span>
                                        </div>
                                        <span className="text-xs text-zinc-500 font-mono">{s.used} MB / {s.total} MB</span>
                                    </div>
                                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className={`h-full bg-gradient-to-r ${s.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                                    </div>
                                    <p className="text-zinc-600 text-xs mt-1">{t('x_percent_used', { pct: pct })}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Server Info Table */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5">
                    <h2 className="text-white font-bold text-sm">{t('server_information_title')}</h2>
                </div>
                <div className="p-4">
                    {[
                        [t('environment_label'), 'Production'],
                        [t('app_url_label'), 'https://lamanteknologi.com'],
                        [t('timezone_label'), 'Asia/Kuala_Lumpur (UTC+8)'],
                        [t('max_upload_size_label'), '10 MB'],
                        [t('max_execution_time_label'), '30s'],
                        [t('memory_limit_label'), '256 MB'],
                        [t('php_extensions_label'), 'PDO, GD, fileinfo, mbstring, openssl, tokenizer, xml, ctype, json'],
                    ].map(([k, v], i) => (
                        <div key={i} className="flex items-start justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.02] transition-colors border-b border-white/[0.03] last:border-0">
                            <span className="text-xs text-zinc-500 font-medium w-44 shrink-0">{k}</span>
                            <span className="text-xs text-zinc-300 font-mono text-right">{v}</span>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
