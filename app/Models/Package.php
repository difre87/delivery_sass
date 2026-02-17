<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Package extends Model
{
    use BelongsToCompany, HasFactory;

    protected $fillable = [
        'company_id',
        'branch_id',
        'shipment_id',
        'tracking_number',
        'reference',
        'description',
        'type',
        'weight_kg',
        'length_cm',
        'width_cm',
        'height_cm',
        'volume_m3',
        'value_cents',
        'declared_value_cents',
        'requires_signature',
        'is_fragile',
        'is_hazardous',
        'status',
        'notes',
        'barcode',
    ];

    protected $casts = [
        'weight_kg' => 'decimal:2',
        'length_cm' => 'decimal:2',
        'width_cm' => 'decimal:2',
        'height_cm' => 'decimal:2',
        'volume_m3' => 'decimal:4',
        'value_cents' => 'integer',
        'declared_value_cents' => 'integer',
        'requires_signature' => 'boolean',
        'is_fragile' => 'boolean',
        'is_hazardous' => 'boolean',
    ];

    /**
     * Get the shipment that owns the package.
     */
    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class);
    }

    /**
     * Get the company that owns the package.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the branch that owns the package.
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * Get formatted value.
     */
    public function getFormattedValueAttribute(): string
    {
        if (!$this->value_cents) {
            return '0,00 €';
        }
        return number_format($this->value_cents / 100, 2, ',', ' ') . ' €';
    }

    /**
     * Get formatted weight.
     */
    public function getFormattedWeightAttribute(): string
    {
        return $this->weight_kg ? number_format($this->weight_kg, 2, ',', ' ') . ' kg' : '-';
    }

    /**
     * Get formatted dimensions.
     */
    public function getFormattedDimensionsAttribute(): string
    {
        if (!$this->length_cm || !$this->width_cm || !$this->height_cm) {
            return '-';
        }
        return sprintf('%s x %s x %s cm', $this->length_cm, $this->width_cm, $this->height_cm);
    }

    /**
     * Calculate volume from dimensions.
     */
    public function calculateVolume(): void
    {
        if ($this->length_cm && $this->width_cm && $this->height_cm) {
            $this->volume_m3 = ($this->length_cm * $this->width_cm * $this->height_cm) / 1000000;
        }
    }

    /**
     * Generate tracking number if not set.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($package) {
            if (!$package->tracking_number) {
                $package->tracking_number = 'PKG' . strtoupper(uniqid());
            }
        });

        static::saving(function ($package) {
            $package->calculateVolume();
        });
    }
}
