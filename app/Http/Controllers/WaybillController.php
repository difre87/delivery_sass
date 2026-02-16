<?php

namespace App\Http\Controllers;

use App\Models\Waybill;
use App\Models\WaybillItem;
use App\Models\DispatchRun;
use App\Models\Driver;
use App\Models\Vehicle;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Barryvdh\DomPDF\Facade\Pdf;

class WaybillController extends Controller
{
    public function index(Request $request): Response
    {
        $company = $request->user()->currentCompany;

        $waybills = Waybill::where('company_id', $company->id)
            ->with(['driver', 'vehicle', 'dispatchRun', 'items'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('number', 'like', "%{$search}%")
                        ->orWhereHas('driver', function ($driverQuery) use ($search) {
                            $driverQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest('date')
            ->paginate(15);

        $stats = [
            'total' => Waybill::where('company_id', $company->id)->count(),
            'in_progress' => Waybill::where('company_id', $company->id)->where('status', 'in_progress')->count(),
            'completed' => Waybill::where('company_id', $company->id)->where('status', 'completed')->count(),
            'total_shipments' => Waybill::where('company_id', $company->id)->sum('total_shipments'),
        ];

        return Inertia::render('Waybills/Index', [
            'waybills' => $waybills,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(Request $request): Response
    {
        $company = $request->user()->currentCompany;

        $dispatchRuns = DispatchRun::where('company_id', $company->id)
            ->with(['driver', 'vehicle', 'stops.shipment'])
            ->whereIn('status', ['scheduled', 'in_progress'])
            ->latest()
            ->get();

        $drivers = Driver::where('company_id', $company->id)
            ->where('is_active', true)
            ->select('id', 'name')
            ->get();

        $vehicles = Vehicle::where('company_id', $company->id)
            ->where('status', 'active')
            ->select('id', 'plate_number', 'make', 'model')
            ->get();

        $shipments = Shipment::where('company_id', $company->id)
            ->whereIn('status', ['pending', 'ready'])
            ->with(['client', 'senderAddress', 'recipientAddress'])
            ->latest()
            ->get();

        return Inertia::render('Waybills/Create', [
            'dispatch_runs' => $dispatchRuns,
            'drivers' => $drivers,
            'vehicles' => $vehicles,
            'shipments' => $shipments,
            'waybill_number' => Waybill::generateWaybillNumber($company),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $company = $request->user()->currentCompany;

        $validated = $request->validate([
            'dispatch_run_id' => ['nullable', 'exists:dispatch_runs,id'],
            'driver_id' => ['required', 'exists:drivers,id'],
            'vehicle_id' => ['required', 'exists:vehicles,id'],
            'date' => ['required', 'date'],
            'departure_time' => ['nullable', 'date_format:H:i'],
            'notes' => ['nullable', 'string'],
            'shipments' => ['required', 'array', 'min:1'],
            'shipments.*.id' => ['required', 'exists:shipments,id'],
            'shipments.*.sequence_number' => ['required', 'integer', 'min:0'],
        ]);

        $waybill = Waybill::create([
            'company_id' => $company->id,
            'dispatch_run_id' => $validated['dispatch_run_id'] ?? null,
            'driver_id' => $validated['driver_id'],
            'vehicle_id' => $validated['vehicle_id'],
            'number' => Waybill::generateWaybillNumber($company),
            'date' => $validated['date'],
            'departure_time' => $validated['departure_time'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => 'draft',
            'qr_token' => \Str::random(32),
        ]);

        foreach ($validated['shipments'] as $shipmentData) {
            WaybillItem::create([
                'waybill_id' => $waybill->id,
                'shipment_id' => $shipmentData['id'],
                'sequence_number' => $shipmentData['sequence_number'],
                'status' => 'pending',
            ]);
        }

        $waybill->updateTotalShipments();

        $company = $request->user()->currentCompany;
        return redirect()->route('waybills.show', ['company' => $company->slug, 'waybillId' => $waybill->id])
            ->with('success', 'Bordereau créé avec succès.');
    }

    public function show(Request $request, string $waybillId): Response
    {
        $company = $request->user()->currentCompany;
        
        $waybill = Waybill::where('company_id', $company->id)
            ->where('id', $waybillId)
            ->with([
                'driver',
                'vehicle',
                'dispatchRun',
                'items.shipment.senderAddress',
                'items.shipment.recipientAddress',
                'items.shipment.client',
                'company'
            ])
            ->firstOrFail();

        return Inertia::render('Waybills/Show', [
            'waybill' => $waybill,
        ]);
    }

    public function update(Request $request, string $waybillId): RedirectResponse
    {
        $company = $request->user()->currentCompany;
        
        $waybill = Waybill::where('company_id', $company->id)
            ->where('id', $waybillId)
            ->firstOrFail();
        
        $validated = $request->validate([
            'status' => ['required', 'in:draft,issued,in_progress,completed,cancelled'],
            'notes' => ['nullable', 'string'],
            'return_time' => ['nullable', 'date_format:H:i'],
        ]);

        $waybill->update($validated);

        if ($validated['status'] === 'issued' && $waybill->status !== 'issued') {
            $waybill->markAsIssued();
        }

        return back()->with('success', 'Bordereau mis à jour avec succès.');
    }

    public function destroy(Request $request, string $waybillId): RedirectResponse
    {
        $company = $request->user()->currentCompany;
        
        $waybill = Waybill::where('company_id', $company->id)
            ->where('id', $waybillId)
            ->firstOrFail();
        
        $waybill->delete();

        return redirect()->route('waybills.index', ['company' => $company->slug])
            ->with('success', 'Bordereau supprimé avec succès.');
    }

    public function generatePdf(Request $request, string $waybillId)
    {
        $company = $request->user()->currentCompany;
        
        $waybill = Waybill::where('company_id', $company->id)
            ->where('id', $waybillId)
            ->with([
                'driver',
                'vehicle',
                'dispatchRun',
                'items.shipment.senderAddress',
                'items.shipment.recipientAddress',
                'items.shipment.client',
                'company'
            ])
            ->firstOrFail();

        $pdf = Pdf::loadView('waybills.pdf', ['waybill' => $waybill]);

        return $pdf->download($waybill->number . '.pdf');
    }

    public function markAsIssued(Request $request, string $waybillId): RedirectResponse
    {
        $company = $request->user()->currentCompany;
        
        $waybill = Waybill::where('company_id', $company->id)
            ->where('id', $waybillId)
            ->firstOrFail();
        
        $waybill->markAsIssued();

        return back()->with('success', 'Bordereau émis avec succès.');
    }

    public function markAsInProgress(Request $request, string $waybillId): RedirectResponse
    {
        $company = $request->user()->currentCompany;
        
        $waybill = Waybill::where('company_id', $company->id)
            ->where('id', $waybillId)
            ->firstOrFail();
        
        $waybill->markAsInProgress();

        return back()->with('success', 'Bordereau en cours.');
    }

    public function markAsCompleted(Request $request, string $waybillId): RedirectResponse
    {
        $company = $request->user()->currentCompany;
        
        $waybill = Waybill::where('company_id', $company->id)
            ->where('id', $waybillId)
            ->firstOrFail();
        
        $waybill->markAsCompleted();

        return back()->with('success', 'Bordereau terminé.');
    }

    public function updateItem(Request $request, string $waybillId, WaybillItem $item): RedirectResponse
    {
        $company = $request->user()->currentCompany;
        
        $waybill = Waybill::where('company_id', $company->id)
            ->where('id', $waybillId)
            ->firstOrFail();
        
        // Verify item belongs to waybill
        if ($item->waybill_id !== $waybill->id) {
            abort(404);
        }
        $validated = $request->validate([
            'status' => ['required', 'in:pending,picked_up,delivered,failed'],
            'delivery_notes' => ['nullable', 'string'],
            'signature_url' => ['nullable', 'string'],
        ]);

        if ($validated['status'] === 'picked_up') {
            $item->markAsPickedUp();
        } elseif ($validated['status'] === 'delivered') {
            $item->markAsDelivered(
                $validated['delivery_notes'] ?? null,
                $validated['signature_url'] ?? null
            );
        } elseif ($validated['status'] === 'failed') {
            $item->markAsFailed($validated['delivery_notes'] ?? null);
        } else {
            $item->update($validated);
        }

        return back()->with('success', 'Statut de l\'expédition mis à jour.');
    }
}
