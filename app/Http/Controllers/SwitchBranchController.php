<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SwitchBranchController extends Controller
{
    public function __invoke(Request $request, Branch $branch): RedirectResponse
    {
        $user = $request->user();
        
        // Vérifier que l'agence appartient à la company actuelle
        abort_if(
            $branch->company_id !== $user->current_company_id,
            404
        );
        
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
