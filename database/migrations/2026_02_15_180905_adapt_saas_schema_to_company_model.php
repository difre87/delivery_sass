<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            if (! Schema::hasColumn('companies', 'plan_id')) {
                $table->foreignId('plan_id')->nullable()->after('id')->constrained('plans')->nullOnDelete();
            }

            if (! Schema::hasColumn('companies', 'email')) {
                $table->string('email')->nullable()->after('slug');
            }

            if (! Schema::hasColumn('companies', 'phone')) {
                $table->string('phone')->nullable()->after('email');
            }

            if (! Schema::hasColumn('companies', 'logo_path')) {
                $table->string('logo_path')->nullable()->after('phone');
            }

            if (! Schema::hasColumn('companies', 'status')) {
                $table->string('status')->default('trial')->after('logo_path');
            }

            if (! Schema::hasColumn('companies', 'trial_ends_at')) {
                $table->timestamp('trial_ends_at')->nullable()->after('status');
            }
        });

        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('email');
            }

            if (! Schema::hasColumn('users', 'type')) {
                $table->string('type')->default('manager')->after('password');
            }

            if (! Schema::hasColumn('users', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('type');
            }
        });

        if (! Schema::hasTable('roles')) {
            Schema::create('roles', function (Blueprint $table) {
                $table->id();
                $table->foreignId('company_id')->constrained()->cascadeOnDelete();
                $table->string('name');
                $table->timestamps();

                $table->unique(['company_id', 'name']);
            });
        }

        if (! Schema::hasTable('permissions')) {
            Schema::create('permissions', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('permission_role')) {
            Schema::create('permission_role', function (Blueprint $table) {
                $table->id();
                $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
                $table->foreignId('role_id')->constrained()->cascadeOnDelete();

                $table->unique(['permission_id', 'role_id']);
            });
        }

        if (! Schema::hasTable('role_user')) {
            Schema::create('role_user', function (Blueprint $table) {
                $table->id();
                $table->foreignId('company_id')->constrained()->cascadeOnDelete();
                $table->foreignId('role_id')->constrained()->cascadeOnDelete();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();

                $table->unique(['company_id', 'role_id', 'user_id']);
            });
        }

        if (! Schema::hasTable('branches')) {
            Schema::create('branches', function (Blueprint $table) {
                $table->id();
                $table->foreignId('company_id')->constrained()->cascadeOnDelete();
                $table->string('name');
                $table->string('address')->nullable();
                $table->string('city')->nullable();
                $table->string('country')->nullable();
                $table->timestamps();

                $table->index(['company_id', 'name']);
            });
        }

        Schema::table('shipments', function (Blueprint $table) {
            if (! Schema::hasColumn('shipments', 'branch_id')) {
                $table->foreignId('branch_id')->nullable()->after('company_id')->constrained('branches')->nullOnDelete();
            }

            if (! Schema::hasColumn('shipments', 'tracking_number')) {
                $table->string('tracking_number')->nullable()->after('branch_id');
            }

            if (! Schema::hasColumn('shipments', 'recipient_address')) {
                $table->text('recipient_address')->nullable()->after('recipient_phone');
            }
        });

        Schema::table('shipments', function (Blueprint $table) {
            $table->unique(['company_id', 'tracking_number']);
        });
    }

    public function down(): void
    {
        Schema::table('shipments', function (Blueprint $table) {
            $table->dropUnique('shipments_company_id_tracking_number_unique');

            if (Schema::hasColumn('shipments', 'branch_id')) {
                $table->dropConstrainedForeignId('branch_id');
            }

            if (Schema::hasColumn('shipments', 'tracking_number')) {
                $table->dropColumn('tracking_number');
            }

            if (Schema::hasColumn('shipments', 'recipient_address')) {
                $table->dropColumn('recipient_address');
            }
        });

        Schema::dropIfExists('branches');
        Schema::dropIfExists('role_user');
        Schema::dropIfExists('permission_role');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'is_active')) {
                $table->dropColumn('is_active');
            }

            if (Schema::hasColumn('users', 'type')) {
                $table->dropColumn('type');
            }

            if (Schema::hasColumn('users', 'phone')) {
                $table->dropColumn('phone');
            }
        });

        Schema::table('companies', function (Blueprint $table) {
            if (Schema::hasColumn('companies', 'plan_id')) {
                $table->dropConstrainedForeignId('plan_id');
            }

            if (Schema::hasColumn('companies', 'trial_ends_at')) {
                $table->dropColumn('trial_ends_at');
            }

            if (Schema::hasColumn('companies', 'status')) {
                $table->dropColumn('status');
            }

            if (Schema::hasColumn('companies', 'logo_path')) {
                $table->dropColumn('logo_path');
            }

            if (Schema::hasColumn('companies', 'phone')) {
                $table->dropColumn('phone');
            }

            if (Schema::hasColumn('companies', 'email')) {
                $table->dropColumn('email');
            }
        });
    }
};
