import { GoogleMap, LoadScript, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { useState, useCallback, useEffect } from 'react';
import { Icons } from '@/Components/Icons';

interface Location {
    latitude: number;
    longitude: number;
    speed: number | null;
    heading: number | null;
    status: 'moving' | 'stopped' | 'idle' | 'offline';
    address: string | null;
    battery_level: number | null;
    engine_on: boolean;
    recorded_at: string;
}

interface Vehicle {
    id: number;
    plate_number: string;
    make: string | null;
    model: string | null;
    type: string;
    status: string;
    driver: {
        id: number;
        name: string;
    } | null;
    location: Location | null;
}

interface Props {
    vehicles: Vehicle[];
    selectedVehicle: Vehicle | null;
    onVehicleSelect: (vehicle: Vehicle) => void;
    center: {
        latitude: number;
        longitude: number;
        zoom: number;
    };
    showTrails?: boolean;
}

const containerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '12px',
};

// Google Maps API key - à configurer dans .env
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export default function TrackingMap({ 
    vehicles, 
    selectedVehicle, 
    onVehicleSelect,
    center,
    showTrails = false 
}: Props) {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [activeMarker, setActiveMarker] = useState<number | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const mapCenter = {
        lat: center.latitude,
        lng: center.longitude,
    };

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    // Center map on selected vehicle
    useEffect(() => {
        if (map && selectedVehicle?.location) {
            map.panTo({
                lat: selectedVehicle.location.latitude,
                lng: selectedVehicle.location.longitude,
            });
            map.setZoom(15);
        }
    }, [map, selectedVehicle]);

    const getMarkerIcon = (vehicle: Vehicle) => {
        // Only create icon if google maps is loaded
        if (typeof google === 'undefined') return undefined;
        
        const status = vehicle.location?.status || 'offline';
        let color = '#94a3b8'; // slate-400 (offline)
        
        switch (status) {
            case 'moving':
                color = '#10b981'; // emerald-500
                break;
            case 'stopped':
                color = '#f59e0b'; // amber-500
                break;
            case 'idle':
                color = '#3b82f6'; // blue-500
                break;
        }

        // SVG truck icon with dynamic color
        const svgMarker = `
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="${color}" opacity="0.2"/>
                <circle cx="20" cy="20" r="14" fill="${color}"/>
                <path d="M15 16v-2a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h1m5-5a1 1 0 0 1-1 1h-2m3-1v4a1 1 0 0 1 1 1h1.586a1 1 0 0 1 .707.293l2.414 2.414a1 1 0 0 1 .293.707v2a1 1 0 0 1-1 1h-1m-5-1a1 1 0 0 0 1 1h1m-5-5a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0m5 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0" 
                      stroke="white" 
                      stroke-width="1.5" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      fill="none"
                      transform="translate(7, 7) scale(0.65)"/>
                ${status === 'moving' ? '<circle cx="20" cy="20" r="16" fill="none" stroke="' + color + '" stroke-width="2" opacity="0.5"><animate attributeName="r" from="14" to="18" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite"/></circle>' : ''}
            </svg>
        `;

        return {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgMarker),
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20),
        };
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'moving':
                return 'text-emerald-600';
            case 'stopped':
                return 'text-amber-600';
            case 'idle':
                return 'text-blue-600';
            default:
                return 'text-slate-600';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'moving':
                return 'En mouvement';
            case 'stopped':
                return 'Arrêté';
            case 'idle':
                return 'Au ralenti';
            default:
                return 'Hors ligne';
        }
    };

    if (!GOOGLE_MAPS_API_KEY) {
        return (
            <div className="flex h-[600px] items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200">
                <div className="text-center">
                    <Icons.AlertCircle className="mx-auto h-16 w-16 text-rose-500" />
                    <p className="mt-4 text-lg font-semibold text-slate-700">
                        Clé API Google Maps manquante
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                        Ajoutez <code className="rounded bg-slate-800 px-2 py-1 text-white">VITE_GOOGLE_MAPS_API_KEY</code> dans votre fichier .env
                    </p>
                </div>
            </div>
        );
    }

    return (
        <LoadScript 
            googleMapsApiKey={GOOGLE_MAPS_API_KEY}
            onLoad={() => setIsLoaded(true)}
        >
            {!isLoaded ? (
                <div className="flex h-[600px] items-center justify-center rounded-xl bg-slate-100">
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
                        <p className="mt-4 text-sm text-slate-600">Chargement de la carte...</p>
                    </div>
                </div>
            ) : (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={mapCenter}
                    zoom={center.zoom}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
                        zoomControl: true,
                        streetViewControl: false,
                        mapTypeControl: true,
                        fullscreenControl: true,
                        styles: [
                            {
                                featureType: 'poi',
                                elementType: 'labels',
                                stylers: [{ visibility: 'off' }],
                            },
                        ],
                    }}
                >
                {/* Vehicle Markers */}
                {vehicles.map((vehicle) => {
                    if (!vehicle.location) return null;

                    return (
                        <Marker
                            key={vehicle.id}
                            position={{
                                lat: vehicle.location.latitude,
                                lng: vehicle.location.longitude,
                            }}
                            icon={getMarkerIcon(vehicle)}
                            onClick={() => {
                                setActiveMarker(vehicle.id);
                                onVehicleSelect(vehicle);
                            }}
                            animation={
                                vehicle.location.status === 'moving' && typeof google !== 'undefined'
                                    ? google.maps.Animation.BOUNCE
                                    : undefined
                            }
                        >
                            {activeMarker === vehicle.id && (
                                <InfoWindow
                                    onCloseClick={() => setActiveMarker(null)}
                                >
                                    <div className="p-2" style={{ minWidth: '250px' }}>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-slate-900">
                                                    {vehicle.plate_number}
                                                </h3>
                                                {vehicle.make && vehicle.model && (
                                                    <p className="text-xs text-slate-500">
                                                        {vehicle.make} {vehicle.model}
                                                    </p>
                                                )}
                                            </div>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                    vehicle.location.status === 'moving'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : vehicle.location.status === 'stopped'
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-slate-100 text-slate-600'
                                                }`}
                                            >
                                                {getStatusLabel(vehicle.location.status)}
                                            </span>
                                        </div>

                                        {vehicle.driver && (
                                            <div className="mt-2 flex items-center gap-1 text-xs text-slate-600">
                                                <svg
                                                    className="h-3 w-3"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                                {vehicle.driver.name}
                                            </div>
                                        )}

                                        <div className="mt-3 space-y-1 border-t border-slate-200 pt-2">
                                            {vehicle.location.speed !== null && (
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-slate-600">Vitesse:</span>
                                                    <span className="font-semibold text-slate-900">
                                                        {Number(vehicle.location.speed).toFixed(0)} km/h
                                                    </span>
                                                </div>
                                            )}
                                            {vehicle.location.heading !== null && (
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-slate-600">Direction:</span>
                                                    <span className="font-semibold text-slate-900">
                                                        {Number(vehicle.location.heading).toFixed(0)}°
                                                    </span>
                                                </div>
                                            )}
                                            {vehicle.location.battery_level !== null && (
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-slate-600">Batterie:</span>
                                                    <span className="font-semibold text-slate-900">
                                                        {vehicle.location.battery_level}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {vehicle.location.address && (
                                            <div className="mt-2 rounded bg-slate-50 p-2 text-xs text-slate-600">
                                                📍 {vehicle.location.address}
                                            </div>
                                        )}

                                        <p className="mt-2 text-[10px] text-slate-400">
                                            Mise à jour:{' '}
                                            {new Date(vehicle.location.recorded_at).toLocaleTimeString('fr-FR')}
                                        </p>
                                    </div>
                                </InfoWindow>
                            )}
                        </Marker>
                    );
                })}

                {/* Trail for selected vehicle */}
                {showTrails && selectedVehicle?.location && (
                    <Polyline
                        path={[
                            // TODO: Fetch vehicle history and draw trail
                            {
                                lat: selectedVehicle.location.latitude,
                                lng: selectedVehicle.location.longitude,
                            },
                        ]}
                        options={{
                            strokeColor: '#10b981',
                            strokeOpacity: 0.8,
                            strokeWeight: 3,
                        }}
                    />
                )}
                </GoogleMap>
            )}
        </LoadScript>
    );
}
