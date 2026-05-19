<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ArticleResource\Pages;
use App\Models\Article;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Group;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ArticleResource extends Resource
{
    protected static ?string $model = Article::class;
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-newspaper';
    protected static string | \UnitEnum | null $navigationGroup = 'Kandungan';
    protected static ?string $navigationLabel = 'Artikel';
    protected static ?string $modelLabel = 'Artikel';
    protected static ?string $pluralModelLabel = 'Artikel';
    protected static ?int $navigationSort = 3;

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Group::make()
                    ->schema([
                        Section::make('Kandungan Artikel')
                            ->schema([
                                Forms\Components\TextInput::make('title')
                                    ->label('Tajuk (BM)')
                                    ->required()
                                    ->maxLength(255)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn ($set, ?string $state) => $set('slug', \Illuminate\Support\Str::slug($state))),
                                Forms\Components\TextInput::make('title_en')
                                    ->label('Tajuk (EN)')
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('slug')
                                    ->label('Slug')
                                    ->required()
                                    ->unique(ignoreRecord: true)
                                    ->maxLength(255),
                                Forms\Components\Textarea::make('excerpt')
                                    ->label('Ringkasan (BM)')
                                    ->rows(3),
                                Forms\Components\Textarea::make('excerpt_en')
                                    ->label('Ringkasan (EN)')
                                    ->rows(3),
                                Forms\Components\RichEditor::make('content')
                                    ->label('Kandungan (BM)')
                                    ->required()
                                    ->columnSpanFull(),
                                Forms\Components\RichEditor::make('content_en')
                                    ->label('Kandungan (EN)')
                                    ->columnSpanFull(),
                            ])->columns(2),
                    ])->columnSpan(['lg' => 2]),

                Group::make()
                    ->schema([
                        Section::make('Tetapan')
                            ->schema([
                                Forms\Components\FileUpload::make('featured_image')
                                    ->label('Imej Utama')
                                    ->image()
                                    ->directory('articles'),
                                Forms\Components\Select::make('category')
                                    ->label('Kategori')
                                    ->options([
                                        'berita' => 'Berita',
                                        'teknologi' => 'Teknologi',
                                        'tips' => 'Tips & Tutorial',
                                        'pengumuman' => 'Pengumuman',
                                        'kajian-kes' => 'Kajian Kes',
                                    ])
                                    ->searchable(),
                                Forms\Components\TagsInput::make('tags')
                                    ->label('Tag'),
                                Forms\Components\Select::make('author_id')
                                    ->label('Penulis')
                                    ->relationship('author', 'name')
                                    ->default(auth()->id())
                                    ->required(),
                            ]),

                        Section::make('Status')
                            ->schema([
                                Forms\Components\Toggle::make('is_published')
                                    ->label('Diterbitkan')
                                    ->default(false),
                                Forms\Components\Toggle::make('is_featured')
                                    ->label('Pilihan Utama'),
                                Forms\Components\DateTimePicker::make('published_at')
                                    ->label('Tarikh Terbit'),
                            ]),

                        Section::make('SEO')
                            ->schema([
                                Forms\Components\TextInput::make('meta_title')
                                    ->label('Meta Title')
                                    ->maxLength(255),
                                Forms\Components\Textarea::make('meta_description')
                                    ->label('Meta Description')
                                    ->rows(3),
                            ])->collapsed(),
                    ])->columnSpan(['lg' => 1]),
            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('featured_image')
                    ->label('Imej')
                    ->square(),
                Tables\Columns\TextColumn::make('title')
                    ->label('Tajuk')
                    ->searchable()
                    ->sortable()
                    ->limit(40),
                Tables\Columns\TextColumn::make('category')
                    ->label('Kategori')
                    ->badge(),
                Tables\Columns\TextColumn::make('author.name')
                    ->label('Penulis')
                    ->sortable(),
                Tables\Columns\TextColumn::make('views_count')
                    ->label('Tontonan')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_published')
                    ->label('Diterbitkan')
                    ->boolean(),
                Tables\Columns\IconColumn::make('is_featured')
                    ->label('Utama')
                    ->boolean(),
                Tables\Columns\TextColumn::make('published_at')
                    ->label('Tarikh Terbit')
                    ->dateTime('d M Y')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->label('Kategori')
                    ->options([
                        'berita' => 'Berita',
                        'teknologi' => 'Teknologi',
                        'tips' => 'Tips & Tutorial',
                        'pengumuman' => 'Pengumuman',
                        'kajian-kes' => 'Kajian Kes',
                    ]),
                Tables\Filters\TernaryFilter::make('is_published')
                    ->label('Diterbitkan'),
                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Pilihan Utama'),
            ])
            ->actions([
                \Filament\Actions\EditAction::make(),
                \Filament\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                \Filament\Actions\BulkActionGroup::make([
                    \Filament\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function canViewAny(): bool
    {
        return auth()->user()->hasPermissionTo('view_articles');
    }

    public static function canCreate(): bool
    {
        return auth()->user()->hasPermissionTo('create_articles');
    }

    public static function canEdit(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return auth()->user()->hasPermissionTo('edit_articles');
    }

    public static function canDelete(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return auth()->user()->hasPermissionTo('delete_articles');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListArticles::route('/'),
            'create' => Pages\CreateArticle::route('/create'),
            'edit' => Pages\EditArticle::route('/{record}/edit'),
        ];
    }
}
