import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Icons } from './Icons';

export default function BranchSwitcher() {
    const { auth } = usePage<any>().props;
    const { currentBranch, userBranches, currentCompany } = auth;
    const [isOpen, setIsOpen] = useState(false);

    // Ne rien afficher si l'utilisateur n'a aucune agence
    if (!userBranches || userBranches.length === 0) {
        return null;
    }

    const switchBranch = (branchId) => {
        router.post(route('branch.switch', { company: currentCompany.slug, branchId: branchId }), {}, {
            preserveScroll: true,
            onSuccess: () => setIsOpen(false),
        });
    };

    const hasMultipleBranches = userBranches.length > 1;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 transition-colors"
            >
                <Icons.Building className="h-4 w-4 text-slate-500" />
                <span>{currentBranch?.name || 'Sélectionner une agence'}</span>
                <Icons.ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 z-20 mt-2 w-64 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        {hasMultipleBranches && (
                            <div className="p-2">
                                <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">
                                    Changer d'agence
                                </div>
                                {userBranches.map((branch) => (
                                    <button
                                        key={branch.id}
                                        onClick={() => switchBranch(branch.id)}
                                        className={`
                                            w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-left
                                            ${currentBranch?.id === branch.id
                                                ? 'bg-emerald-50 text-emerald-700 font-medium'
                                                : 'text-slate-700 hover:bg-slate-50'
                                            }
                                        `}
                                    >
                                        <Icons.Building className={`h-4 w-4 flex-shrink-0 ${currentBranch?.id === branch.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                                        <span className="flex-1">{branch.name}</span>
                                        {currentBranch?.id === branch.id && (
                                            <Icons.Check className="h-4 w-4 text-emerald-600" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className={`${hasMultipleBranches ? 'border-t border-slate-100' : ''} p-2`}>
                            <div className="px-3 py-2">
                                <div className="text-xs font-semibold text-slate-500 mb-2">
                                    Agence actuelle
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                    <Icons.Building className="h-4 w-4 text-emerald-600" />
                                    <span className="font-medium">{currentBranch?.name || 'Aucune agence'}</span>
                                </div>
                            </div>
                            <a
                                href={route('settings.branches')}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
                            >
                                <Icons.Settings className="h-4 w-4" />
                                Gérer les agences
                            </a>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
