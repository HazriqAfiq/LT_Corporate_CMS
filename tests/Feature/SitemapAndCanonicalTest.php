<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SitemapAndCanonicalTest extends TestCase
{
    use RefreshDatabase;

    public function test_sitemap_returns_xml_with_correct_host(): void
    {
        $response = $this->get('/sitemap.xml');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/xml');
        $this->assertStringContainsString('<urlset', $response->getContent());
        $this->assertStringContainsString('localhost', $response->getContent());
    }

    public function test_canonical_link_is_present_on_home_page(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $this->assertStringContainsString('<link rel="canonical" href="http://localhost', $response->getContent());
    }
}
