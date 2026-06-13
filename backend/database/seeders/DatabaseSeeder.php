<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Temel rolleri oluştur (Eğer daha önce oluşturulmamışsa)
        $roles = [
            'SUPER_ADMIN',
            'INSTITUTION_ADMIN',
            'TEACHER',
            'STUDENT',
            'PARENT'
        ];

        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        // 1. Süper Admin Oluştur (Kurumdan bağımsız)
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@akillitahta.com'],
            [
                'name' => 'Sistem Yöneticisi',
                'password' => Hash::make('12345678'),
                'role' => 'SUPER_ADMIN',
                'tenant_id' => null, // Süper admin tüm kurumlara erişebilir
            ]
        );
        if (!$superAdmin->hasRole('SUPER_ADMIN')) {
            $superAdmin->assignRole('SUPER_ADMIN');
        }

        // 2. Örnek Kurum (Tenant) Oluştur
        $tenant = Tenant::firstOrCreate(
            ['subdomain' => 'demo'],
            [
                'name' => 'Demo Eğitim Kurumu',
                'logo_url' => null,
                'primary_color' => '#4f46e5',
                'license_type' => 'premium',
                'user_limit' => 500,
                'is_active' => true,
            ]
        );

        // 3. Kurum Yöneticisi Oluştur
        $institutionAdmin = User::firstOrCreate(
            ['email' => 'yonetici@demo.com'],
            [
                'name' => 'Demo Yönetici',
                'password' => Hash::make('12345678'),
                'role' => 'INSTITUTION_ADMIN',
                'tenant_id' => $tenant->id,
            ]
        );
        if (!$institutionAdmin->hasRole('INSTITUTION_ADMIN')) {
            $institutionAdmin->assignRole('INSTITUTION_ADMIN');
        }

        // 4. Örnek Öğretmen Oluştur
        $teacher = User::firstOrCreate(
            ['email' => 'ogretmen@demo.com'],
            [
                'name' => 'Örnek Öğretmen',
                'password' => Hash::make('12345678'),
                'role' => 'TEACHER',
                'tenant_id' => $tenant->id,
            ]
        );
        if (!$teacher->hasRole('TEACHER')) {
            $teacher->assignRole('TEACHER');
        }
        
        // 5. Örnek Öğrenci Oluştur
        $student = User::firstOrCreate(
            ['email' => 'ogrenci@demo.com'],
            [
                'name' => 'Örnek Öğrenci',
                'password' => Hash::make('12345678'),
                'role' => 'STUDENT',
                'tenant_id' => $tenant->id,
            ]
        );
        if (!$student->hasRole('STUDENT')) {
            $student->assignRole('STUDENT');
        }

        $this->command->info('Database seeded successfully with default roles, tenant and users.');
    }
}
