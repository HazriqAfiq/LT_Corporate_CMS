import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    BarChart2, Users, Eye, Clock, TrendingUp, HelpCircle, Key, 
    Shield, Terminal, Copy, Check, ChevronDown, ChevronUp 
} from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import useTranslation from '@/Hooks/useTranslation';

const GOLD = '#eab308';
const AMBER = '#f59e0b';

const PIE_COLORS = [GOLD, '#a78bfa', '#34d399'];

const CHART_COLORS = [
    '#eab308', // Gold
    '#38bdf8', // Sky Blue
    '#a78bfa', // Purple
    '#34d399', // Emerald
    '#f87171', // Red
    '#fb923c', // Orange
    '#f472b6', // Pink
    '#f59e0b', // Amber
    '#60a5fa', // Light Blue
];

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

export default function AnalyticsIndex({ trailingTwelveMonths, yearlyData, topPages, deviceData, stats, isConfigured, isLive, errorMessage, mostViewedArticles, allViewedArticles, mostViewedProducts, allViewedProducts, mostViewedProjects, allViewedProjects }) {
    const { t, lang } = useTranslation();
    const [copiedText, setCopiedText] = useState('');
    const [showSetup, setShowSetup] = useState(true);
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

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedText(text);
        setTimeout(() => setCopiedText(''), 2000);
    };

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
            // Strip common site name suffixes from raw GA4 titles
            name = name.replace(/\s*[|\-–—]\s*Laman\s*Teknologi\s*$/i, '').trim();
            // Use mapped name if available, otherwise use cleaned title
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

    const expandLabel = lang === 'en' ? (showAllArticles ? 'Show Less' : 'Show All') : (showAllArticles ? 'Tunjuk Kurang' : 'Lihat Semua');

    return (
        <AdminLayout header={t('analytics_title')}>
            <Head title={`${t('analytics_title')} | Admin`} />

            {/* Dev Banner & Setup Instructions */}
            {!isConfigured ? (
                <div className="space-y-4 mb-6">
                    {/* Dev Banner */}
                    <div className="flex items-center gap-3 px-5 py-3.5 bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-2xl animate-fade-in">
                        <BarChart2 className="w-5 h-5 text-[var(--gold)] shrink-0" />
                        <div className="flex-1">
                            <p className="text-[var(--gold)] font-semibold text-sm">{t('demo_data')}</p>
                            <p className="text-zinc-400 text-xs mt-0.5">{t('demo_data_desc')}</p>
                        </div>
                        <button
                            onClick={() => setShowSetup(!showSetup)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 border border-white/5 transition-all"
                        >
                            {showSetup ? (
                                <>
                                    <span>{lang === 'en' ? 'Hide Setup Guide' : 'Sorok Panduan'}</span>
                                    <ChevronUp className="w-3.5 h-3.5" />
                                </>
                            ) : (
                                <>
                                    <span>{lang === 'en' ? 'Show Setup Guide' : 'Papar Panduan'}</span>
                                    <ChevronDown className="w-3.5 h-3.5" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Setup Guide Card */}
                    {showSetup && (
                        <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 space-y-6 animate-slide-down">
                            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                                <HelpCircle className="w-5 h-5 text-[var(--gold)]" />
                                <div>
                                    <h3 className="text-white font-bold text-base">{t('ga_setup_title')}</h3>
                                    <p className="text-zinc-400 text-xs mt-0.5">{t('ga_setup_desc')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Step 1 */}
                                <div className="space-y-3 bg-white/[0.02] border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-[var(--gold)]/25 transition-all duration-300">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[var(--gold)]/5 to-transparent rounded-bl-full pointer-events-none" />
                                    <div className="flex items-center gap-2 text-[var(--gold)] font-bold text-sm">
                                        <Key className="w-4 h-4" />
                                        <h4>{t('ga_step_1_title')}</h4>
                                    </div>
                                    <p className="text-zinc-400 text-xs leading-relaxed">{t('ga_step_1_desc')}</p>
                                    
                                    <div className="bg-[#080808] border border-white/5 rounded-lg p-2.5 flex items-center justify-between text-[11px] font-mono text-zinc-300 select-all">
                                        <span className="truncate">storage/app/analytics/service-account-credentials.json</span>
                                        <button 
                                            onClick={() => handleCopy('storage/app/analytics/service-account-credentials.json')}
                                            className="text-zinc-500 hover:text-[var(--gold)] shrink-0 ml-2"
                                            title="Copy Path"
                                        >
                                            {copiedText === 'storage/app/analytics/service-account-credentials.json' ? (
                                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            ) : (
                                                <Copy className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="space-y-3 bg-white/[0.02] border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-[var(--gold)]/25 transition-all duration-300">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[var(--gold)]/5 to-transparent rounded-bl-full pointer-events-none" />
                                    <div className="flex items-center gap-2 text-[var(--gold)] font-bold text-sm">
                                        <Shield className="w-4 h-4" />
                                        <h4>{t('ga_step_2_title')}</h4>
                                    </div>
                                    <p className="text-zinc-400 text-xs leading-relaxed">{t('ga_step_2_desc')}</p>
                                </div>

                                {/* Step 3 */}
                                <div className="space-y-3 bg-white/[0.02] border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-[var(--gold)]/25 transition-all duration-300">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[var(--gold)]/5 to-transparent rounded-bl-full pointer-events-none" />
                                    <div className="flex items-center gap-2 text-[var(--gold)] font-bold text-sm">
                                        <Terminal className="w-4 h-4" />
                                        <h4>{t('ga_step_3_title')}</h4>
                                    </div>
                                    <p className="text-zinc-400 text-xs leading-relaxed">{t('ga_step_3_desc')}</p>
                                    
                                    <div className="bg-[#080808] border border-white/5 rounded-lg p-3 space-y-2 text-[10px] font-mono text-zinc-300 relative select-all">
                                        <button 
                                            onClick={() => handleCopy("ANALYTICS_PROPERTY_ID=YOUR_PROPERTY_ID_HERE\nANALYTICS_CREDENTIALS_JSON=storage/app/analytics/service-account-credentials.json")}
                                            className="absolute top-2.5 right-2.5 text-zinc-500 hover:text-[var(--gold)]"
                                            title="Copy Config"
                                        >
                                            {copiedText.includes('ANALYTICS_PROPERTY_ID') ? (
                                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            ) : (
                                                <Copy className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                        <p className="text-zinc-500"># .env configuration</p>
                                        <p className="text-[var(--gold)]">ANALYTICS_PROPERTY_ID=<span className="text-zinc-400">123456789</span></p>
                                        <p className="text-[var(--gold)]">ANALYTICS_CREDENTIALS_JSON=<span className="text-zinc-400">storage/app/analytics/service-account-credentials.json</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Configured but live data is not yet generated / retrieved (waiting for Google's first crawl or error) */
                !isLive && (
                    <div className="mb-6 space-y-4">
                        {errorMessage ? (
                            <div className="flex flex-col gap-2 px-5 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-fade-in shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-500/10 rounded-xl text-red-400">
                                        <Shield className="w-5 h-5 shrink-0" />
                                    </div>
                                    <div>
                                        <p className="text-red-400 font-extrabold text-sm tracking-wide">
                                            {lang === 'en' ? 'Google Analytics Connection Error' : 'Ralat Sambungan Google Analytics'}
                                        </p>
                                        <p className="text-zinc-300 text-xs mt-0.5 leading-relaxed">
                                            {lang === 'en' 
                                                ? 'The credentials are set up, but the Google API returned an error:' 
                                                : 'Kredensial telah disediakan, tetapi Google API mengembalikan ralat:'}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 p-3 bg-black/40 border border-white/5 rounded-xl text-xs font-mono text-zinc-400 break-all select-all">
                                    {errorMessage}
                                </div>
                                <p className="text-zinc-500 text-[11px] mt-1 leading-relaxed">
                                    {lang === 'en' 
                                        ? 'Tip: Make sure you have added the service account email (found in your credentials JSON file) to your GA4 property Admin settings with Viewer rights, and that the Google Analytics API is enabled in your Google Developer Console.' 
                                        : 'Tip: Pastikan anda telah menambah e-mel akaun perkhidmatan (terdapat dalam fail JSON kredensial anda) ke tetapan Pentadbir GA4 anda dengan peranan "Viewer", dan API Google Analytics diaktifkan di Google Developer Console anda.'}
                                </p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 px-5 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-fade-in shadow-lg">
                                <div className="p-2 bg-emerald-500/10 rounded-xl">
                                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                                </div>
                                <div>
                                    <p className="text-emerald-400 font-extrabold text-sm tracking-wide">{t('ga_connected_title')}</p>
                                    <p className="text-zinc-300 text-xs mt-0.5 leading-relaxed">{t('ga_connected_desc')}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {[
                    { icon: Users, label: t('total_visitors'), value: stats.total_visitors, change: stats.change_visitors, color: 'text-[var(--gold)]', bg: 'bg-[var(--gold)]/10' },
                    { icon: Eye, label: 'Page Views', value: stats.page_views, change: stats.change_views, color: 'text-violet-400', bg: 'bg-violet-500/10' },
                    { icon: Clock, label: t('avg_session_time'), value: stats.avg_session_time, change: stats.change_time, color: 'text-sky-400', bg: 'bg-sky-500/10' },
                    { icon: TrendingUp, label: t('bounce_rate'), value: stats.bounce_rate, change: stats.change_bounce, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                ].map((s, i) => (
                    <div key={i} className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-5">
                        <div className={`inline-flex p-2.5 rounded-xl ${s.bg} mb-3`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
                        <p className="text-zinc-500 text-xs tracking-wider uppercase mb-1">{s.label}</p>
                        <p className="text-2xl font-extrabold text-white">{s.value}</p>
                        <p className={`text-xs mt-1 ${s.change.startsWith('-') ? 'text-red-400' : 'text-emerald-400'}`}>
                            {s.change} {t('this_month')}
                        </p>
                    </div>
                ))}
            </div>

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
                <ResponsiveContainer width="100%" height={260}>
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

            {/* Bar + Pie */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Bar Chart */}
                <div className="xl:col-span-2 bg-[#0c0c0e] border border-white/5 rounded-2xl p-6">
                    <div className="mb-5">
                        <h2 className="text-white font-bold text-base">{t('most_visited_pages')}</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">{t('top_pages_desc')}</p>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
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

                {/* Pie Chart */}
                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6">
                    <div className="mb-5">
                        <h2 className="text-white font-bold text-base">{t('device_types')}</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">{t('device_breakdown_desc')}</p>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie data={deviceDataMapped} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                                {deviceDataMapped.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="transparent" />)}
                            </Pie>
                            <Tooltip content={<DarkTooltip lang={lang} />} />
                        </PieChart>
                    </ResponsiveContainer>
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
                        {expandLabel}
                    </button>
                </div>
                {displayArticles.length > 0 ? (
                    <ResponsiveContainer width="100%" height={Math.max(220, displayArticles.length * 36)}>
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
                        {lang === 'en' ? (showAllProducts ? 'Show Less' : 'Show All') : (showAllProducts ? 'Tunjuk Kurang' : 'Lihat Semua')}
                    </button>
                </div>
                {displayProducts.length > 0 ? (
                    <ResponsiveContainer width="100%" height={Math.max(220, displayProducts.length * 36)}>
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
                        {lang === 'en' ? (showAllProjects ? 'Show Less' : 'Show All') : (showAllProjects ? 'Tunjuk Kurang' : 'Lihat Semua')}
                    </button>
                </div>
                {displayProjects.length > 0 ? (
                    <ResponsiveContainer width="100%" height={Math.max(220, displayProjects.length * 36)}>
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
                ) : (
                    <p className="text-center py-10 text-zinc-500 text-sm">{lang === 'en' ? 'No project views recorded yet.' : 'Tiada rekod tontonan projek.'}</p>
                )}
            </div>
        </AdminLayout>
    );
}
