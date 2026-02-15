<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shipments', function (Blueprint $table) {
            if (! Schema::hasColumn('shipments', 'weight')) {
                $table->decimal('weight', 8, 2)->nullable()->after('distance_km');
            }

            if (! Schema::hasColumn('shipments', 'amount')) {
                $table->decimal('amount', 12, 2)->default(0)->after('weight');
            }

            if (! Schema::hasColumn('shipments', 'cod_amount')) {
                $table->decimal('cod_amount', 12, 2)->default(0)->after('amount');
            }
        });

        if (! Schema::hasTable('shipment_events')) {
            Schema::create('shipment_events', function (Blueprint $table) {
                $table->id();
                $table->foreignId('company_id')->constrained()->cascadeOnDelete();
                $table->foreignId('shipment_id')->constrained()->cascadeOnDelete();
                $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
                $table->string('status');
                $table->text('notes')->nullable();
                $table->string('location')->nullable();
                $table->timestamps();

                $table->index(['company_id', 'shipment_id']);
            });
        }

        if (! Schema::hasTable('dispatch_runs')) {
            Schema::create('dispatch_runs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('company_id')->constrained()->cascadeOnDelete();
                $table->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
                $table->foreignId('driver_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('vehicle_id')->nullable()->constrained()->nullOnDelete();
                $table->date('date');
                $table->string('status')->default('planned');
                $table->timestamps();

                $table->index(['company_id', 'date', 'status']);
            });
        }

        if (! Schema::hasTable('dispatch_run_shipments')) {
            Schema::create('dispatch_run_shipments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('dispatch_run_id')->constrained()->cascadeOnDelete();
                $table->foreignId('shipment_id')->constrained()->cascadeOnDelete();

                $table->unique(['dispatch_run_id', 'shipment_id']);
            });
        }

        Schema::table('vehicles', function (Blueprint $table) {
            if (! Schema::hasColumn('vehicles', 'branch_id')) {
                $table->foreignId('branch_id')->nullable()->after('company_id')->constrained()->nullOnDelete();
            }

            if (! Schema::hasColumn('vehicles', 'type')) {
                $table->string('type')->default('van')->after('branch_id');
            }

            if (! Schema::hasColumn('vehicles', 'current_odometer')) {
                $table->unsignedInteger('current_odometer')->default(0)->after('odometer_km');
            }
        });

        if (! Schema::hasTable('vehicle_assignments')) {
            Schema::create('vehicle_assignments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
                $table->foreignId('driver_id')->constrained('users')->cascadeOnDelete();
                $table->timestamp('starts_at');
                $table->timestamp('ends_at')->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('odometer_readings')) {
            Schema::create('odometer_readings', function (Blueprint $table) {
                $table->id();
                $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
                $table->foreignId('driver_id')->nullable()->constrained('users')->nullOnDelete();
                $table->foreignId('dispatch_run_id')->nullable()->constrained()->nullOnDelete();
                $table->string('type')->default('manual');
                $table->unsignedInteger('odometer_km');
                $table->string('photo_path')->nullable();
                $table->timestamp('recorded_at');
                $table->timestamps();

                $table->index(['vehicle_id', 'recorded_at']);
            });
        }

        Schema::table('fuel_logs', function (Blueprint $table) {
            if (! Schema::hasColumn('fuel_logs', 'dispatch_run_id')) {
                $table->foreignId('dispatch_run_id')->nullable()->after('driver_id')->constrained()->nullOnDelete();
            }

            if (! Schema::hasColumn('fuel_logs', 'liters')) {
                $table->decimal('liters', 8, 2)->nullable()->after('volume_liters');
            }

            if (! Schema::hasColumn('fuel_logs', 'amount')) {
                $table->decimal('amount', 12, 2)->nullable()->after('liters');
            }

            if (! Schema::hasColumn('fuel_logs', 'receipt_photo')) {
                $table->string('receipt_photo')->nullable()->after('station_name');
            }
        });

        if (! Schema::hasTable('maintenance_records')) {
            Schema::create('maintenance_records', function (Blueprint $table) {
                $table->id();
                $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
                $table->string('type');
                $table->unsignedInteger('odometer_km')->nullable();
                $table->decimal('cost', 12, 2)->nullable();
                $table->string('vendor')->nullable();
                $table->text('notes')->nullable();
                $table->string('status')->default('planned');
                $table->timestamp('scheduled_at')->nullable();
                $table->timestamp('done_at')->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('invoices')) {
            Schema::create('invoices', function (Blueprint $table) {
                $table->id();
                $table->foreignId('company_id')->constrained()->cascadeOnDelete();
                $table->string('invoice_number')->unique();
                $table->decimal('total', 12, 2);
                $table->string('status')->default('draft');
                $table->timestamp('due_date')->nullable();
                $table->timestamps();

                $table->index(['company_id', 'status']);
            });
        }

        if (! Schema::hasTable('audit_logs')) {
            Schema::create('audit_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('company_id')->nullable()->constrained()->nullOnDelete();
                $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
                $table->string('action');
                $table->string('model_type')->nullable();
                $table->unsignedBigInteger('model_id')->nullable();
                $table->json('old_values')->nullable();
                $table->json('new_values')->nullable();
                $table->timestamps();

                $table->index(['company_id', 'action']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('maintenance_records');

        Schema::table('fuel_logs', function (Blueprint $table) {
            if (Schema::hasColumn('fuel_logs', 'dispatch_run_id')) {
                $table->dropConstrainedForeignId('dispatch_run_id');
            }

            if (Schema::hasColumn('fuel_logs', 'receipt_photo')) {
                $table->dropColumn('receipt_photo');
            }

            if (Schema::hasColumn('fuel_logs', 'amount')) {
                $table->dropColumn('amount');
            }

            if (Schema::hasColumn('fuel_logs', 'liters')) {
                $table->dropColumn('liters');
            }
        });

        Schema::dropIfExists('odometer_readings');
        Schema::dropIfExists('vehicle_assignments');

        Schema::table('vehicles', function (Blueprint $table) {
            if (Schema::hasColumn('vehicles', 'current_odometer')) {
                $table->dropColumn('current_odometer');
            }

            if (Schema::hasColumn('vehicles', 'type')) {
                $table->dropColumn('type');
            }

            if (Schema::hasColumn('vehicles', 'branch_id')) {
                $table->dropConstrainedForeignId('branch_id');
            }
        });

        Schema::dropIfExists('dispatch_run_shipments');
        Schema::dropIfExists('dispatch_runs');
        Schema::dropIfExists('shipment_events');

        Schema::table('shipments', function (Blueprint $table) {
            if (Schema::hasColumn('shipments', 'cod_amount')) {
                $table->dropColumn('cod_amount');
            }

            if (Schema::hasColumn('shipments', 'amount')) {
                $table->dropColumn('amount');
            }

            if (Schema::hasColumn('shipments', 'weight')) {
                $table->dropColumn('weight');
            }
        });
    }
};
