<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $company = Company::where('name', 'Express Delivery Pro')->first();
        
        if (!$company) {
            return;
        }

        $branches = [
            [
                'name' => 'Agence Centre-Ville',
                'address' => 'Boulevard Mohammed V, Place des Nations Unies',
                'city' => 'Casablanca',
                'country' => 'Maroc',
            ],
            [
                'name' => 'Agence Maarif',
                'address' => 'Avenue Hassan II, Quartier Maarif',
                'city' => 'Casablanca',
                'country' => 'Maroc',
            ],
            [
                'name' => 'Agence Rabat',
                'address' => 'Avenue Allal Ben Abdellah',
                'city' => 'Rabat',
                'country' => 'Maroc',
            ],
            [
                'name' => 'Agence Marrakech',
                'address' => 'Avenue Mohammed VI, Guéliz',
                'city' => 'Marrakech',
                'country' => 'Maroc',
            ],
            [
                'name' => 'Agence Tanger',
                'address' => 'Boulevard Pasteur',
                'city' => 'Tanger',
                'country' => 'Maroc',
            ],
        ];

        $createdBranches = [];
        foreach ($branches as $branchData) {
            $createdBranches[] = Branch::create([
                'company_id' => $company->id,
                ...$branchData,
            ]);
        }

        // Assigner tous les utilisateurs admin/staff à toutes les agences
        $adminUsers = User::whereHas('companies', function ($query) use ($company) {
            $query->where('companies.id', $company->id)
                  ->whereIn('company_user.role', ['admin', 'dispatcher', 'accountant']);
        })->get();

        foreach ($adminUsers as $user) {
            foreach ($createdBranches as $index => $branch) {
                $user->branches()->attach($branch->id, [
                    'is_default' => $index === 0, // Première agence par défaut
                ]);
            }
            
            // Définir la première agence comme current_branch_id
            $user->update(['current_branch_id' => $createdBranches[0]->id]);
        }

        // Assigner les chauffeurs aux agences de manière répartie
        $drivers = User::whereHas('companies', function ($query) use ($company) {
            $query->where('companies.id', $company->id)
                  ->where('company_user.role', 'driver');
        })->get();

        foreach ($drivers as $index => $driver) {
            $branchIndex = $index % count($createdBranches);
            $branch = $createdBranches[$branchIndex];
            
            $driver->branches()->attach($branch->id, ['is_default' => true]);
            $driver->update(['current_branch_id' => $branch->id]);
        }
    }
}
