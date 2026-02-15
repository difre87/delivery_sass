<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture {{ $invoice->invoice_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #333;
            padding: 40px;
        }

        .header {
            display: table;
            width: 100%;
            margin-bottom: 40px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
        }

        .header-left {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }

        .header-right {
            display: table-cell;
            width: 50%;
            text-align: right;
            vertical-align: top;
        }

        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }

        .company-info {
            font-size: 11px;
            color: #666;
            line-height: 1.8;
        }

        .invoice-title {
            font-size: 32px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
        }

        .invoice-number {
            font-size: 14px;
            color: #666;
        }

        .invoice-meta {
            margin-top: 40px;
            margin-bottom: 40px;
        }

        .meta-grid {
            display: table;
            width: 100%;
        }

        .meta-col {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }

        .meta-section {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-right: 10px;
        }

        .meta-section-right {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-left: 10px;
        }

        .meta-title {
            font-size: 10px;
            text-transform: uppercase;
            font-weight: bold;
            color: #64748b;
            margin-bottom: 10px;
            letter-spacing: 0.5px;
        }

        .meta-content {
            font-size: 12px;
        }

        .client-name {
            font-weight: bold;
            font-size: 14px;
            color: #1e293b;
            margin-bottom: 5px;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        .items-table thead {
            background: #2563eb;
            color: white;
        }

        .items-table th {
            padding: 12px 10px;
            text-align: left;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .items-table th.text-right {
            text-align: right;
        }

        .items-table tbody tr {
            border-bottom: 1px solid #e2e8f0;
        }

        .items-table tbody tr:last-child {
            border-bottom: 2px solid #cbd5e1;
        }

        .items-table td {
            padding: 12px 10px;
            font-size: 12px;
        }

        .items-table td.text-right {
            text-align: right;
        }

        .item-description {
            font-weight: 500;
            color: #1e293b;
        }

        .item-ref {
            font-size: 10px;
            color: #64748b;
            margin-top: 2px;
        }

        .totals {
            float: right;
            width: 300px;
            margin-top: 20px;
        }

        .totals-row {
            display: table;
            width: 100%;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
        }

        .totals-row.total {
            border-bottom: none;
            border-top: 2px solid #1e40af;
            padding-top: 15px;
            margin-top: 10px;
        }

        .totals-label {
            display: table-cell;
            font-weight: 500;
            color: #475569;
        }

        .totals-amount {
            display: table-cell;
            text-align: right;
            font-weight: 600;
            color: #1e293b;
        }

        .total .totals-label {
            font-size: 16px;
            font-weight: bold;
            color: #1e293b;
        }

        .total .totals-amount {
            font-size: 18px;
            font-weight: bold;
            color: #2563eb;
        }

        .notes {
            clear: both;
            margin-top: 60px;
            padding: 20px;
            background: #f8fafc;
            border-left: 4px solid #2563eb;
            border-radius: 4px;
        }

        .notes-title {
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 10px;
            font-size: 13px;
        }

        .notes-content {
            font-size: 11px;
            color: #475569;
            line-height: 1.8;
            white-space: pre-wrap;
        }

        .footer {
            position: fixed;
            bottom: 30px;
            left: 40px;
            right: 40px;
            text-align: center;
            font-size: 10px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
        }

        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .status-paid {
            background: #dcfce7;
            color: #166534;
        }

        .status-sent {
            background: #dbeafe;
            color: #1e40af;
        }

        .status-draft {
            background: #f1f5f9;
            color: #475569;
        }

        .status-overdue {
            background: #fee2e2;
            color: #991b1b;
        }

        .status-cancelled {
            background: #fed7aa;
            color: #9a3412;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="header-left">
            <div class="company-name">{{ $invoice->company->name }}</div>
            <div class="company-info">
                @if($invoice->company->address)
                    {{ $invoice->company->address }}<br>
                @endif
                @if($invoice->company->postal_code || $invoice->company->city)
                    {{ $invoice->company->postal_code }} {{ $invoice->company->city }}<br>
                @endif
                @if($invoice->company->email)
                    Email: {{ $invoice->company->email }}<br>
                @endif
                @if($invoice->company->phone)
                    Tél: {{ $invoice->company->phone }}<br>
                @endif
                @if($invoice->company->tax_id)
                    TVA: {{ $invoice->company->tax_id }}<br>
                @endif
                @if($invoice->company->registration_number)
                    SIRET: {{ $invoice->company->registration_number }}
                @endif
            </div>
        </div>
        <div class="header-right">
            <div class="invoice-title">FACTURE</div>
            <div class="invoice-number">{{ $invoice->invoice_number }}</div>
            <div style="margin-top: 10px;">
                @php
                    $statusClass = 'status-' . $invoice->status;
                    $statusLabels = [
                        'draft' => 'BROUILLON',
                        'sent' => 'ENVOYÉE',
                        'paid' => 'PAYÉE',
                        'overdue' => 'EN RETARD',
                        'cancelled' => 'ANNULÉE',
                    ];
                @endphp
                <span class="status-badge {{ $statusClass }}">
                    {{ $statusLabels[$invoice->status] ?? strtoupper($invoice->status) }}
                </span>
            </div>
        </div>
    </div>

    <!-- Invoice Meta -->
    <div class="invoice-meta">
        <div class="meta-grid">
            <div class="meta-col">
                <div class="meta-section">
                    <div class="meta-title">Facturé à</div>
                    <div class="meta-content">
                        <div class="client-name">{{ $invoice->client->name }}</div>
                        @if($invoice->client->email)
                            {{ $invoice->client->email }}<br>
                        @endif
                        @if($invoice->client->phone)
                            {{ $invoice->client->phone }}
                        @endif
                    </div>
                </div>
            </div>
            <div class="meta-col">
                <div class="meta-section-right">
                    <div class="meta-title">Détails de la facture</div>
                    <div class="meta-content">
                        <strong>Date de facture :</strong> {{ $invoice->invoice_date->format('d/m/Y') }}<br>
                        <strong>Date d'échéance :</strong> {{ $invoice->due_date->format('d/m/Y') }}<br>
                        @if($invoice->paid_at)
                            <strong>Payée le :</strong> <span style="color: #16a34a;">{{ $invoice->paid_at->format('d/m/Y') }}</span>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Items Table -->
    <table class="items-table">
        <thead>
            <tr>
                <th>Description</th>
                <th class="text-right" style="width: 80px;">Quantité</th>
                <th class="text-right" style="width: 100px;">Prix unitaire</th>
                <th class="text-right" style="width: 100px;">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $item)
                <tr>
                    <td>
                        <div class="item-description">{{ $item->description }}</div>
                        @if($item->shipment)
                            <div class="item-ref">Réf: {{ $item->shipment->tracking_number }}</div>
                        @endif
                    </td>
                    <td class="text-right">{{ $item->quantity }}</td>
                    <td class="text-right">{{ number_format($item->unit_price, 2, ',', ' ') }} €</td>
                    <td class="text-right">{{ number_format($item->total, 2, ',', ' ') }} €</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Totals -->
    <div class="totals">
        <div class="totals-row">
            <div class="totals-label">Sous-total</div>
            <div class="totals-amount">{{ number_format($invoice->subtotal, 2, ',', ' ') }} €</div>
        </div>
        <div class="totals-row">
            <div class="totals-label">TVA ({{ number_format($invoice->tax_rate, 2, ',', ' ') }}%)</div>
            <div class="totals-amount">{{ number_format($invoice->tax_amount, 2, ',', ' ') }} €</div>
        </div>
        <div class="totals-row total">
            <div class="totals-label">Total TTC</div>
            <div class="totals-amount">{{ number_format($invoice->total, 2, ',', ' ') }} €</div>
        </div>
    </div>

    <!-- Notes -->
    @if($invoice->notes)
        <div class="notes">
            <div class="notes-title">Notes</div>
            <div class="notes-content">{{ $invoice->notes }}</div>
        </div>
    @endif

    <!-- Footer -->
    <div class="footer">
        Facture générée le {{ now()->format('d/m/Y à H:i') }} - {{ $invoice->company->name }}
        @if($invoice->company->website)
            - {{ $invoice->company->website }}
        @endif
    </div>
</body>
</html>
