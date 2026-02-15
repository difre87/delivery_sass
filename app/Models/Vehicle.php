<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    use BelongsToCompany, HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'company_id',
        'branch_id',
        'type',
        'plate_number',
        'make',
        'model',
        'year',
        'fuel_type',
        'capacity_kg',
        'capacity_m3',
        'odometer_km',
        'current_odometer',
        'status',
    ];

    /**
     * @return BelongsTo<Branch, $this>
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * @return HasMany<DeliveryRoute, $this>
     */
    public function deliveryRoutes(): HasMany
    {
        return $this->hasMany(DeliveryRoute::class);
    }

    /**
     * @return HasMany<FuelLog, $this>
     */
    public function fuelLogs(): HasMany
    {
        return $this->hasMany(FuelLog::class);
    }

    /**
     * @return HasMany<OdometerLog, $this>
     */
    public function odometerLogs(): HasMany
    {
        return $this->hasMany(OdometerLog::class);
    }

    /**
     * @return HasMany<VehicleAssignment, $this>
     */
    public function assignments(): HasMany
    {
        return $this->hasMany(VehicleAssignment::class);
    }
}
