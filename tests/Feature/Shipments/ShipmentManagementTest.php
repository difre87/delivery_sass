<?php

namespace Tests\Feature\Shipments;

use App\Models\Client;
use App\Models\Company;
use App\Models\Shipment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShipmentManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_shipments_page(): void
    {
        [$user] = $this->createUserWithCompany();

        $response = $this->actingAs($user)->get(route('shipments.index'));

        $response->assertOk();
    }

    public function test_user_can_create_shipment_for_current_company(): void
    {
        [$user, $company] = $this->createUserWithCompany();

        $client = Client::create([
            'company_id' => $company->id,
            'name' => 'Client A',
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->post(route('shipments.store'), [
            'client_id' => $client->id,
            'recipient_name' => 'Jean Martin',
            'recipient_phone' => '+33123456789',
            'reference' => 'CMD-1001',
            'status' => 'scheduled',
            'scheduled_for' => now()->addDay()->toDateTimeString(),
            'distance_km' => 42.5,
            'cost_cents' => 1200,
            'price_cents' => 2500,
            'notes' => 'Livrer avant midi',
        ]);

        $response->assertRedirect(route('shipments.index'));

        $this->assertDatabaseHas('shipments', [
            'company_id' => $company->id,
            'recipient_name' => 'Jean Martin',
            'reference' => 'CMD-1001',
            'status' => 'scheduled',
        ]);
    }

    public function test_user_can_update_own_company_shipment(): void
    {
        [$user, $company] = $this->createUserWithCompany();

        $shipment = Shipment::create([
            'company_id' => $company->id,
            'recipient_name' => 'Old Recipient',
            'status' => 'draft',
        ]);

        $response = $this->actingAs($user)->patch(route('shipments.update', $shipment), [
            'client_id' => null,
            'recipient_name' => 'New Recipient',
            'recipient_phone' => null,
            'reference' => 'UPD-100',
            'status' => 'assigned',
            'scheduled_for' => null,
            'distance_km' => 10,
            'cost_cents' => 500,
            'price_cents' => 1000,
            'notes' => null,
        ]);

        $response->assertRedirect(route('shipments.index'));

        $this->assertDatabaseHas('shipments', [
            'id' => $shipment->id,
            'recipient_name' => 'New Recipient',
            'status' => 'assigned',
            'reference' => 'UPD-100',
        ]);
    }

    public function test_user_cannot_update_other_company_shipment(): void
    {
        [$user] = $this->createUserWithCompany();
        [, $otherCompany] = $this->createUserWithCompany('other-shipments@example.com', 'Other Co', 'other-co-shipments');

        $shipment = Shipment::create([
            'company_id' => $otherCompany->id,
            'recipient_name' => 'Other Recipient',
            'status' => 'draft',
        ]);

        $response = $this->actingAs($user)->patch(route('shipments.update', $shipment), [
            'client_id' => null,
            'recipient_name' => 'Hack',
            'recipient_phone' => null,
            'reference' => null,
            'status' => 'assigned',
            'scheduled_for' => null,
            'distance_km' => null,
            'cost_cents' => null,
            'price_cents' => null,
            'notes' => null,
        ]);

        $response->assertNotFound();
    }

    private function createUserWithCompany(
        string $email = 'shipments@example.com',
        string $companyName = 'Acme',
        string $companySlug = 'acme'
    ): array {
        $user = User::factory()->create([
            'email' => $email,
        ]);

        $company = Company::create([
            'name' => $companyName,
            'slug' => $companySlug,
        ]);

        $company->users()->attach($user->id, ['role' => 'owner']);
        $user->update(['current_company_id' => $company->id]);

        return [$user, $company];
    }
}
