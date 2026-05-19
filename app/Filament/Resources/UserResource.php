<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Hash;

class UserResource extends Resource
{
    protected static ?string $model = User::class;
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-users';
    protected static string | \UnitEnum | null $navigationGroup = 'Sistem';
    protected static ?string $navigationLabel = 'Pengguna';
    protected static ?string $modelLabel = 'Pengguna';
    protected static ?string $pluralModelLabel = 'Pengguna';
    protected static ?int $navigationSort = 1;

    public static function form(Schema $form): Schema
    {
        return $form->schema([
            Section::make('Maklumat Pengguna')->schema([
                Forms\Components\TextInput::make('name')->label('Nama')->required()->maxLength(255),
                Forms\Components\TextInput::make('email')->label('Emel')->email()->required()->unique(ignoreRecord: true)->maxLength(255),
                Forms\Components\TextInput::make('phone')->label('Telefon')->tel()->maxLength(20),
                Forms\Components\TextInput::make('password')->label('Kata Laluan')
                    ->password()->revealable()
                    ->dehydrateStateUsing(fn ($state) => filled($state) ? Hash::make($state) : null)
                    ->dehydrated(fn ($state) => filled($state))
                    ->required(fn (string $operation): bool => $operation === 'create'),
                Forms\Components\FileUpload::make('avatar')->label('Avatar')->image()->avatar()->directory('avatars')->columnSpanFull(),
            ])->columns(2),
            Section::make('Peranan & Status')->schema([
                Forms\Components\Select::make('roles')->label('Peranan')
                    ->relationship('roles', 'name')
                    ->multiple()
                    ->preload()
                    ->searchable(),
                Forms\Components\Toggle::make('is_active')->label('Aktif')->default(true),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\ImageColumn::make('avatar')->label('Avatar')->circular()->defaultImageUrl(fn ($record) => 'https://ui-avatars.com/api/?name=' . urlencode($record->name) . '&background=F5A623&color=1a1a2e'),
            Tables\Columns\TextColumn::make('name')->label('Nama')->searchable()->sortable(),
            Tables\Columns\TextColumn::make('email')->label('Emel')->searchable(),
            Tables\Columns\TextColumn::make('roles.name')->label('Peranan')->badge()->color('warning'),
            Tables\Columns\IconColumn::make('is_active')->label('Aktif')->boolean(),
            Tables\Columns\TextColumn::make('created_at')->label('Didaftarkan')->dateTime('d M Y')->sortable(),
        ])->defaultSort('name')
        ->filters([
            Tables\Filters\TernaryFilter::make('is_active')->label('Status'),
            Tables\Filters\SelectFilter::make('roles')->label('Peranan')->relationship('roles', 'name'),
        ])
        ->actions([\Filament\Actions\EditAction::make(), \Filament\Actions\DeleteAction::make()])
        ->bulkActions([\Filament\Actions\BulkActionGroup::make([\Filament\Actions\DeleteBulkAction::make()])]);
    }

    public static function canViewAny(): bool
    {
        return auth()->user()->hasPermissionTo('view_users');
    }

    public static function canCreate(): bool
    {
        return auth()->user()->hasPermissionTo('create_users');
    }

    public static function canEdit(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return auth()->user()->hasPermissionTo('edit_users');
    }

    public static function canDelete(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return auth()->user()->hasPermissionTo('delete_users');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
