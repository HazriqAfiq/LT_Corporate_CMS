<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MediaResource\Pages;
use App\Models\Media;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class MediaResource extends Resource
{
    protected static ?string $model = Media::class;
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-photo';
    protected static string | \UnitEnum | null $navigationGroup = 'Kandungan';
    protected static ?string $navigationLabel = 'Media';
    protected static ?string $modelLabel = 'Media';
    protected static ?string $pluralModelLabel = 'Media';
    protected static ?int $navigationSort = 4;

    public static function form(Schema $form): Schema
    {
        return $form->schema([
            Section::make('Muat Naik Media')->schema([
                Forms\Components\FileUpload::make('path')
                    ->label('Fail')
                    ->directory('media')
                    ->visibility('public')
                    ->required()
                    ->columnSpanFull()
                    ->acceptedFileTypes(['image/*', 'application/pdf', 'video/*'])
                    ->maxSize(10240)
                    ->afterStateUpdated(function ($state, $set) {
                        if ($state) {
                            $set('filename', basename($state));
                            $set('original_filename', basename($state));
                        }
                    }),
                Forms\Components\Hidden::make('filename'),
                Forms\Components\Hidden::make('original_filename'),
                Forms\Components\Hidden::make('disk')->default('public'),
                Forms\Components\Hidden::make('uploaded_by')->default(auth()->id()),
            ]),
            Section::make('Maklumat Media')->schema([
                Forms\Components\TextInput::make('title')->label('Tajuk'),
                Forms\Components\TextInput::make('alt_text')->label('Teks Alt (untuk SEO)'),
                Forms\Components\Select::make('collection')->label('Koleksi')->options([
                    'default' => 'Default',
                    'sliders' => 'Slider',
                    'articles' => 'Artikel',
                    'products' => 'Produk',
                    'projects' => 'Portfolio',
                ])->default('default'),
            ])->columns(3),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\ImageColumn::make('path')
                ->label('Preview')
                ->square()
                ->visibility('public'),
            Tables\Columns\TextColumn::make('original_filename')
                ->label('Nama Fail')
                ->searchable()
                ->sortable()
                ->limit(30),
            Tables\Columns\TextColumn::make('mime_type')
                ->label('Jenis')
                ->badge(),
            Tables\Columns\TextColumn::make('human_size')
                ->label('Saiz'),
            Tables\Columns\TextColumn::make('collection')
                ->label('Koleksi')
                ->badge()
                ->color('info'),
            Tables\Columns\TextColumn::make('uploader.name')
                ->label('Dimuat Naik Oleh'),
            Tables\Columns\TextColumn::make('created_at')
                ->label('Tarikh')
                ->dateTime('d M Y')
                ->sortable(),
        ])->defaultSort('created_at', 'desc')
        ->filters([
            Tables\Filters\SelectFilter::make('collection')->label('Koleksi')->options([
                'default' => 'Default', 'sliders' => 'Slider', 'articles' => 'Artikel',
                'products' => 'Produk', 'projects' => 'Portfolio',
            ]),
        ])
        ->actions([\Filament\Actions\EditAction::make(), \Filament\Actions\DeleteAction::make()])
        ->bulkActions([\Filament\Actions\BulkActionGroup::make([\Filament\Actions\DeleteBulkAction::make()])]);
    }

    public static function canViewAny(): bool
    {
        return auth()->user()->hasPermissionTo('view_media');
    }

    public static function canCreate(): bool
    {
        return auth()->user()->hasPermissionTo('upload_media');
    }

    public static function canEdit(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return auth()->user()->hasPermissionTo('upload_media');
    }

    public static function canDelete(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return auth()->user()->hasPermissionTo('delete_media');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMedia::route('/'),
            'create' => Pages\CreateMedia::route('/create'),
            'edit' => Pages\EditMedia::route('/{record}/edit'),
        ];
    }
}
