<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProjectResource\Pages;
use App\Models\Project;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Group;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ProjectResource extends Resource
{
    protected static ?string $model = Project::class;
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-briefcase';
    protected static string | \UnitEnum | null $navigationGroup = 'Produk & Portfolio';
    protected static ?string $navigationLabel = 'Portfolio';
    protected static ?string $modelLabel = 'Projek';
    protected static ?string $pluralModelLabel = 'Portfolio';
    protected static ?int $navigationSort = 2;

    public static function form(Schema $form): Schema
    {
        return $form->schema([
            Group::make()->schema([
                Section::make('Maklumat Projek')->schema([
                    Forms\Components\TextInput::make('title')->label('Tajuk (BM)')->required()->maxLength(255)
                        ->live(onBlur: true)->afterStateUpdated(fn ($set, ?string $state) => $set('slug', \Illuminate\Support\Str::slug($state))),
                    Forms\Components\TextInput::make('title_en')->label('Tajuk (EN)')->maxLength(255),
                    Forms\Components\TextInput::make('slug')->label('Slug')->required()->unique(ignoreRecord: true),
                    Forms\Components\TextInput::make('client')->label('Klien'),
                    Forms\Components\Select::make('category')->label('Kategori')->options([
                        'web' => 'Pembangunan Web', 'mobile' => 'Aplikasi Mudah Alih', 'system' => 'Sistem',
                        'design' => 'Rekabentuk UI/UX', 'cloud' => 'Cloud & Hosting', 'ai' => 'AI & Automasi',
                    ]),
                    Forms\Components\TextInput::make('url')->label('URL Projek')->url(),
                    Forms\Components\Textarea::make('description')->label('Penerangan (BM)')->rows(3)->columnSpanFull(),
                    Forms\Components\Textarea::make('description_en')->label('Penerangan (EN)')->rows(3)->columnSpanFull(),
                    Forms\Components\RichEditor::make('content')->label('Kandungan (BM)')->columnSpanFull(),
                    Forms\Components\RichEditor::make('content_en')->label('Kandungan (EN)')->columnSpanFull(),
                ])->columns(2),
                Section::make('Testimoni')->schema([
                    Forms\Components\Textarea::make('testimonial')->label('Testimoni (BM)')->rows(2),
                    Forms\Components\Textarea::make('testimonial_en')->label('Testimoni (EN)')->rows(2),
                    Forms\Components\TextInput::make('testimonial_author')->label('Nama Pemberi Testimoni'),
                ])->columns(2),
            ])->columnSpan(['lg' => 2]),
            Group::make()->schema([
                Section::make('Media')->schema([
                    Forms\Components\FileUpload::make('featured_image')->label('Imej Utama')->image()->directory('projects'),
                    Forms\Components\FileUpload::make('images')->label('Galeri Imej')->image()->directory('projects/gallery')->multiple()->reorderable(),
                ]),
                Section::make('Teknologi')->schema([
                    Forms\Components\TagsInput::make('technologies')->label('Teknologi Digunakan'),
                ]),
                Section::make('Status')->schema([
                    Forms\Components\Toggle::make('is_published')->label('Diterbitkan')->default(true),
                    Forms\Components\Toggle::make('is_featured')->label('Pilihan Utama'),
                    Forms\Components\DatePicker::make('completed_at')->label('Tarikh Siap'),
                    Forms\Components\TextInput::make('order')->label('Susunan')->numeric()->default(0),
                ]),
            ])->columnSpan(['lg' => 1]),
        ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\ImageColumn::make('featured_image')->label('Imej')->square(),
            Tables\Columns\TextColumn::make('title')->label('Tajuk')->searchable()->sortable(),
            Tables\Columns\TextColumn::make('client')->label('Klien')->searchable(),
            Tables\Columns\TextColumn::make('category')->label('Kategori')->badge(),
            Tables\Columns\IconColumn::make('is_featured')->label('Utama')->boolean(),
            Tables\Columns\IconColumn::make('is_published')->label('Diterbitkan')->boolean(),
            Tables\Columns\TextColumn::make('completed_at')->label('Tarikh Siap')->date('M Y')->sortable(),
        ])->defaultSort('order')
        ->filters([
            Tables\Filters\SelectFilter::make('category')->label('Kategori')->options([
                'web' => 'Pembangunan Web', 'mobile' => 'Aplikasi Mudah Alih', 'system' => 'Sistem',
                'design' => 'Rekabentuk UI/UX', 'cloud' => 'Cloud & Hosting', 'ai' => 'AI & Automasi',
            ]),
        ])
        ->actions([\Filament\Actions\EditAction::make(), \Filament\Actions\DeleteAction::make()])
        ->bulkActions([\Filament\Actions\BulkActionGroup::make([\Filament\Actions\DeleteBulkAction::make()])]);
    }

    public static function canViewAny(): bool
    {
        return auth()->user()->hasPermissionTo('view_projects');
    }

    public static function canCreate(): bool
    {
        return auth()->user()->hasPermissionTo('create_projects');
    }

    public static function canEdit(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return auth()->user()->hasPermissionTo('edit_projects');
    }

    public static function canDelete(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return auth()->user()->hasPermissionTo('delete_projects');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProjects::route('/'),
            'create' => Pages\CreateProject::route('/create'),
            'edit' => Pages\EditProject::route('/{record}/edit'),
        ];
    }
}
