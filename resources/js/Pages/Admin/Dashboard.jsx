import React, { useMemo, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import { FileText, Briefcase, MessageSquare, Activity, Image as ImageIcon, Users, Package, TrendingUp, Eye, ArrowUpRight } from 'lucide-react';

const DashboardCharts = React.lazy(() => import('@/Components/Admin/DashboardCharts'));

function DashboardChartsSkeleton() {
    return (
        <div className="animate-pulse">
            {/* Charts Row 1: Line + Pie */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                {/* Line Chart Skeleton */}
                <div className="xl:col-span-2 bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 h-[362px] flex flex-col justify-between">
                    <div>
                        <div className="h-5 bg-zinc-800 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-zinc-800 rounded w-1/3"></div>
                    </div>
                    <div className="h-[260px] bg-zinc-900/40 rounded-xl mt-4 flex items-end p-4 gap-4">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="bg-zinc-800/60 rounded-t w-full" style={{ height: `${20 + (i % 3) * 20}%` }} />
                        ))}
                    </div>
                </div>

                {/* Pie Chart Skeleton */}
                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 h-[362px] flex flex-col justify-between">
                    <div>
                        <div className="h-5 bg-zinc-800 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
                    </div>
                    <div className="h-[180px] w-[180px] rounded-full border-[15px] border-zinc-800/60 mx-auto my-4 animate-spin-slow"></div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                                <div className="h-3 bg-zinc-800 rounded w-12" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bar Chart Skeleton */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 mb-6 h-[308px] flex flex-col justify-between">
                <div>
                    <div className="h-5 bg-zinc-800 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-zinc-800 rounded w-1/3"></div>
                </div>
                <div className="h-[220px] bg-zinc-900/40 rounded-xl mt-4 flex items-end p-4 gap-4">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="bg-zinc-800/60 rounded-t w-full" style={{ height: `${30 + (i % 4) * 15}%` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Translate Activity helper
const translateActivity = (description, lang) => {
    if (lang !== 'en') return description;

    const moduleMap = {
        'Artikel': 'Article',
        'Projek': 'Project',
        'Produk': 'Product',
        'Pertanyaan (Contact)': 'Contact Inquiry',
        'Team Member': 'Team Member',
        'Slider': 'Slider',
        'Tetapan': 'Setting',
        'SEO': 'SEO',
        'Media': 'Media',
        'Role': 'Role'
    };

    let match = description.match(/^Tambah (.+) baharu: "(.+)"$/);
    if (match) {
        const mod = moduleMap[match[1]] || match[1];
        return `Added new ${mod}: "${match[2]}"`;
    }

    match = description.match(/^Kemaskini (.+): "(.+)"$/);
    if (match) {
        const mod = moduleMap[match[1]] || match[1];
        return `Updated ${mod}: "${match[2]}"`;
    }

    match = description.match(/^Padam (.+): "(.+)"$/);
    if (match) {
        const mod = moduleMap[match[1]] || match[1];
        return `Deleted ${mod}: "${match[2]}"`;
    }

    match = description.match(/^Muat naik fail: "(.+)"$/);
    if (match) {
        return `Uploaded file: "${match[1]}"`;
    }

    match = description.match(/^Log masuk ke sistem: (.+)$/);
    if (match) {
        return `Logged in to system: ${match[1]}`;
    }

    if (description === 'Ditandai sebagai telah dibaca.') {
        return 'Marked as read.';
    }

    return description;
};

// ── Stat Card
function StatCard({ icon: Icon, label, value, iconBg, iconColor, trend }) {
    return (
        <div className="relative bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 overflow-hidden group hover:border-[var(--gold)]/20 transition-all duration-300">
            {/* background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${iconBg} ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend !== undefined && (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
                        <ArrowUpRight className="w-3 h-3" />
                        {trend}%
                    </div>
                )}
            </div>
            <p className="text-zinc-500 text-xs font-medium tracking-wider uppercase mb-1">{label}</p>
            <p className="text-3xl font-extrabold text-white">{value ?? 0}</p>
        </div>
    );
}

export default function Dashboard({ stats = {}, recent_articles = [], recent_activities = [], recent_inquiries = [], chart_data = {} }) {
    const { t, lang } = useTranslation();

    return (
        <AdminLayout header={t('dashboard')}>
            <Head title={t('dashboard')} />

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <StatCard icon={FileText}     label={t('total_articles')}   value={stats.articles}  iconBg="bg-[var(--gold)]/10"   iconColor="text-[var(--gold)]"  trend={12} />
                <StatCard icon={Briefcase}    label={t('total_portfolio')} value={stats.projects}  iconBg="bg-violet-500/10"      iconColor="text-violet-400"     trend={8}  />
                <StatCard icon={Package}      label={t('total_products')}    value={stats.products}  iconBg="bg-sky-500/10"         iconColor="text-sky-400"        trend={5}  />
                <StatCard icon={MessageSquare} label={t('new_inquiries')}   value={stats.inquiries} iconBg="bg-emerald-500/10"     iconColor="text-emerald-400"    trend={22} />
            </div>

            {/* ── Dynamic Charts (Lazy Loaded) ── */}
            <Suspense fallback={<DashboardChartsSkeleton />}>
                <DashboardCharts stats={stats} chart_data={chart_data} />
            </Suspense>

            {/* ── Data Tables Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Recent Activity */}
                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                        <h2 className="text-white font-bold text-sm">{t('recent_activity')}</h2>
                        <Activity className="w-4 h-4 text-zinc-500" />
                    </div>
                    {/* Desktop View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 text-zinc-500 text-xs font-semibold tracking-wider uppercase">
                                    <th className="px-6 py-3">{t('activity')}</th>
                                    <th className="px-6 py-3 text-right">{t('date')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent_activities.map((activity, idx) => (
                                    <tr key={idx} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center shrink-0">
                                                    <Activity className="w-3.5 h-3.5 text-[var(--gold)]" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{translateActivity(activity.description, lang)}</p>
                                                    <p className="text-xs text-zinc-500">{activity.subtitle}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5 text-right text-xs text-zinc-500 font-mono">{activity.date}</td>
                                    </tr>
                                ))}
                                {recent_activities.length === 0 && (
                                    <tr><td colSpan="2" className="px-6 py-10 text-center text-zinc-600 text-sm">{t('no_activity')}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden divide-y divide-white/5">
                        {recent_activities.map((activity, idx) => (
                            <div key={idx} className="p-4 flex items-start justify-between gap-3 hover:bg-white/[0.02]">
                                <div className="flex items-start gap-3 min-w-0">
                                    <div className="w-7 h-7 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <Activity className="w-3.5 h-3.5 text-[var(--gold)]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-white break-words">{translateActivity(activity.description, lang)}</p>
                                        <p className="text-xs text-zinc-500 truncate mt-0.5">{activity.subtitle}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-zinc-500 font-mono shrink-0 mt-1">{activity.date}</span>
                            </div>
                        ))}
                        {recent_activities.length === 0 && (
                            <div className="p-8 text-center text-zinc-600 text-sm">{t('no_activity')}</div>
                        )}
                    </div>
                </div>

                {/* Recent Articles */}
                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                        <h2 className="text-white font-bold text-sm">{t('recent_articles')}</h2>
                        <Link href="/admin/articles" className="text-[var(--gold)] text-xs hover:underline flex items-center gap-1">
                            {t('view_all')} <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {/* Desktop View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 text-zinc-500 text-xs font-semibold tracking-wider uppercase">
                                    <th className="px-6 py-3">{t('title')}</th>
                                    <th className="px-6 py-3">{t('status')}</th>
                                    <th className="px-6 py-3 text-right">{t('date')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent_articles.map((article, idx) => (
                                    <tr key={idx} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-white/5 overflow-hidden shrink-0">
                                                    {article.featured_image ? (
                                                        <img src={article.featured_image} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="w-3.5 h-3.5 m-1.5 text-zinc-500" />
                                                    )}
                                                </div>
                                                <p className="text-sm font-medium text-white line-clamp-1 max-w-[160px]">{lang === 'en' ? (article.title_en || article.title) : article.title}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                article.status === 'published'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : article.status === 'draft'
                                                        ? 'bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20'
                                                        : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                                            }`}>{t(article.status)}</span>
                                        </td>
                                        <td className="px-6 py-3.5 text-right text-xs text-zinc-500 font-mono">{article.date}</td>
                                    </tr>
                                ))}
                                {recent_articles.length === 0 && (
                                    <tr><td colSpan="3" className="px-6 py-10 text-center text-zinc-600 text-sm">{t('no_articles')}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden divide-y divide-white/5">
                        {recent_articles.map((article, idx) => (
                            <div key={idx} className="p-4 flex items-center justify-between gap-3 hover:bg-white/[0.02]">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/5 overflow-hidden shrink-0">
                                        {article.featured_image ? (
                                            <img src={article.featured_image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="w-3.5 h-3.5 m-2.5 text-zinc-500" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{lang === 'en' ? (article.title_en || article.title) : article.title}</p>
                                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{article.date}</p>
                                    </div>
                                </div>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold shrink-0 ${
                                    article.status === 'published'
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : article.status === 'draft'
                                            ? 'bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20'
                                            : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                                }`}>{t(article.status)}</span>
                            </div>
                        ))}
                        {recent_articles.length === 0 && (
                            <div className="p-8 text-center text-zinc-600 text-sm">{t('no_articles')}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Inquiries Table ── */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-white font-bold text-sm">{t('recent_forms')}</h2>
                    <Link href="/admin/inquiries" className="text-[var(--gold)] text-xs hover:underline flex items-center gap-1">
                        {t('view_all')} <ArrowUpRight className="w-3 h-3" />
                    </Link>
                </div>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-zinc-500 text-xs font-semibold tracking-wider uppercase">
                                <th className="px-6 py-3">{t('name')}</th>
                                <th className="px-6 py-3">{t('subject')}</th>
                                <th className="px-6 py-3">{t('status')}</th>
                                <th className="px-6 py-3 text-right">{t('date')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recent_inquiries.map((inq, idx) => (
                                <tr key={idx} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center shrink-0">
                                                <span className="text-[var(--gold)] text-[10px] font-bold">{(inq.name || 'U').charAt(0).toUpperCase()}</span>
                                            </div>
                                            <p className="text-sm font-medium text-white">{inq.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5 text-xs text-zinc-400 max-w-[180px] truncate">{inq.subject}</td>
                                    <td className="px-6 py-3.5">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                            inq.status === 'new_badge'
                                                ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                                : inq.status === 'status_processing'
                                                    ? 'bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/20'
                                                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        }`}>{t(inq.status)}</span>
                                    </td>
                                    <td className="px-6 py-3.5 text-right text-xs text-zinc-500 font-mono">{inq.date}</td>
                                </tr>
                            ))}
                            {recent_inquiries.length === 0 && (
                                <tr><td colSpan="4" className="px-6 py-10 text-center text-zinc-600 text-sm">{t('no_inquiries')}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-white/5">
                    {recent_inquiries.map((inq, idx) => (
                        <div key={idx} className="p-4 flex flex-col gap-2 hover:bg-white/[0.02]">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-7 h-7 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center shrink-0">
                                        <span className="text-[var(--gold)] text-[10px] font-bold">{(inq.name || 'U').charAt(0).toUpperCase()}</span>
                                    </div>
                                    <p className="text-sm font-medium text-white truncate">{inq.name}</p>
                                </div>
                                <span className="text-[10px] text-zinc-500 font-mono shrink-0">{inq.date}</span>
                            </div>
                            <p className="text-xs text-zinc-400 truncate pl-9">{inq.subject}</p>
                            <div className="flex items-center justify-between pl-9 mt-1">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold border ${
                                    inq.status === 'new_badge'
                                        ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                        : inq.status === 'status_processing'
                                            ? 'bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/20'
                                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                }`}>{t(inq.status)}</span>
                            </div>
                        </div>
                    ))}
                    {recent_inquiries.length === 0 && (
                        <div className="p-8 text-center text-zinc-600 text-sm">{t('no_inquiries')}</div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
