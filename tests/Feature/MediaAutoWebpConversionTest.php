<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaAutoWebpConversionTest extends TestCase
{
    use RefreshDatabase;

    public function test_image_uploads_are_auto_converted_to_webp_when_gd_or_imagick_is_present()
    {
        Storage::fake('public');
        
        $user = User::factory()->create();
        $this->actingAs($user);

        // Create a fake PNG file conditionally depending on GD availability
        if (extension_loaded('gd')) {
            $file = UploadedFile::fake()->image('test_image.png', 100, 100);
        } else {
            $file = UploadedFile::fake()->create('test_image.png', 100, 'image/png');
        }
        $path = $file->store('uploads', 'public');
        $filename = basename($path);

        // Save media record
        $media = Media::create([
            'filename' => $filename,
            'original_filename' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'type' => 'image',
            'extension' => $file->getClientOriginalExtension(),
            'size' => $file->getSize(),
            'disk' => 'public',
            'collection' => 'articles',
            'uploaded_by' => $user->id,
        ]);

        $hasGd = extension_loaded('gd');
        $hasImagick = extension_loaded('imagick');

        if ($hasGd || $hasImagick) {
            // Check that it was converted to webp
            $this->assertEquals('webp', $media->extension);
            $this->assertEquals('image/webp', $media->mime_type);
            $this->assertStringEndsWith('.webp', $media->path);
            $this->assertStringEndsWith('.webp', $media->filename);

            // Check file exists on storage
            Storage::disk('public')->assertExists($media->path);
            Storage::disk('public')->assertMissing($path); // Old PNG should be deleted
        } else {
            // Check that it fell back gracefully and kept PNG
            $this->assertEquals('png', $media->extension);
            $this->assertEquals('image/png', $media->mime_type);
            $this->assertStringEndsWith('.png', $media->path);
            Storage::disk('public')->assertExists($path);
        }
    }
}
