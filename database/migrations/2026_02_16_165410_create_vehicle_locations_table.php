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
        Schema::create('vehicle_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->foreignId('driver_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('dispatch_run_id')->nullable()->constrained()->nullOnDelete();
            
            // GPS coordinates
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->decimal('altitude', 8, 2)->nullable();
            $table->decimal('speed', 6, 2)->nullable(); // km/h
            $table->decimal('heading', 5, 2)->nullable(); // degrees 0-360
            $table->decimal('accuracy', 8, 2)->nullable(); // meters
            
            // Additional data
            $table->string('address')->nullable();
            $table->enum('status', ['moving', 'stopped', 'idle', 'offline'])->default('offline');
            $table->integer('battery_level')->nullable(); // percentage
            $table->boolean('engine_on')->default(false);
            $table->timestamp('recorded_at');
            
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['vehicle_id', 'recorded_at']);
            $table->index(['company_id', 'recorded_at']);
            $table->index(['dispatch_run_id']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_locations');
    }
};
