import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Icons } from '@/Components/Icons';
import Button from '@/Components/Button';
import FormInput from '@/Components/FormInput';
import FormSelect from '@/Components/FormSelect';
import FormCheckbox from '@/Components/FormCheckbox';
import FormTextarea from '@/Components/FormTextarea';

export default function Create() {
    const { auth } = usePage<any>().props;
    const currentCompany = auth.currentCompany;

    const { data, setData, post, processing, errors } = useForm({
        description: '',
        type: 'standard',
        weight_kg: '',
        length_cm: '',
        width_cm: '',
        height_cm: '',
        value_cents: '',
        declared_value_cents: '',
        requires_signature: false,
        is_fragile: false,
        is_hazardous: false,
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('packages.store', { company: currentCompany.slug }), {
            transform: (data) => ({
                ...data,
                requires_signature: data.requires_signature ? 1 : 0,
                is_fragile: data.is_fragile ? 1 : 0,
                is_hazardous: data.is_hazardous ? 1 : 0,
            }),
        } as any);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-slate-800">
                        Nouveau Colis
                    </h2>
                    <Link href={route('packages.index', { company: currentCompany.slug })}>
                        <Button variant="outline">
                            Retour
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Nouveau Colis" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Info message */}
                            <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                                <div className="flex items-start">
                                    <Icons.Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-medium mb-1">ℹ️ Le numéro de suivi sera généré automatiquement</p>
                                        <p className="text-blue-700">Le colis sera associé à une livraison lors de sa création.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Informations de base */}
                            <div>
                                <h3 className="text-lg font-medium text-slate-900 mb-4">
                                    Informations de base
                                </h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <FormInput
                                        label="Description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        error={errors.description}
                                        placeholder="Description du colis"
                                    />
                                    <FormSelect
                                        label="Type"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        error={errors.type}
                                        required
                                        options={[
                                            { value: 'standard', label: 'Standard' },
                                            { value: 'fragile', label: 'Fragile' },
                                            { value: 'perishable', label: 'Périssable' },
                                            { value: 'document', label: 'Document' },
                                        ]}
                                    />
                                </div>
                            </div>

                            {/* Dimensions et poids */}
                            <div>
                                <h3 className="text-lg font-medium text-slate-900 mb-4">
                                    Dimensions et poids
                                </h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
                                    <FormInput
                                        label="Longueur (cm)"
                                        type="number"
                                        step="0.01"
                                        value={data.length_cm}
                                        onChange={(e) => setData('length_cm', e.target.value)}
                                        error={errors.length_cm}
                                        placeholder="0.00"
                                    />
                                    <FormInput
                                        label="Largeur (cm)"
                                        type="number"
                                        step="0.01"
                                        value={data.width_cm}
                                        onChange={(e) => setData('width_cm', e.target.value)}
                                        error={errors.width_cm}
                                        placeholder="0.00"
                                    />
                                    <FormInput
                                        label="Hauteur (cm)"
                                        type="number"
                                        step="0.01"
                                        value={data.height_cm}
                                        onChange={(e) => setData('height_cm', e.target.value)}
                                        error={errors.height_cm}
                                        placeholder="0.00"
                                    />
                                    <FormInput
                                        label="Poids (kg)"
                                        type="number"
                                        step="0.01"
                                        value={data.weight_kg}
                                        onChange={(e) => setData('weight_kg', e.target.value)}
                                        error={errors.weight_kg}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Valeur */}
                            <div>
                                <h3 className="text-lg font-medium text-slate-900 mb-4">
                                    Valeur
                                </h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <FormInput
                                        label="Valeur (centimes)"
                                        type="number"
                                        value={data.value_cents}
                                        onChange={(e) => setData('value_cents', e.target.value)}
                                        error={errors.value_cents}
                                        placeholder="0"
                                        helperText="Valeur en centimes (ex: 5000 = 50,00 €)"
                                    />
                                    <FormInput
                                        label="Valeur déclarée (centimes)"
                                        type="number"
                                        value={data.declared_value_cents}
                                        onChange={(e) => setData('declared_value_cents', e.target.value)}
                                        error={errors.declared_value_cents}
                                        placeholder="0"
                                        helperText="Valeur déclarée en centimes"
                                    />
                                </div>
                            </div>

                            {/* Options */}
                            <div>
                                <h3 className="text-lg font-medium text-slate-900 mb-4">
                                    Options
                                </h3>
                                <div className="space-y-3">
                                    <FormCheckbox
                                        label="Signature requise"
                                        description="Le destinataire doit signer à la réception"
                                        checked={data.requires_signature}
                                        onChange={(e) => setData('requires_signature', e.target.checked)}
                                    />
                                    <FormCheckbox
                                        label="Fragile"
                                        description="Colis fragile nécessitant une manipulation délicate"
                                        checked={data.is_fragile}
                                        onChange={(e) => setData('is_fragile', e.target.checked)}
                                    />
                                    <FormCheckbox
                                        label="Matière dangereuse"
                                        description="Contient des matières dangereuses ou réglementées"
                                        checked={data.is_hazardous}
                                        onChange={(e) => setData('is_hazardous', e.target.checked)}
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <FormTextarea
                                    label="Notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    error={errors.notes}
                                    rows={4}
                                    placeholder="Notes supplémentaires..."
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-4 pt-4 border-t">
                                <Link href={route('packages.index', { company: currentCompany.slug })}>
                                    <Button variant="outline" type="button">
                                        Annuler
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing} loading={processing}>
                                    Créer le colis
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
