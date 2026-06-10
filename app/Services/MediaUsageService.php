<?php

namespace App\Services;

use App\Models\Article;
use App\Models\Product;
use App\Models\Project;
use App\Models\Service;
use App\Models\Slider;
use App\Models\TeamMember;
use App\Models\Setting;

class MediaUsageService
{
    public const USAGE_TYPES = [
        'branding'              => 'Branding',
        'article_gallery'       => 'Article Gallery',
        'article_content'       => 'Article Content Image',
        'product_icon'          => 'Product Icon',
        'product_gallery'       => 'Product Gallery',
        'product_content'       => 'Product Content Image',
        'project_gallery'       => 'Project Gallery',
        'project_content'       => 'Project Content Image',
        'service_image'         => 'Service Image',
        'slider'                => 'Main Slider',
        'team'                  => 'Team Member Image',
        'seo'                   => 'SEO',
    ];

    protected array $usageMap = [];

    public function loadUsages(array $mediaIds): void
    {
        if (empty($mediaIds)) return;

        $this->usageMap = array_fill_keys($mediaIds, []);

        $this->loadArticles($mediaIds);
        $this->loadProducts($mediaIds);
        $this->loadProjects($mediaIds);
        $this->loadServices($mediaIds);
        $this->loadSliders($mediaIds);
        $this->loadTeam($mediaIds);
        $this->loadBranding($mediaIds);
        $this->loadSeo($mediaIds);
    }

    public function getUsage(int $mediaId): array
    {
        return $this->usageMap[$mediaId] ?? [];
    }

    public function getUsageCount(int $mediaId): int
    {
        return count($this->getUsage($mediaId));
    }

    public function getUsageSummary(int $mediaId): string
    {
        $usages = $this->getUsage($mediaId);
        if (empty($usages)) return '';

        $labels = array_map(fn($u) => $u['label'], $usages);
        $unique = array_unique($labels);
        return implode(', ', $unique);
    }

    protected function addUsage(int $mediaId, string $type, string $label, string $entityTitle, ?int $entityId = null): void
    {
        if (!isset($this->usageMap[$mediaId])) return;
        $this->usageMap[$mediaId][] = [
            'type'    => $type,
            'label'   => $label,
            'entity'  => $entityTitle,
            'entityId' => $entityId,
        ];
    }

    protected function loadArticles(array $mediaIds): void
    {
        $featured = Article::whereIn('featured_media_id', $mediaIds)->get(['id', 'featured_media_id', 'title']);
        foreach ($featured as $article) {
            $this->addUsage($article->featured_media_id, 'article_gallery', 'Article Gallery', $article->title, $article->id);
        }

        $galleryArticles = Article::whereNotNull('gallery_media_ids')->get(['id', 'gallery_media_ids', 'title']);
        foreach ($galleryArticles as $article) {
            $galleryIds = $article->gallery_media_ids;
            if (!is_array($galleryIds)) continue;
            foreach ($galleryIds as $gid) {
                if (in_array($gid, $mediaIds)) {
                    $this->addUsage((int)$gid, 'article_gallery', 'Article Gallery', $article->title, $article->id);
                }
            }
        }

        $this->loadContentImages(Article::class, 'article_content', 'Article Content Image', $mediaIds);
    }

    protected function loadProducts(array $mediaIds): void
    {
        $featured = Product::whereIn('featured_media_id', $mediaIds)->get(['id', 'featured_media_id', 'name']);
        foreach ($featured as $product) {
            $this->addUsage($product->featured_media_id, 'product_gallery', 'Product Gallery', $product->name, $product->id);
        }

        $galleryProducts = Product::whereNotNull('gallery_media_ids')->get(['id', 'gallery_media_ids', 'name']);
        foreach ($galleryProducts as $product) {
            $galleryIds = $product->gallery_media_ids;
            if (!is_array($galleryIds)) continue;
            foreach ($galleryIds as $gid) {
                if (in_array($gid, $mediaIds)) {
                    $this->addUsage((int)$gid, 'product_gallery', 'Product Gallery', $product->name, $product->id);
                }
            }
        }

        $icons = Product::whereNotNull('icon')->get(['id', 'icon', 'name']);
        foreach ($icons as $product) {
            $val = $product->getRawOriginal('icon');
            if (is_numeric($val) && in_array((int)$val, $mediaIds)) {
                $this->addUsage((int)$val, 'product_icon', 'Product Icon', $product->name, $product->id);
            }
        }

        $this->loadContentImages(Product::class, 'product_content', 'Product Content Image', $mediaIds);
    }


    protected function loadProjects(array $mediaIds): void
    {
        $featured = Project::whereIn('featured_media_id', $mediaIds)->get(['id', 'featured_media_id', 'title']);
        foreach ($featured as $project) {
            $this->addUsage($project->featured_media_id, 'project_gallery', 'Project Gallery', $project->title, $project->id);
        }

        $galleryProjects = Project::whereNotNull('gallery_media_ids')->get(['id', 'gallery_media_ids', 'title']);
        foreach ($galleryProjects as $project) {
            $galleryIds = $project->gallery_media_ids;
            if (!is_array($galleryIds)) continue;
            foreach ($galleryIds as $gid) {
                if (in_array($gid, $mediaIds)) {
                    $this->addUsage((int)$gid, 'project_gallery', 'Project Gallery', $project->title, $project->id);
                }
            }
        }

        $this->loadContentImages(Project::class, 'project_content', 'Project Content Image', $mediaIds);
    }

    protected function loadServices(array $mediaIds): void
    {
        $services = Service::whereIn('featured_media_id', $mediaIds)->get(['id', 'featured_media_id', 'name']);
        foreach ($services as $service) {
            $this->addUsage($service->featured_media_id, 'service_image', 'Service Image', $service->name, $service->id);
        }

        $galleryServices = Service::whereNotNull('gallery_media_ids')->get(['id', 'gallery_media_ids', 'name']);
        foreach ($galleryServices as $service) {
            $galleryIds = $service->gallery_media_ids;
            if (!is_array($galleryIds)) continue;
            foreach ($galleryIds as $gid) {
                if (in_array($gid, $mediaIds)) {
                    $this->addUsage((int)$gid, 'service_image', 'Service Image', $service->name, $service->id);
                }
            }
        }
    }

    protected function loadSliders(array $mediaIds): void
    {
        $sliders = Slider::whereIn('media_id', $mediaIds)->get(['id', 'media_id', 'title']);
        foreach ($sliders as $slider) {
            $this->addUsage($slider->media_id, 'slider', 'Main Slider', $slider->title, $slider->id);
        }
    }

    protected function loadTeam(array $mediaIds): void
    {
        $members = TeamMember::whereIn('profile_media_id', $mediaIds)->get(['id', 'profile_media_id', 'name']);
        foreach ($members as $member) {
            $this->addUsage($member->profile_media_id, 'team', 'Team Member Image', $member->name, $member->id);
        }
    }

    protected function loadBranding(array $mediaIds): void
    {
        $settings = Setting::where('type', 'image')->whereNotNull('value')->get(['id', 'key', 'value']);
        foreach ($settings as $setting) {
            $mediaId = (int) $setting->value;
            if (in_array($mediaId, $mediaIds)) {
                $this->addUsage($mediaId, 'branding', 'Branding', $setting->key, $setting->id);
            }
        }
    }

    protected function loadSeo(array $mediaIds): void
    {
        $keys = ['seo_image', 'og_image'];
        $settings = Setting::whereIn('key', $keys)->whereNotNull('value')->get(['id', 'key', 'value']);
        foreach ($settings as $setting) {
            $mediaId = (int) $setting->value;
            if (in_array($mediaId, $mediaIds)) {
                $this->addUsage($mediaId, 'seo', 'SEO', $setting->key, $setting->id);
            }
        }
    }

    protected function loadContentImages(string $modelClass, string $type, string $label, array $mediaIds): void
    {
        $pathToMediaId = \App\Models\Media::whereIn('id', $mediaIds)->pluck('id', 'path');

        $contentFields = ['content', 'content_en'];
        if ($modelClass === Product::class) {
            $contentFields = ['content', 'content_en'];
        }

        $titleField = in_array($modelClass, [Product::class]) ? 'name' : 'title';

        $records = $modelClass::where(function ($q) use ($contentFields) {
            foreach ($contentFields as $field) {
                $q->orWhere($field, 'like', '%<img%');
            }
        })->get(['id', $titleField, ...$contentFields]);

        foreach ($records as $record) {
            $title = $record->$titleField;
            foreach ($contentFields as $field) {
                $html = $record->$field;
                if (empty($html)) continue;

                preg_match_all('/<img[^>]+src=["\']([^"\']+)["\']/', $html, $matches);
                if (empty($matches[1])) continue;

                foreach ($matches[1] as $src) {
                    $src = $this->extractPath($src);
                    if (!$src) continue;

                    $mediaId = $pathToMediaId[$src] ?? null;
                    if ($mediaId && in_array($mediaId, $mediaIds)) {
                        $this->addUsage($mediaId, $type, $label, $title, $record->id);
                    }
                }
            }
        }
    }

    protected function extractPath(string $url): ?string
    {
        $url = trim($url);

        if (str_starts_with($url, '/storage/')) {
            return substr($url, 9);
        }

        if (preg_match('#/storage/(uploads/[^\s"\']+)#', $url, $m)) {
            return $m[1];
        }

        return null;
    }
}
