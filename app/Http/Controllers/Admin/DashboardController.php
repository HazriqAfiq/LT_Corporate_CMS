<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ContactInquiry;
use App\Models\Project;
use Spatie\Activitylog\Models\Activity;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'articles' => Article::count(),
                'projects' => Project::count(),
                'inquiries' => ContactInquiry::count(),
                'products' => \App\Models\Product::count(), // products is requested by the stat cards
            ],
            'recent_articles' => Article::with('featuredMedia')->latest()->limit(5)->get()->map(function($article) {
                return [
                    'id' => $article->id,
                    'title' => $article->title,
                    'title_en' => $article->title_en,
                    'featured_image' => $article->featuredMedia ? $article->featuredMedia->url : null,
                    'status' => $article->is_archived 
                        ? 'archived' 
                        : ($article->is_published 
                            ? ($article->published_at && $article->published_at->isFuture() ? 'scheduled' : 'published') 
                            : 'draft'),
                    'author' => $article->author?->name ?? 'Admin',
                    'date' => $article->published_at ? $article->published_at->format('d M Y') : $article->created_at->format('d M Y'),
                ];
            }),
            'recent_activities' => Activity::latest()->limit(5)->get()->map(function($activity) {
                $properties = is_array($activity->properties) ? $activity->properties : (json_decode($activity->properties, true) ?? []);
                return [
                    'id' => $activity->id,
                    'description' => $activity->description,
                    'subtitle' => $properties['subtitle'] ?? '',
                    'date' => $activity->created_at->diffForHumans(),
                ];
            }),
            'recent_inquiries' => ContactInquiry::latest()->limit(5)->get()->map(function($inq) {
                return [
                    'id' => $inq->id,
                    'name' => $inq->name,
                    'subject' => $inq->subject,
                    'status' => $inq->is_read ? ($inq->replied_at ? 'status_completed' : 'status_processing') : 'new_badge',
                    'date' => $inq->created_at->format('d M Y'),
                ];
            }),
            'chart_data' => $this->getChartData()
        ]);
    }

    private function getChartData()
    {
        $months = [];
        $articles = [];
        $projects = [];
        $inquiries = [];

        // Build list of last 12 rolling months ending in the current month
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthKey = $date->format('Y-m'); // e.g. "2026-06"
            
            // Format to show Month Name and Year (e.g. "Jun 26" or "Jun 2026")
            // We translate month short names to BM names to match front-end's MONTHS array
            $monthShort = $date->format('M');
            $bmMonthMap = [
                'Jan' => 'Jan', 'Feb' => 'Feb', 'Mar' => 'Mac', 'Apr' => 'Apr', 
                'May' => 'Mei', 'Jun' => 'Jun', 'Jul' => 'Jul', 'Aug' => 'Ogo', 
                'Sep' => 'Sep', 'Oct' => 'Okt', 'Nov' => 'Nov', 'Dec' => 'Dis'
            ];
            $bmMonth = $bmMonthMap[$monthShort] ?? $monthShort;
            $yearStr = $date->format('y'); // e.g. "26"

            $months[] = "$bmMonth '$yearStr"; // e.g. "Mac '26" or "Jun '26"

            // Count records for this specific year/month
            $articles[] = Article::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();

            $projects[] = Project::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();

            $inquiries[] = ContactInquiry::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
        }

        return [
            'labels' => $months,
            'articles_monthly' => $articles,
            'projects_monthly' => $projects,
            'inquiries_monthly' => $inquiries,
        ];
    }
}
