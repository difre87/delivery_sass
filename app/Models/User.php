<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'type',
        'is_active',
        'is_super_admin',
        'current_company_id',
        'current_branch_id',
        'allowed_modules',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'is_super_admin' => 'boolean',
            'allowed_modules' => 'array',
        ];
    }

    /**
     * Liste complète des modules disponibles
     */
    public const AVAILABLE_MODULES = [
        'dashboard' => 'Tableau de bord',
        'shipments' => 'Expéditions',
        'packages' => 'Colis',
        'clients' => 'Clients',
        'drivers' => 'Chauffeurs',
        'vehicles' => 'Véhicules',
        'dispatch' => 'Course & Feuilles de route',
        'waybills' => 'Lettres de voiture',
        'invoices' => 'Factures',
        'fuel' => 'Carburant',
        'tracking' => 'Suivi GPS',
        'reports' => 'Rapports',
        'settings' => 'Paramètres',
    ];

    /**
     * Vérifie si l'utilisateur a accès à un module
     */
    public function hasAccessToModule(string $module): bool
    {
        // Super admin a accès à tout
        if ($this->is_super_admin) {
            return true;
        }

        // Owner a accès à tout
        if ($this->isOwner()) {
            return true;
        }

        // Si aucun module n'est défini, accès à tout par défaut
        if (empty($this->allowed_modules)) {
            return true;
        }

        return in_array($module, $this->allowed_modules);
    }

    /**
     * Vérifie si l'utilisateur est propriétaire de la compagnie actuelle
     */
    public function isOwner(): bool
    {
        if (!$this->current_company_id) {
            return false;
        }

        return $this->companies()
            ->where('companies.id', $this->current_company_id)
            ->wherePivot('role', 'owner')
            ->exists();
    }

    /**
     * @return BelongsToMany<Company, $this>
     */
    public function companies(): BelongsToMany
    {
        return $this->belongsToMany(Company::class)
            ->withPivot('role')
            ->withTimestamps();
    }

    /**
     * @return BelongsTo<Company, $this>
     */
    public function currentCompany(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'current_company_id');
    }

    /**
     * @return BelongsToMany<Branch, $this>
     */
    public function branches(): BelongsToMany
    {
        return $this->belongsToMany(Branch::class)
            ->withPivot('is_default')
            ->withTimestamps();
    }

    /**
     * @return BelongsTo<Branch, $this>
     */
    public function currentBranch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'current_branch_id');
    }

    /**
     * @return HasMany<VehicleAssignment, $this>
     */
    public function vehicleAssignments(): HasMany
    {
        return $this->hasMany(VehicleAssignment::class, 'driver_id');
    }
}
