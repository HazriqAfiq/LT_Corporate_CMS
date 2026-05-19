<?php
namespace App\Filament\Resources\MediaResource\Pages;
use App\Filament\Resources\MediaResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
class EditMedia extends EditRecord { 
    protected static string $resource = MediaResource::class; 
    protected function getHeaderActions(): array { 
        return [
            \Filament\Actions\Action::make('back')
                ->label('Back')
                ->url($this->getResource()::getUrl('index'))
                ->color('secondary'),
            Actions\DeleteAction::make()
        ]; 
    } 
}
