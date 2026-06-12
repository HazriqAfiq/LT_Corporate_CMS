<?php

namespace Tests\Feature;

use App\Models\ContactInquiry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ContactInquiryTest extends TestCase
{
    use RefreshDatabase;

    public function test_inquiry_can_be_updated(): void
    {
        $editPermission = Permission::firstOrCreate(['name' => 'edit_inquiries', 'guard_name' => 'web']);
        
        $adminRole = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $adminRole->givePermissionTo([$editPermission]);

        // Create admin user
        $user = User::factory()->create();
        $user->assignRole($adminRole);

        // Create a contact inquiry
        $inquiry = ContactInquiry::create([
            'name' => 'John Test',
            'email' => 'john.test@example.com',
            'phone' => '0123456789',
            'company' => 'Test Corp',
            'subject' => 'Help needed',
            'message' => 'This is a test message.',
            'is_read' => false,
        ]);

        // Send PUT request to update the inquiry
        $response = $this->actingAs($user)->put(route('admin.inquiries.update', $inquiry->id), [
            'is_read' => true,
            'replied_at' => now()->toISOString(),
            'admin_notes' => 'Telah dihubungi.',
        ]);

        // Assert redirect (success response)
        $response->assertRedirect(route('admin.inquiries.index'));
        
        // Assert database is updated
        $this->assertDatabaseHas('contact_inquiries', [
            'id' => $inquiry->id,
            'is_read' => true,
            'admin_notes' => 'Telah dihubungi.',
        ]);
    }

    public function test_inquiries_can_be_filtered_by_replied_status(): void
    {
        $editPermission = Permission::firstOrCreate(['name' => 'edit_inquiries', 'guard_name' => 'web']);
        $adminRole = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $adminRole->givePermissionTo($editPermission);

        $user = User::factory()->create();
        $user->assignRole($adminRole);

        // Create unreplied inquiry
        ContactInquiry::create([
            'name' => 'Unreplied User',
            'email' => 'unreplied@example.com',
            'subject' => 'Unreplied subject',
            'message' => 'Unreplied message',
            'is_read' => false,
            'replied_at' => null,
        ]);

        // Create replied inquiry
        ContactInquiry::create([
            'name' => 'Replied User',
            'email' => 'replied@example.com',
            'subject' => 'Replied subject',
            'message' => 'Replied message',
            'is_read' => true,
            'replied_at' => now(),
        ]);

        // Request with is_read = replied
        $response = $this->actingAs($user)->get(route('admin.inquiries.index', ['is_read' => 'replied']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Inquiries/Index')
            ->has('inquiries.data', 1)
            ->where('inquiries.data.0.name', 'Replied User')
        );
    }
}
