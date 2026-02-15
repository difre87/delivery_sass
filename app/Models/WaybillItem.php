<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WaybillItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'waybill_id',
        'shipment_id',
        'sequence_number',
        'status',
        'picked_up_at',
        'delivered_at',
        'delivery_notes',
        'signature_url',
    ];

    protected $casts = [
        'picked_up_at' => 'datetime',
        'delivered_at' => 'datetime',
        'sequence_number' => 'integer',
    ];

    public function waybill(): BelongsTo
    {
        return $this->belongsTo(Waybill::class);
    }

    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class);
    }

    public function markAsPickedUp(): void
    {
        $this->update([
            'status' => 'picked_up',
            'picked_up_at' => now(),
        ]);
        
        $this->shipment->update(['status' => 'in_transit']);
    }

    public function markAsDelivered(string $notes = null, string $signatureUrl = null): void
    {
        $this->update([
            'status' => 'delivered',
            'delivered_at' => now(),
            'delivery_notes' => $notes,
            'signature_url' => $signatureUrl,
        ]);
        
        $this->shipment->update([
            'status' => 'delivered',
            'delivered_at' => now(),
        ]);
        
        $this->waybill->incrementCompletedShipments();
    }

    public function markAsFailed(string $notes = null): void
    {
        $this->update([
            'status' => 'failed',
            'delivery_notes' => $notes,
        ]);
        
        $this->shipment->update(['status' => 'failed']);
    }
}
