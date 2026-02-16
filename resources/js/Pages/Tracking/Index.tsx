import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Icons } from '@/Components/Icons';
import { motion } from 'framer-motion';
import TrackingMap from '@/Components/Tracking/TrackingMap';

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

interface MapCenter {
    latitude: number;
    longitude: number;
    zoom: number;
}

interface Props {
    vehicles: Vehicle[];
    mapCenter: MapCenter;
}

export default function Index({ vehicles: initialVehicles, mapCenter }: Props) {
    const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [filter, setFilter] = useState<'all' | 'moving' | 'stopped' | 'offline'>('all');
    const [autoRefresh, setAutoRefresh] = useState(true);

    const page = usePage<any>();
    const { currentCompany } = page.props.auth;

    // Auto-refresh every 30 seconds
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            // TODO: Fetch live locations from API
            console.log('Fetching live locations...');
        }, 30000);

        return () => clearInterval(interval);
    }, [autoRefresh]);

    const filteredVehicles = vehicles.filter(v => {
        if (filter === 'all') return true;
        if (!v.location) return filter === 'offline';
        return v.location.status === filter;
    });

    const getStatusColor = (status: string | undefined) => {
        switch (status) {
            case 'moving':
                return 'bg-emerald-500';
            case 'stopped':
                return 'bg-amber-500';
            case 'idle':
                return 'bg-blue-500';
            default:
                return 'bg-slate-400';
        }
    };

    const getStatusLabel = (status: string | undefined) => {
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

    const stats = {
        total: vehicles.length,
        moving: vehicles.filter(v => v.location?.status === 'moving').length,
        stopped: vehicles.filter(v => v.location?.status === 'stopped').length,
        offline: vehicles.filter(v => !v.location || v.location.status === 'offline').length,
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Tracking GPS en temps réel
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Suivez la position de vos véhicules en direct
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                                autoRefresh
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <Icons.Radio className="h-4 w-4" />
                            {autoRefresh ? 'Actualisation auto' : 'Actualiser'}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Tracking GPS" />

            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Total véhicules</p>
                                <p className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</p>
                            </div>
                            <div className="rounded-lg bg-slate-100 p-3">
                                <Icons.Fleet className="h-6 w-6 text-slate-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-700">En mouvement</p>
                                <p className="mt-2 text-3xl font-bold text-emerald-900">{stats.moving}</p>
                            </div>
                            <div className="rounded-lg bg-emerald-200 p-3">
                                <Icons.Navigation className="h-6 w-6 text-emerald-700" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-amber-700">Arrêtés</p>
                                <p className="mt-2 text-3xl font-bold text-amber-900">{stats.stopped}</p>
                            </div>
                            <div className="rounded-lg bg-amber-200 p-3">
                                <Icons.MapPin className="h-6 w-6 text-amber-700" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Hors ligne</p>
                                <p className="mt-2 text-3xl font-bold text-slate-900">{stats.offline}</p>
                            </div>
                            <div className="rounded-lg bg-slate-100 p-3">
                                <Icons.AlertCircle className="h-6 w-6 text-slate-600" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Vehicle List */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="rounded-2xl border border-slate-200 bg-white shadow-sm"
                        >
                            <div className="border-b border-slate-200 p-6">
                                <h3 className="text-lg font-bold text-slate-900">Liste des véhicules</h3>
                                <div className="mt-4 flex gap-2">
                                    {['all', 'moving', 'stopped', 'offline'].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setFilter(f as any)}
                                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                                filter === f
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            {f === 'all' ? 'Tous' : f === 'moving' ? 'Actifs' : f === 'stopped' ? 'Arrêtés' : 'Hors ligne'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="max-h-[600px] overflow-y-auto p-4">
                                <div className="space-y-3">
                                    {filteredVehicles.map((vehicle, index) => (
                                        <motion.button
                                            key={vehicle.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => setSelectedVehicle(vehicle)}
                                            className={`w-full rounded-xl border p-4 text-left transition ${
                                                selectedVehicle?.id === vehicle.id
                                                    ? 'border-emerald-300 bg-emerald-50'
                                                    : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(vehicle.location?.status)} animate-pulse`} />
                                                        <p className="font-bold text-slate-900">{vehicle.plate_number}</p>
                                                    </div>
                                                    {vehicle.make && vehicle.model && (
                                                        <p className="mt-1 text-xs text-slate-500">
                                                            {vehicle.make} {vehicle.model}
                                                        </p>
                                                    )}
                                                    {vehicle.driver && (
                                                        <p className="mt-2 flex items-center gap-1 text-xs text-slate-600">
                                                            <Icons.Drivers className="h-3 w-3" />
                                                            {vehicle.driver.name}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                                                    vehicle.location?.status === 'moving'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : vehicle.location?.status === 'stopped'
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {getStatusLabel(vehicle.location?.status)}
                                                </span>
                                            </div>

                                            {vehicle.location && (
                                                <div className="mt-3 flex items-center gap-4 text-xs text-slate-600">
                                                    {vehicle.location.speed !== null && (
                                                        <span>{Number(vehicle.location.speed).toFixed(0)} km/h</span>
                                                    )}
                                                    {vehicle.location.battery_level !== null && (
                                                        <span className="flex items-center gap-1">
                                                            🔋 {vehicle.location.battery_level}%
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Map Area */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900">Carte en temps réel</h3>
                                {selectedVehicle && (
                                    <span className="text-sm text-slate-600">
                                        Véhicule sélectionné: <span className="font-semibold">{selectedVehicle.plate_number}</span>
                                    </span>
                                )}
                            </div>

                            {/* Google Maps Component */}
                            <TrackingMap
                                vehicles={filteredVehicles}
                                selectedVehicle={selectedVehicle}
                                onVehicleSelect={setSelectedVehicle}
                                center={mapCenter}
                                showTrails={false}
                            />

                            {/* Selected Vehicle Details */}
                            {selectedVehicle?.location && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4"
                                >
                                    <h4 className="font-semibold text-emerald-900">Détails de la position</h4>
                                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-emerald-700">Latitude</p>
                                            <p className="font-mono text-emerald-900">{selectedVehicle.location.latitude}</p>
                                        </div>
                                        <div>
                                            <p className="text-emerald-700">Longitude</p>
                                            <p className="font-mono text-emerald-900">{selectedVehicle.location.longitude}</p>
                                        </div>
                                        {selectedVehicle.location.speed !== null && (
                                            <div>
                                                <p className="text-emerald-700">Vitesse</p>
                                                <p className="font-semibold text-emerald-900">{selectedVehicle.location.speed.toFixed(1)} km/h</p>
                                            </div>
                                        )}
                                        {selectedVehicle.location.heading !== null && (
                                            <div>
                                                <p className="text-emerald-700">Direction</p>
                                                <p className="font-semibold text-emerald-900">{selectedVehicle.location.heading.toFixed(0)}°</p>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-3 text-xs text-emerald-700">
                                        Dernière mise à jour: {new Date(selectedVehicle.location.recorded_at).toLocaleString('fr-FR')}
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
