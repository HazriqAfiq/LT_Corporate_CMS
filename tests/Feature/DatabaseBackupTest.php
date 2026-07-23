<?php

namespace App\Http\Controllers\Admin {
    // This allows us to intercept shell_exec calls in BackupController
    function shell_exec($command) {
        if (isset($GLOBALS['mock_shell_exec'])) {
            return call_user_func($GLOBALS['mock_shell_exec'], $command);
        }
        return \shell_exec($command);
    }
}

namespace Tests\Feature {

    use App\Models\User;
    use Illuminate\Foundation\Testing\RefreshDatabase;
    use Illuminate\Support\Facades\Storage;
    use Spatie\Permission\Models\Permission;
    use Spatie\Permission\Models\Role;
    use Tests\TestCase;

    class DatabaseBackupTest extends TestCase
    {
        use RefreshDatabase;

        protected $backupPermission;
        protected $adminRole;
        protected $adminUser;
        protected $regularUser;

        protected function setUp(): void
        {
            parent::setUp();

            // Create necessary permissions and roles
            $this->backupPermission = Permission::firstOrCreate(['name' => 'access_backup', 'guard_name' => 'web']);
            $this->adminRole = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
            $this->adminRole->givePermissionTo($this->backupPermission);

            // Create an admin user with access to backups
            $this->adminUser = User::factory()->create();
            $this->adminUser->assignRole($this->adminRole);

            // Create a regular user with no special permissions
            $this->regularUser = User::factory()->create();

            // Reset the global mock
            unset($GLOBALS['mock_shell_exec']);
        }

        protected function tearDown(): void
        {
            unset($GLOBALS['mock_shell_exec']);
            parent::tearDown();
        }

        public function test_guests_cannot_access_backups(): void
        {
            $response = $this->get(route('admin.backup.index'));
            $response->assertRedirect(route('login'));
        }

        public function test_unauthorized_users_cannot_access_backups(): void
        {
            $response = $this->actingAs($this->regularUser)
                ->get(route('admin.backup.index'));
            $response->assertStatus(403);
        }

        public function test_authorized_users_can_view_empty_backups_list(): void
        {
            Storage::fake('local');

            $response = $this->actingAs($this->adminUser)
                ->get(route('admin.backup.index'));

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => $page
                ->component('Admin/Backup/Index')
                ->has('backups')
                ->where('backups', [])
            );
        }

        public function test_authorized_users_can_view_existing_backups(): void
        {
            Storage::fake('local');
            $appName = config('backup.backup.name', config('app.name', 'laravel-backup'));

            // Create dummy backup files with different timestamps
            Storage::disk('local')->put("{$appName}/backup-1.zip", 'dummy content 1');
            sleep(1);
            Storage::disk('local')->put("{$appName}/backup-2.zip", 'dummy content 2');

            $response = $this->actingAs($this->adminUser)
                ->get(route('admin.backup.index'));

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => $page
                ->component('Admin/Backup/Index')
                ->has('backups', 2)
                ->where('backups.0.name', 'backup-2.zip')
            );
        }

        public function test_unauthorized_users_cannot_run_backups(): void
        {
            $response = $this->actingAs($this->regularUser)
                ->post(route('admin.backup.run'));
            $response->assertStatus(403);
        }

        public function test_authorized_users_can_run_backup_successfully(): void
        {
            $GLOBALS['mock_shell_exec'] = function ($command) {
                $this->assertStringContainsString('backup:run', $command);
                $this->assertStringContainsString('--only-db', $command);
                return 'Backup completed!';
            };

            $response = $this->actingAs($this->adminUser)
                ->post(route('admin.backup.run'));

            $response->assertStatus(200);
            $response->assertJson([
                'success' => true,
                'message' => 'Backup berjaya dijalankan.'
            ]);

            $this->assertDatabaseHas('activity_log', [
                'event' => 'backup',
                'description' => 'Backup pangkalan data berjaya dijalankan.',
                'causer_id' => $this->adminUser->id
            ]);
        }

        public function test_authorized_users_run_backup_failure(): void
        {
            $GLOBALS['mock_shell_exec'] = function ($command) {
                return 'Some error occurred during backup';
            };

            $response = $this->actingAs($this->adminUser)
                ->post(route('admin.backup.run'));

            $response->assertStatus(500);
            $response->assertJson([
                'success' => false,
                'message' => 'Backup gagal. Some error occurred during backup'
            ]);

            $this->assertDatabaseHas('activity_log', [
                'event' => 'backup',
                'description' => 'Backup pangkalan data gagal.',
                'causer_id' => $this->adminUser->id
            ]);
        }

        public function test_unauthorized_users_cannot_download_backups(): void
        {
            $response = $this->actingAs($this->regularUser)
                ->get(route('admin.backup.download', 'some-file.zip'));
            $response->assertStatus(403);
        }

        public function test_cannot_download_non_existent_backup(): void
        {
            Storage::fake('local');

            $response = $this->actingAs($this->adminUser)
                ->get(route('admin.backup.download', 'non-existent.zip'));

            $response->assertStatus(404);
        }

        public function test_authorized_users_can_download_existing_backup(): void
        {
            Storage::fake('local');
            $appName = config('backup.backup.name', config('app.name', 'laravel-backup'));

            Storage::disk('local')->put("{$appName}/test-backup.zip", 'backup content');

            $response = $this->actingAs($this->adminUser)
                ->get(route('admin.backup.download', 'test-backup.zip'));

            $response->assertStatus(200);
            $response->assertHeader('Content-Type', 'application/zip');
            $this->assertTrue(
                str_contains($response->headers->get('Content-Disposition'), 'test-backup.zip')
            );
        }

        public function test_unauthorized_users_cannot_delete_backups(): void
        {
            $response = $this->actingAs($this->regularUser)
                ->delete(route('admin.backup.delete', 'some-file.zip'));
            $response->assertStatus(403);
        }

        public function test_cannot_delete_non_existent_backup(): void
        {
            Storage::fake('local');

            $response = $this->actingAs($this->adminUser)
                ->delete(route('admin.backup.delete', 'non-existent.zip'));

            $response->assertStatus(404);
        }

        public function test_authorized_users_can_delete_existing_backup(): void
        {
            Storage::fake('local');
            $appName = config('backup.backup.name', config('app.name', 'laravel-backup'));

            Storage::disk('local')->put("{$appName}/test-backup.zip", 'backup content');

            $response = $this->actingAs($this->adminUser)
                ->delete(route('admin.backup.delete', 'test-backup.zip'));

            $response->assertRedirect();
            $response->assertSessionHas('success', 'Fail backup dipadam.');
            Storage::disk('local')->assertMissing("{$appName}/test-backup.zip");

            $this->assertDatabaseHas('activity_log', [
                'event' => 'delete',
                'description' => 'Fail backup dipadam: "test-backup.zip"',
                'causer_id' => $this->adminUser->id
            ]);
        }
    }
}
