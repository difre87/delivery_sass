<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SwitchBranchController extends Controller
{
    public function __invoke(Request $request, string $company, string $branchId): RedirectResponse
    {
        $user = $request->user();
        
        // Charger l'agence avec vérification de company
        $branch = Branch::where('id', $branchId)
            ->where('company_id', $user->current_company_id)
            ->firstOrFail();
        
        // Vérifier que l'utilisateur a accès à cette agence
        $hasAccess = $user->branches()->where('branches.id', $branch->id)->exists();
        
        if (!$hasAccess) {
            return redirect()->back()->withErrors([
                'branch' => 'Vous n\'avez pas accès à cette agence.'
            ]);
        }
        
        // Changer l'agence active
        $user->update(['current_branch_id' => $branch->id]);
        
        return redirect()->back()->with('status', "Agence changée vers {$branch->name}");
    }
}
