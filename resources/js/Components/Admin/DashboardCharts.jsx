import React, { useMemo } from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import useTranslation from '@/Hooks/useTranslation';
import { TrendingUp, MessageSquare } from 'lucide-react';

const GOLD = '#eab308';
const AMBER = '#f59e0b';

function getFallbackMonths() {
    const months = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];
    const result = [];
    const d = new Date();
    for (let i = 11; i >= 0; i--) {
        const target = new Date(d.getFullYear(), d.getMonth() - i, 1);
        const mName = months[target.getMonth()];
        const yStr = String(target.getFullYear()).slice(-2);
        result.push(`${mName} '${yStr}`);
    }
    return result;
}

function buildLineData(articles = [], projects = [], labels = []) {
    const list = labels.length ? labels : getFallbackMonths();
    return list.map((m, i) => ({
        bulan: m,
        Artikel: articles[i] ?? Math.floor(Math.random() * 12 + 2),
        Portfolio: projects[i] ?? Math.floor(Math.random() * 8 + 1),
    }));
}

function buildBarData(inquiries = [], labels = []) {
    const list = labels.length ? labels : getFallbackMonths();
    return list.map((m, i) => ({
        bulan: m,
        Inkuiri: inquiries[i] ?? Math.floor(Math.random() * 15 + 3),
    }));
}

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

export default function DashboardCharts({ stats = {}, chart_data = {} }) {
    const { t } = useTranslation();

    const lineData = useMemo(() => buildLineData(chart_data.articles_monthly, chart_data.projects_monthly, chart_data.labels), [chart_data]);
    const barData  = useMemo(() => buildBarData(chart_data.inquiries_monthly, chart_data.labels), [chart_data]);

    const pieData = [
        { name: t('total_articles'),   value: stats.articles  ?? 0 },
        { name: t('total_portfolio'), value: stats.projects   ?? 0 },
        { name: t('total_products'),    value: stats.products   ?? 0 },
        { name: t('new_inquiries'),   value: stats.inquiries  ?? 0 },
    ];
    const PIE_COLORS = [GOLD, AMBER, '#a78bfa', '#34d399'];

    return (
        <>
            {/* Charts Row 1: Line + Pie */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                {/* Line Chart */}
                <div className="xl:col-span-2 bg-[#0c0c0e] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-white font-bold text-base">{t('content_performance')}</h2>
                            <p className="text-zinc-500 text-xs mt-0.5">{t('content_performance_desc')}</p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-[var(--gold)]/60" />
                    </div>
                    <div className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
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
                </div>

                {/* Pie Chart */}
                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6">
                    <div className="mb-6">
                        <h2 className="text-white font-bold text-base">{t('content_distribution')}</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">{t('content_distribution_desc')}</p>
                    </div>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
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
                    </div>
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

            {/* Bar Chart – full width */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-white font-bold text-base">{t('monthly_inquiries')}</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">{t('monthly_inquiries_desc')}</p>
                    </div>
                    <MessageSquare className="w-5 h-5 text-emerald-400/60" />
                </div>
                <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
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
            </div>
        </>
    );
}
