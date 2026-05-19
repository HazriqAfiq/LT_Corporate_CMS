<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SettingResource\Pages;
use App\Models\Setting;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class SettingResource extends Resource
{
    protected static ?string $model = Setting::class;
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-cog-6-tooth';
    protected static string | \UnitEnum | null $navigationGroup = 'Sistem';
    protected static ?string $navigationLabel = 'Tetapan Website';
    protected static ?string $modelLabel = 'Tetapan';
    protected static ?string $pluralModelLabel = 'Tetapan';
    protected static ?int $navigationSort = 2;

    public static function form(Schema $form): Schema
    {
        return $form->schema([
            Section::make('Tetapan')->schema([
                Forms\Components\TextInput::make('key')->label('Kunci')->required()->unique(ignoreRecord: true)->disabled(fn (string $operation) => $operation === 'edit'),
                Forms\Components\TextInput::make('label')->label('Label (BM)'),
                Forms\Components\TextInput::make('label_en')->label('Label (EN)'),
                Forms\Components\Select::make('group')->label('Kumpulan')->options([
                    'general' => 'Umum',
                    'contact' => 'Maklumat Hubungan',
                    'social' => 'Media Sosial',
                    'company' => 'Maklumat Syarikat',
                    'seo' => 'SEO',
                    'footer' => 'Footer',
                ])->required(),
                Forms\Components\Select::make('type')->label('Jenis')->options([
                    'text' => 'Teks',
                    'textarea' => 'Teks Panjang',
                    'image' => 'Imej',
                    'boolean' => 'Ya/Tidak',
                ])->default('text')->required(),
                Forms\Components\Textarea::make('value')->label('Nilai')->rows(3)->columnSpanFull(),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('key')->label('Kunci')->searchable()->sortable()->copyable(),
            Tables\Columns\TextColumn::make('label')->label('Label')->searchable(),
            Tables\Columns\TextColumn::make('group')->label('Kumpulan')->badge()->color(fn (string $state): string => match ($state) {
                'general' => 'warning',
                'contact' => 'info',
                'social' => 'success',
                'company' => 'primary',
                'seo' => 'danger',
                'footer' => 'gray',
                default => 'gray',
            }),
            Tables\Columns\TextColumn::make('type')->label('Jenis')->badge(),
            Tables\Columns\TextColumn::make('value')->label('Nilai')->limit(40),
        ])->defaultSort('group')
        ->filters([
            Tables\Filters\SelectFilter::make('group')->label('Kumpulan')->options([
                'general' => 'Umum', 'contact' => 'Hubungan', 'social' => 'Media Sosial',
                'company' => 'Syarikat', 'seo' => 'SEO', 'footer' => 'Footer',
            ]),
        ])
        ->actions([\Filament\Actions\EditAction::make()])
        ->bulkActions([]);
    }

    public static function canViewAny(): bool
    {
        return auth()->user()->hasPermissionTo('view_settings');
    }

    public static function canCreate(): bool
    {
        return auth()->user()->hasRole('Super Admin');
    }

    public static function canEdit(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return auth()->user()->hasPermissionTo('edit_settings');
    }

    public static function canDelete(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return auth()->user()->hasRole('Super Admin');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSettings::route('/'),
            'create' => Pages\CreateSetting::route('/create'),
            'edit' => Pages\EditSetting::route('/{record}/edit'),
        ];
    }
}
