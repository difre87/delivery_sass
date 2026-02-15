<?php

namespace Tests\Feature\Billing;

use App\Models\Company;
use App\Models\Plan;
use App\Models\User;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubscriptionTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_subscribe_current_company_to_a_plan(): void
    {
        $this->seed(PlanSeeder::class);

        $user = User::factory()->create();
        $company = Company::create([
            'name' => 'Acme',
            'slug' => 'acme',
        ]);

        $company->users()->attach($user->id, ['role' => 'owner']);
        $user->update(['current_company_id' => $company->id]);

        $plan = Plan::where('slug', 'pro')->firstOrFail();

        $response = $this->actingAs($user)->post(route('subscriptions.store'), [
            'plan_id' => $plan->id,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('subscriptions', [
            'company_id' => $company->id,
            'plan_id' => $plan->id,
            'status' => 'trialing',
        ]);
    }

    public function test_user_can_cancel_current_subscription(): void
    {
        $this->seed(PlanSeeder::class);

        $user = User::factory()->create();
        $company = Company::create([
            'name' => 'Acme',
            'slug' => 'acme',
        ]);

        $company->users()->attach($user->id, ['role' => 'owner']);
        $user->update(['current_company_id' => $company->id]);

        $plan = Plan::where('slug', 'starter')->firstOrFail();
        $company->subscriptions()->create([
            'plan_id' => $plan->id,
            'status' => 'active',
            'starts_at' => now(),
            'renews_at' => now()->addMonth(),
        ]);

        $response = $this->actingAs($user)->delete(route('subscriptions.destroy'));

        $response->assertRedirect();

        $this->assertDatabaseHas('subscriptions', [
            'company_id' => $company->id,
            'plan_id' => $plan->id,
            'status' => 'canceled',
        ]);
    }
}
