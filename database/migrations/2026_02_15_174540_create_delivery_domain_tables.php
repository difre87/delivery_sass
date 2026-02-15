<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('label')->nullable();
            $table->string('contact_name')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('line1');
            $table->string('line2')->nullable();
            $table->string('city');
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country_code', 2)->default('FR');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->timestamps();

            $table->index(['company_id', 'city']);
        });

        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('code')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->foreignId('billing_address_id')->nullable()->constrained('addresses')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['company_id', 'code']);
        });

        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('license_number')->nullable();
            $table->date('license_expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['company_id', 'is_active']);
        });

        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('plate_number');
            $table->string('make')->nullable();
            $table->string('model')->nullable();
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('fuel_type')->default('diesel');
            $table->decimal('capacity_kg', 10, 2)->nullable();
            $table->decimal('capacity_m3', 8, 2)->nullable();
            $table->unsignedInteger('odometer_km')->default(0);
            $table->string('status')->default('active');
            $table->timestamps();

            $table->unique(['company_id', 'plate_number']);
            $table->index(['company_id', 'status']);
        });

        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('sender_address_id')->nullable()->constrained('addresses')->nullOnDelete();
            $table->string('recipient_name');
            $table->string('recipient_phone')->nullable();
            $table->foreignId('recipient_address_id')->nullable()->constrained('addresses')->nullOnDelete();
            $table->string('reference')->nullable();
            $table->string('status')->default('draft');
            $table->timestamp('scheduled_for')->nullable();
            $table->timestamp('picked_up_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->decimal('distance_km', 8, 2)->nullable();
            $table->unsignedInteger('cost_cents')->nullable();
            $table->unsignedInteger('price_cents')->nullable();
            $table->string('proof_of_delivery_url')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['company_id', 'status', 'scheduled_for']);
        });

        Schema::create('waybills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('shipment_id')->constrained()->cascadeOnDelete();
            $table->string('number');
            $table->string('qr_token')->unique();
            $table->timestamp('issued_at')->nullable();
            $table->string('pdf_url')->nullable();
            $table->timestamps();

            $table->unique(['company_id', 'number']);
            $table->unique(['shipment_id']);
        });

        Schema::create('delivery_routes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('code');
            $table->date('route_date');
            $table->foreignId('driver_id')->nullable()->constrained('drivers')->nullOnDelete();
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles')->nullOnDelete();
            $table->string('status')->default('planned');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->unsignedInteger('start_odometer_km')->nullable();
            $table->unsignedInteger('end_odometer_km')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['company_id', 'code']);
            $table->index(['company_id', 'route_date', 'status']);
        });

        Schema::create('route_stops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('delivery_route_id')->constrained('delivery_routes')->cascadeOnDelete();
            $table->foreignId('shipment_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('address_id')->nullable()->constrained('addresses')->nullOnDelete();
            $table->unsignedSmallInteger('sequence');
            $table->string('stop_type')->default('dropoff');
            $table->timestamp('planned_arrival_at')->nullable();
            $table->timestamp('arrived_at')->nullable();
            $table->timestamp('departed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['delivery_route_id', 'sequence']);
            $table->index(['company_id', 'stop_type']);
        });

        Schema::create('fuel_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_id')->constrained('vehicles')->cascadeOnDelete();
            $table->foreignId('driver_id')->nullable()->constrained('drivers')->nullOnDelete();
            $table->foreignId('delivery_route_id')->nullable()->constrained('delivery_routes')->nullOnDelete();
            $table->timestamp('filled_at');
            $table->string('station_name')->nullable();
            $table->decimal('volume_liters', 8, 2);
            $table->unsignedInteger('price_per_liter_cents');
            $table->unsignedInteger('total_cents');
            $table->unsignedInteger('odometer_km')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['company_id', 'filled_at']);
        });

        Schema::create('odometer_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_id')->constrained('vehicles')->cascadeOnDelete();
            $table->foreignId('driver_id')->nullable()->constrained('drivers')->nullOnDelete();
            $table->foreignId('delivery_route_id')->nullable()->constrained('delivery_routes')->nullOnDelete();
            $table->timestamp('logged_at');
            $table->unsignedInteger('value_km');
            $table->string('entry_type')->default('manual');
            $table->string('source')->nullable();
            $table->timestamps();

            $table->index(['company_id', 'vehicle_id', 'logged_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('odometer_logs');
        Schema::dropIfExists('fuel_logs');
        Schema::dropIfExists('route_stops');
        Schema::dropIfExists('delivery_routes');
        Schema::dropIfExists('waybills');
        Schema::dropIfExists('shipments');
        Schema::dropIfExists('vehicles');
        Schema::dropIfExists('drivers');
        Schema::dropIfExists('clients');
        Schema::dropIfExists('addresses');
    }
};
