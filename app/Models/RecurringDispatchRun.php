<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class RecurringDispatchRun extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'company_id',
        'branch_id',
        'driver_id',
        'vehicle_id',
        'name',
        'description',
        'frequency',
        'weekdays',
        'monthdays',
        'start_date',
        'end_date',
        'default_start_time',
        'default_end_time',
        'default_status',
        'is_active',
        'last_generated_at',
    ];

    protected $casts = [
        'weekdays' => 'array',
        'monthdays' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
        'last_generated_at' => 'date',
    ];

    // Relations
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function shipments(): BelongsToMany
    {
        return $this->belongsToMany(Shipment::class, 'recurring_dispatch_run_shipment');
    }

    public function generatedRuns(): HasMany
    {
        return $this->hasMany(DispatchRun::class, 'recurring_dispatch_run_id');
    }

    // Scopes
    public function scopeForCompany($query, $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeDueForGeneration($query, $date)
    {
        return $query->active()
            ->where('start_date', '<=', $date)
            ->where(function ($q) use ($date) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', $date);
            })
            ->where(function ($q) use ($date) {
                $q->whereNull('last_generated_at')
                    ->orWhere('last_generated_at', '<', $date);
            });
    }

    // Méthodes utilitaires
    public function shouldGenerateForDate($date): bool
    {
        $date = \Carbon\Carbon::parse($date);

        // Vérifier si actif
        if (!$this->is_active) {
            return false;
        }

        // Vérifier la période de validité
        if ($date->lt($this->start_date)) {
            return false;
        }

        if ($this->end_date && $date->gt($this->end_date)) {
            return false;
        }

        // Vérifier si déjà généré aujourd'hui
        if ($this->last_generated_at && $this->last_generated_at->isSameDay($date)) {
            return false;
        }

        // Vérifier selon la fréquence
        switch ($this->frequency) {
            case 'daily':
                return true;

            case 'weekly':
                if (!$this->weekdays) {
                    return false;
                }
                // 1 = Lundi, 7 = Dimanche
                $dayOfWeek = $date->dayOfWeekIso;
                return in_array($dayOfWeek, $this->weekdays);

            case 'monthly':
                if (!$this->monthdays) {
                    return false;
                }
                $dayOfMonth = $date->day;
                return in_array($dayOfMonth, $this->monthdays);

            default:
                return false;
        }
    }

    public function generateDispatchRun($date = null): ?DispatchRun
    {
        $date = $date ? \Carbon\Carbon::parse($date) : now();

        if (!$this->shouldGenerateForDate($date)) {
            return null;
        }

        $dispatchRun = DispatchRun::create([
            'company_id' => $this->company_id,
            'branch_id' => $this->branch_id,
            'driver_id' => $this->driver_id,
            'vehicle_id' => $this->vehicle_id,
            'date' => $date->toDateString(),
            'start_time' => $this->default_start_time,
            'end_time' => $this->default_end_time,
            'status' => $this->default_status,
            'recurring_dispatch_run_id' => $this->id,
        ]);

        // Associer les envois par défaut
        if ($this->shipments()->count() > 0) {
            $dispatchRun->shipments()->sync($this->shipments->pluck('id'));
        }

        // Mettre à jour la date de dernière génération
        $this->update(['last_generated_at' => $date]);

        return $dispatchRun;
    }
}
