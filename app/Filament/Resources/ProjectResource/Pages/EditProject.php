<?php
namespace App\Filament\Resources\ProjectResource\Pages;
use App\Filament\Resources\ProjectResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
class EditProject extends EditRecord { 
    protected static string $resource = ProjectResource::class; 
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
