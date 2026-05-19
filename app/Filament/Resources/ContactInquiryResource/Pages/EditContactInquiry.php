<?php
namespace App\Filament\Resources\ContactInquiryResource\Pages;
use App\Filament\Resources\ContactInquiryResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
class EditContactInquiry extends EditRecord { 
    protected static string $resource = ContactInquiryResource::class; 
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
