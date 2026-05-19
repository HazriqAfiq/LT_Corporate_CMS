<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PageResource\Pages;
use App\Models\Page;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PageResource extends Resource
{
    protected static ?string $model = Page::class;
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-document-duplicate';
    protected static string | \UnitEnum | null $navigationGroup = 'Kandungan';
    protected static ?string $navigationLabel = 'Halaman';
    protected static ?string $modelLabel = 'Halaman';
    protected static ?string $pluralModelLabel = 'Halaman';
    protected static ?int $navigationSort = 2;

    public static function form(Schema $form): Schema
    {
        return $form->schema([
            Section::make('Kandungan Halaman')->schema([
                Forms\Components\TextInput::make('title')->label('Tajuk (BM)')->required()->maxLength(255)
                    ->live(onBlur: true)->afterStateUpdated(fn ($set, ?string $state) => $set('slug', \Illuminate\Support\Str::slug($state))),
                Forms\Components\TextInput::make('title_en')->label('Tajuk (EN)')->maxLength(255),
                Forms\Components\TextInput::make('slug')->label('Slug')->required()->unique(ignoreRecord: true),
                Forms\Components\Select::make('template')->label('Template')->options(['default' => 'Default', 'full-width' => 'Full Width', 'sidebar' => 'Dengan Sidebar'])->default('default'),
                Forms\Components\RichEditor::make('content')->label('Kandungan (BM)')->columnSpanFull(),
                Forms\Components\RichEditor::make('content_en')->label('Kandungan (EN)')->columnSpanFull(),
            ])->columns(2),
            Section::make('SEO & Tetapan')->schema([
                Forms\Components\FileUpload::make('featured_image')->label('Imej Utama')->image()->directory('pages'),
                Forms\Components\TextInput::make('meta_title')->label('Meta Title'),
                Forms\Components\TextInput::make('meta_title_en')->label('Meta Title (EN)'),
                Forms\Components\Textarea::make('meta_description')->label('Meta Description')->rows(2),
                Forms\Components\Textarea::make('meta_description_en')->label('Meta Description (EN)')->rows(2),
                Forms\Components\Toggle::make('is_published')->label('Diterbitkan')->default(false),
                Forms\Components\DateTimePicker::make('published_at')->label('Tarikh Terbit'),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('title')->label('Tajuk')->searchable()->sortable(),
            Tables\Columns\TextColumn::make('slug')->label('Slug')->searchable(),
            Tables\Columns\TextColumn::make('template')->label('Template')->badge(),
            Tables\Columns\IconColumn::make('is_published')->label('Diterbitkan')->boolean(),
            Tables\Columns\TextColumn::make('updated_at')->label('Dikemaskini')->dateTime('d M Y')->sortable(),
        ])->defaultSort('title')
        ->actions([\Filament\Actions\EditAction::make(), \Filament\Actions\DeleteAction::make()])
        ->bulkActions([\Filament\Actions\BulkActionGroup::make([\Filament\Actions\DeleteBulkAction::make()])]);
    }

    public static function canViewAny(): bool
    {
        return auth()->user()->hasPermissionTo('view_pages');
    }

    public static function canCreate(): bool
    {
        return auth()->user()->hasPermissionTo('create_pages');
    }

    public static function canEdit(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return auth()->user()->hasPermissionTo('edit_pages');
    }

    public static function canDelete(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return auth()->user()->hasPermissionTo('delete_pages');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPages::route('/'),
            'create' => Pages\CreatePage::route('/create'),
            'edit' => Pages\EditPage::route('/{record}/edit'),
        ];
    }
}
