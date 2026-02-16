<?php

namespace App\Observers;

use App\Models\Client;

class ClientObserver
{
    /**
     * Handle the Client "creating" event.
     */
    public function creating(Client $client): void
    {
        // Générer automatiquement le code client s'il n'est pas fourni
        if (empty($client->code)) {
            $client->code = $this->generateClientCode($client);
        }
    }

    /**
     * Générer un code client unique
     */
    private function generateClientCode(Client $client): string
    {
        // Format: CL-YYYY-NNNN (ex: CL-2026-0001)
        $year = date('Y');
        $prefix = 'CL-' . $year . '-';
        
        // Trouver le dernier numéro pour cette année et cette société
        $lastClient = Client::where('company_id', $client->company_id)
            ->where('code', 'like', $prefix . '%')
            ->orderByDesc('code')
            ->first();
        
        if ($lastClient && preg_match('/-(\d{4})$/', $lastClient->code, $matches)) {
            $nextNumber = intval($matches[1]) + 1;
        } else {
            $nextNumber = 1;
        }
        
        return $prefix . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Handle the Client "created" event.
     */
    public function created(Client $client): void
    {
        //
    }

    /**
     * Handle the Client "updated" event.
     */
    public function updated(Client $client): void
    {
        //
    }

    /**
     * Handle the Client "deleted" event.
     */
    public function deleted(Client $client): void
    {
        //
    }

    /**
     * Handle the Client "restored" event.
     */
    public function restored(Client $client): void
    {
        //
    }

    /**
     * Handle the Client "force deleted" event.
     */
    public function forceDeleted(Client $client): void
    {
        //
    }
}
