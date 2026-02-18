<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\AutoAssignsBranch;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Client;
use App\Models\Shipment;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    use AutoAssignsBranch, LogsActivity;

    public function index(Request $request): Response
    {
        $company = $request->user()->currentCompany;
        $currentBranchId = $request->user()->current_branch_id;

        $invoices = Invoice::where('company_id', $company->id)
            ->where('branch_id', $currentBranchId)
            ->with(['client', 'items'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('invoice_number', 'like', "%{$search}%")
                        ->orWhereHas('client', function ($clientQuery) use ($search) {
                            $clientQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest('invoice_date')
            ->paginate(15);

        $stats = [
            'total' => Invoice::where('company_id', $company->id)->where('branch_id', $currentBranchId)->sum('total'),
            'paid' => Invoice::where('company_id', $company->id)->where('branch_id', $currentBranchId)->where('status', 'paid')->sum('total'),
            'pending' => Invoice::where('company_id', $company->id)->where('branch_id', $currentBranchId)->whereIn('status', ['draft', 'sent'])->sum('total'),
            'overdue' => Invoice::where('company_id', $company->id)->where('branch_id', $currentBranchId)->where('status', 'overdue')->sum('total'),
        ];

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(Request $request): Response
    {
        $company = $request->user()->currentCompany;

        $clients = Client::where('company_id', $company->id)
            ->select('id', 'name', 'email')
            ->get();

        $shipments = Shipment::where('company_id', $company->id)
            ->where('status', 'delivered')
            ->whereDoesntHave('invoiceItems')
            ->with(['client', 'senderAddress', 'recipientAddress'])
            ->latest()
            ->get();

        return Inertia::render('Invoices/Create', [
            'clients' => $clients,
            'shipments' => $shipments,
            'invoice_number' => Invoice::generateInvoiceNumber($company),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $company = $request->user()->currentCompany;

        $validated = $request->validate([
            'client_id' => ['required', 'exists:clients,id'],
            'invoice_date' => ['required', 'date'],
            'due_date' => ['required', 'date', 'after_or_equal:invoice_date'],
            'tax_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.description' => ['required', 'string'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.shipment_id' => ['nullable', 'exists:shipments,id'],
        ]);

        $invoice = Invoice::create([
            ...$this->withCompanyAndBranch([
                'client_id' => $validated['client_id'],
                'invoice_number' => Invoice::generateInvoiceNumber($company),
                'invoice_date' => $validated['invoice_date'],
                'due_date' => $validated['due_date'],
                'tax_rate' => $validated['tax_rate'],
                'notes' => $validated['notes'] ?? null,
                'status' => 'draft',
            ], $request),
        ]);

        foreach ($validated['items'] as $item) {
            InvoiceItem::create([
                'invoice_id' => $invoice->id,
                'shipment_id' => $item['shipment_id'] ?? null,
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
            ]);
        }

        static::logCreated('invoices', $invoice, "Création de la facture {$invoice->invoice_number} pour le client {$invoice->client->name}");

        return redirect()->route('invoices.index')
            ->with('success', 'Facture créée avec succès.');
    }

    public function show(Request $request, $invoiceId): Response
    {
        $company = $request->user()->currentCompany;
        
        $invoice = Invoice::where('company_id', $company->id)
            ->where('id', $invoiceId)
            ->with(['client', 'items.shipment', 'company'])
            ->firstOrFail();

        return Inertia::render('Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    public function update(Request $request, $invoiceId): RedirectResponse
    {
        $company = $request->user()->currentCompany;
        
        $invoice = Invoice::where('company_id', $company->id)
            ->where('id', $invoiceId)
            ->firstOrFail();
        
        $validated = $request->validate([
            'status' => ['required', 'in:draft,sent,paid,overdue,cancelled'],
            'notes' => ['nullable', 'string'],
        ]);

        $oldValues = $invoice->only(['status', 'notes', 'paid_at']);

        $invoice->update($validated);

        if ($validated['status'] === 'paid' && !$invoice->paid_at) {
            $invoice->markAsPaid();
        }

        $newValues = $invoice->only(['status', 'notes', 'paid_at']);

        static::logUpdated('invoices', $invoice, $oldValues, $newValues, "Modification de la facture {$invoice->invoice_number}");

        return back()->with('success', 'Facture mise à jour avec succès.');
    }

    public function destroy(Request $request, $invoiceId): RedirectResponse
    {
        $company = $request->user()->currentCompany;
        
        $invoice = Invoice::where('company_id', $company->id)
            ->where('id', $invoiceId)
            ->firstOrFail();
        
        $invoiceNumber = $invoice->invoice_number;
        $invoice->delete();

        static::logDeleted('invoices', $invoice, "Suppression de la facture {$invoiceNumber}");

        return redirect()->route('invoices.index', ['company' => $company->slug])
            ->with('success', 'Facture supprimée avec succès.');
    }

    public function generatePdf(Request $request, $invoiceId)
    {
        $company = $request->user()->currentCompany;
        
        $invoice = Invoice::where('company_id', $company->id)
            ->where('id', $invoiceId)
            ->with(['client', 'items.shipment', 'company'])
            ->firstOrFail();

        $pdf = Pdf::loadView('invoices.pdf', ['invoice' => $invoice]);

        return $pdf->download($invoice->invoice_number . '.pdf');
    }

    public function markAsPaid(Request $request, $invoiceId): RedirectResponse
    {
        $company = $request->user()->currentCompany;
        
        $invoice = Invoice::where('company_id', $company->id)
            ->where('id', $invoiceId)
            ->firstOrFail();
        
        $invoice->markAsPaid();

        return back()->with('success', 'Facture marquée comme payée.');
    }

    public function send(Request $request, $invoiceId): RedirectResponse
    {
        $company = $request->user()->currentCompany;
        
        $invoice = Invoice::where('company_id', $company->id)
            ->where('id', $invoiceId)
            ->firstOrFail();
        
        $invoice->update(['status' => 'sent']);

        // TODO: Envoyer l'email avec la facture au client

        return back()->with('success', 'Facture envoyée au client.');
    }
}
