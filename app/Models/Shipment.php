<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Shipment extends Model
{
    use BelongsToCompany, HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'company_id',
        'branch_id',
        'tracking_number',
        'client_id',
        'sender_address_id',
        'recipient_name',
        'recipient_phone',
        'recipient_address',
        'recipient_address_id',
        'reference',
        'status',
        'scheduled_for',
        'picked_up_at',
        'delivered_at',
        'distance_km',
        'weight',
        'amount',
        'cod_amount',
        'cost_cents',
        'price_cents',
        'proof_of_delivery_url',
        'notes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scheduled_for' => 'datetime',
            'picked_up_at' => 'datetime',
            'delivered_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Client, $this>
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * @return BelongsTo<Branch, $this>
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * @return BelongsTo<Address, $this>
     */
    public function senderAddress(): BelongsTo
    {
        return $this->belongsTo(Address::class, 'sender_address_id');
    }

    /**
     * @return BelongsTo<Address, $this>
     */
    public function recipientAddress(): BelongsTo
    {
        return $this->belongsTo(Address::class, 'recipient_address_id');
    }

    /**
     * @return HasOne<Waybill, $this>
     */
    public function waybill(): HasOne
    {
        return $this->hasOne(Waybill::class);
    }

    /**
     * @return HasMany<RouteStop, $this>
     */
    public function routeStops(): HasMany
    {
        return $this->hasMany(RouteStop::class);
    }

    /**
     * @return HasMany<InvoiceItem, $this>
     */
    public function invoiceItems(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }
}
