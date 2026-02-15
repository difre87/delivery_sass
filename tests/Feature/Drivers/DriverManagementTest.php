<?php

namespace Tests\Feature\Drivers;

use App\Models\Company;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DriverManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_drivers_page(): void
    {
        $user = $this->createUserWithCurrentCompany();

        $this->actingAs($user)->get(route('drivers.index'))->assertOk();
    }

    public function test_user_can_create_driver_and_assign_vehicle(): void
    {
        $user = $this->createUserWithCurrentCompany();
        $vehicle = Vehicle::create([
            'company_id' => $user->current_company_id,
            'type' => 'van',
            'plate_number' => 'DR-111-AA',
            'status' => 'active',
            'odometer_km' => 0,
            'current_odometer' => 0,
        ]);

        $response = $this->actingAs($user)->post(route('drivers.store'), [
            'name' => 'Driver Test',
            'email' => 'driver@test.com',
            'phone' => '0102030405',
            'password' => 'password123',
            'is_active' => true,
            'vehicle_id' => $vehicle->id,
        ]);

        $response->assertRedirect(route('drivers.index'));

        $driver = User::where('email', 'driver@test.com')->firstOrFail();

        $this->assertDatabaseHas('company_user', [
            'company_id' => $user->current_company_id,
            'user_id' => $driver->id,
        ]);

        $this->assertDatabaseHas('vehicle_assignments', [
            'vehicle_id' => $vehicle->id,
            'driver_id' => $driver->id,
            'ends_at' => null,
        ]);
    }

    private function createUserWithCurrentCompany(): User
    {
        $user = User::factory()->create();
        $company = Company::create([
            'name' => 'Driver Company',
            'slug' => 'driver-company-'.str()->lower(str()->random(6)),
        ]);

        $user->companies()->attach($company->id, ['role' => 'owner']);
        $user->forceFill(['current_company_id' => $company->id])->save();

        return $user->fresh();
    }
}
