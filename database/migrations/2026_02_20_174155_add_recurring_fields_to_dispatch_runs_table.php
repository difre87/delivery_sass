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
        Schema::table('dispatch_runs', function (Blueprint $table) {
            $table->time('start_time')->nullable()->after('date');
            $table->time('end_time')->nullable()->after('start_time');
            $table->foreignId('recurring_dispatch_run_id')->nullable()->after('vehicle_id')->constrained('recurring_dispatch_runs')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dispatch_runs', function (Blueprint $table) {
            $table->dropForeign(['recurring_dispatch_run_id']);
            $table->dropColumn(['start_time', 'end_time', 'recurring_dispatch_run_id']);
        });
    }
};
