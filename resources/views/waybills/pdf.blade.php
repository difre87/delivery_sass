<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bordereau {{ $waybill->waybill_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #333;
        }

        .container {
            padding: 20px;
        }

        /* Header */
        .header {
            margin-bottom: 30px;
            border-bottom: 3px solid #9333ea;
            padding-bottom: 15px;
        }

        .header-content {
            display: table;
            width: 100%;
        }

        .company-info {
            display: table-cell;
            width: 60%;
            vertical-align: top;
        }

        .company-logo {
            max-width: 120px;
            max-height: 60px;
            margin-bottom: 10px;
        }

        .company-name {
            font-size: 20px;
            font-weight: bold;
            color: #9333ea;
            margin-bottom: 5px;
        }

        .company-details {
            font-size: 9px;
            color: #666;
            line-height: 1.5;
        }

        .waybill-info {
            display: table-cell;
            width: 40%;
            vertical-align: top;
            text-align: right;
        }

        .waybill-number {
            font-size: 24px;
            font-weight: bold;
            color: #9333ea;
            margin-bottom: 10px;
        }

        .waybill-title {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
        }

        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 15px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .status-draft { background: #e5e7eb; color: #374151; }
        .status-issued { background: #dbeafe; color: #1e40af; }
        .status-in_progress { background: #fef3c7; color: #92400e; }
        .status-completed { background: #d1fae5; color: #065f46; }
        .status-cancelled { background: #fee2e2; color: #991b1b; }

        /* Info Section */
        .info-section {
            margin-bottom: 25px;
        }

        .info-grid {
            display: table;
            width: 100%;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
        }

        .info-row {
            display: table-row;
        }

        .info-row:nth-child(even) {
            background: #f9fafb;
        }

        .info-label {
            display: table-cell;
            padding: 8px 12px;
            font-weight: bold;
            color: #6b7280;
            width: 30%;
            border-bottom: 1px solid #e5e7eb;
        }

        .info-value {
            display: table-cell;
            padding: 8px 12px;
            color: #111827;
            border-bottom: 1px solid #e5e7eb;
        }

        .info-row:last-child .info-label,
        .info-row:last-child .info-value {
            border-bottom: none;
        }

        /* Section Title */
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #9333ea;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 2px solid #e9d5ff;
        }

        /* Shipments Table */
        .shipments-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }

        .shipments-table th {
            background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
            color: white;
            padding: 10px 8px;
            text-align: left;
            font-weight: bold;
            font-size: 10px;
            text-transform: uppercase;
        }

        .shipments-table td {
            padding: 10px 8px;
            border-bottom: 1px solid #e5e7eb;
            vertical-align: top;
        }

        .shipments-table tr:last-child td {
            border-bottom: none;
        }

        .shipments-table tbody tr:nth-child(even) {
            background: #faf5ff;
        }

        .sequence-number {
            display: inline-block;
            width: 28px;
            height: 28px;
            background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
            color: white;
            border-radius: 50%;
            text-align: center;
            line-height: 28px;
            font-weight: bold;
            font-size: 12px;
        }

        .tracking-number {
            font-weight: bold;
            color: #9333ea;
        }

        .address {
            font-size: 9px;
            color: #666;
            margin-top: 3px;
        }

        .item-status {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 10px;
            font-size: 8px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .item-status-pending { background: #e5e7eb; color: #374151; }
        .item-status-picked_up { background: #dbeafe; color: #1e40af; }
        .item-status-delivered { background: #d1fae5; color: #065f46; }
        .item-status-failed { background: #fee2e2; color: #991b1b; }

        /* Summary */
        .summary-box {
            background: #faf5ff;
            border: 2px solid #e9d5ff;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 25px;
        }

        .summary-grid {
            display: table;
            width: 100%;
        }

        .summary-item {
            display: table-cell;
            text-align: center;
            padding: 10px;
            border-right: 1px solid #e9d5ff;
        }

        .summary-item:last-child {
            border-right: none;
        }

        .summary-label {
            font-size: 9px;
            color: #6b7280;
            text-transform: uppercase;
            margin-bottom: 5px;
        }

        .summary-value {
            font-size: 18px;
            font-weight: bold;
            color: #9333ea;
        }

        /* Signature Section */
        .signature-section {
            margin-top: 40px;
            page-break-inside: avoid;
        }

        .signature-boxes {
            display: table;
            width: 100%;
            margin-top: 20px;
        }

        .signature-box {
            display: table-cell;
            width: 50%;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }

        .signature-box:first-child {
            margin-right: 10px;
        }

        .signature-label {
            font-weight: bold;
            color: #9333ea;
            margin-bottom: 10px;
        }

        .signature-line {
            border-top: 2px solid #9333ea;
            margin-top: 50px;
            padding-top: 10px;
            text-align: center;
            font-size: 9px;
            color: #666;
        }

        /* Notes */
        .notes-box {
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 12px;
            margin-bottom: 20px;
            border-radius: 4px;
        }

        .notes-label {
            font-weight: bold;
            color: #92400e;
            margin-bottom: 5px;
        }

        .notes-content {
            color: #78350f;
            font-size: 10px;
        }

        /* Footer */
        .footer {
            margin-top: 40px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 9px;
            color: #9ca3af;
        }

        /* Progress Bar */
        .progress-container {
            background: #e5e7eb;
            height: 20px;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
            position: relative;
        }

        .progress-bar {
            background: linear-gradient(90deg, #9333ea 0%, #ec4899 100%);
            height: 100%;
            border-radius: 10px;
        }

        .progress-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 10px;
            font-weight: bold;
            color: #111827;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="header-content">
                <div class="company-info">
                    @if($company->logo)
                        <img src="{{ public_path('storage/' . $company->logo) }}" alt="{{ $company->name }}" class="company-logo">
                    @endif
                    <div class="company-name">{{ $company->name }}</div>
                    <div class="company-details">
                        @if($company->address) {{ $company->address }}<br> @endif
                        @if($company->phone) Tél: {{ $company->phone }}<br> @endif
                        @if($company->email) Email: {{ $company->email }}<br> @endif
                        @if($company->website) {{ $company->website }} @endif
                    </div>
                </div>
                <div class="waybill-info">
                    <div class="waybill-number">{{ $waybill->waybill_number }}</div>
                    <div class="waybill-title">Bordereau de Livraison</div>
                    <span class="status-badge status-{{ $waybill->status }}">
                        @switch($waybill->status)
                            @case('draft') Brouillon @break
                            @case('issued') Émis @break
                            @case('in_progress') En cours @break
                            @case('completed') Terminé @break
                            @case('cancelled') Annulé @break
                            @default {{ $waybill->status }}
                        @endswitch
                    </span>
                </div>
            </div>
        </div>

        <!-- Waybill Information -->
        <div class="info-section">
            <div class="section-title">Informations du bordereau</div>
            <div class="info-grid">
                <div class="info-row">
                    <div class="info-label">Date</div>
                    <div class="info-value">{{ \Carbon\Carbon::parse($waybill->date)->format('d/m/Y') }}</div>
                </div>
                @if($waybill->dispatchRun)
                <div class="info-row">
                    <div class="info-label">Tournée</div>
                    <div class="info-value">{{ $waybill->dispatchRun->run_number }}</div>
                </div>
                @endif
                <div class="info-row">
                    <div class="info-label">Chauffeur</div>
                    <div class="info-value">{{ $waybill->driver->name }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Véhicule</div>
                    <div class="info-value">{{ $waybill->vehicle->plate_number }} - {{ $waybill->vehicle->make }} {{ $waybill->vehicle->model }}</div>
                </div>
                @if($waybill->departure_time)
                <div class="info-row">
                    <div class="info-label">Heure de départ</div>
                    <div class="info-value">{{ $waybill->departure_time }}</div>
                </div>
                @endif
                @if($waybill->return_time)
                <div class="info-row">
                    <div class="info-label">Heure de retour</div>
                    <div class="info-value">{{ $waybill->return_time }}</div>
                </div>
                @endif
            </div>
        </div>

        <!-- Notes -->
        @if($waybill->notes)
        <div class="notes-box">
            <div class="notes-label">📋 Notes importantes</div>
            <div class="notes-content">{{ $waybill->notes }}</div>
        </div>
        @endif

        <!-- Summary -->
        <div class="summary-box">
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-label">Total Envois</div>
                    <div class="summary-value">{{ $waybill->total_shipments }}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Livrés</div>
                    <div class="summary-value">{{ $waybill->completed_shipments }}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Progression</div>
                    <div class="summary-value">
                        {{ $waybill->total_shipments > 0 ? round(($waybill->completed_shipments / $waybill->total_shipments) * 100) : 0 }}%
                    </div>
                </div>
            </div>
            <div class="progress-container">
                <div class="progress-bar" style="width: {{ $waybill->total_shipments > 0 ? round(($waybill->completed_shipments / $waybill->total_shipments) * 100) : 0 }}%"></div>
                <div class="progress-text">
                    {{ $waybill->completed_shipments }} / {{ $waybill->total_shipments }} envois livrés
                </div>
            </div>
        </div>

        <!-- Shipments List -->
        <div class="section-title">Liste des envois (Itinéraire)</div>
        <table class="shipments-table">
            <thead>
                <tr>
                    <th style="width: 5%">#</th>
                    <th style="width: 15%">N° Suivi</th>
                    <th style="width: 15%">Client</th>
                    <th style="width: 25%">Enlèvement</th>
                    <th style="width: 25%">Livraison</th>
                    <th style="width: 10%">Statut</th>
                    <th style="width: 5%">✓</th>
                </tr>
            </thead>
            <tbody>
                @foreach($waybill->items as $item)
                <tr>
                    <td>
                        <span class="sequence-number">{{ $item->sequence_number }}</span>
                    </td>
                    <td>
                        <span class="tracking-number">{{ $item->shipment->tracking_number }}</span>
                    </td>
                    <td>{{ $item->shipment->client->name }}</td>
                    <td>
                        <strong>{{ $item->shipment->pickupAddress->city }}</strong>
                        <div class="address">
                            {{ $item->shipment->pickupAddress->street }}<br>
                            {{ $item->shipment->pickupAddress->postal_code }} {{ $item->shipment->pickupAddress->city }}
                        </div>
                    </td>
                    <td>
                        <strong>{{ $item->shipment->deliveryAddress->city }}</strong>
                        <div class="address">
                            {{ $item->shipment->deliveryAddress->street }}<br>
                            {{ $item->shipment->deliveryAddress->postal_code }} {{ $item->shipment->deliveryAddress->city }}
                        </div>
                    </td>
                    <td>
                        <span class="item-status item-status-{{ $item->status }}">
                            @switch($item->status)
                                @case('pending') En attente @break
                                @case('picked_up') Collecté @break
                                @case('delivered') Livré @break
                                @case('failed') Échec @break
                                @default {{ $item->status }}
                            @endswitch
                        </span>
                    </td>
                    <td style="text-align: center;">
                        @if($item->status === 'delivered')
                            <strong style="color: #059669; font-size: 16px;">✓</strong>
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Signature Section -->
        <div class="signature-section">
            <div class="section-title">Signatures</div>
            <div class="signature-boxes">
                <div class="signature-box">
                    <div class="signature-label">👨‍✈️ Signature du Chauffeur</div>
                    <div class="signature-line">
                        {{ $waybill->driver->name }}<br>
                        Date: _______________
                    </div>
                </div>
                <div class="signature-box">
                    <div class="signature-label">✍️ Signature du Responsable</div>
                    <div class="signature-line">
                        Nom: _______________<br>
                        Date: _______________
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            Document généré le {{ now()->format('d/m/Y à H:i') }}
            @if($company->name)
                • {{ $company->name }}
            @endif
            @if($company->registration_number)
                • RC: {{ $company->registration_number }}
            @endif
        </div>
    </div>
</body>
</html>
