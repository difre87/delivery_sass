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
        Schema::create('recurring_dispatch_runs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->nullable()->constrained('branches')->nullOnDelete();
            $table->foreignId('driver_id')->nullable()->constrained('drivers')->nullOnDelete();
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles')->nullOnDelete();
            
            $table->string('name'); // Nom de la tournée récurrente (ex: "Collecte quotidienne - Zone Nord")
            $table->text('description')->nullable();
            
            // Fréquence : daily, weekly, monthly
            $table->enum('frequency', ['daily', 'weekly', 'monthly'])->default('daily');
            
            // Pour fréquence hebdomadaire : jours de la semaine (JSON array: [1,2,3,4,5] pour Lun-Ven)
            $table->json('weekdays')->nullable();
            
            // Pour fréquence mensuelle : jours du mois (JSON array: [1,15] pour le 1er et 15 du mois)
            $table->json('monthdays')->nullable();
            
            // Période de validité
            $table->date('start_date');
            $table->date('end_date')->nullable();
            
            // Horaires par défaut
            $table->time('default_start_time')->nullable();
            $table->time('default_end_time')->nullable();
            
            // Statut par défaut des tournées générées
            $table->enum('default_status', ['planned', 'in_progress', 'completed'])->default('planned');
            
            // Active/Inactive
            $table->boolean('is_active')->default(true);
            
            // Date de la dernière génération
            $table->date('last_generated_at')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Index
            $table->index(['company_id', 'is_active']);
            $table->index(['branch_id', 'is_active']);
            $table->index('start_date');
            $table->index('last_generated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recurring_dispatch_runs');
    }
};
