<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DriverUpdateRequest extends FormRequest
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
        $driver = $this->route('driver');

        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'identity_document_type' => ['nullable', 'string', 'in:passport,cni,carte_consulaire,extrait_naissance'],
            'identity_document_number' => ['nullable', 'string', 'max:100'],
            'license_type' => ['required', 'string', 'in:A,A1,B,C,D,E,ABCDE'],
            'license_number' => ['required', 'string', 'max:100'],
            'license_expires_at' => ['required', 'date', 'after:today'],
            'is_active' => ['required', 'boolean'],
            'vehicle_id' => [
                'required',
                'integer',
                Rule::exists('vehicles', 'id')
                    ->where(fn ($query) => $query->where('company_id', $this->user()->current_company_id)),
            ],
        ];
    }
}
