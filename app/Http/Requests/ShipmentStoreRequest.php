<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ShipmentStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'branch_id' => [
                'nullable',
                'integer',
                Rule::exists('branches', 'id')
                    ->where(fn ($query) => $query->where('company_id', $this->user()->current_company_id)),
            ],
            'tracking_number' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('shipments', 'tracking_number')
                    ->where(fn ($query) => $query->where('company_id', $this->user()->current_company_id)),
            ],
            'client_id' => [
                'required',
                'integer',
                Rule::exists('clients', 'id')
                    ->where(fn ($query) => $query->where('company_id', $this->user()->current_company_id)),
            ],
            'recipient_name' => ['required', 'string', 'max:255'],
            'recipient_phone' => ['nullable', 'string', 'max:50'],
            'recipient_address' => ['nullable', 'string', 'max:4000'],
            'reference' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['draft', 'scheduled', 'assigned', 'in_transit', 'delivered', 'canceled'])],
            'scheduled_for' => ['nullable', 'date'],
            'distance_km' => ['nullable', 'numeric', 'min:0'],
            'cost_cents' => ['nullable', 'integer', 'min:0'],
            'price_cents' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string', 'max:4000'],
        ];
    }
}
