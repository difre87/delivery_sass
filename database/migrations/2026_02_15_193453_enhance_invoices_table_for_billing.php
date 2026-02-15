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
        Schema::table('invoices', function (Blueprint $table) {
            if (!Schema::hasColumn('invoices', 'client_id')) {
                $table->foreignId('client_id')->after('company_id')->nullable()->constrained()->nullOnDelete();
            }
            if (!Schema::hasColumn('invoices', 'invoice_date')) {
                $table->date('invoice_date')->after('invoice_number')->nullable();
            }
            if (!Schema::hasColumn('invoices', 'subtotal')) {
                $table->decimal('subtotal', 10, 2)->after('invoice_date')->default(0);
            }
            if (!Schema::hasColumn('invoices', 'tax_rate')) {
                $table->decimal('tax_rate', 5, 2)->after('subtotal')->default(0);
            }
            if (!Schema::hasColumn('invoices', 'tax_amount')) {
                $table->decimal('tax_amount', 10, 2)->after('tax_rate')->default(0);
            }
            if (!Schema::hasColumn('invoices', 'notes')) {
                $table->text('notes')->after('status')->nullable();
            }
            if (!Schema::hasColumn('invoices', 'pdf_path')) {
                $table->string('pdf_path')->after('notes')->nullable();
            }
            if (!Schema::hasColumn('invoices', 'paid_at')) {
                $table->timestamp('paid_at')->after('pdf_path')->nullable();
            }
            
            // Modify existing column type
            $table->date('due_date')->nullable()->change();
        });

        // Create invoice_items table
        if (!Schema::hasTable('invoice_items')) {
            Schema::create('invoice_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('invoice_id')->constrained()->cascadeOnDelete();
                $table->foreignId('shipment_id')->nullable()->constrained()->nullOnDelete();
                $table->string('description');
                $table->integer('quantity')->default(1);
                $table->decimal('unit_price', 10, 2);
                $table->decimal('total', 10, 2);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_items');
        
        Schema::table('invoices', function (Blueprint $table) {
            $columns = ['client_id', 'invoice_date', 'subtotal', 'tax_rate', 'tax_amount', 'notes', 'pdf_path', 'paid_at'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('invoices', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
