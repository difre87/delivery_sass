<?php

namespace Tests\Feature\Onboarding;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyOnboardingTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_without_company_is_redirected_to_onboarding_when_opening_dashboard(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertRedirect(route('onboarding.company.create'));
    }

    public function test_user_can_create_first_company_from_onboarding(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('onboarding.company.store'), [
            'name' => 'Acme Delivery',
        ]);

        $response->assertRedirect(route('dashboard'));

        $company = Company::first();

        $this->assertNotNull($company);
        $this->assertSame('Acme Delivery', $company->name);
        $this->assertSame($company->id, $user->fresh()->current_company_id);
        $this->assertDatabaseHas('company_user', [
            'company_id' => $company->id,
            'user_id' => $user->id,
            'role' => 'owner',
        ]);
    }
}
