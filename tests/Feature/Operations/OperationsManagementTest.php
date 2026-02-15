<?php

namespace Tests\Feature\Operations;

use App\Models\Company;
use App\Models\Shipment;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class OperationsManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_operations_pages(): void
    {
        $user = $this->createUserWithCurrentCompany();

        $this->actingAs($user)->get(route('fleet.index'))->assertOk();
        $this->actingAs($user)->get(route('routes.index'))->assertOk();
        $this->actingAs($user)->get(route('fuel.index'))->assertOk();
    }

    public function test_user_can_create_vehicle_for_current_company(): void
    {
        $user = $this->createUserWithCurrentCompany();

        $response = $this->actingAs($user)->post(route('fleet.store'), [
            'type' => 'van',
            'plate_number' => 'AA-123-BB',
            'make' => 'Renault',
            'model' => 'Master',
            'status' => 'active',
            'current_odometer' => 12500,
        ]);

        $response->assertRedirect(route('fleet.index'));

        $this->assertDatabaseHas('vehicles', [
            'company_id' => $user->current_company_id,
            'plate_number' => 'AA-123-BB',
            'type' => 'van',
            'current_odometer' => 12500,
        ]);
    }

    public function test_user_can_create_dispatch_run_and_fuel_log(): void
    {
        $user = $this->createUserWithCurrentCompany();
        $vehicle = Vehicle::create([
            'company_id' => $user->current_company_id,
            'type' => 'van',
            'plate_number' => 'CC-456-DD',
            'status' => 'active',
            'odometer_km' => 1000,
            'current_odometer' => 1000,
        ]);
        $shipment = Shipment::create([
            'company_id' => $user->current_company_id,
            'recipient_name' => 'Client test',
            'status' => 'scheduled',
        ]);

        $runResponse = $this->actingAs($user)->post(route('routes.store'), [
            'driver_id' => $user->id,
            'vehicle_id' => $vehicle->id,
            'date' => '2026-02-15',
            'status' => 'planned',
            'shipment_ids' => [$shipment->id],
        ]);

        $runResponse->assertRedirect(route('routes.index'));
        $this->assertDatabaseHas('dispatch_runs', [
            'company_id' => $user->current_company_id,
            'driver_id' => $user->id,
            'vehicle_id' => $vehicle->id,
        ]);

        $dispatchRunId = (int) DB::table('dispatch_runs')->value('id');
        $this->assertDatabaseHas('dispatch_run_shipments', [
            'dispatch_run_id' => $dispatchRunId,
            'shipment_id' => $shipment->id,
        ]);

        $fuelResponse = $this->actingAs($user)->post(route('fuel.store'), [
            'vehicle_id' => $vehicle->id,
            'dispatch_run_id' => $dispatchRunId,
            'filled_at' => '2026-02-15 10:00:00',
            'station_name' => 'Total',
            'volume_liters' => 30.5,
            'total_cents' => 4500,
            'odometer_km' => 1100,
        ]);

        $fuelResponse->assertRedirect(route('fuel.index'));

        $this->assertDatabaseHas('fuel_logs', [
            'company_id' => $user->current_company_id,
            'vehicle_id' => $vehicle->id,
            'dispatch_run_id' => $dispatchRunId,
            'total_cents' => 4500,
        ]);
    }

    private function createUserWithCurrentCompany(): User
    {
        $user = User::factory()->create();
        $company = Company::create([
            'name' => 'Ops Company',
            'slug' => 'ops-company-'.str()->lower(str()->random(6)),
        ]);

        $user->companies()->attach($company->id, ['role' => 'owner']);
        $user->forceFill(['current_company_id' => $company->id])->save();

        return $user->fresh();
    }
}
