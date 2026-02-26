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
        Schema::create('recurring_dispatch_run_shipment', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('recurring_dispatch_run_id');
            $table->unsignedBigInteger('shipment_id');
            $table->timestamps();
            
            // Clés étrangères avec noms courts
            $table->foreign('recurring_dispatch_run_id', 'rdr_shipment_rdr_fk')
                  ->references('id')->on('recurring_dispatch_runs')
                  ->cascadeOnDelete();
                  
            $table->foreign('shipment_id', 'rdr_shipment_shipment_fk')
                  ->references('id')->on('shipments')
                  ->cascadeOnDelete();
            
            // Éviter les doublons
            $table->unique(['recurring_dispatch_run_id', 'shipment_id'], 'rdr_shipment_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recurring_dispatch_run_shipment');
    }
};
