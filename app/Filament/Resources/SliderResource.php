<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SliderResource\Pages;
use App\Models\Slider;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class SliderResource extends Resource
{
    protected static ?string $model = Slider::class;
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-photo';
    protected static string | \UnitEnum | null $navigationGroup = 'Kandungan';
    protected static ?string $navigationLabel = 'Slider';
    protected static ?string $modelLabel = 'Slider';
    protected static ?string $pluralModelLabel = 'Slider';
    protected static ?int $navigationSort = 1;

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Section::make('Maklumat Slider')
                    ->description('Kandungan utama slider homepage')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->label('Tajuk (BM)')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('title_en')
                            ->label('Tajuk (EN)')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('subtitle')
                            ->label('Subtajuk (BM)')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('subtitle_en')
                            ->label('Subtajuk (EN)')
                            ->maxLength(255),
                        Forms\Components\Textarea::make('description')
                            ->label('Deskripsi (BM)')
                            ->maxLength(500)
                            ->columnSpanFull(),
                        Forms\Components\Textarea::make('description_en')
                            ->label('Deskripsi (EN)')
                            ->maxLength(500)
                            ->columnSpanFull(),
                    ])->columns(2),

                Section::make('Imej & Butang')
                    ->schema([
                        Forms\Components\FileUpload::make('image')
                            ->label('Imej Slider')
                            ->image()
                            ->directory('sliders')
                            ->disk('public')
                            ->required()
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('button_text')
                            ->label('Teks Butang (BM)')
                            ->maxLength(100),
                        Forms\Components\TextInput::make('button_text_en')
                            ->label('Teks Butang (EN)')
                            ->maxLength(100),
                        Forms\Components\TextInput::make('button_url')
                            ->label('URL Butang')
                            ->url()
                            ->maxLength(255),
                    ])->columns(3),

                Section::make('Tetapan')
                    ->schema([
                        Forms\Components\TextInput::make('order')
                            ->label('Susunan')
                            ->numeric()
                            ->default(0),
                        Forms\Components\Toggle::make('is_active')
                            ->label('Aktif')
                            ->default(true),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label('Imej')
                    ->square(),
                Tables\Columns\TextColumn::make('title')
                    ->label('Tajuk')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('subtitle')
                    ->label('Subtajuk')
                    ->limit(30),
                Tables\Columns\TextColumn::make('order')
                    ->label('Susunan')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Dikemaskini')
                    ->dateTime('d M Y')
                    ->sortable(),
            ])
            ->defaultSort('order')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Status'),
            ])
            ->actions([
                \Filament\Actions\EditAction::make(),
                \Filament\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                \Filament\Actions\BulkActionGroup::make([
                    \Filament\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->reorderable('order');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function canViewAny(): bool
    {
        return auth()->user()->hasPermissionTo('view_sliders');
    }

    public static function canCreate(): bool
    {
        return auth()->user()->hasPermissionTo('create_sliders');
    }

    public static function canEdit(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return auth()->user()->hasPermissionTo('edit_sliders');
    }

    public static function canDelete(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return auth()->user()->hasPermissionTo('delete_sliders');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSliders::route('/'),
            'create' => Pages\CreateSlider::route('/create'),
            'edit' => Pages\EditSlider::route('/{record}/edit'),
        ];
    }
}
