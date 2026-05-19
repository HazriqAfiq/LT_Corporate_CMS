<?php
namespace App\Filament\Resources\SliderResource\Pages;
use App\Filament\Resources\SliderResource;
use Filament\Resources\Pages\ListRecords;
class ListSliders extends ListRecords
{
    protected static string $resource = SliderResource::class;
    protected function getHeaderActions(): array
    {
        return [\Filament\Actions\CreateAction::make()];
    }
}
