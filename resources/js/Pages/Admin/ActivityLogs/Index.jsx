import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Activity, Search, LogIn, Edit, Trash, Upload, Settings,
    Plus, RefreshCw, ChevronLeft, ChevronRight, AlertTriangle
} from 'lucide-react';
import debounce from 'lodash/debounce';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';
import useTranslation from '@/Hooks/useTranslation';

const EVENT_ICONS = {
    login:  { icon: LogIn,    color: 'text-sky-400',       bg: 'bg-sky-500/10',    label: 'Log Masuk', label_en: 'Log In' },
    create: { icon: Plus,     color: 'text-emerald-400',   bg: 'bg-emerald-500/10', label: 'Cipta', label_en: 'Create' },
    update: { icon: Edit,     color: 'text-[var(--gold)]', bg: 'bg-[var(--gold)]/10', label: 'Kemaskini', label_en: 'Update' },
    delete: { icon: Trash,    color: 'text-red-400',       bg: 'bg-red-500/10',    label: 'Padam', label_en: 'Delete' },
    upload: { icon: Upload,   color: 'text-violet-400',    bg: 'bg-violet-500/10', label: 'Muat Naik', label_en: 'Upload' },
    system: { icon: Settings, color: 'text-emerald-400',   bg: 'bg-emerald-500/10', label: 'Sistem', label_en: 'System' },
};

const ALL_EVENTS = ['login', 'create', 'update', 'delete', 'upload'];

export default function ActivityLogsIndex({ logs, filters }) {
    const { t, lang } = useTranslation();
    const [search, setSearch]     = useState(filters.search || '');
    const [eventFilter, setEvent] = useState(filters.event || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo]     = useState(filters.date_to || '');
    const [showClearModal, setShowClearModal] = useState(false);

    const applyFilters = (overrides = {}) => {
        const params = {
            search: search,
            event:  eventFilter,
            date_from: dateFrom,
            date_to:   dateTo,
            ...overrides,
        };
        // Remove empty params
        Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
        router.get('/admin/activity-logs', params, { preserveState: true, replace: true });
    };

    const debouncedSearch = debounce((val) => applyFilters({ search: val }), 300);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value);
    };
    const onEventChange = (val) => {
        setEvent(val);
        applyFilters({ event: val });
    };
    const onDateChange = (field, val) => {
        if (field === 'from') {
            setDateFrom(val);
            applyFilters({ date_from: val });
        } else {
            setDateTo(val);
            applyFilters({ date_to: val });
        }
    };

    const confirmClear = () => {
        router.delete(route('admin.activity-logs.clear'), {
            onSuccess: () => setShowClearModal(false)
        });
    };

    const resetFilters = () => {
        setSearch(''); setEvent(''); setDateFrom(''); setDateTo('');
        router.get('/admin/activity-logs', {}, { preserveState: false, replace: true });
    };

    const hasActiveFilters = search || eventFilter || dateFrom || dateTo;

    return (
        <AdminLayout header={t('activity_logs_title')}>
            <Head title={`${t('activity_logs_title')} | Admin`} />

            {/* Main Card */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden">
                {/* Toolbar */}
                <div className="px-6 py-4 border-b border-white/5 flex flex-col gap-4">
                    {/* Row 1: title + clear */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[var(--gold)]/10 rounded-xl border border-[var(--gold)]/20">
                                <Activity className="w-4 h-4 text-[var(--gold)]" />
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-sm">{t('system_activity_logs')}</h2>
                                <p className="text-zinc-500 text-xs">
                                    {t('log_records_found', { count: logs.total })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {hasActiveFilters && (
                                <button
                                    onClick={resetFilters}
                                    className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition flex items-center gap-1.5"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    {t('reset_filters')}
                                </button>
                            )}
                            <button
                                onClick={() => setShowClearModal(true)}
                                className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 border border-red-900/20 hover:border-red-900/40 bg-red-950/20 hover:bg-red-950/40 rounded-lg transition flex items-center gap-1.5"
                            >
                                <Trash className="w-3.5 h-3.5" />
                                {t('clear_all_logs')}
                            </button>
                        </div>
                    </div>

                    {/* Row 2: filters */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder={t('search_logs_placeholder')}
                                value={search}
                                onChange={onSearchChange}
                                className="pl-9 pr-4 py-2 w-full bg-[#080808] border border-white/10 text-white text-sm rounded-xl placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
                            />
                        </div>

                        {/* Event type tabs */}
                        <div className="flex items-center gap-1 bg-[#080808] border border-white/10 rounded-xl px-1 py-1">
                            <button
                                onClick={() => onEventChange('')}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${!eventFilter ? 'bg-[var(--gold)] text-[#080808]' : 'text-zinc-500 hover:text-white'}`}
                            >
                                {t('all')}
                            </button>
                            {ALL_EVENTS.map(ev => (
                                <button
                                    key={ev}
                                    onClick={() => onEventChange(ev)}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${eventFilter === ev ? 'bg-[var(--gold)] text-[#080808]' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    {lang === 'en' ? (EVENT_ICONS[ev]?.label_en || ev) : (EVENT_ICONS[ev]?.label || ev)}
                                </button>
                            ))}
                        </div>

                        {/* Date range */}
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={e => onDateChange('from', e.target.value)}
                                className="px-3 py-2 bg-[#080808] border border-white/10 text-white text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--gold)] [color-scheme:dark]"
                            />
                            <span className="text-zinc-600 text-xs">—</span>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={e => onDateChange('to', e.target.value)}
                                className="px-3 py-2 bg-[#080808] border border-white/10 text-white text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--gold)] [color-scheme:dark]"
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-3">{t('type')}</th>
                                <th className="px-6 py-3">{t('user')}</th>
                                <th className="px-6 py-3">{t('action')}</th>
                                <th className="px-6 py-3">{t('module')}</th>
                                <th className="px-6 py-3 text-right">{t('date_time')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-zinc-600">
                                            <Activity className="w-10 h-10 text-zinc-800" />
                                            <p className="text-sm">{t('no_logs_found')}</p>
                                            {hasActiveFilters && (
                                                <button onClick={resetFilters} className="text-xs text-[var(--gold)] hover:underline">
                                                    {t('clear_filters')}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                logs.data.map(log => {
                                    const ev = EVENT_ICONS[log.event] || EVENT_ICONS['system'];
                                    const Icon = ev.icon;
                                    return (
                                        <tr key={log.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                                            {/* Event Icon */}
                                            <td className="px-6 py-3.5">
                                                <div className={`inline-flex items-center gap-2`}>
                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${ev.bg}`}>
                                                        <Icon className={`w-3.5 h-3.5 ${ev.color}`} />
                                                    </div>
                                                    <span className={`text-[10px] font-bold ${ev.color}`}>
                                                        {lang === 'en' ? (ev.label_en || ev.label) : (ev.label || ev.label_en)}
                                                    </span>
                                                </div>
                                            </td>
                                            {/* User */}
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center shrink-0">
                                                        <span className="text-[var(--gold)] text-[9px] font-bold">
                                                            {log.user_name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-white leading-tight">{log.user_name}</p>
                                                        {log.user_email && (
                                                            <p className="text-[10px] text-zinc-600">{log.user_email}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Description */}
                                            <td className="px-6 py-3.5 text-sm text-zinc-300 max-w-xs">
                                                <span className="line-clamp-2">{log.description}</span>
                                            </td>
                                            {/* Module/Subject */}
                                            <td className="px-6 py-3.5">
                                                {log.subject_type ? (
                                                    <span className="inline-flex px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-zinc-400 font-medium">
                                                        {log.subject_type}
                                                    </span>
                                                ) : (
                                                    <span className="text-zinc-600 text-xs">—</span>
                                                )}
                                            </td>
                                            {/* Date */}
                                            <td className="px-6 py-3.5 text-right">
                                                <p className="text-xs text-zinc-300 font-mono">{log.created_at}</p>
                                                <p className="text-[10px] text-zinc-600 mt-0.5">{log.created_at_human}</p>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {logs.links?.length > 3 && (
                    <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-[#080808]/20">
                        <p className="text-xs text-zinc-500">
                            {t('showing')} <span className="text-zinc-300 font-semibold">{logs.from}</span>–<span className="text-zinc-300 font-semibold">{logs.to}</span> {t('of_total')} <span className="text-zinc-300 font-semibold">{logs.total}</span> {t('records_unit')}
                        </p>
                        <div className="flex items-center gap-1">
                            {logs.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                        link.active
                                            ? 'bg-[var(--gold)] text-[#080808] border-[var(--gold)]'
                                            : !link.url
                                                ? 'text-zinc-700 border-transparent cursor-not-allowed'
                                                : 'bg-transparent text-zinc-400 border-white/10 hover:border-white/20'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Clear All Confirmation Modal */}
            <DeleteConfirmModal
                show={showClearModal}
                onClose={() => setShowClearModal(false)}
                onConfirm={confirmClear}
                title={t('clear_logs_confirm_title')}
                message={t('clear_logs_confirm_message')}
            />
        </AdminLayout>
    );
}
