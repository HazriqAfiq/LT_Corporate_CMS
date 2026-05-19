<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    {{-- Static Pages --}}
    <url>
        <loc>{{ url('/') }}</loc>
        <priority>1.0</priority>
        <changefreq>weekly</changefreq>
    </url>
    <url>
        <loc>{{ url('/tentang-kami') }}</loc>
        <priority>0.8</priority>
        <changefreq>monthly</changefreq>
    </url>
    <url>
        <loc>{{ url('/perkhidmatan') }}</loc>
        <priority>0.8</priority>
        <changefreq>monthly</changefreq>
    </url>
    <url>
        <loc>{{ url('/produk') }}</loc>
        <priority>0.9</priority>
        <changefreq>weekly</changefreq>
    </url>
    <url>
        <loc>{{ url('/portfolio') }}</loc>
        <priority>0.8</priority>
        <changefreq>weekly</changefreq>
    </url>
    <url>
        <loc>{{ url('/artikel') }}</loc>
        <priority>0.9</priority>
        <changefreq>daily</changefreq>
    </url>
    <url>
        <loc>{{ url('/hubungi-kami') }}</loc>
        <priority>0.7</priority>
        <changefreq>monthly</changefreq>
    </url>
    <url>
        <loc>{{ url('/dasar-privasi') }}</loc>
        <priority>0.3</priority>
        <changefreq>yearly</changefreq>
    </url>
    <url>
        <loc>{{ url('/terma-syarat') }}</loc>
        <priority>0.3</priority>
        <changefreq>yearly</changefreq>
    </url>

    {{-- Dynamic Products --}}
    @foreach($products as $product)
    <url>
        <loc>{{ url('/produk/' . $product->slug) }}</loc>
        <lastmod>{{ $product->updated_at->toAtomString() }}</lastmod>
        <priority>0.7</priority>
        <changefreq>monthly</changefreq>
    </url>
    @endforeach

    {{-- Dynamic Projects --}}
    @foreach($projects as $project)
    <url>
        <loc>{{ url('/portfolio/' . $project->slug) }}</loc>
        <lastmod>{{ $project->updated_at->toAtomString() }}</lastmod>
        <priority>0.6</priority>
        <changefreq>monthly</changefreq>
    </url>
    @endforeach

    {{-- Dynamic Articles --}}
    @foreach($articles as $article)
    <url>
        <loc>{{ url('/artikel/' . $article->slug) }}</loc>
        <lastmod>{{ ($article->published_at ?? $article->updated_at)->toAtomString() }}</lastmod>
        <priority>0.6</priority>
        <changefreq>monthly</changefreq>
    </url>
    @endforeach
</urlset>
