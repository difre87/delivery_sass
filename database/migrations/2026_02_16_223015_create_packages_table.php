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
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('shipment_id')->constrained()->cascadeOnDelete();
            $table->string('tracking_number')->nullable()->unique();
            $table->string('reference')->nullable();
            $table->string('description')->nullable();
            $table->string('type')->default('standard'); // standard, fragile, perishable, document
            $table->decimal('weight_kg', 8, 2)->nullable();
            $table->decimal('length_cm', 8, 2)->nullable();
            $table->decimal('width_cm', 8, 2)->nullable();
            $table->decimal('height_cm', 8, 2)->nullable();
            $table->decimal('volume_m3', 8, 4)->nullable();
            $table->unsignedInteger('value_cents')->nullable();
            $table->unsignedInteger('declared_value_cents')->nullable();
            $table->boolean('requires_signature')->default(false);
            $table->boolean('is_fragile')->default(false);
            $table->boolean('is_hazardous')->default(false);
            $table->string('status')->default('pending'); // pending, in_transit, delivered, returned, lost
            $table->text('notes')->nullable();
            $table->string('barcode')->nullable();
            $table->timestamps();

            $table->index(['company_id', 'branch_id', 'shipment_id']);
            $table->index(['company_id', 'status']);
            $table->index(['tracking_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
