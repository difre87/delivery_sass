<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Waybill extends Model
{
    use BelongsToCompany, HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'company_id',
        'branch_id',
        'dispatch_run_id',
        'driver_id',
        'vehicle_id',
        'shipment_id',
        'number',
        'status',
        'date',
        'departure_time',
        'return_time',
        'qr_token',
        'issued_at',
        'pdf_url',
        'notes',
        'total_shipments',
        'completed_shipments',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'issued_at' => 'datetime',
            'date' => 'date',
            'total_shipments' => 'integer',
            'completed_shipments' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Shipment, $this>
     */
    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class);
    }

    /**
     * @return BelongsTo<DispatchRun, $this>
     */
    public function dispatchRun(): BelongsTo
    {
        return $this->belongsTo(DispatchRun::class);
    }

    /**
     * @return BelongsTo<Branch, $this>
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * @return BelongsTo<Driver, $this>
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }

    /**
     * @return BelongsTo<Vehicle, $this>
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * @return HasMany<WaybillItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(WaybillItem::class)->orderBy('sequence_number');
    }

    /**
     * @return HasMany<Shipment, $this>
     */
    public function shipments(): HasMany
    {
        return $this->hasManyThrough(
            Shipment::class,
            WaybillItem::class,
            'waybill_id',
            'id',
            'id',
            'shipment_id'
        );
    }

    public function incrementCompletedShipments(): void
    {
        $this->increment('completed_shipments');
        
        if ($this->completed_shipments >= $this->total_shipments) {
            $this->update(['status' => 'completed']);
        }
    }

    public function updateTotalShipments(): void
    {
        $this->update([
            'total_shipments' => $this->items()->count(),
        ]);
    }

    public function markAsIssued(): void
    {
        $this->update([
            'status' => 'issued',
            'issued_at' => now(),
        ]);
    }

    public function markAsInProgress(): void
    {
        $this->update(['status' => 'in_progress']);
    }

    public function markAsCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'return_time' => now()->format('H:i'),
        ]);
    }

    public static function generateWaybillNumber(Company $company): string
    {
        $year = now()->year;
        $lastWaybill = static::where('company_id', $company->id)
            ->whereYear('created_at', $year)
            ->latest()
            ->first();

        $number = $lastWaybill ? (int) substr($lastWaybill->number, -4) + 1 : 1;

        return sprintf('BR-%s-%04d', $year, $number);
    }

    public function getProgressPercentage(): int
    {
        if ($this->total_shipments === 0) {
            return 0;
        }

        return (int) (($this->completed_shipments / $this->total_shipments) * 100);
    }
}
