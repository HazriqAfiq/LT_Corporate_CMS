<?php
namespace App\Filament\Resources\ArticleResource\Pages;
use App\Filament\Resources\ArticleResource;
use Filament\Resources\Pages\CreateRecord;
class CreateArticle extends CreateRecord
{
    protected static string $resource = ArticleResource::class;
    protected function getHeaderActions(): array { 
        return [
            \Filament\Actions\Action::make('back')
                ->label('Back')
                ->url($this->getResource()::getUrl('index'))
                ->color('secondary')
        ]; 
    } 
    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['author_id'] = $data['author_id'] ?? auth()->id();
        return $data;
    }
}
