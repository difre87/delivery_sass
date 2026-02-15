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
        Schema::table('waybills', function (Blueprint $table) {
            // Add dispatch_run_id to link waybill to a route
            if (!Schema::hasColumn('waybills', 'dispatch_run_id')) {
                $table->foreignId('dispatch_run_id')->after('company_id')->nullable()->constrained('dispatch_runs')->nullOnDelete();
            }
            
            // Add driver_id
            if (!Schema::hasColumn('waybills', 'driver_id')) {
                $table->foreignId('driver_id')->after('dispatch_run_id')->nullable()->constrained()->nullOnDelete();
            }
            
            // Add vehicle_id
            if (!Schema::hasColumn('waybills', 'vehicle_id')) {
                $table->foreignId('vehicle_id')->after('driver_id')->nullable()->constrained()->nullOnDelete();
            }
            
            // Add status
            if (!Schema::hasColumn('waybills', 'status')) {
                $table->enum('status', ['draft', 'issued', 'in_progress', 'completed', 'cancelled'])->default('draft')->after('number');
            }
            
            // Add dates
            if (!Schema::hasColumn('waybills', 'date')) {
                $table->date('date')->after('status')->nullable();
            }
            
            if (!Schema::hasColumn('waybills', 'departure_time')) {
                $table->time('departure_time')->after('date')->nullable();
            }
            
            if (!Schema::hasColumn('waybills', 'return_time')) {
                $table->time('return_time')->after('departure_time')->nullable();
            }
            
            // Add notes
            if (!Schema::hasColumn('waybills', 'notes')) {
                $table->text('notes')->after('qr_token')->nullable();
            }
            
            // Add total_shipments
            if (!Schema::hasColumn('waybills', 'total_shipments')) {
                $table->integer('total_shipments')->default(0)->after('notes');
            }
            
            // Add completed_shipments
            if (!Schema::hasColumn('waybills', 'completed_shipments')) {
                $table->integer('completed_shipments')->default(0)->after('total_shipments');
            }
            
            // Make shipment_id nullable since one waybill can have multiple shipments
            $table->foreignId('shipment_id')->nullable()->change();
        });

        // Create waybill_items table to link multiple shipments to a waybill
        if (!Schema::hasTable('waybill_items')) {
            Schema::create('waybill_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('waybill_id')->constrained()->cascadeOnDelete();
                $table->foreignId('shipment_id')->constrained()->cascadeOnDelete();
                $table->integer('sequence_number')->default(0); // Order in the route
                $table->enum('status', ['pending', 'picked_up', 'delivered', 'failed'])->default('pending');
                $table->timestamp('picked_up_at')->nullable();
                $table->timestamp('delivered_at')->nullable();
                $table->text('delivery_notes')->nullable();
                $table->string('signature_url')->nullable();
                $table->timestamps();
                
                $table->unique(['waybill_id', 'shipment_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('waybill_items');
        
        Schema::table('waybills', function (Blueprint $table) {
            $columns = [
                'dispatch_run_id', 'driver_id', 'vehicle_id', 'status', 'date', 
                'departure_time', 'return_time', 'notes', 'total_shipments', 'completed_shipments'
            ];
            
            foreach ($columns as $column) {
                if (Schema::hasColumn('waybills', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
