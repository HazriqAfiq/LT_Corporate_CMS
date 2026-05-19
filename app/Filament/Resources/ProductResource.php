<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Product;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Group;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-cube';
    protected static string | \UnitEnum | null $navigationGroup = 'Produk & Portfolio';
    protected static ?string $navigationLabel = 'Produk Digital';
    protected static ?string $modelLabel = 'Produk';
    protected static ?string $pluralModelLabel = 'Produk';
    protected static ?int $navigationSort = 1;

    public static function form(Schema $form): Schema
    {
        return $form->schema([
            Group::make()->schema([
                Section::make('Maklumat Produk')->schema([
                    Forms\Components\TextInput::make('name')->label('Nama Produk (BM)')->required()->maxLength(255)
                        ->live(onBlur: true)->afterStateUpdated(fn ($set, ?string $state) => $set('slug', \Illuminate\Support\Str::slug($state))),
                    Forms\Components\TextInput::make('name_en')->label('Nama Produk (EN)')->maxLength(255),
                    Forms\Components\TextInput::make('slug')->label('Slug')->required()->unique(ignoreRecord: true),
                    Forms\Components\Select::make('category')->label('Kategori')->options([
                        'Pengurusan' => 'Pengurusan', 'Sokongan' => 'Sokongan', 'AI' => 'AI',
                        'Kolaborasi' => 'Kolaborasi', 'Jualan' => 'Jualan', 'Acara' => 'Acara', 'Pematuhan' => 'Pematuhan',
                    ]),
                    Forms\Components\Textarea::make('description')->label('Penerangan Ringkas (BM)')->rows(3),
                    Forms\Components\Textarea::make('description_en')->label('Penerangan Ringkas (EN)')->rows(3),
                    Forms\Components\RichEditor::make('content')->label('Kandungan Penuh (BM)')->columnSpanFull(),
                    Forms\Components\RichEditor::make('content_en')->label('Kandungan Penuh (EN)')->columnSpanFull(),
                ])->columns(2),
                Section::make('Ciri-ciri Produk')->schema([
                    Forms\Components\TagsInput::make('features')->label('Ciri-ciri (BM)'),
                    Forms\Components\TagsInput::make('features_en')->label('Ciri-ciri (EN)'),
                ])->columns(2),
            ])->columnSpan(['lg' => 2]),
            Group::make()->schema([
                Section::make('Media')->schema([
                    Forms\Components\FileUpload::make('icon')->label('Ikon')->image()->directory('products/icons'),
                    Forms\Components\FileUpload::make('featured_image')->label('Imej Utama')->image()->directory('products'),
                ]),
                Section::make('Harga & Pautan')->schema([
                    Forms\Components\TextInput::make('price')->label('Harga')->prefix('RM'),
                    Forms\Components\TextInput::make('demo_url')->label('URL Demo')->url(),
                    Forms\Components\TextInput::make('order')->label('Susunan')->numeric()->default(0),
                ]),
                Section::make('Status')->schema([
                    Forms\Components\Toggle::make('is_active')->label('Aktif')->default(true),
                    Forms\Components\Toggle::make('is_featured')->label('Pilihan Utama'),
                ]),
                Section::make('SEO')->schema([
                    Forms\Components\TextInput::make('meta_title')->label('Meta Title'),
                    Forms\Components\Textarea::make('meta_description')->label('Meta Description')->rows(2),
                ])->collapsed(),
            ])->columnSpan(['lg' => 1]),
        ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\ImageColumn::make('icon')->label('Ikon')->circular(),
            Tables\Columns\TextColumn::make('name')->label('Nama')->searchable()->sortable(),
            Tables\Columns\TextColumn::make('category')->label('Kategori')->badge(),
            Tables\Columns\TextColumn::make('price')->label('Harga')->prefix('RM '),
            Tables\Columns\TextColumn::make('order')->label('Susunan')->sortable(),
            Tables\Columns\IconColumn::make('is_active')->label('Aktif')->boolean(),
            Tables\Columns\IconColumn::make('is_featured')->label('Utama')->boolean(),
        ])->defaultSort('order')
        ->filters([
            Tables\Filters\TernaryFilter::make('is_active')->label('Aktif'),
            Tables\Filters\TernaryFilter::make('is_featured')->label('Utama'),
        ])
        ->actions([\Filament\Actions\EditAction::make(), \Filament\Actions\DeleteAction::make()])
        ->bulkActions([\Filament\Actions\BulkActionGroup::make([\Filament\Actions\DeleteBulkAction::make()])])
        ->reorderable('order');
    }

    public static function canViewAny(): bool
    {
        return auth()->user()->hasPermissionTo('view_products');
    }

    public static function canCreate(): bool
    {
        return auth()->user()->hasPermissionTo('create_products');
    }

    public static function canEdit(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return auth()->user()->hasPermissionTo('edit_products');
    }

    public static function canDelete(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return auth()->user()->hasPermissionTo('delete_products');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
