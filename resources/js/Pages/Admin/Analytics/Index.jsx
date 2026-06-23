import React, { useMemo, useState, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    BarChart2, Users, Eye, Clock, TrendingUp, HelpCircle, Key, 
    Shield, Terminal, Copy, Check, ChevronDown, ChevronUp 
} from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

const AnalyticsCharts = React.lazy(() => import('@/Components/Admin/AnalyticsCharts'));

function AnalyticsChartsSkeleton() {
    return (
        <div className="animate-pulse">
            {/* Line Chart Skeleton */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 mb-6 h-[362px] flex flex-col justify-between">
                <div>
                    <div className="h-5 bg-zinc-800 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-zinc-800 rounded w-1/3"></div>
                </div>
                <div className="h-[260px] bg-zinc-900/40 rounded-xl mt-4 flex items-end p-4 gap-4">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="bg-zinc-800/60 rounded-t w-full" style={{ height: `${30 + (i % 3) * 20}%` }} />
                    ))}
                </div>
            </div>

            {/* Bar + Pie Row Skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Bar Chart Skeleton */}
                <div className="xl:col-span-2 bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 h-[322px] flex flex-col justify-between">
                    <div>
                        <div className="h-5 bg-zinc-800 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-zinc-800 rounded w-1/3"></div>
                    </div>
                    <div className="h-[220px] bg-zinc-900/40 rounded-xl mt-4 flex items-end p-4 gap-4">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className="bg-zinc-800/60 rounded-t w-full" style={{ height: `${20 + (i % 3) * 25}%` }} />
                        ))}
                    </div>
                </div>

                {/* Pie Chart Skeleton */}
                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 h-[322px] flex flex-col justify-between">
                    <div>
                        <div className="h-5 bg-zinc-800 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
                    </div>
                    <div className="h-[180px] w-[180px] rounded-full border-[15px] border-zinc-800/60 mx-auto my-2 animate-spin-slow"></div>
                    <div className="space-y-2 mt-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                                    <div className="h-3 bg-zinc-800 rounded w-12" />
                                </div>
                                <div className="h-3 bg-zinc-800 rounded w-8" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Most Viewed Articles Skeleton */}
            <div className="mt-6 bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 h-[322px] flex flex-col justify-between">
                <div>
                    <div className="h-5 bg-zinc-800 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-zinc-800 rounded w-1/3"></div>
                </div>
                <div className="h-[220px] bg-zinc-900/40 rounded-xl mt-4 flex items-end p-4 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-zinc-800/60 rounded-t w-full" style={{ height: `${40 + (i % 2) * 30}%` }} />
                    ))}
                </div>
            </div>

            {/* Most Viewed Products Skeleton */}
            <div className="mt-6 bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 h-[322px] flex flex-col justify-between">
                <div>
                    <div className="h-5 bg-zinc-800 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-zinc-800 rounded w-1/3"></div>
                </div>
                <div className="h-[220px] bg-zinc-900/40 rounded-xl mt-4 flex items-end p-4 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-zinc-800/60 rounded-t w-full" style={{ height: `${30 + (i % 2) * 40}%` }} />
                    ))}
                </div>
            </div>

            {/* Most Viewed Projects Skeleton */}
            <div className="mt-6 bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 h-[322px] flex flex-col justify-between">
                <div>
                    <div className="h-5 bg-zinc-800 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-zinc-800 rounded w-1/3"></div>
                </div>
                <div className="h-[220px] bg-zinc-900/40 rounded-xl mt-4 flex items-end p-4 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-zinc-800/60 rounded-t w-full" style={{ height: `${50 + (i % 2) * 20}%` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function AnalyticsIndex({ trailingTwelveMonths, yearlyData, topPages, deviceData, stats, isConfigured, isLive, errorMessage, mostViewedArticles, allViewedArticles, mostViewedProducts, allViewedProducts, mostViewedProjects, allViewedProjects }) {
    const { t, lang } = useTranslation();
    const [copiedText, setCopiedText] = useState('');
    const [showSetup, setShowSetup] = useState(true);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedText(text);
        setTimeout(() => setCopiedText(''), 2000);
    };

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

            {/* Dynamic Charts (Lazy Loaded) */}
            <Suspense fallback={<AnalyticsChartsSkeleton />}>
                <AnalyticsCharts
                    trailingTwelveMonths={trailingTwelveMonths}
                    yearlyData={yearlyData}
                    topPages={topPages}
                    deviceData={deviceData}
                    stats={stats}
                    mostViewedArticles={mostViewedArticles}
                    allViewedArticles={allViewedArticles}
                    mostViewedProducts={mostViewedProducts}
                    allViewedProducts={allViewedProducts}
                    mostViewedProjects={mostViewedProjects}
                    allViewedProjects={allViewedProjects}
                />
            </Suspense>
        </AdminLayout>
    );
}
