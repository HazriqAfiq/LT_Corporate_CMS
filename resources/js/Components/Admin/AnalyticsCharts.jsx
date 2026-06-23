import React, { useMemo, useState } from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import useTranslation from '@/Hooks/useTranslation';
import { ChevronDown, ChevronUp } from 'lucide-react';

const GOLD = '#eab308';
const AMBER = '#f59e0b';

const PIE_COLORS = [GOLD, '#a78bfa', '#34d399'];

const ORANGE_COLORS = ['#f97316', '#c2410c']; // Orange (Normal / Darker)
const PURPLE_COLORS = ['#8b5cf6', '#5b21b6']; // Purple (Normal / Darker)
const SKY_COLORS = ['#0ea5e9', '#0369a1'];    // Sky Blue (Normal / Darker)
const GOLD_COLORS = ['#eab308', '#a16207'];   // Gold (Normal / Darker)

const CustomXAxisTick = (props) => {
    const { x, y, payload, index, data } = props;
    if (!data) return null;

    const currentItem = data.find(d => d.bulan === payload.value) || data[index];
    if (!currentItem) return null;

    const dataIndex = data.indexOf(currentItem);
    const prevItem = dataIndex > 0 ? data[dataIndex - 1] : null;

    // Show year if:
    // 1. It is the first item on the chart.
    // 2. The year changed from the previous item (e.g. from 2025 to 2026).
    const showYear = dataIndex === 0 || (prevItem && currentItem.year !== prevItem.year);

    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="middle" fill="#71717a" fontSize={11}>
                {currentItem.month}
            </text>
            {showYear && currentItem.year && (
                <text x={0} y={0} dy={30} textAnchor="middle" fill="#a1a1aa" fontSize={9} fontWeight="bold">
                    {currentItem.year}
                </text>
            )}
        </g>
    );
};

const DarkTooltip = ({ active, payload, label, lang }) => {
    if (!active || !payload?.length) return null;
    
    const labelTranslations = {
        'Pelawat': lang === 'en' ? 'Visitors' : 'Pelawat',
        'Visitors': lang === 'en' ? 'Visitors' : 'Pelawat',
        'Page Views': lang === 'en' ? 'Page Views' : 'Page Views',
        'views': lang === 'en' ? 'Page Views' : 'Page Views',
        'Desktop': lang === 'en' ? 'Desktop' : 'Desktop',
        'Mobile': lang === 'en' ? 'Mobile' : 'Mudah Alih (Mobile)',
        'Tablet': lang === 'en' ? 'Tablet' : 'Tablet'
    };

    return (
        <div className="bg-[#0c0c0e] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
            <p className="text-zinc-400 text-xs font-mono mb-2 uppercase">{label}</p>
            {payload.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-zinc-300">{labelTranslations[p.name] || p.name}:</span>
                    <span className="text-white font-bold">{Number(p.value).toLocaleString()}</span>
                </div>
            ))}
        </div>
    );
};

export default function AnalyticsCharts({
    trailingTwelveMonths = [],
    yearlyData = {},
    topPages = [],
    deviceData = [],
    stats = {},
    mostViewedArticles = [],
    allViewedArticles = [],
    mostViewedProducts = [],
    allViewedProducts = [],
    mostViewedProjects = [],
    allViewedProjects = []
}) {
    const { t, lang } = useTranslation();
    const [showAllArticles, setShowAllArticles] = useState(false);
    const [showAllProducts, setShowAllProducts] = useState(false);
    const [showAllProjects, setShowAllProjects] = useState(false);
    const [selectedYear, setSelectedYear] = useState('last_12_months');

    const YEAR_DATA = useMemo(() => ({
        'last_12_months': trailingTwelveMonths || [],
        ...yearlyData,
        '2024': [
            { bulan: 'Jan', Pelawat: 0, 'Page Views': 0 },
            { bulan: 'Feb', Pelawat: 0, 'Page Views': 0 },
            { bulan: 'Mac', Pelawat: 0, 'Page Views': 0 },
            { bulan: 'Apr', Pelawat: 0, 'Page Views': 0 },
            { bulan: 'Mei', Pelawat: 0, 'Page Views': 0 },
            { bulan: 'Jun', Pelawat: 0, 'Page Views': 0 },
            { bulan: 'Jul', Pelawat: 0, 'Page Views': 0 },
            { bulan: 'Ogo', Pelawat: 0, 'Page Views': 0 },
            { bulan: 'Sep', Pelawat: 0, 'Page Views': 0 },
            { bulan: 'Okt', Pelawat: 0, 'Page Views': 0 },
            { bulan: 'Nov', Pelawat: 0, 'Page Views': 0 },
            { bulan: 'Dis', Pelawat: 0, 'Page Views': 0 },
        ]
    }), [trailingTwelveMonths, yearlyData]);

    const monthlyVisitorsMapped = useMemo(() => {
        const dataForYear = YEAR_DATA[selectedYear] || trailingTwelveMonths || [];
        const monthNamesMap = {
            'Jan': lang === 'en' ? 'Jan' : 'Jan',
            'Feb': lang === 'en' ? 'Feb' : 'Feb',
            'Mac': lang === 'en' ? 'Mar' : 'Mac',
            'Apr': lang === 'en' ? 'Apr' : 'Apr',
            'Mei': lang === 'en' ? 'May' : 'Mei',
            'Jun': lang === 'en' ? 'Jun' : 'Jun',
            'Jul': lang === 'en' ? 'Jul' : 'Jul',
            'Ogo': lang === 'en' ? 'Aug' : 'Ogo',
            'Sep': lang === 'en' ? 'Sep' : 'Sep',
            'Okt': lang === 'en' ? 'Oct' : 'Okt',
            'Nov': lang === 'en' ? 'Nov' : 'Nov',
            'Dis': lang === 'en' ? 'Dec' : 'Dis',
        };

        return dataForYear.map(v => {
            let label = v.bulan;
            const parts = label.split(' ');
            let translatedMonth = '';
            let itemYear = v.year;

            if (parts.length === 2) {
                translatedMonth = monthNamesMap[parts[0]] || parts[0];
                label = `${translatedMonth} ${parts[1]}`;
                if (!itemYear) {
                    itemYear = `20${parts[1]}`;
                }
            } else {
                translatedMonth = monthNamesMap[label] || label;
                label = translatedMonth;
                if (!itemYear) {
                    itemYear = selectedYear !== 'last_12_months' ? selectedYear : new Date().getFullYear().toString();
                }
            }

            return {
                ...v,
                bulan: label,
                month: translatedMonth,
                year: itemYear,
                [lang === 'en' ? 'Visitors' : 'Pelawat']: v['Pelawat'] ?? v['Visitors'],
                'Page Views': v['Page Views'],
            };
        });
    }, [YEAR_DATA, selectedYear, lang, trailingTwelveMonths]);

    const topPagesMapped = useMemo(() => {
        const pagesMap = {
            'Laman Utama': lang === 'en' ? 'Home Page' : 'Laman Utama',
            'Perkhidmatan': lang === 'en' ? 'Services' : 'Perkhidmatan',
            'Artikel': lang === 'en' ? 'Articles' : 'Artikel',
            'Portfolio': lang === 'en' ? 'Portfolio' : 'Portfolio',
            'Tentang Kami': lang === 'en' ? 'About Us' : 'Tentang Kami',
            'Hubungi Kami': lang === 'en' ? 'Contact Us' : 'Hubungi Kami',
            'Produk': lang === 'en' ? 'Products' : 'Produk',
        };
        return topPages.map(p => {
            let name = p.halaman;
            name = name.replace(/\s*[|\-–—]\s*Laman\s*Teknologi\s*$/i, '').trim();
            return {
                ...p,
                halaman: pagesMap[name] || pagesMap[p.halaman] || name || p.halaman
            };
        });
    }, [topPages, lang]);

    const deviceDataMapped = useMemo(() => {
        const deviceMap = {
            'Desktop': t('desktop'),
            'Mobile': t('mobile'),
            'Tablet': t('tablet'),
        };
        return deviceData.map(d => ({
            ...d,
            translatedName: deviceMap[d.name] || d.name
        }));
    }, [deviceData, lang]);

    const displayArticles = useMemo(() => {
        return (showAllArticles ? allViewedArticles : mostViewedArticles).map(a => ({
            name: lang === 'en' && a.title_en ? a.title_en : a.title,
            views: a.views_count,
        }));
    }, [mostViewedArticles, allViewedArticles, showAllArticles, lang]);

    const displayProducts = useMemo(() => {
        return (showAllProducts ? allViewedProducts : mostViewedProducts).map(p => ({
            name: lang === 'en' && p.name_en ? p.name_en : p.name,
            views: p.views_count,
        }));
    }, [mostViewedProducts, allViewedProducts, showAllProducts, lang]);

    const displayProjects = useMemo(() => {
        return (showAllProjects ? allViewedProjects : mostViewedProjects).map(p => ({
            name: lang === 'en' && p.title_en ? p.title_en : p.title,
            views: p.views_count,
        }));
    }, [mostViewedProjects, allViewedProjects, showAllProjects, lang]);

    const expandLabelArticles = lang === 'en' ? (showAllArticles ? 'Show Less' : 'Show All') : (showAllArticles ? 'Tunjuk Kurang' : 'Lihat Semua');
    const expandLabelProducts = lang === 'en' ? (showAllProducts ? 'Show Less' : 'Show All') : (showAllProducts ? 'Tunjuk Kurang' : 'Lihat Semua');
    const expandLabelProjects = lang === 'en' ? (showAllProjects ? 'Show Less' : 'Show All') : (showAllProjects ? 'Tunjuk Kurang' : 'Lihat Semua');

    return (
        <>
            {/* Line Chart */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                    <div>
                        <h2 className="text-white font-bold text-base">{t('monthly_visitors_views')}</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">{t('traffic_trend_desc')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-zinc-400 text-xs font-medium">{t('year')}:</label>
                        <div className="relative">
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="appearance-none bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold px-3.5 py-1.5 pr-8 rounded-lg border border-white/5 focus:outline-none focus:border-[var(--gold)]/50 transition-all cursor-pointer"
                            >
                                <option value="last_12_months" className="bg-[#0c0c0e] text-white">
                                    {lang === 'en' ? 'Last 12 Months' : '12 Bulan Terakhir'}
                                </option>
                                <option value="2026" className="bg-[#0c0c0e] text-white">2026</option>
                                <option value="2025" className="bg-[#0c0c0e] text-white">2025</option>
                                <option value="2024" className="bg-[#0c0c0e] text-white">2024</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                </div>
                <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyVisitorsMapped} margin={{ top: 5, right: 10, left: -20, bottom: 35 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="bulan" tick={<CustomXAxisTick data={monthlyVisitorsMapped} />} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<DarkTooltip lang={lang} />} />
                            <Legend wrapperStyle={{ fontSize: '12px', color: '#a1a1aa', paddingTop: '12px' }} iconType="circle" iconSize={8} />
                            <Line type="monotone" dataKey={lang === 'en' ? 'Visitors' : 'Pelawat'} stroke={GOLD} strokeWidth={2.5} dot={{ r: 3, fill: GOLD, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                            <Line type="monotone" dataKey="Page Views" stroke="#a78bfa" strokeWidth={2.5} dot={{ r: 3, fill: '#a78bfa', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bar + Pie */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Bar Chart */}
                <div className="xl:col-span-2 bg-[#0c0c0e] border border-white/5 rounded-2xl p-6">
                    <div className="mb-5">
                        <h2 className="text-white font-bold text-base">{t('most_visited_pages')}</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">{t('top_pages_desc')}</p>
                    </div>
                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topPagesMapped} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }} barSize={18}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                                <XAxis type="number" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis type="category" dataKey="halaman" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                                <Tooltip content={<DarkTooltip lang={lang} />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                <Bar dataKey="views" radius={[0, 6, 6, 0]}>
                                    {topPagesMapped.map((_, i) => <Cell key={i} fill={ORANGE_COLORS[i % ORANGE_COLORS.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6">
                    <div className="mb-5">
                        <h2 className="text-white font-bold text-base">{t('device_types')}</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">{t('device_breakdown_desc')}</p>
                    </div>
                    <div className="h-[180px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={deviceDataMapped} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                                    {deviceDataMapped.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="transparent" />)}
                                </Pie>
                                <Tooltip content={<DarkTooltip lang={lang} />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-2">
                        {deviceDataMapped.map((d, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                                    <span className="text-zinc-400">{d.translatedName}</span>
                                </div>
                                <span className="text-white font-bold">{d.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Most Viewed Articles */}
            <div className="mt-6 bg-[#0c0c0e] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-white font-bold text-base">{lang === 'en' ? 'Most Viewed Articles' : 'Artikel Paling Banyak Dilihat'}</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">{lang === 'en' ? `Showing ${displayArticles.length} articles sorted by view count` : `Menunjukkan ${displayArticles.length} artikel mengikut jumlah tontonan`}</p>
                    </div>
                    <button
                        onClick={() => setShowAllArticles(!showAllArticles)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5 transition-all"
                    >
                        {showAllArticles ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {expandLabelArticles}
                    </button>
                </div>
                {displayArticles.length > 0 ? (
                    <div style={{ height: `${Math.max(220, displayArticles.length * 36)}px` }} className="w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={displayArticles} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }} barSize={16}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                                <XAxis type="number" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis type="category" dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} width={180} />
                                <Tooltip content={<DarkTooltip lang={lang} />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                <Bar dataKey="views" radius={[0, 6, 6, 0]}>
                                    {displayArticles.map((_, i) => <Cell key={i} fill={PURPLE_COLORS[i % PURPLE_COLORS.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="text-center py-10 text-zinc-500 text-sm">{lang === 'en' ? 'No article views recorded yet.' : 'Tiada rekod tontonan artikel.'}</p>
                )}
            </div>

            {/* Most Viewed Products */}
            <div className="mt-6 bg-[#0c0c0e] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-white font-bold text-base">{lang === 'en' ? 'Most Viewed Products' : 'Produk Paling Banyak Dilihat'}</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">{lang === 'en' ? `Showing ${displayProducts.length} products sorted by view count` : `Menunjukkan ${displayProducts.length} produk mengikut jumlah tontonan`}</p>
                    </div>
                    <button
                        onClick={() => setShowAllProducts(!showAllProducts)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5 transition-all"
                    >
                        {showAllProducts ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {expandLabelProducts}
                    </button>
                </div>
                {displayProducts.length > 0 ? (
                    <div style={{ height: `${Math.max(220, displayProducts.length * 36)}px` }} className="w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={displayProducts} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }} barSize={16}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                                <XAxis type="number" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis type="category" dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} width={180} />
                                <Tooltip content={<DarkTooltip lang={lang} />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                <Bar dataKey="views" radius={[0, 6, 6, 0]}>
                                    {displayProducts.map((_, i) => <Cell key={i} fill={SKY_COLORS[i % SKY_COLORS.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="text-center py-10 text-zinc-500 text-sm">{lang === 'en' ? 'No product views recorded yet.' : 'Tiada rekod tontonan produk.'}</p>
                )}
            </div>

            {/* Most Viewed Projects */}
            <div className="mt-6 bg-[#0c0c0e] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-white font-bold text-base">{lang === 'en' ? 'Most Viewed Projects' : 'Projek Paling Banyak Dilihat'}</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">{lang === 'en' ? `Showing ${displayProjects.length} projects sorted by view count` : `Menunjukkan ${displayProjects.length} projek mengikut jumlah tontonan`}</p>
                    </div>
                    <button
                        onClick={() => setShowAllProjects(!showAllProjects)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5 transition-all"
                    >
                        {showAllProjects ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {expandLabelProjects}
                    </button>
                </div>
                {displayProjects.length > 0 ? (
                    <div style={{ height: `${Math.max(220, displayProjects.length * 36)}px` }} className="w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={displayProjects} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }} barSize={16}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                                <XAxis type="number" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis type="category" dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} width={180} />
                                <Tooltip content={<DarkTooltip lang={lang} />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                <Bar dataKey="views" radius={[0, 6, 6, 0]}>
                                    {displayProjects.map((_, i) => <Cell key={i} fill={GOLD_COLORS[i % GOLD_COLORS.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="text-center py-10 text-zinc-500 text-sm">{lang === 'en' ? 'No project views recorded yet.' : 'Tiada rekod tontonan projek.'}</p>
                )}
            </div>
        </>
    );
}
