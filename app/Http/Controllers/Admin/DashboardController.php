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
            ],
            'recent_articles' => Article::with('featuredMedia')->latest()->limit(5)->get()->map(function($article) {
                return [
                    'id' => $article->id,
                    'title' => $article->title,
                    'featured_image' => $article->featuredMedia ? $article->featuredMedia->url : null,
                    'status' => $article->is_published ? 'Diterbitkan' : 'Draf',
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
                    'status' => $inq->is_read ? ($inq->replied_at ? 'Selesai' : 'Diproses') : 'Baru',
                    'date' => $inq->created_at->format('d M Y'),
                ];
            })
        ]);
    }
}
