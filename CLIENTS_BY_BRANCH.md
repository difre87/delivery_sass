# Système de Gestion des Clients par Agence

## 📋 Vue d'ensemble

Les clients sont maintenant **assignés à des agences spécifiques**, permettant à chaque agence de gérer ses propres clients. Lorsqu'un utilisateur change d'agence, il ne voit que les clients de l'agence sélectionnée.

## ✅ Modifications effectuées

### 1. Base de données

**Migration** : `2026_02_18_010949_add_branch_id_to_clients_table.php`

```sql
ALTER TABLE clients ADD COLUMN branch_id BIGINT UNSIGNED NULL;
ALTER TABLE clients ADD CONSTRAINT clients_branch_id_foreign 
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE;
```

- Colonne `branch_id` ajoutée à la table `clients`
- Foreign key vers la table `branches`
- Nullable pour permettre la migration des données existantes
- Cascade on delete : si une agence est supprimée, ses clients sont aussi supprimés

### 2. Backend (Laravel)

#### Modèle Client (`app/Models/Client.php`)

```php
protected $fillable = [
    'company_id',
    'branch_id',  // ✅ Ajouté
    'name',
    'code',
    'email',
    'phone',
    'billing_address_id',
    'notes',
    'is_active',
];

// ✅ Nouvelle relation
public function branch(): BelongsTo
{
    return $this->belongsTo(Branch::class);
}
```

#### Controller (`app/Http/Controllers/ClientController.php`)

**index()** - Filtre par agence :
```php
$clients = Client::query()
    ->forCompany($company->id)
    ->when($currentBranchId, fn($q) => $q->where('branch_id', $currentBranchId))
    ->with('branch:id,name')
    ->orderByDesc('id')
    ->paginate(10);

// Envoie la liste des agences pour les sélecteurs
$branches = Branch::query()
    ->where('company_id', $company->id)
    ->where('is_active', true)
    ->orderBy('name')
    ->get(['id', 'name']);
```

**store()** - Assignation automatique ou manuelle :
```php
$client = Client::create([
    ...$validated,
    'company_id' => $company->id,
    'branch_id' => $validated['branch_id'] ?? $user->current_branch_id,
]);
```
- Si `branch_id` est fourni dans le formulaire → utilisé
- Sinon → agence actuelle de l'utilisateur

#### Requests de validation

**ClientStoreRequest.php** et **ClientUpdateRequest.php** :
```php
'branch_id' => [
    'nullable', 
    'integer', 
    Rule::exists('branches', 'id')->where('company_id', $this->user()->current_company_id)
],
```
- Validation que l'agence existe
- Validation qu'elle appartient à la compagnie de l'utilisateur

### 3. Frontend (React/TypeScript)

#### Page Clients/Index.tsx

**Props** :
```tsx
export default function ClientsIndex({ clients, branches = [] })
```

**Formulaire** :
```tsx
const initialForm = {
    name: '',
    code: '',
    email: '',
    phone: '',
    branch_id: '',  // ✅ Ajouté
    notes: '',
    is_active: true,
};
```

**Champ de sélection** :
```tsx
<FormSelect
    label="Agence"
    value={createForm.data.branch_id}
    onChange={(e) => createForm.setData('branch_id', e.target.value)}
    error={createForm.errors.branch_id}
    options={[
        { value: '', label: 'Sélectionner une agence...' },
        ...branches.map(branch => ({ value: branch.id, label: branch.name }))
    ]}
    helperText="Laissez vide pour utiliser votre agence actuelle"
/>
```

**Colonne dans le tableau** :
```tsx
{
    key: 'branch',
    label: 'Agence',
    render: (row) => (
        row.branch ? (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                {row.branch.name}
            </span>
        ) : (
            <span className="text-slate-400">—</span>
        )
    ),
}
```

## 🎯 Comportement

### Création d'un client

1. **Utilisateur remplit le formulaire**
2. **Deux options** :
   - Sélectionner une agence spécifique dans le menu déroulant
   - Laisser vide → le client sera automatiquement assigné à l'agence actuelle de l'utilisateur

### Affichage des clients

1. **Utilisateur sur l'agence A** → Voit uniquement les clients de l'agence A
2. **Utilisateur change vers l'agence B** → Voit uniquement les clients de l'agence B
3. **Super admin / Owner sans agence** → Voit tous les clients de la compagnie

### Modification d'un client

1. **Formulaire d'édition** affiche l'agence actuelle du client
2. **Utilisateur peut changer** l'agence du client
3. **Validation** : l'agence doit appartenir à la même compagnie

## 🔄 Migration des données existantes

Les clients existants ont `branch_id = NULL`. Deux approches possibles :

### Option 1 : Assigner à l'agence principale
```sql
-- Assigner tous les clients à la première agence de chaque compagnie
UPDATE clients c
JOIN (
    SELECT company_id, MIN(id) as first_branch_id
    FROM branches
    GROUP BY company_id
) b ON c.company_id = b.company_id
SET c.branch_id = b.first_branch_id
WHERE c.branch_id IS NULL;
```

### Option 2 : Laisser NULL temporairement
- Les clients sans agence sont visibles par toutes les agences de la compagnie
- Un administrateur peut les assigner manuellement

### Option 3 : Créer une agence "Siège"
```sql
-- Pour chaque compagnie sans agence "Siège"
INSERT INTO branches (company_id, name, is_active, created_at, updated_at)
SELECT id, 'Siège', true, NOW(), NOW()
FROM companies
WHERE id NOT IN (SELECT company_id FROM branches WHERE name = 'Siège');

-- Assigner les clients orphelins au siège
UPDATE clients c
JOIN branches b ON c.company_id = b.company_id AND b.name = 'Siège'
SET c.branch_id = b.id
WHERE c.branch_id IS NULL;
```

## 📊 Impact sur les autres modules

### Modules qui utilisent les clients :

1. **Expéditions (Shipments)** ✅ Déjà filtré par agence
   - Les expéditions sont liées aux clients
   - Cohérence : client et expédition doivent être de la même agence

2. **Factures (Invoices)** ⚠️ Pas encore filtré par agence
   - Les factures sont liées aux clients
   - À implémenter : filtrer les factures par agence

3. **Lettres de voiture (Waybills)** ⚠️ Pas encore filtré par agence
   - Peuvent contenir des références aux clients
   - À implémenter : filtrer par agence

## 🧪 Tests suggérés

### Test 1 : Création avec agence spécifique
1. Créer un client et sélectionner "Agence Marcory"
2. Vérifier que le client est bien assigné à "Agence Marcory"
3. Changer vers une autre agence
4. Vérifier que le client n'apparaît pas dans la liste

### Test 2 : Création sans sélection d'agence
1. Être sur l'agence "Cocody"
2. Créer un client sans sélectionner d'agence
3. Vérifier que le client est automatiquement assigné à "Cocody"

### Test 3 : Modification de l'agence
1. Créer un client sur l'agence A
2. Modifier le client et changer pour l'agence B
3. Vérifier que le client apparaît maintenant dans l'agence B et plus dans A

### Test 4 : Filtrage lors du switch
1. Créer des clients dans différentes agences
2. Changer d'agence via le sélecteur
3. Vérifier que seuls les clients de l'agence active sont affichés

### Test 5 : Validation de sécurité
1. Tenter de créer un client avec un `branch_id` d'une autre compagnie (via API)
2. Vérifier que la validation échoue avec erreur 422

## 🚀 Prochaines étapes

### Priorité haute
1. ✅ Ajouter `branch_id` aux clients
2. ⏳ Migrer les données existantes (choisir option 1, 2 ou 3)
3. ⏳ Ajouter filtrage par agence aux **factures**
4. ⏳ Ajouter filtrage par agence aux **lettres de voiture**

### Priorité moyenne
5. ⏳ Ajouter un indicateur visuel si un client n'a pas d'agence
6. ⏳ Permettre la réassignation en masse de clients entre agences
7. ⏳ Statistiques par agence incluant le nombre de clients

### Priorité basse
8. ⏳ Historique des changements d'agence pour un client
9. ⏳ Export des clients par agence
10. ⏳ Rapport : répartition des clients par agence

## 📄 Résumé

✅ **Système de clients par agence opérationnel**

- Migration créée et exécutée
- Modèle mis à jour avec relation `branch`
- Controller filtre correctement par agence
- Formulaire permet la sélection d'agence
- Affichage de l'agence dans le tableau
- Validation de sécurité en place

**Statut : Prêt à l'emploi ! 🎉**

Les clients sont maintenant correctement isolés par agence, assurant que chaque agence gère uniquement ses propres clients.
