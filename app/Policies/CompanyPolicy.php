<?php

namespace App\Policies;

use App\Models\User;

class CompanyPolicy
{
    /**
     * Get user role for current company and normalize it.
     * 'admin' is treated as 'owner' for backwards compatibility.
     */
    public function getUserRole(User $user): ?string
    {
        $role = $user->companies()
            ->where('companies.id', $user->current_company_id)
            ->first()
            ?->pivot
            ?->role;
        
        // Normaliser 'admin' en 'owner' pour compatibilité
        return $role === 'admin' ? 'owner' : $role;
    }

    /**
     * Determine if the user can access settings.
     */
    public function accessSettings(User $user): bool
    {
        $role = $this->getUserRole($user);
        return in_array($role, ['owner', 'manager']);
    }

    /**
     * Determine if the user can manage users.
     */
    public function manageUsers(User $user): bool
    {
        $role = $this->getUserRole($user);
        return in_array($role, ['owner', 'manager']);
    }

    /**
     * Determine if the user can manage branches.
     */
    public function manageBranches(User $user): bool
    {
        $role = $this->getUserRole($user);
        return $role === 'owner';
    }

    /**
     * Determine if the user can manage company settings.
     */
    public function manageCompanySettings(User $user): bool
    {
        $role = $this->getUserRole($user);
        return $role === 'owner';
    }

    /**
     * Determine if the user can manage drivers.
     */
    public function manageDrivers(User $user): bool
    {
        $role = $this->getUserRole($user);
        return in_array($role, ['owner', 'manager']);
    }

    /**
     * Determine if the user can manage fleet (vehicles).
     */
    public function manageFleet(User $user): bool
    {
        $role = $this->getUserRole($user);
        return in_array($role, ['owner', 'manager']);
    }

    /**
     * Determine if the user can manage routes/dispatch.
     */
    public function manageRoutes(User $user): bool
    {
        $role = $this->getUserRole($user);
        return in_array($role, ['owner', 'manager']);
    }

    /**
     * Determine if the user can manage clients.
     */
    public function manageClients(User $user): bool
    {
        $role = $this->getUserRole($user);
        return in_array($role, ['owner', 'manager']);
    }

    /**
     * Determine if the user can view shipments.
     */
    public function viewShipments(User $user): bool
    {
        // Tous les utilisateurs peuvent voir les shipments
        return true;
    }

    /**
     * Determine if the user can manage shipments.
     */
    /**
     * Determine if the user can manage shipments.
     */
    public function manageShipments(User $user): bool
    {
        $role = $this->getUserRole($user);
        return in_array($role, ['owner', 'manager']);
    }

    /**
     * Determine if the user can access analytics.
     */
    public function accessAnalytics(User $user): bool
    {
        $role = $this->getUserRole($user);
        return in_array($role, ['owner', 'manager']);
    }
}