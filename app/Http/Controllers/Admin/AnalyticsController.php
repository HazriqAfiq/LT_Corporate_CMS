<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Analytics\Facades\Analytics;
use Spatie\Analytics\Period;
use App\Models\Article;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $propertyId = config('analytics.property_id');
        $credentialsPath = config('analytics.service_account_credentials_json');
        
        $isConfigured = !empty($propertyId) && file_exists($credentialsPath);
        $isLive = $isConfigured;

        // Fallback demo data
        $monthlyVisitors = [
            ['bulan' => 'Jan', 'Pelawat' => 0, 'Page Views' => 0],
            ['bulan' => 'Feb', 'Pelawat' => 0, 'Page Views' => 0],
            ['bulan' => 'Mac', 'Pelawat' => 0, 'Page Views' => 0],
            ['bulan' => 'Apr', 'Pelawat' => 0, 'Page Views' => 0],
            ['bulan' => 'Mei', 'Pelawat' => 0, 'Page Views' => 0],
            ['bulan' => 'Jun', 'Pelawat' => 0, 'Page Views' => 0],
            ['bulan' => 'Jul', 'Pelawat' => 0, 'Page Views' => 0],
            ['bulan' => 'Ogo', 'Pelawat' => 0, 'Page Views' => 0],
            ['bulan' => 'Sep', 'Pelawat' => 0, 'Page Views' => 0],
            ['bulan' => 'Okt', 'Pelawat' => 0, 'Page Views' => 0],
            ['bulan' => 'Nov', 'Pelawat' => 0, 'Page Views' => 0],
            ['bulan' => 'Dis', 'Pelawat' => 0, 'Page Views' => 0],
        ];

        $topPages = [
            ['halaman' => 'Laman Utama', 'views' => 0],
            ['halaman' => 'Perkhidmatan', 'views' => 0],
            ['halaman' => 'Artikel', 'views' => 0],
            ['halaman' => 'Portfolio', 'views' => 0],
            ['halaman' => 'Tentang Kami', 'views' => 0],
            ['halaman' => 'Hubungi Kami', 'views' => 0],
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

        $mostViewedArticles = Article::published()
            ->latest('views_count')
            ->take(6)
            ->get(['id', 'title', 'title_en', 'slug', 'views_count'])
            ->toArray();

        $allViewedArticles = Article::published()
            ->latest('views_count')
            ->get(['id', 'title', 'title_en', 'slug', 'views_count'])
            ->toArray();

        return Inertia::render('Admin/Analytics/Index', [
            'monthlyVisitors'  => $monthlyVisitors,
            'topPages'         => $topPages,
            'deviceData'       => $deviceData,
            'stats'            => $stats,
            'isConfigured'     => $isConfigured,
            'isLive'           => $isLive,
            'mostViewedArticles' => $mostViewedArticles,
            'allViewedArticles'  => $allViewedArticles,
        ]);
    }
}
