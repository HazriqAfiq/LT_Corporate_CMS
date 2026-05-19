<?php
namespace App\Filament\Resources\SliderResource\Pages;
use App\Filament\Resources\SliderResource;
use Filament\Resources\Pages\CreateRecord;
class CreateSlider extends CreateRecord
{
    protected static string $resource = SliderResource::class;
    protected function getHeaderActions(): array { 
        return [
            \Filament\Actions\Action::make('back')
                ->label('Back')
                ->url($this->getResource()::getUrl('index'))
                ->color('secondary')
        ]; 
    } 
}
