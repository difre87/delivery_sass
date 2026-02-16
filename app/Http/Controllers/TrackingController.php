<?php

namespace App\Http\Controllers;

use App\Models\VehicleLocation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrackingController extends Controller
{
    /**
     * Display the tracking dashboard
     */
    public function index(Request $request)
    {
        $company = $request->user()->currentCompany;
        
        if (!$company) {
            return redirect()->route('onboarding.company.create');
        }

        // Get latest location for each vehicle with current assignment
        $vehicles = $company->vehicles()
            ->with(['latestLocation', 'assignments' => function($query) {
                $query->with('driver')->where('ends_at', null)->latest();
            }])
            ->get()
            ->map(function($vehicle) {
                $location = $vehicle->latestLocation;
                $currentAssignment = $vehicle->assignments->first();
                
                return [
                    'id' => $vehicle->id,
                    'plate_number' => $vehicle->plate_number,
                    'make' => $vehicle->make,
                    'model' => $vehicle->model,
                    'type' => $vehicle->type,
                    'status' => $vehicle->status,
                    'driver' => $currentAssignment ? [
                        'id' => $currentAssignment->driver_id,
                        'name' => $currentAssignment->driver->name ?? 'N/A',
                    ] : null,
                    'location' => $location ? [
                        'latitude' => $location->latitude,
                        'longitude' => $location->longitude,
                        'speed' => $location->speed,
                        'heading' => $location->heading,
                        'status' => $location->status,
                        'address' => $location->address,
                        'battery_level' => $location->battery_level,
                        'engine_on' => $location->engine_on,
                        'recorded_at' => $location->recorded_at->toIso8601String(),
                    ] : null,
                ];
            });

        return Inertia::render('Tracking/Index', [
            'vehicles' => $vehicles,
            'mapCenter' => $this->getMapCenter($vehicles),
        ]);
    }

    /**
     * Get live locations (API endpoint for real-time updates)
     */
    public function liveLocations(Request $request)
    {
        $company = $request->user()->currentCompany;
        
        $locations = VehicleLocation::where('company_id', $company->id)
            ->latest()
            ->with(['vehicle', 'driver'])
            ->get()
            ->groupBy('vehicle_id')
            ->map(function($group) {
                return $group->first();
            })
            ->values();

        return response()->json([
            'locations' => $locations,
            'timestamp' => Carbon::now()->toIso8601String(),
        ]);
    }

    /**
     * Store a new location update
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'altitude' => 'nullable|numeric',
            'speed' => 'nullable|numeric|min:0',
            'heading' => 'nullable|numeric|between:0,360',
            'accuracy' => 'nullable|numeric|min:0',
            'battery_level' => 'nullable|integer|between:0,100',
            'engine_on' => 'nullable|boolean',
        ]);

        $company = $request->user()->currentCompany;
        
        // Determine status based on speed
        $status = 'offline';
        if (isset($validated['speed'])) {
            $status = $validated['speed'] > 5 ? 'moving' : ($validated['speed'] > 0 ? 'idle' : 'stopped');
        }

        // Get address from coordinates (optional - would need geocoding service)
        $address = $this->getAddressFromCoordinates($validated['latitude'], $validated['longitude']);

        $location = VehicleLocation::create([
            'company_id' => $company->id,
            'vehicle_id' => $validated['vehicle_id'],
            'driver_id' => $request->user()->id,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'altitude' => $validated['altitude'] ?? null,
            'speed' => $validated['speed'] ?? null,
            'heading' => $validated['heading'] ?? null,
            'accuracy' => $validated['accuracy'] ?? null,
            'address' => $address,
            'status' => $status,
            'battery_level' => $validated['battery_level'] ?? null,
            'engine_on' => $validated['engine_on'] ?? false,
            'recorded_at' => Carbon::now(),
        ]);

        return response()->json([
            'success' => true,
            'location' => $location,
        ]);
    }

    /**
     * Get vehicle history/trail
     */
    public function history(Request $request, $vehicleId)
    {
        $company = $request->user()->currentCompany;
        
        $hours = $request->get('hours', 24);
        $startTime = Carbon::now()->subHours($hours);

        $locations = VehicleLocation::where('company_id', $company->id)
            ->where('vehicle_id', $vehicleId)
            ->where('recorded_at', '>=', $startTime)
            ->orderBy('recorded_at', 'asc')
            ->get();

        return response()->json([
            'locations' => $locations,
            'stats' => [
                'total_distance' => $this->calculateTotalDistance($locations),
                'avg_speed' => $locations->avg('speed'),
                'max_speed' => $locations->max('speed'),
                'duration' => $hours,
            ],
        ]);
    }

    /**
     * Calculate map center based on vehicles
     */
    private function getMapCenter($vehicles)
    {
        $vehiclesWithLocation = $vehicles->filter(fn($v) => $v['location'] !== null);
        
        if ($vehiclesWithLocation->isEmpty()) {
            // Default: Paris coordinates
            return [
                'latitude' => 48.8566,
                'longitude' => 2.3522,
                'zoom' => 12,
            ];
        }

        $avgLat = $vehiclesWithLocation->avg('location.latitude');
        $avgLng = $vehiclesWithLocation->avg('location.longitude');

        return [
            'latitude' => $avgLat,
            'longitude' => $avgLng,
            'zoom' => 13,
        ];
    }

    /**
     * Get address from coordinates (placeholder - needs geocoding API)
     */
    private function getAddressFromCoordinates($latitude, $longitude)
    {
        // TODO: Integrate with Google Maps Geocoding API or similar
        return null;
    }

    /**
     * Calculate total distance traveled
     */
    private function calculateTotalDistance($locations)
    {
        if ($locations->count() < 2) {
            return 0;
        }

        $totalDistance = 0;
        for ($i = 1; $i < $locations->count(); $i++) {
            $prev = $locations[$i - 1];
            $curr = $locations[$i];
            $totalDistance += $prev->distanceTo($curr->latitude, $curr->longitude);
        }

        return round($totalDistance, 2);
    }
}
