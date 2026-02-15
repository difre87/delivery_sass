<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Onboarding\CompanyOnboardingController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\DashboardController;
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

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'plans' => $plans,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/onboarding/company', [CompanyOnboardingController::class, 'create'])
        ->name('onboarding.company.create');
    Route::post('/onboarding/company', [CompanyOnboardingController::class, 'store'])
        ->name('onboarding.company.store');

    Route::get('/dashboard', DashboardController::class)
        ->middleware(['verified', 'has-company'])
        ->name('dashboard');
    Route::get('/clients', [ClientController::class, 'index'])
        ->middleware('has-company')
        ->name('clients.index');
    Route::get('/drivers', [DriverController::class, 'index'])
        ->middleware('has-company')
        ->name('drivers.index');
    Route::post('/drivers', [DriverController::class, 'store'])
        ->middleware('has-company')
        ->name('drivers.store');
    Route::patch('/drivers/{driver}', [DriverController::class, 'update'])
        ->middleware('has-company')
        ->name('drivers.update');
    Route::delete('/drivers/{driver}', [DriverController::class, 'destroy'])
        ->middleware('has-company')
        ->name('drivers.destroy');
    Route::post('/drivers/{driver}/assign', [DriverController::class, 'assign'])
        ->middleware('has-company')
        ->name('drivers.assign');
    Route::delete('/drivers/{driver}/assign', [DriverController::class, 'unassign'])
        ->middleware('has-company')
        ->name('drivers.unassign');
    Route::post('/clients', [ClientController::class, 'store'])
        ->middleware('has-company')
        ->name('clients.store');
    Route::patch('/clients/{client}', [ClientController::class, 'update'])
        ->middleware('has-company')
        ->name('clients.update');
    Route::delete('/clients/{client}', [ClientController::class, 'destroy'])
        ->middleware('has-company')
        ->name('clients.destroy');
    Route::get('/shipments', [ShipmentController::class, 'index'])
        ->middleware('has-company')
        ->name('shipments.index');
    Route::post('/shipments', [ShipmentController::class, 'store'])
        ->middleware('has-company')
        ->name('shipments.store');
    Route::patch('/shipments/{shipment}', [ShipmentController::class, 'update'])
        ->middleware('has-company')
        ->name('shipments.update');
    Route::delete('/shipments/{shipment}', [ShipmentController::class, 'destroy'])
        ->middleware('has-company')
        ->name('shipments.destroy');
    Route::get('/routes', [DispatchRunController::class, 'index'])
        ->middleware('has-company')
        ->name('routes.index');
    Route::post('/routes', [DispatchRunController::class, 'store'])
        ->middleware('has-company')
        ->name('routes.store');
    Route::patch('/routes/{dispatchRun}', [DispatchRunController::class, 'update'])
        ->middleware('has-company')
        ->name('routes.update');
    Route::delete('/routes/{dispatchRun}', [DispatchRunController::class, 'destroy'])
        ->middleware('has-company')
        ->name('routes.destroy');
    Route::get('/fleet', [VehicleController::class, 'index'])
        ->middleware('has-company')
        ->name('fleet.index');
    Route::post('/fleet', [VehicleController::class, 'store'])
        ->middleware('has-company')
        ->name('fleet.store');
    Route::patch('/fleet/{vehicle}', [VehicleController::class, 'update'])
        ->middleware('has-company')
        ->name('fleet.update');
    Route::delete('/fleet/{vehicle}', [VehicleController::class, 'destroy'])
        ->middleware('has-company')
        ->name('fleet.destroy');
    Route::get('/fuel', [FuelLogController::class, 'index'])
        ->middleware('has-company')
        ->name('fuel.index');
    Route::post('/fuel', [FuelLogController::class, 'store'])
        ->middleware('has-company')
        ->name('fuel.store');
    Route::patch('/fuel/{fuelLog}', [FuelLogController::class, 'update'])
        ->middleware('has-company')
        ->name('fuel.update');
    Route::delete('/fuel/{fuelLog}', [FuelLogController::class, 'destroy'])
        ->middleware('has-company')
        ->name('fuel.destroy');
    Route::get('/invoices', [InvoiceController::class, 'index'])
        ->middleware('has-company')
        ->name('invoices.index');
    Route::get('/invoices/create', [InvoiceController::class, 'create'])
        ->middleware('has-company')
        ->name('invoices.create');
    Route::post('/invoices', [InvoiceController::class, 'store'])
        ->middleware('has-company')
        ->name('invoices.store');
    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])
        ->middleware('has-company')
        ->name('invoices.show');
    Route::patch('/invoices/{invoice}', [InvoiceController::class, 'update'])
        ->middleware('has-company')
        ->name('invoices.update');
    Route::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy'])
        ->middleware('has-company')
        ->name('invoices.destroy');
    Route::post('/invoices/{invoice}/mark-paid', [InvoiceController::class, 'markAsPaid'])
        ->middleware('has-company')
        ->name('invoices.mark-paid');
    Route::post('/invoices/{invoice}/send', [InvoiceController::class, 'send'])
        ->middleware('has-company')
        ->name('invoices.send');
    Route::get('/invoices/{invoice}/pdf', [InvoiceController::class, 'generatePdf'])
        ->middleware('has-company')
        ->name('invoices.pdf');
    Route::get('/waybills', [WaybillController::class, 'index'])
        ->middleware('has-company')
        ->name('waybills.index');
    Route::get('/waybills/create', [WaybillController::class, 'create'])
        ->middleware('has-company')
        ->name('waybills.create');
    Route::post('/waybills', [WaybillController::class, 'store'])
        ->middleware('has-company')
        ->name('waybills.store');
    Route::get('/waybills/{waybill}', [WaybillController::class, 'show'])
        ->middleware('has-company')
        ->name('waybills.show');
    Route::patch('/waybills/{waybill}', [WaybillController::class, 'update'])
        ->middleware('has-company')
        ->name('waybills.update');
    Route::delete('/waybills/{waybill}', [WaybillController::class, 'destroy'])
        ->middleware('has-company')
        ->name('waybills.destroy');
    Route::post('/waybills/{waybill}/mark-issued', [WaybillController::class, 'markAsIssued'])
        ->middleware('has-company')
        ->name('waybills.mark-issued');
    Route::post('/waybills/{waybill}/mark-in-progress', [WaybillController::class, 'markAsInProgress'])
        ->middleware('has-company')
        ->name('waybills.mark-in-progress');
    Route::post('/waybills/{waybill}/mark-completed', [WaybillController::class, 'markAsCompleted'])
        ->middleware('has-company')
        ->name('waybills.mark-completed');
    Route::patch('/waybills/{waybill}/items/{item}', [WaybillController::class, 'updateItem'])
        ->middleware('has-company')
        ->name('waybills.items.update');
    Route::get('/waybills/{waybill}/pdf', [WaybillController::class, 'generatePdf'])
        ->middleware('has-company')
        ->name('waybills.pdf');
    Route::get('/settings/company', [CompanySettingsController::class, 'edit'])
        ->middleware('has-company')
        ->name('settings.company');
    Route::post('/settings/company', [CompanySettingsController::class, 'update'])
        ->middleware('has-company')
        ->name('settings.company.update');
    Route::get('/plans', [SubscriptionController::class, 'index'])
        ->middleware('has-company')
        ->name('plans.index');
    Route::post('/subscriptions', [SubscriptionController::class, 'store'])
        ->middleware('has-company')
        ->name('subscriptions.store');
    Route::delete('/subscriptions/current', [SubscriptionController::class, 'destroy'])
        ->middleware('has-company')
        ->name('subscriptions.destroy');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
