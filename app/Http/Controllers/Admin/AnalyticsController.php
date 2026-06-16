<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Analytics\Facades\Analytics;
use Spatie\Analytics\Period;
use Spatie\Analytics\OrderBy;
use App\Models\Article;
use App\Models\Product;
use App\Models\Project;
use Google\Analytics\Data\V1beta\FilterExpression;
use Google\Analytics\Data\V1beta\Filter;
use Google\Analytics\Data\V1beta\Filter\StringFilter;
use Google\Analytics\Data\V1beta\Filter\StringFilter\MatchType;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Carbon\Carbon;

class AnalyticsController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:access_analytics'),
        ];
    }
    public function index(Request $request)
    {
        $propertyId = config('analytics.property_id');
        $credentialsPath = config('analytics.service_account_credentials_json');
        
        $isConfigured = !empty($propertyId) && file_exists($credentialsPath);
        $isLive = false;
        $errorMessage = null;

        // Fallback/Default data (Trailing 12 months)
        $monthlyVisitors = [];
        $tempDate = Carbon::now()->subMonths(11)->startOfMonth();
        $monthMap = [
            'Jan' => 'Jan', 'Feb' => 'Feb', 'Mar' => 'Mac', 'Apr' => 'Apr',
            'May' => 'Mei', 'Jun' => 'Jun', 'Jul' => 'Jul', 'Aug' => 'Ogo',
            'Sep' => 'Sep', 'Oct' => 'Okt', 'Nov' => 'Nov', 'Dec' => 'Dis'
        ];
        for ($i = 0; $i < 12; $i++) {
            $engMonth = $tempDate->format('M');
            $malayMonth = $monthMap[$engMonth] ?? $engMonth;
            $monthlyVisitors[] = [
                'bulan' => $malayMonth . ' ' . $tempDate->format('y'),
                'Pelawat' => 0,
                'Page Views' => 0,
                'year' => $tempDate->format('Y'),
                'month' => $malayMonth
            ];
            $tempDate->addMonth();
        }

        $yearlyData = [
            '2026' => [
                ['bulan' => 'Jan', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2026', 'month' => 'Jan'],
                ['bulan' => 'Feb', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2026', 'month' => 'Feb'],
                ['bulan' => 'Mac', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2026', 'month' => 'Mac'],
                ['bulan' => 'Apr', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2026', 'month' => 'Apr'],
                ['bulan' => 'Mei', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2026', 'month' => 'Mei'],
                ['bulan' => 'Jun', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2026', 'month' => 'Jun'],
                ['bulan' => 'Jul', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2026', 'month' => 'Jul'],
                ['bulan' => 'Ogo', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2026', 'month' => 'Ogo'],
                ['bulan' => 'Sep', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2026', 'month' => 'Sep'],
                ['bulan' => 'Okt', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2026', 'month' => 'Okt'],
                ['bulan' => 'Nov', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2026', 'month' => 'Nov'],
                ['bulan' => 'Dis', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2026', 'month' => 'Dis'],
            ],
            '2025' => [
                ['bulan' => 'Jan', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2025', 'month' => 'Jan'],
                ['bulan' => 'Feb', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2025', 'month' => 'Feb'],
                ['bulan' => 'Mac', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2025', 'month' => 'Mac'],
                ['bulan' => 'Apr', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2025', 'month' => 'Apr'],
                ['bulan' => 'Mei', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2025', 'month' => 'Mei'],
                ['bulan' => 'Jun', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2025', 'month' => 'Jun'],
                ['bulan' => 'Jul', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2025', 'month' => 'Jul'],
                ['bulan' => 'Ogo', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2025', 'month' => 'Ogo'],
                ['bulan' => 'Sep', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2025', 'month' => 'Sep'],
                ['bulan' => 'Okt', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2025', 'month' => 'Okt'],
                ['bulan' => 'Nov', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2025', 'month' => 'Nov'],
                ['bulan' => 'Dis', 'Pelawat' => 0, 'Page Views' => 0, 'year' => '2025', 'month' => 'Dis'],
            ],
        ];

        $topPages = [
            ['halaman' => 'Laman Utama', 'views' => 0],
            ['halaman' => 'Perkhidmatan', 'views' => 0],
            ['halaman' => 'Artikel', 'views' => 0],
            ['halaman' => 'Portfolio', 'views' => 0],
            ['halaman' => 'Tentang Kami', 'views' => 0],
            ['halaman' => 'Hubungi Kami', 'views' => 0],
            ['halaman' => 'Produk', 'views' => 0],
        ];

        $deviceData = [
            ['name' => 'Desktop', 'value' => 0],
            ['name' => 'Mobile', 'value' => 0],
            ['name' => 'Tablet', 'value' => 0],
        ];

        $stats = [
            'total_visitors' => '0',
            'page_views' => '0',
            'avg_session_time' => '0s',
            'bounce_rate' => '0%',
            'change_visitors' => '0%',
            'change_views' => '0%',
            'change_time' => '0%',
            'change_bounce' => '0%',
        ];

        if ($isConfigured) {
            try {
                // Define filter to exclude /admin paths
                $excludeAdminFilter = new FilterExpression([
                    'not_expression' => new FilterExpression([
                        'filter' => new Filter([
                            'field_name' => 'pagePath',
                            'string_filter' => new StringFilter([
                                'match_type' => MatchType::BEGINS_WITH,
                                'value' => '/admin',
                            ]),
                        ]),
                    ]),
                ]);

                // 1. Fetch monthly visitors/views for the last 12 months trailing from today
                $startDate = Carbon::now()->subMonths(11)->startOfMonth();
                $endDate = Carbon::now();
                $period = Period::create($startDate, $endDate);

                $rawDaily = Analytics::get(
                    $period,
                    ['activeUsers', 'screenPageViews'],
                    ['date'],
                    365,
                    [OrderBy::dimension('date', true)],
                    0,
                    $excludeAdminFilter
                );
                
                $monthlyData = [];
                // Initialize all 12 trailing months with 0
                $tempDate = $startDate->copy();
                while ($tempDate <= $endDate) {
                    $yearMonth = $tempDate->format('Y-m');
                    $monthlyData[$yearMonth] = [
                        'year' => $tempDate->format('Y'),
                        'month' => $tempDate->format('M'),
                        'Pelawat' => 0,
                        'Page Views' => 0
                    ];
                    $tempDate->addMonth();
                }

                foreach ($rawDaily as $day) {
                    $dayCarbon = Carbon::parse($day['date']);
                    $yearMonth = $dayCarbon->format('Y-m');
                    if (isset($monthlyData[$yearMonth])) {
                        $monthlyData[$yearMonth]['Pelawat'] += $day['activeUsers'] ?? 0;
                        $monthlyData[$yearMonth]['Page Views'] += $day['screenPageViews'] ?? 0;
                    }
                }

                $monthMap = [
                    'Jan' => 'Jan', 'Feb' => 'Feb', 'Mar' => 'Mac', 'Apr' => 'Apr',
                    'May' => 'Mei', 'Jun' => 'Jun', 'Jul' => 'Jul', 'Aug' => 'Ogo',
                    'Sep' => 'Sep', 'Oct' => 'Okt', 'Nov' => 'Nov', 'Dec' => 'Dis'
                ];

                // Build trailing twelve months
                $monthlyVisitors = [];
                foreach ($monthlyData as $ym => $data) {
                    $malayMonth = $monthMap[$data['month']] ?? $data['month'];
                    $label = $malayMonth . ' ' . substr($data['year'], 2);
                    $monthlyVisitors[] = [
                        'bulan' => $label,
                        'Pelawat' => $data['Pelawat'],
                        'Page Views' => $data['Page Views'],
                        'year' => $data['year'],
                        'month' => $malayMonth
                    ];
                }

                // Build yearly calendar data (e.g. 2026, 2025)
                $years = [Carbon::now()->format('Y'), Carbon::now()->subYear()->format('Y')];
                $yearlyData = [];

                foreach ($years as $year) {
                    $yearlyData[$year] = [];
                    foreach ($monthMap as $eng => $malay) {
                        $monthNumbers = [
                            'Jan' => '01', 'Feb' => '02', 'Mar' => '03', 'Apr' => '04',
                            'May' => '05', 'Jun' => '06', 'Jul' => '07', 'Aug' => '08',
                            'Sep' => '09', 'Oct' => '10', 'Nov' => '11', 'Dec' => '12'
                        ];
                        $ymKey = $year . '-' . $monthNumbers[$eng];
                        
                        $views = 0;
                        $visitors = 0;
                        if (isset($monthlyData[$ymKey])) {
                            $views = $monthlyData[$ymKey]['Page Views'];
                            $visitors = $monthlyData[$ymKey]['Pelawat'];
                        }
                        
                        $yearlyData[$year][] = [
                            'bulan' => $malay,
                            'Pelawat' => $visitors,
                            'Page Views' => $views,
                            'year' => $year,
                            'month' => $malay
                        ];
                    }
                }

                // 2. Fetch top pages for the last 30 days
                $rawPages = Analytics::get(
                    Period::days(30),
                    ['screenPageViews'],
                    ['fullPageUrl', 'pagePath'],
                    250, // Fetch more to aggregate correctly
                    [],
                    0,
                    $excludeAdminFilter
                );
                
                $topPagesMap = [
                    'Laman Utama'  => 0,
                    'Perkhidmatan' => 0,
                    'Artikel'      => 0,
                    'Portfolio'    => 0,
                    'Tentang Kami' => 0,
                    'Hubungi Kami' => 0,
                    'Produk'       => 0,
                ];

                foreach ($rawPages as $page) {
                    $path = $page['pagePath'] ?? '';
                    if (empty($path)) {
                        $url = $page['fullPageUrl'] ?? '';
                        if (!empty($url)) {
                            if (!str_starts_with($url, 'http://') && !str_starts_with($url, 'https://')) {
                                $url = 'https://' . $url;
                            }
                            $path = parse_url($url, PHP_URL_PATH) ?: '/';
                        } else {
                            $path = '/';
                        }
                    }

                    $views = (int)($page['screenPageViews'] ?? 0);

                    // Map paths to their respective sections (exact match only, detail pages are not included)
                    $trimmedPath = rtrim($path, '/');
                    if ($trimmedPath === '') {
                        $topPagesMap['Laman Utama'] += $views;
                    } elseif ($trimmedPath === '/perkhidmatan') {
                        $topPagesMap['Perkhidmatan'] += $views;
                    } elseif ($trimmedPath === '/artikel') {
                        $topPagesMap['Artikel'] += $views;
                    } elseif ($trimmedPath === '/portfolio') {
                        $topPagesMap['Portfolio'] += $views;
                    } elseif ($trimmedPath === '/tentang-kami') {
                        $topPagesMap['Tentang Kami'] += $views;
                    } elseif ($trimmedPath === '/hubungi-kami') {
                        $topPagesMap['Hubungi Kami'] += $views;
                    } elseif ($trimmedPath === '/produk') {
                        $topPagesMap['Produk'] += $views;
                    }
                }

                $topPages = [];
                foreach ($topPagesMap as $name => $views) {
                    $topPages[] = [
                        'halaman' => $name,
                        'views' => $views,
                    ];
                }

                // Sort by views descending
                usort($topPages, function ($a, $b) {
                    return $b['views'] <=> $a['views'];
                });

                // 3. Fetch device category breakdown for the last 30 days
                $rawDevices = Analytics::get(
                    Period::days(30),
                    ['activeUsers'],
                    ['deviceCategory'],
                    10,
                    [],
                    0,
                    $excludeAdminFilter
                );

                $totalDevices = 0;
                $tempDevices = ['Desktop' => 0, 'Mobile' => 0, 'Tablet' => 0];
                foreach ($rawDevices as $row) {
                    $cat = ucfirst($row['deviceCategory'] ?? 'Desktop');
                    $val = (int)($row['activeUsers'] ?? 0);
                    if (isset($tempDevices[$cat])) {
                        $tempDevices[$cat] = $val;
                    } else {
                        $tempDevices['Desktop'] += $val;
                    }
                    $totalDevices += $val;
                }

                if ($totalDevices > 0) {
                    $deviceData = [
                        ['name' => 'Desktop', 'value' => round(($tempDevices['Desktop'] / $totalDevices) * 100)],
                        ['name' => 'Mobile', 'value' => round(($tempDevices['Mobile'] / $totalDevices) * 100)],
                        ['name' => 'Tablet', 'value' => round(($tempDevices['Tablet'] / $totalDevices) * 100)],
                    ];
                }

                // 4. Fetch 30-day stats and calculate change vs previous 30 days
                $stats30 = Analytics::get(
                    Period::days(30),
                    ['activeUsers', 'screenPageViews', 'averageSessionDuration', 'bounceRate'],
                    [],
                    10,
                    [],
                    0,
                    $excludeAdminFilter
                );

                $startPrev = Carbon::now()->subDays(60);
                $endPrev = Carbon::now()->subDays(30);
                $statsPrev = Analytics::get(
                    Period::create($startPrev, $endPrev),
                    ['activeUsers', 'screenPageViews', 'averageSessionDuration', 'bounceRate'],
                    [],
                    10,
                    [],
                    0,
                    $excludeAdminFilter
                );

                $current = $stats30[0] ?? [];
                $previous = $statsPrev[0] ?? [];

                $currVisitors = (int)($current['activeUsers'] ?? 0);
                $currViews = (int)($current['screenPageViews'] ?? 0);
                $currTime = (float)($current['averageSessionDuration'] ?? 0);
                $currBounce = (float)($current['bounceRate'] ?? 0);

                $prevVisitors = (int)($previous['activeUsers'] ?? 0);
                $prevViews = (int)($previous['screenPageViews'] ?? 0);
                $prevTime = (float)($previous['averageSessionDuration'] ?? 0);
                $prevBounce = (float)($previous['bounceRate'] ?? 0);

                $changeVisitors = $prevVisitors > 0 ? (($currVisitors - $prevVisitors) / $prevVisitors) * 100 : 0;
                $changeViews = $prevViews > 0 ? (($currViews - $prevViews) / $prevViews) * 100 : 0;
                $changeTime = $prevTime > 0 ? (($currTime - $prevTime) / $prevTime) * 100 : 0;
                $changeBounce = $prevBounce > 0 ? (($currBounce - $prevBounce) / $prevBounce) * 100 : 0;

                $stats = [
                    'total_visitors' => number_format($currVisitors),
                    'page_views' => number_format($currViews),
                    'avg_session_time' => round($currTime) . 's',
                    'bounce_rate' => round($currBounce * 100) . '%',
                    'change_visitors' => ($changeVisitors >= 0 ? '+' : '') . round($changeVisitors) . '%',
                    'change_views' => ($changeViews >= 0 ? '+' : '') . round($changeViews) . '%',
                    'change_time' => ($changeTime >= 0 ? '+' : '') . round($changeTime) . '%',
                    'change_bounce' => ($changeBounce >= 0 ? '+' : '') . round($changeBounce) . '%',
                ];

                $isLive = true;
            } catch (\Exception $e) {
                $isLive = false;
                $errorMessage = $e->getMessage();
                \Illuminate\Support\Facades\Log::error("Google Analytics Live Fetch Error: " . $errorMessage);
            }
        }

        $mostViewedArticles = Article::published()
            ->latest('views_count')
            ->take(6)
            ->get(['id', 'title', 'title_en', 'slug', 'views_count'])
            ->toArray();

        $allViewedArticles = Article::published()
            ->latest('views_count')
            ->get(['id', 'title', 'title_en', 'slug', 'views_count'])
            ->toArray();

        $mostViewedProducts = Product::active()
            ->latest('views_count')
            ->take(6)
            ->get(['id', 'name', 'name_en', 'slug', 'views_count'])
            ->toArray();

        $allViewedProducts = Product::active()
            ->latest('views_count')
            ->get(['id', 'name', 'name_en', 'slug', 'views_count'])
            ->toArray();

        $mostViewedProjects = Project::published()
            ->latest('views_count')
            ->take(6)
            ->get(['id', 'title', 'title_en', 'slug', 'views_count'])
            ->toArray();

        $allViewedProjects = Project::published()
            ->latest('views_count')
            ->get(['id', 'title', 'title_en', 'slug', 'views_count'])
            ->toArray();

        return Inertia::render('Admin/Analytics/Index', [
            'trailingTwelveMonths' => $monthlyVisitors,
            'yearlyData'       => $yearlyData,
            'topPages'         => $topPages,
            'deviceData'       => $deviceData,
            'stats'            => $stats,
            'isConfigured'     => $isConfigured,
            'isLive'           => $isLive,
            'errorMessage'     => $errorMessage,
            'mostViewedArticles' => $mostViewedArticles,
            'allViewedArticles'  => $allViewedArticles,
            'mostViewedProducts' => $mostViewedProducts,
            'allViewedProducts'  => $allViewedProducts,
            'mostViewedProjects' => $mostViewedProjects,
            'allViewedProjects'  => $allViewedProjects,
        ]);
    }
}
