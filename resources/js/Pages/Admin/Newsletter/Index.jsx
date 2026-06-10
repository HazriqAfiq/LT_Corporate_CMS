import React, { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Mail, Search, Trash, Download, Users, TrendingUp,
    Check, Send, Loader2, AlertCircle, Eye
} from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import debounce from 'lodash/debounce';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';
import SendConfirmModal from '@/Components/Admin/SendConfirmModal';
import RichTextEditor from '@/Components/Admin/RichTextEditor';

export default function NewsletterIndex({ subscribers, filters, stats, campaigns }) {
    const { t } = useTranslation();

    // List state
    const [search, setSearch]               = useState(filters.search || '');
    const [statusFilter, setStatusFilter]   = useState(filters.is_active || '');
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [toast, setToast]                 = useState(null);
    const [list, setList]                 = useState(subscribers.data);

    useEffect(() => {
        setList(subscribers.data);
    }, [subscribers.data]);

    // Compose state
    const [subject, setSubject]             = useState('');
    const [body, setBody]                   = useState('');
    const [sending, setSending]             = useState(false);
    const [sendResult, setSendResult]       = useState(null); // { success, sent, failed, message }
    const [showSendModal, setShowSendModal] = useState(false);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    /* ── List helpers ── */
    const fetchList = (searchVal, statusVal) => {
        const query = {};
        if (searchVal) query.search = searchVal;
        if (statusVal !== '') query.is_active = statusVal;
        router.get(route('admin.newsletter.index'), query, { preserveState: true, replace: true });
    };

    const handleSearch  = debounce((val, status) => fetchList(val, status), 300);
    const onSearchChange = (e) => { setSearch(e.target.value); handleSearch(e.target.value, statusFilter); };
    const onStatusChange = (e) => { setStatusFilter(e.target.value); fetchList(search, e.target.value); };

    const handleDelete  = (id) => setDeleteTargetId(id);
    const confirmDelete = () => {
        if (deleteTargetId) {
            router.delete(route('admin.newsletter.destroy', deleteTargetId), {
                onSuccess: () => { setDeleteTargetId(null); showToast(t('subscriber_deleted')); }
            });
        }
    };

    const handleToggle = async (sub) => {
        const originalStatus = sub.is_active;
        setList(prev => prev.map(item => item.id === sub.id ? { ...item, is_active: !item.is_active } : item));

        try {
            const res = await fetch(route('admin.newsletter.toggle', sub.id), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    'Accept': 'application/json',
                },
            });
            if (res.ok) {
                router.reload({ only: ['subscribers', 'stats'] });
                showToast(!originalStatus ? t('subscriber_activated') : t('subscriber_deactivated'));
            } else {
                setList(prev => prev.map(item => item.id === sub.id ? { ...item, is_active: originalStatus } : item));
                showToast(t('error_occurred'));
            }
        } catch (e) {
            setList(prev => prev.map(item => item.id === sub.id ? { ...item, is_active: originalStatus } : item));
            showToast('Ralat berlaku');
        }
    };

    /* ── Send campaign ── */
    const handleSendTrigger = (e) => {
        e.preventDefault();
        const cleanBody = body.replace(/<p><br><\/p>|<br>/g, '').trim();
        if (!subject.trim() || !cleanBody) return;
        setShowSendModal(true);
    };

    const handleConfirmSend = async () => {
        setSending(true);
        setSendResult(null);
        try {
            const res = await fetch(route('admin.newsletter.send'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({ subject, body }),
            });
            const data = await res.json();
            setSendResult(data);
            if (data.success) {
                setSubject('');
                setBody('');
                setTimeout(() => router.reload(), 500);
            }
            setSending(false);
            return data;
        } catch (e) {
            setSending(false);
            const errResult = { success: false, message: t('newsletter_send_error') };
            setSendResult(errResult);
            return errResult;
        }
    };

    return (
        <AdminLayout header={t('newsletter_title')}>
            <Head title={`${t('newsletter_title')} | Admin`} />

            {/* Toast */}
            {toast && (
                <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl bg-emerald-500 text-white text-sm font-medium flex items-center gap-2 shadow-xl">
                    <Check className="w-4 h-4" /> {toast}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                    { icon: Users,      label: t('total_subscribers'),          value: stats.total,           color: 'text-[var(--gold)]',  bg: 'bg-[var(--gold)]/10' },
                    { icon: TrendingUp, label: t('new_subscribers_this_month'), value: '+' + stats.this_month, color: 'text-emerald-400',    bg: 'bg-emerald-500/10' },
                    { icon: Mail,       label: t('active_subscribers'),         value: stats.active,          color: 'text-sky-400',        bg: 'bg-sky-500/10' },
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

            {/* ── Compose & Send Panel ── */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--gold)]/10">
                        <Send className="w-4 h-4 text-[var(--gold)]" />
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-sm">{t('newsletter_compose_title')}</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">
                            {t('newsletter_compose_desc', { count: stats.active })}
                        </p>
                    </div>
                </div>
                <form onSubmit={handleSendTrigger} className="p-6 space-y-4">
                    {/* Subject */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                            {t('newsletter_subject_label')}
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            placeholder={t('newsletter_subject_label') + '...'}
                            required
                            className="w-full px-4 py-3 bg-[#080808] border border-white/10 text-white text-sm rounded-xl placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-all"
                        />
                    </div>

                    {/* Body */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                            {t('newsletter_body_label')}
                        </label>
                        <RichTextEditor
                            value={body}
                            onChange={setBody}
                            placeholder={t('newsletter_body_placeholder')}
                            collection="newsletter"
                        />
                        <p className="text-zinc-600 text-xs mt-2">{t('newsletter_body_hint')}</p>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={sending || !subject.trim() || !body.replace(/<p><br><\/p>|<br>/g, '').trim() || stats.active === 0}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--gold)] text-[#080808] font-bold text-sm rounded-xl hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[var(--gold)]/10"
                        >
                            {sending ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> {t('newsletter_sending')}</>
                            ) : (
                                <><Send className="w-4 h-4" /> {t('newsletter_send_btn').replace(':count', stats.active)}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* ── Subscriber Table ── */}
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
                                onChange={onSearchChange}
                                className="pl-9 pr-4 py-2 bg-[#080808] border border-white/10 text-white text-sm rounded-xl placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] w-52"
                            />
                        </div>
                        <div className="flex bg-[#080808] p-1 rounded-xl border border-white/10 flex-wrap gap-1">
                            {[
                                { key: '', label: t('all_status') },
                                { key: 'true', label: t('active') },
                                { key: 'false', label: t('inactive') }
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => {
                                        setStatusFilter(tab.key);
                                        fetchList(search, tab.key);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                        statusFilter === tab.key
                                            ? 'bg-zinc-800 text-white shadow-sm border border-white/5'
                                            : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <a
                            href={route('admin.newsletter.export')}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--gold)] text-[#080808] font-bold text-sm rounded-xl hover:opacity-90 transition-all"
                        >
                            <Download className="w-4 h-4" /> {t('export_label')}
                        </a>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-3">{t('name')}</th>
                                <th className="px-6 py-3">{t('email_address')}</th>
                                <th className="px-6 py-3">{t('registration_date')}</th>
                                <th className="px-6 py-3 text-center">{t('status')}</th>
                                <th className="px-6 py-3 text-right">{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map(sub => (
                                <tr key={sub.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center shrink-0">
                                                <span className="text-[var(--gold)] text-[10px] font-bold">{(sub.name || sub.email).charAt(0).toUpperCase()}</span>
                                            </div>
                                            <span className="text-sm text-white font-medium">{sub.name || '—'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5 text-sm text-zinc-400">{sub.email}</td>
                                    <td className="px-6 py-3.5 text-sm text-zinc-500 font-mono">{sub.created_at?.split('T')[0] ?? '—'}</td>
                                    <td className="px-6 py-3.5 text-center">
                                        <label className="relative inline-flex items-center select-none cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={sub.is_active}
                                                onChange={() => handleToggle(sub)}
                                                className="sr-only peer"
                                            />
                                            <div className="switch-toggle-track toggle-gold"></div>
                                        </label>
                                    </td>
                                    <td className="px-6 py-3.5 text-right">
                                        <button
                                            onClick={() => handleDelete(sub.id)}
                                            className="p-2 bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/60 rounded-lg transition-colors border border-red-900/20"
                                            title={t('delete')}
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {list.length === 0 && (
                                <tr><td colSpan="5" className="px-6 py-16 text-center text-zinc-500 text-sm">{t('no_subscribers_found')}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {subscribers.links?.length > 3 && (
                    <div className="px-6 py-4 border-t border-white/5 flex flex-wrap gap-1">
                        {subscribers.links.map((link, idx) => (
                            <button
                                key={idx}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                disabled={!link.url}
                                className={`px-3 py-1 rounded-lg text-sm ${link.active ? 'bg-[var(--gold)] text-[#080808] font-bold' : !link.url ? 'text-zinc-700 cursor-not-allowed' : 'bg-[#080808] text-zinc-300 border border-white/10 hover:border-[var(--gold)]/30'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Campaign History ── */}
            {campaigns && campaigns.length > 0 && (
                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden mt-6">
                    <div className="px-6 py-4 border-b border-white/5">
                        <h2 className="text-white font-bold text-sm">{t('send_history')}</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">{t('send_history_desc')}</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                    <th className="px-6 py-3">{t('subject_label')}</th>
                                    <th className="px-6 py-3">{t('sent_date')}</th>
                                    <th className="px-6 py-3 text-center">{t('recipients_label')}</th>
                                    <th className="px-6 py-3 text-center">{t('sent_label')}</th>
                                    <th className="px-6 py-3 text-center">{t('failed_label')}</th>
                                    <th className="px-6 py-3">{t('sent_by')}</th>
                                    <th className="px-6 py-3 text-right">{t('action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaigns.map(c => (
                                    <tr key={c.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-3.5">
                                            <span className="text-sm text-white font-medium">{c.subject}</span>
                                        </td>
                                        <td className="px-6 py-3.5 text-sm text-zinc-400 font-mono">
                                            {c.sent_at ? new Date(c.sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                                        </td>
                                        <td className="px-6 py-3.5 text-center text-sm text-zinc-400">{c.recipient_count}</td>
                                        <td className="px-6 py-3.5 text-center">
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                                <Check className="w-3 h-3" />{c.sent_count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5 text-center">
                                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${c.failed_count > 0 ? 'text-red-400 bg-red-500/10' : 'text-zinc-500 bg-white/5'}`}>
                                                {c.failed_count > 0 ? <AlertCircle className="w-3 h-3" /> : <Check className="w-3 h-3" />}{c.failed_count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5 text-sm text-zinc-500">{c.creator?.name || '—'}</td>
                                        <td className="px-6 py-3.5 text-right">
                                            <Link
                                                href={route('admin.newsletter.history.show', c.id)}
                                                className="p-2 bg-zinc-800 text-zinc-300 hover:text-[var(--gold)] hover:bg-zinc-700/60 rounded-lg transition-colors border border-white/5 inline-flex items-center justify-center"
                                                title={t('view_email')}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <DeleteConfirmModal
                show={!!deleteTargetId}
                onClose={() => setDeleteTargetId(null)}
                url={deleteTargetId ? route('admin.newsletter.destroy', deleteTargetId) : null}
                title={t('newsletter_delete_confirm_title')}
                message={t('newsletter_delete_confirm_message')}
            />

            <SendConfirmModal
                show={showSendModal}
                onClose={() => setShowSendModal(false)}
                onConfirm={handleConfirmSend}
                title={t('newsletter_compose_title')}
                message={t('newsletter_send_confirm').replace(':count', stats.active)}
                processing={sending}
            />
        </AdminLayout>
    );
}
