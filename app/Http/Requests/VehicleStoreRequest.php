<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VehicleStoreRequest extends FormRequest
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
            'type' => ['required', Rule::in(['motorcycle', 'car', 'van', 'truck'])],
            'plate_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('vehicles', 'plate_number')
                    ->where(fn ($query) => $query->where('company_id', $this->user()->current_company_id)),
            ],
            'make' => ['nullable', 'string', 'max:255'],
            'model' => ['nullable', 'string', 'max:255'],
            'year' => ['nullable', 'integer', 'min:1950', 'max:2100'],
            'fuel_type' => ['nullable', 'string', 'max:50'],
            'status' => ['required', Rule::in(['active', 'maintenance', 'inactive'])],
            'odometer_km' => ['nullable', 'integer', 'min:0'],
            'current_odometer' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
