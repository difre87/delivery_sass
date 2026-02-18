<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@deliverysaas.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('admin123456'),
                'is_super_admin' => true,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        if ($superAdmin->wasRecentlyCreated) {
            $this->command->info('✅ Super Admin créé avec succès !');
            $this->command->info('📧 Email: admin@deliverysaas.com');
            $this->command->info('🔑 Mot de passe: admin123456');
            $this->command->warn('⚠️  N\'oubliez pas de changer le mot de passe !');
        } else {
            // S'assurer qu'il est super admin
            $superAdmin->update(['is_super_admin' => true]);
            $this->command->info('✅ Utilisateur déjà existant, promu super admin.');
        }
    }
}
