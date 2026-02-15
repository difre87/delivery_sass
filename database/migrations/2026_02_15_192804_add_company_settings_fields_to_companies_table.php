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
        Schema::table('companies', function (Blueprint $table) {
            // Check for columns that don't already exist
            if (! Schema::hasColumn('companies', 'address')) {
                $table->text('address')->nullable()->after('phone');
            }
            if (! Schema::hasColumn('companies', 'city')) {
                $table->string('city')->nullable()->after('address');
            }
            if (! Schema::hasColumn('companies', 'postal_code')) {
                $table->string('postal_code')->nullable()->after('city');
            }
            if (! Schema::hasColumn('companies', 'country')) {
                $table->string('country')->nullable()->after('postal_code');
            }
            if (! Schema::hasColumn('companies', 'tax_id')) {
                $table->string('tax_id')->nullable()->after('country');
            }
            if (! Schema::hasColumn('companies', 'registration_number')) {
                $table->string('registration_number')->nullable()->after('tax_id');
            }
            if (! Schema::hasColumn('companies', 'website')) {
                $table->string('website')->nullable()->after('registration_number');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $columns = [
                'address',
                'city',
                'postal_code',
                'country',
                'tax_id',
                'registration_number',
                'website',
            ];
            
            foreach ($columns as $column) {
                if (Schema::hasColumn('companies', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
