<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FuelLogStoreRequest extends FormRequest
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
            'vehicle_id' => [
                'required',
                'integer',
                Rule::exists('vehicles', 'id')
                    ->where(fn ($query) => $query->where('company_id', $this->user()->current_company_id)),
            ],
            'dispatch_run_id' => [
                'nullable',
                'integer',
                Rule::exists('dispatch_runs', 'id')
                    ->where(fn ($query) => $query->where('company_id', $this->user()->current_company_id)),
            ],
            'filled_at' => ['required', 'date'],
            'station_name' => ['nullable', 'string', 'max:255'],
            'volume_liters' => ['required', 'numeric', 'gt:0'],
            'total_cents' => ['required', 'integer', 'min:0'],
            'odometer_km' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string', 'max:4000'],
            'receipt_photo' => ['nullable', 'string', 'max:255'],
            'liters' => ['nullable', 'numeric', 'gt:0'],
            'amount' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
