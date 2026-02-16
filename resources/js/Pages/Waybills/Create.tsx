import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Icons } from '@/Components/Icons';

export default function Create({ dispatch_runs, drivers, vehicles, shipments }) {
    const { data, setData, post, processing, errors } = useForm({
        dispatch_run_id: '',
        driver_id: '',
        vehicle_id: '',
        date: new Date().toISOString().split('T')[0],
        departure_time: '',
        notes: '',
        items: []
    });

    const [selectedShipments, setSelectedShipments] = useState([]);
    const [availableShipments, setAvailableShipments] = useState(shipments || []);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter shipments based on search
    const filteredShipments = availableShipments.filter(shipment => {
        const search = searchTerm.toLowerCase();
        return (
            shipment.tracking_number?.toLowerCase().includes(search) ||
            shipment.client?.name?.toLowerCase().includes(search) ||
            shipment.sender_address?.city?.toLowerCase().includes(search) ||
            shipment.recipient_address?.city?.toLowerCase().includes(search)
        );
    });

    // Add shipment to waybill
    const addShipment = (shipment) => {
        const newItem = {
            shipment_id: shipment.id,
            sequence_number: selectedShipments.length + 1,
            shipment: shipment
        };
        setSelectedShipments([...selectedShipments, newItem]);
        setAvailableShipments(availableShipments.filter(s => s.id !== shipment.id));
        setData('items', [...data.items, { shipment_id: shipment.id, sequence_number: newItem.sequence_number }]);
    };

    // Remove shipment from waybill
    const removeShipment = (index) => {
        const item = selectedShipments[index];
        setAvailableShipments([...availableShipments, item.shipment]);
        const newSelected = selectedShipments.filter((_, i) => i !== index);
        // Reorder sequence numbers
        const reordered = newSelected.map((item, i) => ({
            ...item,
            sequence_number: i + 1
        }));
        setSelectedShipments(reordered);
        setData('items', reordered.map(item => ({
            shipment_id: item.shipment_id,
            sequence_number: item.sequence_number
        })));
    };

    // Move shipment up in sequence
    const moveUp = (index) => {
        if (index === 0) return;
        const newSelected = [...selectedShipments];
        [newSelected[index], newSelected[index - 1]] = [newSelected[index - 1], newSelected[index]];
        // Update sequence numbers
        const reordered = newSelected.map((item, i) => ({
            ...item,
            sequence_number: i + 1
        }));
        setSelectedShipments(reordered);
        setData('items', reordered.map(item => ({
            shipment_id: item.shipment_id,
            sequence_number: item.sequence_number
        })));
    };

    // Move shipment down in sequence
    const moveDown = (index) => {
        if (index === selectedShipments.length - 1) return;
        const newSelected = [...selectedShipments];
        [newSelected[index], newSelected[index + 1]] = [newSelected[index + 1], newSelected[index]];
        // Update sequence numbers
        const reordered = newSelected.map((item, i) => ({
            ...item,
            sequence_number: i + 1
        }));
        setSelectedShipments(reordered);
        setData('items', reordered.map(item => ({
            shipment_id: item.shipment_id,
            sequence_number: item.sequence_number
        })));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('waybills.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                        <Icons.Clipboard className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Nouveau Bordereau
                    </h2>
                </div>
            }
        >
            <Head title="Nouveau Bordereau" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Basic Information */}
                        <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100">
                            <div className="p-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <Icons.Calendar className="w-5 h-5 text-purple-600" />
                                    Informations de base
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Dispatch Run */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tournée de livraison
                                        </label>
                                        <select
                                            value={data.dispatch_run_id}
                                            onChange={e => setData('dispatch_run_id', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        >
                                            <option value="">Sélectionner une tournée (optionnel)</option>
                                            {dispatch_runs?.map(run => (
                                                <option key={run.id} value={run.id}>
                                                    {run.run_number} - {run.date}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.dispatch_run_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.dispatch_run_id}</p>
                                        )}
                                    </div>

                                    {/* Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.date}
                                            onChange={e => setData('date', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            required
                                        />
                                        {errors.date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                                        )}
                                    </div>

                                    {/* Driver */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Icons.Drivers className="w-4 h-4 inline mr-1" />
                                            Chauffeur *
                                        </label>
                                        <select
                                            value={data.driver_id}
                                            onChange={e => setData('driver_id', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            required
                                        >
                                            <option value="">Sélectionner un chauffeur</option>
                                            {drivers?.map(driver => (
                                                <option key={driver.id} value={driver.id}>
                                                    {driver.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.driver_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.driver_id}</p>
                                        )}
                                    </div>

                                    {/* Vehicle */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Icons.Truck className="w-4 h-4 inline mr-1" />
                                            Véhicule *
                                        </label>
                                        <select
                                            value={data.vehicle_id}
                                            onChange={e => setData('vehicle_id', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            required
                                        >
                                            <option value="">Sélectionner un véhicule</option>
                                            {vehicles?.map(vehicle => (
                                                <option key={vehicle.id} value={vehicle.id}>
                                                    {vehicle.plate_number} - {vehicle.make} {vehicle.model}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.vehicle_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.vehicle_id}</p>
                                        )}
                                    </div>

                                    {/* Departure Time */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Heure de départ
                                        </label>
                                        <input
                                            type="time"
                                            value={data.departure_time}
                                            onChange={e => setData('departure_time', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        />
                                        {errors.departure_time && (
                                            <p className="mt-1 text-sm text-red-600">{errors.departure_time}</p>
                                        )}
                                    </div>

                                    {/* Notes */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Notes
                                        </label>
                                        <textarea
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="Instructions spéciales, itinéraire préféré, etc."
                                        />
                                        {errors.notes && (
                                            <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Selected Shipments (Ordered List) */}
                        <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100">
                            <div className="p-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <Icons.Clipboard className="w-5 h-5 text-purple-600" />
                                    Envois sélectionnés ({selectedShipments.length})
                                </h3>

                                {selectedShipments.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Icons.Clipboard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">Aucun envoi sélectionné</p>
                                        <p className="text-sm text-gray-400 mt-2">Ajoutez des envois depuis la liste ci-dessous</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {selectedShipments.map((item, index) => (
                                            <motion.div
                                                key={item.shipment_id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200"
                                            >
                                                {/* Sequence Number */}
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                                                        {item.sequence_number}
                                                    </div>
                                                </div>

                                                {/* Shipment Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold text-gray-900">
                                                            {item.shipment.tracking_number}
                                                        </span>
                                                        <span className="text-gray-600">•</span>
                                                        <span className="text-gray-700">
                                                            {item.shipment.client?.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <Icons.MapPin className="w-4 h-4" />
                                                            {item.shipment.sender_address?.city}
                                                        </span>
                                                        <span>→</span>
                                                        <span className="flex items-center gap-1">
                                                            <Icons.MapPin className="w-4 h-4" />
                                                            {item.shipment.recipient_address?.city}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => moveUp(index)}
                                                        disabled={index === 0}
                                                        className="p-2 text-gray-600 hover:text-purple-600 disabled:opacity-30 disabled:hover:text-gray-600 transition-colors"
                                                        title="Monter"
                                                    >
                                                        <Icons.ArrowUp className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => moveDown(index)}
                                                        disabled={index === selectedShipments.length - 1}
                                                        className="p-2 text-gray-600 hover:text-purple-600 disabled:opacity-30 disabled:hover:text-gray-600 transition-colors"
                                                        title="Descendre"
                                                    >
                                                        <Icons.ArrowDown className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeShipment(index)}
                                                        className="p-2 text-red-600 hover:text-red-700 transition-colors"
                                                        title="Retirer"
                                                    >
                                                        <Icons.Trash className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                                {errors.items && (
                                    <p className="mt-4 text-sm text-red-600">{errors.items}</p>
                                )}
                            </div>
                        </div>

                        {/* Available Shipments */}
                        <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Icons.MapPin className="w-5 h-5 text-purple-600" />
                                        Envois disponibles ({filteredShipments.length})
                                    </h3>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        placeholder="Rechercher un envoi..."
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                {filteredShipments.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Icons.MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">Aucun envoi disponible</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {filteredShipments.map(shipment => (
                                            <div
                                                key={shipment.id}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold text-gray-900">
                                                            {shipment.tracking_number}
                                                        </span>
                                                        <span className="text-gray-600">•</span>
                                                        <span className="text-gray-700">
                                                            {shipment.client?.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <span>{shipment.sender_address?.city}</span>
                                                        <span>→</span>
                                                        <span>{shipment.recipient_address?.city}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => addShipment(shipment)}
                                                    className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-100 rounded-lg transition-all"
                                                    title="Ajouter"
                                                >
                                                    <Icons.Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end gap-4">
                            <a
                                href={route('waybills.index')}
                                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                            >
                                Annuler
                            </a>
                            <button
                                type="submit"
                                disabled={processing || selectedShipments.length === 0}
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                            >
                                {processing ? 'Création...' : 'Créer le bordereau'}
                            </button>
                        </div>
                    </motion.form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
