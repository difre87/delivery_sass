<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class DispatchRun extends Model
{
    use BelongsToCompany, HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'company_id',
        'branch_id',
        'driver_id',
        'vehicle_id',
        'date',
        'status',
        'start_time',
        'end_time',
        'recurring_dispatch_run_id',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    /**
     * @return BelongsTo<Branch, $this>
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    /**
     * @return BelongsTo<Vehicle, $this>
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * @return BelongsToMany<Shipment, $this>
     */
    public function shipments(): BelongsToMany
    {
        return $this->belongsToMany(Shipment::class, 'dispatch_run_shipments');
    }

    /**
     * @return BelongsTo<RecurringDispatchRun, $this>
     */
    public function recurringDispatchRun(): BelongsTo
    {
        return $this->belongsTo(RecurringDispatchRun::class);
    }
}
