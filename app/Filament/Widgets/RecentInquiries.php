<?php

namespace App\Filament\Widgets;

use App\Models\ContactInquiry;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class RecentInquiries extends BaseWidget
{
    protected static ?int $sort = 2;
    protected int | string | array $columnSpan = 'full';
    protected static ?string $heading = 'Pertanyaan Terkini';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                ContactInquiry::query()
                    ->latest()
                    ->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama')
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('Emel')
                    ->searchable(),
                Tables\Columns\TextColumn::make('subject')
                    ->label('Subjek')
                    ->limit(40),
                Tables\Columns\IconColumn::make('is_read')
                    ->label('Dibaca')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tarikh')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->paginated(false);
    }
}
