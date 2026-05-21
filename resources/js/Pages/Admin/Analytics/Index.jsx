import React, { useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BarChart2, Users, Eye, Clock, TrendingUp } from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const GOLD = '#eab308';
const AMBER = '#f59e0b';

const monthlyVisitors = [
    { bulan: 'Jan', Pelawat: 1200, 'Page Views': 3400 },
    { bulan: 'Feb', Pelawat: 1900, 'Page Views': 5200 },
    { bulan: 'Mac', Pelawat: 1500, 'Page Views': 4100 },
    { bulan: 'Apr', Pelawat: 2400, 'Page Views': 6800 },
    { bulan: 'Mei', Pelawat: 2100, 'Page Views': 5900 },
    { bulan: 'Jun', Pelawat: 2800, 'Page Views': 7600 },
    { bulan: 'Jul', Pelawat: 3200, 'Page Views': 8900 },
    { bulan: 'Ogo', Pelawat: 2900, 'Page Views': 8100 },
    { bulan: 'Sep', Pelawat: 3500, 'Page Views': 9700 },
    { bulan: 'Okt', Pelawat: 3800, 'Page Views': 10400 },
    { bulan: 'Nov', Pelawat: 4100, 'Page Views': 11200 },
    { bulan: 'Dis', Pelawat: 4500, 'Page Views': 12300 },
];

const topPages = [
    { halaman: 'Laman Utama', views: 8420 },
    { halaman: 'Perkhidmatan', views: 4210 },
    { halaman: 'Artikel', views: 3180 },
    { halaman: 'Portfolio', views: 2640 },
    { halaman: 'Tentang Kami', views: 1920 },
    { halaman: 'Hubungi Kami', views: 1480 },
];

const deviceData = [
    { name: 'Desktop', value: 52 },
    { name: 'Mobile', value: 38 },
    { name: 'Tablet', value: 10 },
];

const PIE_COLORS = [GOLD, '#a78bfa', '#34d399'];

const DarkTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#0c0c0e] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
            <p className="text-zinc-400 text-xs font-mono mb-2 uppercase">{label}</p>
            {payload.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-zinc-300">{p.name}:</span>
                    <span className="text-white font-bold">{Number(p.value).toLocaleString()}</span>
                </div>
            ))}
        </div>
    );
};

export default function AnalyticsIndex() {
    return (
        <AdminLayout header="Analytics">
            <Head title="Analytics | Admin" />

            {/* Dev Banner */}
            <div className="mb-6 flex items-center gap-3 px-5 py-3.5 bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-2xl">
                <BarChart2 className="w-5 h-5 text-[var(--gold)] shrink-0" />
                <div>
                    <p className="text-[var(--gold)] font-semibold text-sm">Data Demonstrasi</p>
                    <p className="text-zinc-400 text-xs mt-0.5">Data di bawah adalah contoh. Hubungkan Google Analytics atau sistem tracking untuk data sebenar.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {[
                    { icon: Users, label: 'Jumlah Pelawat', value: '34,521', change: '+12%', color: 'text-[var(--gold)]', bg: 'bg-[var(--gold)]/10' },
                    { icon: Eye, label: 'Page Views', value: '97,430', change: '+18%', color: 'text-violet-400', bg: 'bg-violet-500/10' },
                    { icon: Clock, label: 'Avg. Masa Sesi', value: '3m 42s', change: '+5%', color: 'text-sky-400', bg: 'bg-sky-500/10' },
                    { icon: TrendingUp, label: 'Kadar Bounce', value: '38.4%', change: '-3%', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                ].map((s, i) => (
                    <div key={i} className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-5">
                        <div className={`inline-flex p-2.5 rounded-xl ${s.bg} mb-3`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
                        <p className="text-zinc-500 text-xs tracking-wider uppercase mb-1">{s.label}</p>
                        <p className="text-2xl font-extrabold text-white">{s.value}</p>
                        <p className="text-xs text-emerald-400 mt-1">{s.change} bulan ini</p>
                    </div>
                ))}
            </div>

            {/* Line Chart */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 mb-6">
                <div className="mb-5">
                    <h2 className="text-white font-bold text-base">Pelawat & Page Views Bulanan</h2>
                    <p className="text-zinc-500 text-xs mt-0.5">Trend trafik keseluruhan sepanjang tahun</p>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={monthlyVisitors} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="bulan" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<DarkTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '12px', color: '#a1a1aa', paddingTop: '12px' }} iconType="circle" iconSize={8} />
                        <Line type="monotone" dataKey="Pelawat" stroke={GOLD} strokeWidth={2.5} dot={{ r: 3, fill: GOLD, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                        <Line type="monotone" dataKey="Page Views" stroke="#a78bfa" strokeWidth={2.5} dot={{ r: 3, fill: '#a78bfa', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Bar + Pie */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Bar Chart */}
                <div className="xl:col-span-2 bg-[#0c0c0e] border border-white/5 rounded-2xl p-6">
                    <div className="mb-5">
                        <h2 className="text-white font-bold text-base">Halaman Paling Banyak Dilawati</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">Top 6 halaman mengikut jumlah page views</p>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={topPages} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }} barSize={18}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                            <XAxis type="number" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="halaman" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                            <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                            <Bar dataKey="views" fill={GOLD} radius={[0, 6, 6, 0]}>
                                {topPages.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? GOLD : AMBER} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6">
                    <div className="mb-5">
                        <h2 className="text-white font-bold text-base">Jenis Peranti</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">Breakdown pelawat mengikut peranti</p>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie data={deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                                {deviceData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} stroke="transparent" />)}
                            </Pie>
                            <Tooltip content={<DarkTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                        {deviceData.map((d, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                                    <span className="text-zinc-400">{d.name}</span>
                                </div>
                                <span className="text-white font-bold">{d.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
