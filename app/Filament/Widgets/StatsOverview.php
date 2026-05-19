<?php

namespace App\Filament\Widgets;

use App\Models\Article;
use App\Models\ContactInquiry;
use App\Models\Product;
use App\Models\Project;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        return [
            Stat::make('Artikel', Article::count())
                ->description('Jumlah artikel')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('warning')
                ->chart([3, 5, 7, 4, 6, 8, 5]),

            Stat::make('Produk', Product::where('is_active', true)->count())
                ->description('Produk aktif')
                ->descriptionIcon('heroicon-m-cube')
                ->color('success')
                ->chart([2, 3, 3, 5, 4, 6, 7]),

            Stat::make('Portfolio', Project::where('is_published', true)->count())
                ->description('Projek diterbitkan')
                ->descriptionIcon('heroicon-m-briefcase')
                ->color('info')
                ->chart([1, 2, 3, 2, 4, 3, 5]),

            Stat::make('Pertanyaan Baru', ContactInquiry::where('is_read', false)->count())
                ->description('Belum dibaca')
                ->descriptionIcon('heroicon-m-envelope')
                ->color('danger')
                ->chart([5, 3, 7, 4, 6, 2, 8]),
        ];
    }
}
