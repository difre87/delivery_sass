<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Onboarding\CompanyOnboardingController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\TrackingController;
use App\Http\Controllers\AppPlaceholderController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DispatchRunController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\FuelLogController;
use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\CompanySettingsController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\WaybillController;
use App\Http\Controllers\ExportController;
use App\Models\Plan;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

Route::get('/', function () {
    $plans = Schema::hasTable('plans')
        ? Plan::active()
            ->orderBy('sort_order')
            ->get([
                'id',
                'name',
                'slug',
                'price_cents',
                'currency',
                'interval',
                'trial_days',
                'max_drivers',
                'max_vehicles',
                'features',
            ])
        : collect();

    // Statistiques globales de la plateforme
    $stats = [
        'total_companies' => Schema::hasTable('companies') ? \App\Models\Company::count() : 0,
        'total_shipments' => Schema::hasTable('shipments') ? \App\Models\Shipment::count() : 0,
        'total_vehicles' => Schema::hasTable('vehicles') ? \App\Models\Vehicle::count() : 0,
        'total_drivers' => Schema::hasTable('drivers') ? \App\Models\Driver::where('is_active', true)->count() : 0,
        'active_subscriptions' => Schema::hasTable('subscriptions') 
            ? \App\Models\Subscription::where('status', 'active')->count() 
            : 0,
    ];

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'plans' => $plans,
        'platformStats' => $stats,
    ]);
});

// Legal pages
Route::get('/legal/terms', function () {
    return Inertia::render('Legal/TermsOfService');
})->name('legal.terms');

Route::get('/legal/notice', function () {
    return Inertia::render('Legal/LegalNotice');
})->name('legal.notice');

Route::get('/legal/privacy', function () {
    return Inertia::render('Legal/PrivacyPolicy');
})->name('legal.privacy');

Route::middleware('auth')->group(function () {
    // Onboarding routes (sans préfixe company)
    Route::get('/onboarding/company', [CompanyOnboardingController::class, 'create'])
        ->name('onboarding.company.create');
    Route::post('/onboarding/company', [CompanyOnboardingController::class, 'store'])
        ->name('onboarding.company.store');

    // Routes avec slug de société
    Route::prefix('{company}')->middleware(['company-slug'])->group(function () {
        Route::get('/dashboard', DashboardController::class)
            ->middleware('verified')
            ->name('dashboard');
        
        // Analytics
        Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
        
        // Tracking GPS
        Route::get('/tracking', [TrackingController::class, 'index'])->name('tracking.index');
        Route::get('/tracking/live', [TrackingController::class, 'liveLocations'])->name('tracking.live');
        Route::post('/tracking', [TrackingController::class, 'store'])->name('tracking.store');
        Route::get('/tracking/{vehicle}/history', [TrackingController::class, 'history'])->name('tracking.history');
        
        // Clients
        Route::get('/clients', [ClientController::class, 'index'])->name('clients.index');
        Route::post('/clients', [ClientController::class, 'store'])->name('clients.store');
        Route::patch('/clients/{clientId}', [ClientController::class, 'update'])->name('clients.update')->where('clientId', '[0-9]+');
        Route::delete('/clients/{clientId}', [ClientController::class, 'destroy'])->name('clients.destroy')->where('clientId', '[0-9]+');
        
        // Drivers
        Route::get('/drivers', [DriverController::class, 'index'])->name('drivers.index');
        Route::post('/drivers', [DriverController::class, 'store'])->name('drivers.store');
        Route::patch('/drivers/{driver}', [DriverController::class, 'update'])->name('drivers.update');
        Route::delete('/drivers/{driver}', [DriverController::class, 'destroy'])->name('drivers.destroy');
        Route::post('/drivers/{driver}/assign', [DriverController::class, 'assign'])->name('drivers.assign');
        Route::delete('/drivers/{driver}/assign', [DriverController::class, 'unassign'])->name('drivers.unassign');
        
        // Shipments
        Route::get('/shipments', [ShipmentController::class, 'index'])->name('shipments.index');
        Route::post('/shipments', [ShipmentController::class, 'store'])->name('shipments.store');
        Route::patch('/shipments/{shipment}', [ShipmentController::class, 'update'])->name('shipments.update');
        Route::delete('/shipments/{shipment}', [ShipmentController::class, 'destroy'])->name('shipments.destroy');
        
        // Packages (Colis)
        Route::get('/packages', [\App\Http\Controllers\PackageController::class, 'index'])->name('packages.index');
        Route::get('/packages/create', [\App\Http\Controllers\PackageController::class, 'create'])->name('packages.create');
        Route::post('/packages', [\App\Http\Controllers\PackageController::class, 'store'])->name('packages.store');
        Route::get('/packages/{packageId}/edit', [\App\Http\Controllers\PackageController::class, 'edit'])->name('packages.edit');
        Route::patch('/packages/{packageId}', [\App\Http\Controllers\PackageController::class, 'update'])->name('packages.update');
        Route::delete('/packages/{packageId}', [\App\Http\Controllers\PackageController::class, 'destroy'])->name('packages.destroy');
        
        // Routes (Dispatch Runs)
        Route::get('/routes', [DispatchRunController::class, 'index'])->name('routes.index');
        Route::post('/routes', [DispatchRunController::class, 'store'])->name('routes.store');
        Route::patch('/routes/{dispatchRun}', [DispatchRunController::class, 'update'])->name('routes.update');
        Route::delete('/routes/{dispatchRun}', [DispatchRunController::class, 'destroy'])->name('routes.destroy');
        
        // Fleet
        Route::get('/fleet', [VehicleController::class, 'index'])->name('fleet.index');
        Route::post('/fleet', [VehicleController::class, 'store'])->name('fleet.store');
        Route::patch('/fleet/{vehicle}', [VehicleController::class, 'update'])->name('fleet.update');
        Route::delete('/fleet/{vehicle}', [VehicleController::class, 'destroy'])->name('fleet.destroy');
        
        // Fuel
        Route::get('/fuel', [FuelLogController::class, 'index'])->name('fuel.index');
        Route::post('/fuel', [FuelLogController::class, 'store'])->name('fuel.store');
        Route::patch('/fuel/{fuelLog}', [FuelLogController::class, 'update'])->name('fuel.update');
        Route::delete('/fuel/{fuelLog}', [FuelLogController::class, 'destroy'])->name('fuel.destroy');
        
        // Invoices
        Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
        Route::get('/invoices/create', [InvoiceController::class, 'create'])->name('invoices.create');
        Route::post('/invoices', [InvoiceController::class, 'store'])->name('invoices.store');
        Route::get('/invoices/{invoiceId}', [InvoiceController::class, 'show'])->name('invoices.show');
        Route::patch('/invoices/{invoiceId}', [InvoiceController::class, 'update'])->name('invoices.update');
        Route::delete('/invoices/{invoiceId}', [InvoiceController::class, 'destroy'])->name('invoices.destroy');
        Route::post('/invoices/{invoiceId}/mark-paid', [InvoiceController::class, 'markAsPaid'])->name('invoices.mark-paid');
        Route::post('/invoices/{invoiceId}/send', [InvoiceController::class, 'send'])->name('invoices.send');
        Route::get('/invoices/{invoiceId}/pdf', [InvoiceController::class, 'generatePdf'])->name('invoices.pdf');
        
        // Waybills
        Route::get('/waybills', [WaybillController::class, 'index'])->name('waybills.index');
        Route::get('/waybills/create', [WaybillController::class, 'create'])->name('waybills.create');
        Route::post('/waybills', [WaybillController::class, 'store'])->name('waybills.store');
        Route::get('/waybills/{waybillId}', [WaybillController::class, 'show'])->name('waybills.show');
        Route::patch('/waybills/{waybillId}', [WaybillController::class, 'update'])->name('waybills.update');
        Route::delete('/waybills/{waybillId}', [WaybillController::class, 'destroy'])->name('waybills.destroy');
        Route::post('/waybills/{waybillId}/mark-issued', [WaybillController::class, 'markAsIssued'])->name('waybills.mark-issued');
        Route::post('/waybills/{waybillId}/mark-in-progress', [WaybillController::class, 'markAsInProgress'])->name('waybills.mark-in-progress');
        Route::post('/waybills/{waybillId}/mark-completed', [WaybillController::class, 'markAsCompleted'])->name('waybills.mark-completed');
        Route::patch('/waybills/{waybillId}/items/{item}', [WaybillController::class, 'updateItem'])->name('waybills.items.update');
        Route::get('/waybills/{waybillId}/pdf', [WaybillController::class, 'generatePdf'])->name('waybills.pdf');
        
        // Settings
        Route::get('/settings/company', [CompanySettingsController::class, 'edit'])->name('settings.company');
        Route::post('/settings/company', [CompanySettingsController::class, 'update'])->name('settings.company.update');
        Route::get('/settings/branches', [\App\Http\Controllers\CompanyBranchController::class, 'index'])->name('settings.branches');
        Route::post('/settings/branches', [\App\Http\Controllers\CompanyBranchController::class, 'store'])->name('settings.branches.store');
        Route::patch('/settings/branches/{branchId}', [\App\Http\Controllers\CompanyBranchController::class, 'update'])->name('settings.branches.update');
        Route::delete('/settings/branches/{branchId}', [\App\Http\Controllers\CompanyBranchController::class, 'destroy'])->name('settings.branches.destroy');
        
        // Branch Switching
        Route::post('/switch-branch/{branchId}', \App\Http\Controllers\SwitchBranchController::class)->name('branch.switch');
        
        // Plans & Subscriptions
        Route::get('/plans', [SubscriptionController::class, 'index'])->name('plans.index');
        Route::post('/subscriptions', [SubscriptionController::class, 'store'])->name('subscriptions.store');
        Route::delete('/subscriptions/current', [SubscriptionController::class, 'destroy'])->name('subscriptions.destroy');
        
        // CSV Exports
        Route::get('/export/clients', [ExportController::class, 'clients'])->name('export.clients');
        Route::get('/export/drivers', [ExportController::class, 'drivers'])->name('export.drivers');
        Route::get('/export/shipments', [ExportController::class, 'shipments'])->name('export.shipments');
        Route::get('/export/vehicles', [ExportController::class, 'vehicles'])->name('export.vehicles');
        Route::get('/export/fuel', [ExportController::class, 'fuelLogs'])->name('export.fuel');
        Route::get('/export/invoices', [ExportController::class, 'invoices'])->name('export.invoices');
        Route::get('/export/waybills', [ExportController::class, 'waybills'])->name('export.waybills');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
