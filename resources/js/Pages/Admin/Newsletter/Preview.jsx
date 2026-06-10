import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Monitor, Tablet, Smartphone, Download, Eye, Users, Send, AlertCircle, Calendar, AtSign, Check } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

const DEVICE_MODE_KEYS = [
    { key: 'desktop', icon: Monitor, labelKey: 'desktop' },
    { key: 'tablet', icon: Tablet, labelKey: 'tablet' },
    { key: 'mobile', icon: Smartphone, labelKey: 'mobile' },
];

const DEVICE_WIDTHS = { desktop: '100%', tablet: '640px', mobile: '375px' };

export default function Preview({ campaign, branding }) {
    const { t } = useTranslation();
    const [device, setDevice] = useState('desktop');

    const activeWidth = DEVICE_WIDTHS[device] || '100%';

    const emailHtml = `<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${campaign.subject}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background-color: #0c0c0e; font-family: 'Segoe UI', Arial, sans-serif; color: #e4e4e7; -webkit-font-smoothing: antialiased; }
        .wrapper { max-width: 640px; margin: 0 auto; background-color: #0c0c0e; }
        .header { background: linear-gradient(135deg, #111114 0%, #1a1a1e 100%); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 32px 40px; text-align: center; }
        .logo-badge { display: inline-block; background: linear-gradient(135deg, #ca8a04, #eab308); color: #080808; font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 14px; border-radius: 999px; margin-bottom: 12px; }
        .logo-name { font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.01em; }
        .logo-name span { color: #eab308; }
        .hero { background: linear-gradient(180deg, #111114 0%, #0c0c0e 100%); padding: 48px 40px 36px; border-bottom: 1px solid rgba(255,255,255,0.05); position: relative; overflow: hidden; }
        .hero h1 { font-size: 26px; font-weight: 800; color: #ffffff; line-height: 1.3; margin-bottom: 12px; }
        .hero h1 span { color: #eab308; }
        .body-content { padding: 36px 40px; border-bottom: 1px solid rgba(255,255,255,0.05); background-color: #0c0c0e; font-size: 15px; line-height: 1.75; color: #a1a1aa; }
        .body-content p { margin-bottom: 16px; }
        .body-content h2, .body-content h3 { color: #ffffff; margin: 24px 0 10px; }
        .body-content a { color: #eab308; text-decoration: none; }
        .body-content ul, .body-content ol { margin: 12px 0 12px 24px; }
        .body-content li { margin-bottom: 6px; }
        .divider { height: 1px; background: linear-gradient(to right, transparent, rgba(234,179,8,0.25), transparent); margin: 0 40px; }
        .footer { padding: 28px 40px; text-align: center; background-color: #080808; }
        .footer p { font-size: 12px; color: #52525b; line-height: 1.6; margin-bottom: 8px; }
        .footer a { color: #eab308; text-decoration: none; font-size: 12px; }
        .footer .unsubscribe { margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05); }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <div class="logo-badge">Newsletter</div>
            <div class="logo-name">Laman<span>Teknologi</span></div>
        </div>
        <div class="hero"><h1>${campaign.subject}</h1></div>
        <div class="body-content">${campaign.body}</div>
        <div class="divider"></div>
        <div class="footer">
            <p>E-mel ini dihantar kepada anda kerana anda telah melanggan newsletter kami.<br/><em>This email was sent to you because you subscribed to our newsletter.</em></p>
            <p><a href="${branding.site_url}">${branding.site_url}</a></p>
            <div class="unsubscribe"><p>Ingin berhenti melanggan? Hubungi kami di <a href="mailto:${branding.from_email}">${branding.from_email}</a></p></div>
        </div>
    </div>
</body>
</html>`;

    const handleDownload = () => {
        const blob = new Blob([emailHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `newsletter-${campaign.id}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <AdminLayout header={t('email_preview')}>
            <Head title={`${t('email_preview')}: ${campaign.subject} | Admin`} />

            <div className="space-y-6">
                <Link
                    href={route('admin.newsletter.index')}
                    className="text-zinc-500 hover:text-[var(--gold)] flex items-center gap-1.5 text-sm transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t('back_to_email_history')}
                </Link>

                <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5 bg-[#080808]/50">
                        <h2 className="text-sm font-bold text-white uppercase tracking-wide">{t('campaign_details')}</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                            <div className="flex items-start">
                                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 border border-white/5">
                                    <AtSign className="w-4 h-4 text-zinc-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">{t('subject_label')}</p>
                                    <p className="text-sm font-semibold text-white">{campaign.subject}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 border border-white/5">
                                    <Users className="w-4 h-4 text-zinc-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">{t('sent_by')}</p>
                                    <p className="text-sm font-semibold text-white">{campaign.creator?.name || '—'}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 border border-white/5">
                                    <Calendar className="w-4 h-4 text-zinc-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">{t('sent_date')}</p>
                                    <p className="text-sm font-semibold text-white">
                                        {campaign.sent_at ? new Date(campaign.sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 border border-white/5">
                                    <Send className="w-4 h-4 text-zinc-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">{t('recipients_label')}</p>
                                    <p className="text-sm font-semibold text-white">{campaign.recipient_count}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center mr-3 flex-shrink-0 border border-emerald-500/20">
                                    <Check className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">{t('sent_label')}</p>
                                    <p className="text-sm font-semibold text-emerald-400">{campaign.sent_count}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 border ${campaign.failed_count > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/5'}`}>
                                    <AlertCircle className={`w-4 h-4 ${campaign.failed_count > 0 ? 'text-red-400' : 'text-zinc-400'}`} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">{t('failed_label')}</p>
                                    <p className={`text-sm font-semibold ${campaign.failed_count > 0 ? 'text-red-400' : 'text-white'}`}>{campaign.failed_count}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5 bg-[#080808]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[var(--gold)]/10 flex items-center justify-center border border-[var(--gold)]/20">
                                <Eye className="w-4 h-4 text-[var(--gold)]" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-white">{t('email_preview')}</h2>
                                <p className="text-xs text-zinc-500">{t('email_preview_desc')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex bg-[#080808] border border-white/10 rounded-xl p-1">
                                {DEVICE_MODE_KEYS.map(d => (
                                    <button
                                        key={d.key}
                                        onClick={() => setDevice(d.key)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                            device === d.key
                                                ? 'bg-[var(--gold)] text-[#080808] shadow-sm'
                                                : 'text-zinc-500 hover:text-white'
                                        }`}
                                    >
                                        <d.icon className="w-3.5 h-3.5" />
                                        {t(d.labelKey)}
                                    </button>
                                ))}
                            </div>
                            <button onClick={handleDownload} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white/5 text-zinc-400 border border-white/10 hover:text-white hover:border-white/20 transition-colors">
                                <Download className="w-3.5 h-3.5" />
                                {t('download_html')}
                            </button>
                        </div>
                    </div>
                    <div className="p-6 flex justify-center bg-[#080808]">
                        <div
                            className="border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300"
                            style={{ width: activeWidth, maxWidth: '100%' }}
                        >
                            <iframe
                                srcDoc={emailHtml}
                                title={t('email_preview')}
                                className="w-full border-0 bg-white"
                                style={{ minHeight: '600px', height: '80vh' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
