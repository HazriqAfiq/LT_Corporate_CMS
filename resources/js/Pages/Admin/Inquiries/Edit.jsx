import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Trash, User, Mail, Phone, Briefcase, Calendar, Copy, Check, Clock, Eye, Save } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';

export default function Edit({ inquiry }) {
    const { t } = useTranslation();
    const [emailCopied, setEmailCopied] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showTick, setShowTick] = useState(false);
    const [loading, setLoading] = useState(false);

    const parseUtcDate = (dateString) => {
        if (!dateString) return null;
        let str = dateString;
        if (str.includes(' ') && !str.includes('T')) {
            str = str.replace(' ', 'T');
        }
        if (!str.endsWith('Z') && !/[+-]\d{2}:?\d{2}$/.test(str)) {
            str += 'Z';
        }
        const d = new Date(str);
        return isNaN(d.getTime()) ? null : d;
    };

    const toLocalInputValue = (dateString) => {
        const date = parseUtcDate(dateString);
        if (!date) return '';
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        return localDate.toISOString().slice(0, 16);
    };

    const toUtcString = (localInputValue) => {
        if (!localInputValue) return null;
        const date = new Date(localInputValue);
        if (isNaN(date.getTime())) return null;
        return date.toISOString();
    };

    const { data, setData, processing, isDirty, setError, clearErrors } = useForm({
        is_read: !!inquiry.is_read,
        replied_at: toLocalInputValue(inquiry.replied_at),
        admin_notes: inquiry.admin_notes || '',
    });

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(inquiry.email);
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
    };

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        clearErrors();

        const payload = {
            ...data,
            replied_at: toUtcString(data.replied_at),
        };

        window.axios.post(route('admin.inquiries.update', inquiry.id), {
            ...payload,
            _method: 'PUT'
        })
            .then(() => {
                setShowTick(true);
                setTimeout(() => {
                    setShowTick(false);
                    router.visit(route('admin.inquiries.index'));
                }, 1500);
            })
            .catch(err => {
                setLoading(false);
                if (err.response?.status === 422) {
                    const formatted = {};
                    Object.keys(err.response.data.errors).forEach(k => formatted[k] = err.response.data.errors[k][0]);
                    setError(formatted);
                } else {
                    alert(t('save_error') || 'Ralat semasa menyimpan.');
                }
            });
    };

    return (
        <AdminLayout header={t('view_inquiry')}>
            <Head title={t('inquiry_from_dynamic', { name: inquiry.name })} />

            <div className="mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <Link
                        href={route('admin.inquiries.index')}
                        className="text-zinc-500 hover:text-[var(--gold)] flex items-center gap-1.5 text-sm transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('back_to_inquiries_list')}
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 space-y-6">

                        {/* Sender Info Card */}
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5 bg-[#080808]/50">
                                <h2 className="text-sm font-bold text-white uppercase tracking-wide">{t('sender_information')}</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                    <div className="flex items-start">
                                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 border border-white/5">
                                            <User className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">{t('full_name')}</p>
                                            <p className="text-sm font-semibold text-white">{inquiry.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 border border-white/5">
                                            <Mail className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">{t('email_address')}</p>
                                            <div className="flex items-center gap-2">
                                                <a href={`mailto:${inquiry.email}`} className="text-sm font-semibold text-[var(--gold)] hover:underline transition-colors">{inquiry.email}</a>
                                                <button
                                                    onClick={handleCopyEmail}
                                                    className={`p-1 rounded-md transition-colors ${emailCopied ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10'}`}
                                                    title={t('copy_email')}
                                                >
                                                    {emailCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 border border-white/5">
                                            <Phone className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">{t('phone_number')}</p>
                                            {inquiry.phone ? (
                                                <a href={`tel:${inquiry.phone}`} className="text-sm font-semibold text-white hover:text-[var(--gold)] transition-colors">{inquiry.phone}</a>
                                            ) : (
                                                <p className="text-sm font-semibold text-zinc-600">—</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 border border-white/5">
                                            <Briefcase className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">{t('company_name')}</p>
                                            <p className="text-sm font-semibold text-white">{inquiry.company || '—'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Message Card */}
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5 bg-[#080808]/50 flex justify-between items-center">
                                <h2 className="text-sm font-bold text-white uppercase tracking-wide">{t('inquiry_message')}</h2>
                                <div className="flex items-center text-xs text-zinc-500 font-medium">
                                    <Calendar className="w-4 h-4 mr-1.5" />
                                    {new Date(inquiry.created_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-base font-bold text-white mb-4 border-l-2 border-[var(--gold)] pl-3">{inquiry.subject}</h3>
                                <p className="whitespace-pre-wrap text-zinc-300 text-sm leading-relaxed bg-[#080808] p-4 rounded-xl border border-white/5">{inquiry.message}</p>
                            </div>
                        </div>

                    </div>

                    {/* Right Column */}
                    <div className="w-full lg:w-96 flex-shrink-0">
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden sticky top-24">
                            <div className="px-6 py-4 border-b border-white/5 bg-[#080808]/50">
                                <h2 className="text-sm font-bold text-white uppercase tracking-wide">{t('management_actions')}</h2>
                            </div>
                            <div className="p-6 space-y-6">

                                {/* Read Status */}
                                <div className="p-3.5 rounded-xl border border-white/5 bg-[#080808]">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t('status')}</span>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            {t('status_read')}
                                        </span>
                                    </div>
                                    {inquiry.is_read && (
                                        <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                                            <div className="flex items-center gap-2 text-xs">
                                                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                                                <span className="text-zinc-500">{t('read_at_label')}</span>
                                                <span className="text-zinc-300 font-medium">
                                                    {inquiry.read_at ? new Date(inquiry.read_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <Eye className="w-3.5 h-3.5 text-zinc-500" />
                                                <span className="text-zinc-500">{t('read_by_label')}</span>
                                                <span className="text-zinc-300 font-medium">{inquiry.reader?.name || '—'}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-1.5">{t('replied_date')}</label>
                                    <input
                                        type="datetime-local"
                                        value={data.replied_at}
                                        onChange={e => setData('replied_at', e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-[#080808] text-white px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] hover:border-white/20"
                                    />
                                    <p className="mt-1.5 text-[10px] text-zinc-500">{t('replied_date_hint')}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-1.5">{t('admin_notes')}</label>
                                    <textarea
                                        rows="5"
                                        value={data.admin_notes}
                                        onChange={e => setData('admin_notes', e.target.value)}
                                        placeholder={t('admin_notes_placeholder')}
                                        className="w-full rounded-lg border border-white/10 bg-[#080808] text-white px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] hover:border-white/20 placeholder-zinc-600"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fixed Bottom Bar */}
                <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-[#080808] border-t border-white/5 p-4 px-6 flex justify-between items-center z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
                    <div>
                        <button
                            type="button"
                            onClick={() => setDeleteTarget({ id: inquiry.id, name: inquiry.name })}
                            className="inline-flex items-center px-4 py-2 border border-red-500/20 rounded-lg text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                            <Trash className="h-4 w-4 mr-2" />
                            {t('delete')}
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.inquiries.index')}
                            className="inline-flex items-center px-5 py-2.5 border border-white/10 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/[0.02] transition-colors"
                        >
                            {t('back')}
                        </Link>
                        <button
                            type="button"
                            onClick={submit}
                            disabled={!isDirty || loading || showTick}
                            className={`inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gold)] ${
                                showTick
                                    ? 'btn-submit-success'
                                    : isDirty && !loading
                                        ? 'bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[#080808] cursor-pointer'
                                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-40'
                            }`}
                        >
                            {showTick ? (
                                <>
                                    <Check className="h-4 w-4 mr-2 animate-bounce text-black" />
                                    {t('saved_successfully')}
                                </>
                            ) : loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                                    {t('saving')}
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    {t('save_changes')}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="h-24"></div>

            <DeleteConfirmModal
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                url={deleteTarget ? `/admin/inquiries/${deleteTarget.id}` : null}
                title={t('delete_inquiry_confirm_title')}
                message={t('delete_inquiry_confirm_message', { name: deleteTarget?.name })}
            />
        </AdminLayout>
    );
}
