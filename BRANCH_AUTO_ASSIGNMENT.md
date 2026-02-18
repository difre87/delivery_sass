# Assignation Automatique de l'Agence (Branch Auto-Assignment)

## 🎯 Principe

Quand un utilisateur **sélectionne une agence** via le **BranchSwitcher**, TOUS les enregistrements qu'il crée sont **automatiquement assignés à cette agence** sans qu'il ait besoin de la sélectionner manuellement dans chaque formulaire.

## ✅ Avantages

1. **UX améliorée** : Pas besoin de sélectionner l'agence à chaque fois
2. **Cohérence** : Tous les enregistrements sont dans la bonne agence
3. **Moins d'erreurs** : Impossible d'oublier de sélectionner l'agence
4. **Logique métier** : L'agence active = contexte de travail

## 🔧 Implémentation

### 1. Trait réutilisable : `AutoAssignsBranch`

**Fichier** : `app/Http/Controllers/Concerns/AutoAssignsBranch.php`

```php
trait AutoAssignsBranch
{
    /**
     * Assigne automatiquement le branch_id
     */
    protected function withBranchId(array $data, Request $request): array
    {
        $user = $request->user();
        
        return array_merge($data, [
            'branch_id' => $user->current_branch_id,
        ]);
    }

    /**
     * Assigne automatiquement company_id ET branch_id
     */
    protected function withCompanyAndBranch(array $data, Request $request): array
    {
        $user = $request->user();
        $company = $user->currentCompany;
        
        return array_merge($data, [
            'company_id' => $company->id,
            'branch_id' => $user->current_branch_id,
        ]);
    }
}
```

### 2. Utilisation dans les Controllers

**Exemple avec ClientController** :

```php
use App\Http\Controllers\Concerns\AutoAssignsBranch;

class ClientController extends Controller
{
    use LogsActivity, AutoAssignsBranch;

    public function store(ClientStoreRequest $request): RedirectResponse
    {
        $company = $request->user()->currentCompany;

        // ✅ Assignation automatique de company_id et branch_id
        $client = Client::create(
            $this->withCompanyAndBranch($request->validated(), $request)
        );

        return redirect()->route('clients.index', ['company' => $company->slug])
            ->with('status', 'Client créé avec succès.');
    }
}
```

### 3. Simplification des Forms

**AVANT** ❌ (mauvais) :
```tsx
const initialForm = {
    name: '',
    email: '',
    branch_id: '', // ❌ L'utilisateur doit choisir
};

<FormSelect
    label="Agence"
    value={form.data.branch_id}
    onChange={(e) => form.setData('branch_id', e.target.value)}
    options={branches}
    required // ❌ Champ obligatoire
/>
```

**APRÈS** ✅ (bon) :
```tsx
const initialForm = {
    name: '',
    email: '',
    // ✅ Pas de branch_id dans le form de création
};

// ✅ Pas de champ de sélection d'agence
// L'agence est automatiquement celle du BranchSwitcher
```

### 4. Édition : Exception à la règle

Pour l'**édition**, on GARDE le champ `branch_id` pour permettre de **corriger des erreurs** :

```tsx
const initialEditForm = {
    name: '',
    email: '',
    branch_id: '', // ✅ Gardé pour correction
};

// Formulaire d'édition
<FormSelect
    label="Agence"
    value={editForm.data.branch_id}
    onChange={(e) => editForm.setData('branch_id', e.target.value)}
    options={branches}
    helperText="Vous pouvez réassigner ce client à une autre agence"
/>
```

## 📊 Modules à mettre à jour

### ✅ Déjà fait
- **Clients** : Assignation automatique implémentée

### ⏳ À faire (même pattern)

1. **Expéditions (Shipments)** ✅ Déjà filtré, mais vérifier l'assignation
2. **Colis (Packages)** ✅ Déjà filtré, mais vérifier l'assignation
3. **Chauffeurs (Drivers)** ✅ Déjà filtré, mais vérifier l'assignation
4. **Véhicules (Vehicles)** ✅ Déjà filtré, mais vérifier l'assignation
5. **Factures (Invoices)** ⚠️ À implémenter
6. **Lettres de voiture (Waybills)** ⚠️ À implémenter
7. **Courses (DispatchRuns)** ⚠️ À implémenter
8. **Carburant (FuelLogs)** ⚠️ À implémenter

## 🔄 Workflow utilisateur

### Scénario typique :

1. **Utilisateur se connecte**
   - Agence par défaut : "Cocody"
   - `current_branch_id` = 5

2. **Utilisateur créé un client**
   - Formulaire : Nom, Email, Téléphone
   - ❌ PAS de sélection d'agence
   - Backend : `branch_id` = 5 (automatique)
   - ✅ Client créé dans "Cocody"

3. **Utilisateur switch vers "Marcory"**
   - BranchSwitcher : sélectionne "Marcory"
   - `current_branch_id` = 8
   - Liste clients : Affiche uniquement clients de "Marcory"

4. **Utilisateur créé un autre client**
   - Formulaire : Nom, Email, Téléphone
   - Backend : `branch_id` = 8 (automatique)
   - ✅ Client créé dans "Marcory"

5. **Utilisateur veut corriger une erreur**
   - Ouvre le formulaire d'édition
   - Voit : Agence = "Marcory"
   - Change vers : "Cocody"
   - ✅ Client réassigné

## 🎨 Interface utilisateur

### Indicateur visuel de l'agence active

Ajouter dans le header ou près du BranchSwitcher :

```tsx
<div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5">
    <Icons.MapPin className="h-4 w-4 text-blue-600" />
    <span className="text-sm font-medium text-blue-900">
        Agence active : {currentBranch.name}
    </span>
</div>
```

### Message informatif (optionnel)

Dans les formulaires de création :

```tsx
<div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
    <Icons.Info className="inline h-4 w-4 mr-1" />
    Ce client sera automatiquement créé dans l'agence <strong>{currentBranch.name}</strong>
</div>
```

## 🛡️ Sécurité et validation

### Backend validation

**NE PAS** accepter `branch_id` depuis le formulaire de création :

```php
// ClientStoreRequest.php
public function rules(): array
{
    return [
        'name' => ['required', 'string', 'max:255'],
        'email' => ['nullable', 'email'],
        // ❌ PAS de branch_id ici
    ];
}
```

**ACCEPTER** `branch_id` dans l'édition avec validation :

```php
// ClientUpdateRequest.php
public function rules(): array
{
    return [
        'name' => ['required', 'string', 'max:255'],
        'email' => ['nullable', 'email'],
        'branch_id' => [
            'nullable', 
            'integer', 
            Rule::exists('branches', 'id')
                ->where('company_id', $this->user()->current_company_id)
        ],
    ];
}
```

### Vérification de sécurité

```php
// Toujours vérifier que le branch_id appartient à la company
Rule::exists('branches', 'id')
    ->where('company_id', $user->current_company_id)
```

## 🧪 Tests

### Test 1 : Création automatique
```php
test('client is created with current branch', function () {
    $user = User::factory()->create();
    $branch = Branch::factory()->create(['company_id' => $user->current_company_id]);
    $user->update(['current_branch_id' => $branch->id]);

    $this->actingAs($user)
        ->post(route('clients.store'), [
            'name' => 'Test Client',
            'email' => 'test@example.com',
        ]);

    $this->assertDatabaseHas('clients', [
        'name' => 'Test Client',
        'branch_id' => $branch->id, // ✅ Assignation automatique
    ]);
});
```

### Test 2 : Switch et création
```php
test('client is created in new branch after switch', function () {
    $user = User::factory()->create();
    $branchA = Branch::factory()->create(['company_id' => $user->current_company_id, 'name' => 'Branch A']);
    $branchB = Branch::factory()->create(['company_id' => $user->current_company_id, 'name' => 'Branch B']);
    
    $user->update(['current_branch_id' => $branchA->id]);

    // Créer un client dans Branch A
    $this->actingAs($user)->post(route('clients.store'), ['name' => 'Client A']);
    $this->assertDatabaseHas('clients', ['name' => 'Client A', 'branch_id' => $branchA->id]);

    // Switch vers Branch B
    $user->update(['current_branch_id' => $branchB->id]);

    // Créer un client dans Branch B
    $this->actingAs($user)->post(route('clients.store'), ['name' => 'Client B']);
    $this->assertDatabaseHas('clients', ['name' => 'Client B', 'branch_id' => $branchB->id]);
});
```

### Test 3 : Édition avec changement d'agence
```php
test('client can be reassigned to another branch', function () {
    $user = User::factory()->create();
    $branchA = Branch::factory()->create(['company_id' => $user->current_company_id]);
    $branchB = Branch::factory()->create(['company_id' => $user->current_company_id]);
    
    $client = Client::factory()->create([
        'company_id' => $user->current_company_id,
        'branch_id' => $branchA->id,
    ]);

    $this->actingAs($user)
        ->patch(route('clients.update', $client), [
            'name' => $client->name,
            'branch_id' => $branchB->id,
        ]);

    $this->assertDatabaseHas('clients', [
        'id' => $client->id,
        'branch_id' => $branchB->id, // ✅ Réassigné
    ]);
});
```

## 📝 Checklist pour chaque module

Pour implémenter l'assignation automatique dans un module :

- [ ] Ajouter la colonne `branch_id` (si pas déjà fait)
- [ ] Ajouter `branch_id` au `$fillable` du modèle
- [ ] Ajouter la relation `branch()` au modèle
- [ ] Ajouter `use AutoAssignsBranch` dans le controller
- [ ] Utiliser `withCompanyAndBranch()` dans `store()`
- [ ] Filtrer par `current_branch_id` dans `index()`
- [ ] **RETIRER** `branch_id` du formulaire de création
- [ ] **GARDER** `branch_id` dans le formulaire d'édition
- [ ] **RETIRER** validation de `branch_id` dans StoreRequest
- [ ] **GARDER** validation de `branch_id` dans UpdateRequest
- [ ] Tester création, édition, switch d'agence

## 🎉 Résumé

**L'agence sélectionnée dans le BranchSwitcher = Contexte de travail**

✅ Création : Assignation automatique (pas de champ)
✅ Affichage : Filtrage automatique par agence
✅ Édition : Possibilité de réassigner (avec champ)
✅ Sécurité : Validation que l'agence appartient à la company

**Résultat** : UX fluide, moins d'erreurs, code plus propre ! 🚀
