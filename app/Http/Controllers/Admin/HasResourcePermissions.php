<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Routing\Controllers\Middleware;

trait HasResourcePermissions
{
    /**
     * Define middleware for resource controllers dynamically based on permission prefix.
     */
    public static function middleware(): array
    {
        $prefix = static::$permissionPrefix ?? null;

        if (!$prefix) {
            return [];
        }

        if ($prefix === 'articles') {
            $middlewares = [
                new Middleware("permission:create_articles|manage_own_articles", only: ['create', 'store']),
                new Middleware("permission:delete_articles|manage_own_articles", only: ['destroy']),
                new Middleware("permission:create_articles|edit_articles|delete_articles|manage_own_articles", only: ['index', 'show']),
                new Middleware("permission:edit_articles|manage_own_articles", only: ['edit', 'update']),
            ];
        } else {
            $middlewares = [
                new Middleware("permission:create_{$prefix}", only: ['create', 'store']),
                new Middleware("permission:delete_{$prefix}", only: ['destroy']),
                new Middleware("permission:create_{$prefix}|edit_{$prefix}|delete_{$prefix}", only: ['index', 'show']),
                new Middleware("permission:edit_{$prefix}", only: ['edit', 'update']),
            ];
        }

        return $middlewares;
    }
}
