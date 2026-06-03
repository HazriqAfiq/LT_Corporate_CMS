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

export default function AnalyticsIndex({ monthlyVisitors, topPages, deviceData, stats, isConfigured, isLive }) {
    const { t, lang } = useTranslation();
    const [copiedText, setCopiedText] = useState('');
    const [showSetup, setShowSetup] = useState(true);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedText(text);
        setTimeout(() => setCopiedText(''), 2000);
    };

    const monthlyVisitorsMapped = useMemo(() => {
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

        return monthlyVisitors.map(v => ({
            ...v,
            bulan: monthNamesMap[v.bulan] || v.bulan,
            [lang === 'en' ? 'Visitors' : 'Pelawat']: v['Pelawat'] ?? v['Visitors'],
            'Page Views': v['Page Views'],
        }));
    }, [monthlyVisitors, lang]);

    const topPagesMapped = useMemo(() => {
        const pagesMap = {
            'Laman Utama': lang === 'en' ? 'Home Page' : 'Laman Utama',
            'Perkhidmatan': lang === 'en' ? 'Services' : 'Perkhidmatan',
            'Artikel': lang === 'en' ? 'Articles' : 'Artikel',
            'Portfolio': lang === 'en' ? 'Portfolio' : 'Portfolio',
            'Tentang Kami': lang === 'en' ? 'About Us' : 'Tentang Kami',
            'Hubungi Kami': lang === 'en' ? 'Contact Us' : 'Hubungi Kami',
        };
        return topPages.map(p => ({
            ...p,
            halaman: pagesMap[p.halaman] || p.halaman
        }));
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
                /* Configured but live data is not yet generated / retrieved (waiting for Google's first crawl) */
                !isLive && (
                    <div className="mb-6 flex items-center gap-3 px-5 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-fade-in shadow-lg">
                        <div className="p-2 bg-emerald-500/10 rounded-xl">
                            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                        </div>
                        <div>
                            <p className="text-emerald-400 font-extrabold text-sm tracking-wide">{t('ga_connected_title')}</p>
                            <p className="text-zinc-300 text-xs mt-0.5 leading-relaxed">{t('ga_connected_desc')}</p>
                        </div>
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
                <div className="mb-5">
                    <h2 className="text-white font-bold text-base">{t('monthly_visitors_views')}</h2>
                    <p className="text-zinc-500 text-xs mt-0.5">{t('traffic_trend_desc')}</p>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={monthlyVisitorsMapped} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="bulan" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
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
                            <Bar dataKey="views" fill={GOLD} radius={[0, 6, 6, 0]}>
                                {topPagesMapped.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? GOLD : AMBER} />)}
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
        </AdminLayout>
    );
}
