<?php

namespace Tests\Feature\Clients;

use App\Models\Client;
use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_clients_page(): void
    {
        [$user] = $this->createUserWithCompany();

        $response = $this->actingAs($user)->get(route('clients.index'));

        $response->assertOk();
    }

    public function test_user_can_create_client_for_current_company(): void
    {
        [$user, $company] = $this->createUserWithCompany();

        $response = $this->actingAs($user)->post(route('clients.store'), [
            'name' => 'ACME Logistics',
            'code' => 'ACME',
            'email' => 'ops@acme.test',
            'phone' => '+33123456789',
            'notes' => 'Client premium',
            'is_active' => true,
        ]);

        $response->assertRedirect(route('clients.index'));

        $this->assertDatabaseHas('clients', [
            'company_id' => $company->id,
            'name' => 'ACME Logistics',
            'code' => 'ACME',
            'is_active' => 1,
        ]);
    }

    public function test_user_can_update_own_company_client(): void
    {
        [$user, $company] = $this->createUserWithCompany();

        $client = Client::create([
            'company_id' => $company->id,
            'name' => 'Old Name',
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->patch(route('clients.update', $client), [
            'name' => 'New Name',
            'code' => 'NEWCODE',
            'email' => null,
            'phone' => null,
            'notes' => null,
            'is_active' => false,
        ]);

        $response->assertRedirect(route('clients.index'));

        $this->assertDatabaseHas('clients', [
            'id' => $client->id,
            'name' => 'New Name',
            'code' => 'NEWCODE',
            'is_active' => 0,
        ]);
    }

    public function test_user_cannot_update_other_company_client(): void
    {
        [$user] = $this->createUserWithCompany();
        [, $otherCompany] = $this->createUserWithCompany('other@example.com', 'Other Co', 'other-co');

        $client = Client::create([
            'company_id' => $otherCompany->id,
            'name' => 'Other Client',
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->patch(route('clients.update', $client), [
            'name' => 'Hacked',
            'is_active' => true,
        ]);

        $response->assertNotFound();
    }

    private function createUserWithCompany(
        string $email = 'test@example.com',
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
