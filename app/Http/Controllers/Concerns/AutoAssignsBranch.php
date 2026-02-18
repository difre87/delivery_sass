<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\Request;

trait AutoAssignsBranch
{
    /**
     * Assigne automatiquement le branch_id de l'utilisateur connecté aux données
     */
    protected function withBranchId(array $data, Request $request): array
    {
        $user = $request->user();
        
        return array_merge($data, [
            'branch_id' => $user->current_branch_id,
        ]);
    }

    /**
     * Assigne automatiquement le branch_id et company_id
     */
    protected function withCompanyAndBranch(array $data, Request $request): array
    {
        $user = $request->user();
        $company = $user->currentCompany;
        
        return array_merge($data, [
            'company_id' => $company->id,
            'branch_id' => $user->current_branch_id,
        ]);
    }
}
