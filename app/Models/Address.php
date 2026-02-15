<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Address extends Model
{
    use BelongsToCompany, HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'company_id',
        'label',
        'contact_name',
        'contact_phone',
        'line1',
        'line2',
        'city',
        'state',
        'postal_code',
        'country_code',
        'latitude',
        'longitude',
    ];

    /**
     * @return HasMany<Shipment, $this>
     */
    public function senderShipments(): HasMany
    {
        return $this->hasMany(Shipment::class, 'sender_address_id');
    }

    /**
     * @return HasMany<Shipment, $this>
     */
    public function recipientShipments(): HasMany
    {
        return $this->hasMany(Shipment::class, 'recipient_address_id');
    }
}
