<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Analytics\Facades\Analytics;
use Spatie\Analytics\Period;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $propertyId = config('analytics.property_id');
        $credentialsPath = config('analytics.service_account_credentials_json');
        
        $isConfigured = !empty($propertyId) && file_exists($credentialsPath);

        // Fallback demo data
        $monthlyVisitors = [
            ['bulan' => 'Jan', 'Pelawat' => 1200, 'Page Views' => 3400],
            ['bulan' => 'Feb', 'Pelawat' => 1900, 'Page Views' => 5200],
            ['bulan' => 'Mac', 'Pelawat' => 1500, 'Page Views' => 4100],
            ['bulan' => 'Apr', 'Pelawat' => 2400, 'Page Views' => 6800],
            ['bulan' => 'Mei', 'Pelawat' => 2100, 'Page Views' => 5900],
            ['bulan' => 'Jun', 'Pelawat' => 2800, 'Page Views' => 7600],
            ['bulan' => 'Jul', 'Pelawat' => 3200, 'Page Views' => 8900],
            ['bulan' => 'Ogo', 'Pelawat' => 2900, 'Page Views' => 8100],
            ['bulan' => 'Sep', 'Pelawat' => 3500, 'Page Views' => 9700],
            ['bulan' => 'Okt', 'Pelawat' => 3800, 'Page Views' => 10400],
            ['bulan' => 'Nov', 'Pelawat' => 4100, 'Page Views' => 11200],
            ['bulan' => 'Dis', 'Pelawat' => 4500, 'Page Views' => 12300],
        ];

        $topPages = [
            ['halaman' => 'Laman Utama', 'views' => 8420],
            ['halaman' => 'Perkhidmatan', 'views' => 4210],
            ['halaman' => 'Artikel', 'views' => 3180],
            ['halaman' => 'Portfolio', 'views' => 2640],
            ['halaman' => 'Tentang Kami', 'views' => 1920],
            ['halaman' => 'Hubungi Kami', 'views' => 1480],
        ];

        $deviceData = [
            ['name' => 'Desktop', 'value' => 52],
            ['name' => 'Mobile', 'value' => 38],
            ['name' => 'Tablet', 'value' => 10],
        ];

        $stats = [
            'total_visitors' => '34,521',
            'page_views' => '97,430',
            'avg_session_time' => '3m 42s',
            'bounce_rate' => '38.4%',
            'change_visitors' => '+12%',
            'change_views' => '+18%',
            'change_time' => '+5%',
            'change_bounce' => '-3%',
        ];

        $isLive = false;

        if ($isConfigured) {
            try {
                // Fetch metrics from Google Analytics
                $period = Period::days(30);

                // 1. Fetch visitors & page views grouped by day (last 30 days)
                $dailyReport = Analytics::fetchTotalVisitorsAndPageViews($period);
                
                // Aggregate daily report into months if we want monthly, 
                // but since the dashboard is dynamic, let's map daily report for the line chart (e.g. last 30 days)
                $formattedTraffic = [];
                foreach ($dailyReport as $row) {
                    $date = Carbon::parse($row['date']);
                    $formattedTraffic[] = [
                        'bulan' => $date->format('d M'),
                        'Pelawat' => $row['activeUsers'],
                        'Page Views' => $row['screenPageViews']
                    ];
                }
                if (!empty($formattedTraffic)) {
                    $monthlyVisitors = $formattedTraffic;
                }

                // 2. Fetch top pages
                $pagesReport = Analytics::fetchMostVisitedPages($period, 10);
                $formattedPages = [];
                foreach ($pagesReport as $row) {
                    $formattedPages[] = [
                        'halaman' => $row['pageTitle'],
                        'views' => $row['screenPageViews']
                    ];
                }
                if (!empty($formattedPages)) {
                    $topPages = $formattedPages;
                }

                // 3. Fetch device categories
                $deviceReport = Analytics::get($period, ['activeUsers'], ['deviceCategory']);
                $formattedDevices = [];
                $totalUsers = 0;
                foreach ($deviceReport as $row) {
                    $totalUsers += $row['activeUsers'];
                }
                foreach ($deviceReport as $row) {
                    $pct = $totalUsers > 0 ? round(($row['activeUsers'] / $totalUsers) * 100) : 0;
                    $formattedDevices[] = [
                        'name' => ucfirst($row['deviceCategory']),
                        'value' => (int) $pct
                    ];
                }
                if (!empty($formattedDevices)) {
                    $deviceData = $formattedDevices;
                }

                // 4. Calculate stats summary for last 30 days vs previous 30 days
                $currentPeriod = Period::days(30);
                // Previous 30 days (starting 60 days ago, ending 30 days ago)
                $prevStartDate = now()->subDays(60);
                $prevEndDate = now()->subDays(30);
                $prevPeriod = Period::create($prevStartDate, $prevEndDate);

                // Current period queries
                $currentSummary = Analytics::get($currentPeriod, ['activeUsers', 'screenPageViews', 'averageSessionDuration', 'bounceRate']);
                $prevSummary = Analytics::get($prevPeriod, ['activeUsers', 'screenPageViews', 'averageSessionDuration', 'bounceRate']);

                $currUsers = $currentSummary[0]['activeUsers'] ?? 0;
                $currViews = $currentSummary[0]['screenPageViews'] ?? 0;
                $currSession = $currentSummary[0]['averageSessionDuration'] ?? 0;
                $currBounce = $currentSummary[0]['bounceRate'] ?? 0;

                $prevUsers = $prevSummary[0]['activeUsers'] ?? 0;
                $prevViews = $prevSummary[0]['screenPageViews'] ?? 0;
                $prevSession = $prevSummary[0]['averageSessionDuration'] ?? 0;
                $prevBounce = $prevSummary[0]['bounceRate'] ?? 0;

                // Format Session duration to minutes:seconds
                $avgMinutes = floor($currSession / 60);
                $avgSeconds = round($currSession % 60);

                // Percentages calculations
                $calcPct = function($curr, $prev, $isLowerBetter = false) {
                    if ($prev == 0) return $curr > 0 ? '+100%' : '0%';
                    $diff = (($curr - $prev) / $prev) * 100;
                    $sign = $diff >= 0 ? '+' : '';
                    return $sign . round($diff, 1) . '%';
                };

                $stats = [
                    'total_visitors' => number_format($currUsers),
                    'page_views' => number_format($currViews),
                    'avg_session_time' => $avgMinutes . 'm ' . $avgSeconds . 's',
                    'bounce_rate' => round($currBounce * 100, 1) . '%',
                    'change_visitors' => $calcPct($currUsers, $prevUsers),
                    'change_views' => $calcPct($currViews, $prevViews),
                    'change_time' => $calcPct($currSession, $prevSession),
                    'change_bounce' => $calcPct($currBounce, $prevBounce, true),
                ];

                $isLive = true;

            } catch (\Throwable $e) {
                \Log::warning('Google Analytics Data Fetch failed. Using fallback demo data: ' . $e->getMessage());
                $isLive = false;
            }
        }

        return Inertia::render('Admin/Analytics/Index', [
            'monthlyVisitors' => $monthlyVisitors,
            'topPages'        => $topPages,
            'deviceData'      => $deviceData,
            'stats'           => $stats,
            'isConfigured'    => $isConfigured,
            'isLive'          => $isLive,
        ]);
    }
}
