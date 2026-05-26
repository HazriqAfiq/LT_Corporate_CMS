<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add new columns first
        Schema::table('articles', function (Blueprint $table) {
            $table->foreignId('featured_media_id')->nullable()->constrained('media')->nullOnDelete();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('featured_media_id')->nullable()->constrained('media')->nullOnDelete();
            $table->json('gallery_media_ids')->nullable();
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->foreignId('featured_media_id')->nullable()->constrained('media')->nullOnDelete();
            $table->json('gallery_media_ids')->nullable();
        });

        Schema::table('sliders', function (Blueprint $table) {
            $table->foreignId('media_id')->nullable()->constrained('media')->nullOnDelete();
        });

        Schema::table('team_members', function (Blueprint $table) {
            $table->foreignId('profile_media_id')->nullable()->constrained('media')->nullOnDelete();
        });

        // Migrate Data
        $this->migrateData();

        // Drop old columns
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn('featured_image');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['featured_image', 'gallery_images']);
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['featured_image', 'images']);
        });

        Schema::table('sliders', function (Blueprint $table) {
            $table->dropColumn('image');
        });

        Schema::table('team_members', function (Blueprint $table) {
            $table->dropColumn('image_path');
        });
    }

    private function createMediaRecord($path, $collection) {
        if (!$path || !is_string($path)) return null;

        // Extract filename from path
        $filename = basename($path);
        
        $mediaId = DB::table('media')->insertGetId([
            'uuid' => (string) Str::uuid(),
            'filename' => $filename,
            'original_filename' => $filename,
            'path' => $path,
            'disk' => 'public',
            'type' => 'image',
            'extension' => pathinfo($filename, PATHINFO_EXTENSION),
            'collection' => $collection,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        return $mediaId;
    }

    private function migrateData() {
        // Articles
        $articles = DB::table('articles')->get();
        foreach ($articles as $article) {
            if ($article->featured_image) {
                $mediaId = $this->createMediaRecord($article->featured_image, 'articles');
                if ($mediaId) {
                    DB::table('articles')->where('id', $article->id)->update(['featured_media_id' => $mediaId]);
                }
            }
        }

        // Products
        $products = DB::table('products')->get();
        foreach ($products as $product) {
            $updates = [];
            if ($product->featured_image) {
                $mediaId = $this->createMediaRecord($product->featured_image, 'products');
                if ($mediaId) {
                    $updates['featured_media_id'] = $mediaId;
                }
            }
            if ($product->gallery_images) {
                $images = json_decode($product->gallery_images, true);
                if (is_array($images)) {
                    $mediaIds = [];
                    foreach ($images as $img) {
                        $id = $this->createMediaRecord($img, 'products');
                        if ($id) $mediaIds[] = $id;
                    }
                    $updates['gallery_media_ids'] = json_encode($mediaIds);
                }
            }
            if (!empty($updates)) {
                DB::table('products')->where('id', $product->id)->update($updates);
            }
        }

        // Projects
        $projects = DB::table('projects')->get();
        foreach ($projects as $project) {
            $updates = [];
            if ($project->featured_image) {
                $mediaId = $this->createMediaRecord($project->featured_image, 'projects');
                if ($mediaId) {
                    $updates['featured_media_id'] = $mediaId;
                }
            }
            if ($project->images) {
                $images = json_decode($project->images, true);
                if (is_array($images)) {
                    $mediaIds = [];
                    foreach ($images as $img) {
                        $id = $this->createMediaRecord($img, 'projects');
                        if ($id) $mediaIds[] = $id;
                    }
                    $updates['gallery_media_ids'] = json_encode($mediaIds);
                }
            }
            if (!empty($updates)) {
                DB::table('projects')->where('id', $project->id)->update($updates);
            }
        }

        // Sliders
        $sliders = DB::table('sliders')->get();
        foreach ($sliders as $slider) {
            if ($slider->image) {
                $mediaId = $this->createMediaRecord($slider->image, 'sliders');
                if ($mediaId) {
                    DB::table('sliders')->where('id', $slider->id)->update(['media_id' => $mediaId]);
                }
            }
        }

        // Team Members
        $members = DB::table('team_members')->get();
        foreach ($members as $member) {
            if ($member->image_path) {
                $mediaId = $this->createMediaRecord($member->image_path, 'users');
                if ($mediaId) {
                    DB::table('team_members')->where('id', $member->id)->update(['profile_media_id' => $mediaId]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Not practically reversible without data loss if files were migrated and columns dropped.
        // We could just add the string columns back.
        Schema::table('articles', function (Blueprint $table) {
            $table->string('featured_image')->nullable();
            $table->dropForeign(['featured_media_id']);
            $table->dropColumn('featured_media_id');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->string('featured_image')->nullable();
            $table->json('gallery_images')->nullable();
            $table->dropForeign(['featured_media_id']);
            $table->dropColumn(['featured_media_id', 'gallery_media_ids']);
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->string('featured_image')->nullable();
            $table->json('images')->nullable();
            $table->dropForeign(['featured_media_id']);
            $table->dropColumn(['featured_media_id', 'gallery_media_ids']);
        });

        Schema::table('sliders', function (Blueprint $table) {
            $table->string('image')->nullable();
            $table->dropForeign(['media_id']);
            $table->dropColumn('media_id');
        });

        Schema::table('team_members', function (Blueprint $table) {
            $table->string('image_path')->nullable();
            $table->dropForeign(['profile_media_id']);
            $table->dropColumn('profile_media_id');
        });
    }
};
