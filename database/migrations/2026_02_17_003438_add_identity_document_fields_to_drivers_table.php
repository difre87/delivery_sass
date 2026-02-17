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
        Schema::table('drivers', function (Blueprint $table) {
            $table->enum('identity_document_type', ['passport', 'cni', 'carte_consulaire', 'extrait_naissance'])
                ->nullable()
                ->after('phone');
            $table->string('identity_document_number', 100)
                ->nullable()
                ->after('identity_document_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('drivers', function (Blueprint $table) {
            $table->dropColumn(['identity_document_type', 'identity_document_number']);
        });
    }
};
