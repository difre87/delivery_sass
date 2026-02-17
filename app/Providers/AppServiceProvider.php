<?php

namespace App\Providers;

use App\Models\Client;
use App\Models\Company;
use App\Observers\ClientObserver;
use App\Policies\CompanyPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        
        // Enregistrer les observers
        Client::observe(ClientObserver::class);

        // Enregistrer les permissions basées sur les rôles
        Gate::define('access-settings', [CompanyPolicy::class, 'accessSettings']);
        Gate::define('manage-users', [CompanyPolicy::class, 'manageUsers']);
        Gate::define('manage-branches', [CompanyPolicy::class, 'manageBranches']);
        Gate::define('manage-company-settings', [CompanyPolicy::class, 'manageCompanySettings']);
        Gate::define('manage-drivers', [CompanyPolicy::class, 'manageDrivers']);
        Gate::define('manage-fleet', [CompanyPolicy::class, 'manageFleet']);
        Gate::define('manage-routes', [CompanyPolicy::class, 'manageRoutes']);
        Gate::define('manage-clients', [CompanyPolicy::class, 'manageClients']);
        Gate::define('view-shipments', [CompanyPolicy::class, 'viewShipments']);
        Gate::define('manage-shipments', [CompanyPolicy::class, 'manageShipments']);
        Gate::define('access-analytics', [CompanyPolicy::class, 'accessAnalytics']);
    }
}

