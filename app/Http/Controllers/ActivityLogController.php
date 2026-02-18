<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $company = $request->user()->currentCompany;

        $query = ActivityLog::query()
            ->with(['user:id,name,email', 'branch:id,name'])
            ->forCompany($company->id);

        // Filtres
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('module')) {
            $query->where('module', $request->module);
        }

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->betweenDates($request->start_date, $request->end_date);
        }

        if ($request->filled('search')) {
            $query->where('description', 'like', '%' . $request->search . '%');
        }

        $logs = $query
            ->latest()
            ->paginate(50)
            ->withQueryString();

        // Statistiques
        $stats = [
            'total' => ActivityLog::forCompany($company->id)->count(),
            'today' => ActivityLog::forCompany($company->id)
                ->whereDate('created_at', today())
                ->count(),
            'this_week' => ActivityLog::forCompany($company->id)
                ->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
                ->count(),
        ];

        // Modules disponibles
        $modules = ActivityLog::forCompany($company->id)
            ->distinct()
            ->pluck('module')
            ->sort()
            ->values();

        // Actions disponibles
        $actions = ActivityLog::forCompany($company->id)
            ->distinct()
            ->pluck('action')
            ->sort()
            ->values();

        // Utilisateurs actifs
        $users = $company->users()
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('ActivityLogs/Index', [
            'logs' => $logs,
            'stats' => $stats,
            'modules' => $modules,
            'actions' => $actions,
            'users' => $users,
            'filters' => $request->only(['user_id', 'module', 'action', 'start_date', 'end_date', 'search']),
        ]);
    }
}
