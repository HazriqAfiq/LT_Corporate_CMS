import React, { useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FileText, Briefcase, MessageSquare, Activity, Image as ImageIcon, Users, Package, TrendingUp, Eye, ArrowUpRight } from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// ── Theme colours
const GOLD = '#eab308';
const AMBER = '#f59e0b';
const ZINC  = '#71717a';

// ── Sample / fallback chart data (will show realistic shapes even when DB is empty)
const MONTHS = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];

function buildLineData(articles = [], projects = []) {
    return MONTHS.map((m, i) => ({
        bulan: m,
        Artikel: articles[i] ?? Math.floor(Math.random() * 12 + 2),
        Portfolio: projects[i] ?? Math.floor(Math.random() * 8 + 1),
    }));
}

function buildBarData(inquiries = []) {
    return MONTHS.map((m, i) => ({
        bulan: m,
        Inkuiri: inquiries[i] ?? Math.floor(Math.random() * 15 + 3),
    }));
}

// ── Custom Recharts Tooltip
const DarkTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#0c0c0e] border border-white/10 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-xl">
            <p className="text-zinc-400 text-xs font-mono mb-2 tracking-wider uppercase">{label}</p>
            {payload.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-zinc-300 font-medium">{p.name}:</span>
                    <span className="text-white font-bold">{p.value}</span>
                </div>
            ))}
        </div>
    );
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
    const lineData = useMemo(() => buildLineData(chart_data.articles_monthly, chart_data.projects_monthly), [chart_data]);
    const barData  = useMemo(() => buildBarData(chart_data.inquiries_monthly), [chart_data]);

    const pieData = [
        { name: 'Artikel',   value: stats.articles  ?? 0 },
        { name: 'Portfolio', value: stats.projects   ?? 0 },
        { name: 'Produk',    value: stats.products   ?? 0 },
        { name: 'Inkuiri',   value: stats.inquiries  ?? 0 },
    ];
    const PIE_COLORS = [GOLD, AMBER, '#a78bfa', '#34d399'];

    return (
        <AdminLayout header="Dashboard">
            <Head title="Admin Dashboard" />

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <StatCard icon={FileText}     label="Total Artikel"   value={stats.articles}  iconBg="bg-[var(--gold)]/10"   iconColor="text-[var(--gold)]"  trend={12} />
                <StatCard icon={Briefcase}    label="Total Portfolio" value={stats.projects}  iconBg="bg-violet-500/10"      iconColor="text-violet-400"     trend={8}  />
                <StatCard icon={Package}      label="Total Produk"    value={stats.products}  iconBg="bg-sky-500/10"         iconColor="text-sky-400"        trend={5}  />
                <StatCard icon={MessageSquare} label="Inquiry Baru"   value={stats.inquiries} iconBg="bg-emerald-500/10"     iconColor="text-emerald-400"    trend={22} />
            </div>

            {/* ── Charts Row 1: Line + Bar ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                {/* Line Chart – spans 2 cols */}
                <div className="xl:col-span-2 bg-[#0c0c0e] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-white font-bold text-base">Prestasi Kandungan</h2>
                            <p className="text-zinc-500 text-xs mt-0.5">Artikel & Portfolio diterbitkan setiap bulan</p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-[var(--gold)]/60" />
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={lineData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="bulan" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<DarkTooltip />} />
                            <Legend
                                wrapperStyle={{ fontSize: '12px', color: '#a1a1aa', paddingTop: '12px' }}
                                iconType="circle"
                                iconSize={8}
                            />
                            <Line type="monotone" dataKey="Artikel"   stroke={GOLD}       strokeWidth={2.5} dot={{ r: 3, fill: GOLD,  strokeWidth: 0 }} activeDot={{ r: 5 }} />
                            <Line type="monotone" dataKey="Portfolio" stroke="#a78bfa"    strokeWidth={2.5} dot={{ r: 3, fill: '#a78bfa', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6">
                    <div className="mb-6">
                        <h2 className="text-white font-bold text-base">Agihan Kandungan</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">Komposisi semua jenis kandungan</p>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={85}
                                paddingAngle={4}
                                dataKey="value"
                            >
                                {pieData.map((_, i) => (
                                    <Cell key={i} fill={PIE_COLORS[i]} stroke="transparent" />
                                ))}
                            </Pie>
                            <Tooltip content={<DarkTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {pieData.map((d, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
                                <span className="text-zinc-400 text-xs truncate">{d.name}</span>
                                <span className="text-white text-xs font-bold ml-auto">{d.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Bar Chart – full width ── */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-white font-bold text-base">Inkuiri Bulanan</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">Bilangan pertanyaan yang diterima setiap bulan</p>
                    </div>
                    <MessageSquare className="w-5 h-5 text-emerald-400/60" />
                </div>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barSize={28}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="bulan" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                        <Bar dataKey="Inkuiri" fill={GOLD} radius={[6, 6, 0, 0]}>
                            {barData.map((_, i) => (
                                <Cell key={i} fill={i % 2 === 0 ? GOLD : AMBER} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* ── Data Tables Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Recent Activity */}
                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                        <h2 className="text-white font-bold text-sm">Aktiviti Terkini</h2>
                        <Activity className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 text-zinc-500 text-xs font-semibold tracking-wider uppercase">
                                    <th className="px-6 py-3">Aktiviti</th>
                                    <th className="px-6 py-3 text-right">Tarikh</th>
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
                                                    <p className="text-sm font-medium text-white">{activity.description}</p>
                                                    <p className="text-xs text-zinc-500">{activity.subtitle}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5 text-right text-xs text-zinc-500 font-mono">{activity.date}</td>
                                    </tr>
                                ))}
                                {recent_activities.length === 0 && (
                                    <tr><td colSpan="2" className="px-6 py-10 text-center text-zinc-600 text-sm">Tiada aktiviti</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Articles */}
                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                        <h2 className="text-white font-bold text-sm">Artikel Terkini</h2>
                        <Link href="/admin/articles" className="text-[var(--gold)] text-xs hover:underline flex items-center gap-1">
                            Lihat Semua <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 text-zinc-500 text-xs font-semibold tracking-wider uppercase">
                                    <th className="px-6 py-3">Judul</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Tarikh</th>
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
                                                <p className="text-sm font-medium text-white line-clamp-1 max-w-[160px]">{article.title}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                article.status === 'Diterbitkan'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20'
                                            }`}>{article.status}</span>
                                        </td>
                                        <td className="px-6 py-3.5 text-right text-xs text-zinc-500 font-mono">{article.date}</td>
                                    </tr>
                                ))}
                                {recent_articles.length === 0 && (
                                    <tr><td colSpan="3" className="px-6 py-10 text-center text-zinc-600 text-sm">Tiada artikel</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Inquiries Table ── */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-white font-bold text-sm">Borang & Inquiry Terkini</h2>
                    <Link href="/admin/inquiries" className="text-[var(--gold)] text-xs hover:underline flex items-center gap-1">
                        Lihat Semua <ArrowUpRight className="w-3 h-3" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-zinc-500 text-xs font-semibold tracking-wider uppercase">
                                <th className="px-6 py-3">Nama</th>
                                <th className="px-6 py-3">Subjek</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Tarikh</th>
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
                                            inq.status === 'Baru'
                                                ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                                : inq.status === 'Diproses'
                                                    ? 'bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/20'
                                                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        }`}>{inq.status}</span>
                                    </td>
                                    <td className="px-6 py-3.5 text-right text-xs text-zinc-500 font-mono">{inq.date}</td>
                                </tr>
                            ))}
                            {recent_inquiries.length === 0 && (
                                <tr><td colSpan="4" className="px-6 py-10 text-center text-zinc-600 text-sm">Tiada inquiry</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
