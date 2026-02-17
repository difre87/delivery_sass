<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DispatchRunStoreRequest extends FormRequest
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
            'driver_id' => [
                'required',
                'integer',
                Rule::exists('drivers', 'id')
                    ->where(fn ($query) => $query
                        ->where('company_id', $this->user()->current_company_id)
                        ->where('is_active', true)
                    ),
            ],
            'vehicle_id' => [
                'nullable',
                'integer',
                Rule::exists('vehicles', 'id')
                    ->where(fn ($query) => $query->where('company_id', $this->user()->current_company_id)),
            ],
            'shipment_ids' => ['nullable', 'array'],
            'shipment_ids.*' => [
                'integer',
                Rule::exists('shipments', 'id')
                    ->where(fn ($query) => $query->where('company_id', $this->user()->current_company_id)),
            ],
            'date' => ['required', 'date'],
            'status' => ['required', Rule::in(['planned', 'in_progress', 'completed'])],
        ];
    }
}
