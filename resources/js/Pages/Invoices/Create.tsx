import React, { useState, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FormInput from '@/Components/FormInput';
import FormSelect from '@/Components/FormSelect';
import Button from '@/Components/Button';
import { Icons } from '@/Components/Icons';
import { useCurrency } from '@/hooks/useCurrency';

export default function CreateInvoice({ clients, shipments, invoice_number }) {
    const page = usePage<any>();
    const { currentCompany } = page.props.auth;
    const { format: formatCurrency, symbol } = useCurrency();
    const { data, setData, post, processing, errors } = useForm({
        client_id: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tax_rate: 20,
        notes: '',
        items: [
            { description: '', quantity: 1, unit_price: 0, shipment_id: null }
        ],
    });

    const [availableShipments, setAvailableShipments] = useState(shipments || []);

    const clientOptions = [
        { value: '', label: 'Sélectionner un client' },
        ...clients.map(client => ({ value: client.id, label: client.name }))
    ];

    const addItem = () => {
        setData('items', [...data.items, { description: '', quantity: 1, unit_price: 0, shipment_id: null }]);
    };

    const removeItem = (index) => {
        const newItems = data.items.filter((_, i) => i !== index);
        setData('items', newItems);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;
        setData('items', newItems);
    };

    const selectShipment = (index, shipmentId) => {
        const shipment = availableShipments.find(s => s.id === parseInt(shipmentId));
        if (shipment) {
            const newItems = [...data.items];
            newItems[index] = {
                ...newItems[index],
                shipment_id: shipment.id,
                description: `Livraison ${shipment.tracking_number} - ${shipment.pickup_address?.city || ''} → ${shipment.delivery_address?.city || ''}`,
                quantity: 1,
                unit_price: shipment.amount || 0,
            };
            setData('items', newItems);
        }
    };

    const calculateSubtotal = () => {
        return data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * (data.tax_rate / 100);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('invoices.store', { company: currentCompany.slug }));
    };

    // Filter shipments for selected client
    useEffect(() => {
        if (data.client_id) {
            const filtered = shipments.filter(s => s.client_id === parseInt(data.client_id));
            setAvailableShipments(filtered);
        } else {
            setAvailableShipments(shipments);
        }
    }, [data.client_id]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Nouvelle facture
                    </h2>
                </div>
            }
        >
            <Head title="Nouvelle facture" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Invoice Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="overflow-hidden bg-white shadow-lg sm:rounded-2xl"
                        >
                            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6">
                                <div className="absolute inset-0 bg-grid-white/10"></div>
                                <div className="relative">
                                    <Icons.FileText className="mb-2 h-8 w-8 text-white/90" />
                                    <h3 className="text-xl font-semibold text-white">
                                        Informations de la facture
                                    </h3>
                                    <p className="mt-1 text-sm text-blue-100">
                                        Numéro : {invoice_number}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-6 p-6 md:grid-cols-2">
                                <FormSelect
                                    label="Client"
                                    value={data.client_id}
                                    onChange={(e) => setData('client_id', e.target.value)}
                                    options={clientOptions}
                                    error={errors.client_id}
                                    required
                                    icon={Icons.Users}
                                />
                                <FormInput
                                    label="Date de facture"
                                    type="date"
                                    value={data.invoice_date}
                                    onChange={(e) => setData('invoice_date', e.target.value)}
                                    error={errors.invoice_date}
                                    helperText={null}
                                    required
                                    icon={Icons.Calendar}
                                />
                                <FormInput
                                    label="Date d'échéance"
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                    error={errors.due_date}
                                    helperText={null}
                                    required
                                    icon={Icons.Calendar}
                                />
                                <FormInput
                                    label="TVA (%)"
                                    type="number"
                                    step="0.01"
                                    value={data.tax_rate}
                                    onChange={(e) => setData('tax_rate', parseFloat(e.target.value))}
                                    error={errors.tax_rate}
                                    helperText={null}
                                    required
                                    icon={Icons.Currency}
                                />
                            </div>
                        </motion.div>

                        {/* Invoice Items */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="overflow-hidden bg-white shadow-lg sm:rounded-2xl"
                        >
                            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6">
                                <div className="absolute inset-0 bg-grid-white/10"></div>
                                <div className="relative flex items-center justify-between">
                                    <div>
                                        <Icons.List className="mb-2 h-8 w-8 text-white/90" />
                                        <h3 className="text-xl font-semibold text-white">
                                            Articles de la facture
                                        </h3>
                                        <p className="mt-1 text-sm text-indigo-100">
                                            Ajoutez les services ou produits facturés
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={addItem}
                                        variant="secondary"
                                        icon={Icons.Plus}
                                        className="bg-white/20 text-white hover:bg-white/30"
                                    >
                                        Ajouter
                                    </Button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {data.items.map((item, index) => (
                                    <div key={index} className="rounded-lg border-2 border-gray-200 p-4">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h4 className="font-semibold text-gray-900">Article {index + 1}</h4>
                                            {data.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Icons.Trash className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                            {availableShipments.length > 0 && (
                                                <div className="lg:col-span-2">
                                                    <FormSelect
                                                        label="Expédition (optionnel)"
                                                        value={item.shipment_id || ''}
                                                        onChange={(e) => selectShipment(index, e.target.value)}
                                                        options={[
                                                            { value: '', label: 'Sélectionner une expédition' },
                                                            ...availableShipments.map(s => ({
                                                                value: s.id,
                                                                label: `${s.tracking_number} - ${s.pickup_address?.city || ''} → ${s.delivery_address?.city || ''}`
                                                            }))
                                                        ]}
                                                        icon={Icons.Shipments}
                                                        error={null}
                                                    />
                                                </div>
                                            )}
                                            <div className={availableShipments.length > 0 ? 'lg:col-span-2' : 'lg:col-span-4'}>
                                                <FormInput
                                                    label="Description"
                                                    value={item.description}
                                                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                    error={errors[`items.${index}.description`]}
                                                    helperText={null}
                                                    icon={null}
                                                    required
                                                    placeholder="Service ou produit"
                                                />
                                            </div>
                                            <FormInput
                                                label="Quantité"
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                                                error={errors[`items.${index}.quantity`]}
                                                helperText={null}
                                                icon={null}
                                                required
                                            />
                                            <FormInput
                                                label={`Prix unitaire (${symbol})`}
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={item.unit_price}
                                                onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value))}
                                                error={errors[`items.${index}.unit_price`]}
                                                helperText={null}
                                                icon={null}
                                                required
                                            />
                                            <div className="lg:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Total ligne
                                                </label>
                                                <div className="rounded-lg bg-gray-100 px-4 py-3 text-lg font-semibold text-gray-900">
                                                    {formatCurrency(item.quantity * item.unit_price)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Totals */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="overflow-hidden bg-white shadow-lg sm:rounded-2xl"
                        >
                            <div className="p-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-lg">
                                        <span className="font-medium text-gray-700">Sous-total :</span>
                                        <span className="font-semibold text-gray-900">
                                            {formatCurrency(calculateSubtotal())}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-lg">
                                        <span className="font-medium text-gray-700">TVA ({data.tax_rate}%) :</span>
                                        <span className="font-semibold text-gray-900">
                                            {formatCurrency(calculateTax())}
                                        </span>
                                    </div>
                                    <div className="border-t-2 border-gray-200 pt-3">
                                        <div className="flex items-center justify-between text-2xl">
                                            <span className="font-bold text-gray-900">Total :</span>
                                            <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                                {formatCurrency(calculateTotal())}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Notes */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="overflow-hidden bg-white shadow-lg sm:rounded-2xl"
                        >
                            <div className="p-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes (optionnel)
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={4}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Conditions de paiement, informations supplémentaires..."
                                />
                            </div>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex justify-end space-x-4"
                        >
                            <Button
                                type="button"
                                variant="secondary"
                                icon={null}
                                onClick={() => router.visit(route('invoices.index', { company: currentCompany.slug }))}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                icon={Icons.Save}
                                disabled={processing}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600"
                            >
                                {processing ? 'Création...' : 'Créer la facture'}
                            </Button>
                        </motion.div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
