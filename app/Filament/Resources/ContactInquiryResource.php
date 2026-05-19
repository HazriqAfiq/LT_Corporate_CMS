<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactInquiryResource\Pages;
use App\Models\ContactInquiry;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ContactInquiryResource extends Resource
{
    protected static ?string $model = ContactInquiry::class;
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-envelope';
    protected static string | \UnitEnum | null $navigationGroup = 'Interaksi';
    protected static ?string $navigationLabel = 'Pertanyaan';
    protected static ?string $modelLabel = 'Pertanyaan';
    protected static ?string $pluralModelLabel = 'Pertanyaan';
    protected static ?int $navigationSort = 1;

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('is_read', false)->count() ?: null;
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'danger';
    }

    public static function form(Schema $form): Schema
    {
        return $form->schema([
            Section::make('Maklumat Penghantar')->schema([
                Forms\Components\TextInput::make('name')->label('Nama')->disabled(),
                Forms\Components\TextInput::make('email')->label('Emel')->disabled(),
                Forms\Components\TextInput::make('phone')->label('Telefon')->disabled(),
                Forms\Components\TextInput::make('company')->label('Syarikat')->disabled(),
            ])->columns(2),
            Section::make('Mesej')->schema([
                Forms\Components\TextInput::make('subject')->label('Subjek')->disabled(),
                Forms\Components\Textarea::make('message')->label('Mesej')->disabled()->rows(5)->columnSpanFull(),
            ]),
            Section::make('Tindakan Admin')->schema([
                Forms\Components\Toggle::make('is_read')->label('Telah Dibaca'),
                Forms\Components\DateTimePicker::make('replied_at')->label('Tarikh Dibalas'),
                Forms\Components\Textarea::make('admin_notes')->label('Nota Admin')->rows(3)->columnSpanFull(),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('name')->label('Nama')->searchable()->sortable(),
            Tables\Columns\TextColumn::make('email')->label('Emel')->searchable(),
            Tables\Columns\TextColumn::make('subject')->label('Subjek')->limit(30)->searchable(),
            Tables\Columns\IconColumn::make('is_read')->label('Dibaca')->boolean(),
            Tables\Columns\TextColumn::make('replied_at')->label('Dibalas')->dateTime('d M Y')->placeholder('Belum dibalas'),
            Tables\Columns\TextColumn::make('created_at')->label('Tarikh')->dateTime('d M Y, H:i')->sortable(),
        ])->defaultSort('created_at', 'desc')
        ->filters([
            Tables\Filters\TernaryFilter::make('is_read')->label('Status Baca'),
        ])
        ->actions([
            \Filament\Actions\Action::make('markRead')
                ->label('Tandai Dibaca')
                ->icon('heroicon-o-check')
                ->action(fn (ContactInquiry $record) => $record->markAsRead())
                ->visible(fn (ContactInquiry $record) => !$record->is_read)
                ->color('success'),
            \Filament\Actions\EditAction::make(),
            \Filament\Actions\DeleteAction::make(),
        ])
        ->bulkActions([
            \Filament\Actions\BulkActionGroup::make([
                \Filament\Actions\BulkAction::make('markAllRead')
                    ->label('Tandai Semua Dibaca')
                    ->action(fn ($records) => $records->each->markAsRead())
                    ->icon('heroicon-o-check-circle'),
                \Filament\Actions\DeleteBulkAction::make(),
            ]),
        ]);
    }

    public static function canViewAny(): bool
    {
        return auth()->user()->hasPermissionTo('view_inquiries');
    }

    public static function canEdit(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return auth()->user()->hasPermissionTo('manage_inquiries');
    }

    public static function canDelete(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return auth()->user()->hasPermissionTo('delete_inquiries');
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListContactInquiries::route('/'),
            'edit' => Pages\EditContactInquiry::route('/{record}/edit'),
        ];
    }
}
