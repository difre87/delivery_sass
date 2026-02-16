# Routes Multi-Tenant - Corrections Nécessaires

## Problème Identifié
Toutes les routes sont préfixées par `{company}` dans `web.php`, mais la plupart des fichiers frontend n'incluent pas ce paramètre lors de l'appel avec `route()`.

## Routes Backend (web.php) - CORRECT ✅
```php
Route::prefix('{company}')->middleware(['company-slug'])->group(function () {
    // Toutes les routes ont le format: {company}/resource/{id}
    Route::get('/invoices/{invoiceId}', ...)->name('invoices.show');
    Route::get('/waybills/{waybillId}', ...)->name('waybills.show');
    Route::post('/switch-branch/{branchId}', ...)->name('branch.switch');
});
```

## Fichiers Frontend à Corriger

### ✅ DÉJÀ CORRIGÉS:
1. `resources/js/Pages/Invoices/Index.tsx` - ✅ Inclut `company` + `invoiceId`
2. `resources/js/Pages/Invoices/Show.tsx` - ✅ Inclut `company` + `invoiceId`
3. `resources/js/Pages/Waybills/Index.tsx` - ✅ Inclut `company` + `waybillId`
4. `resources/js/Pages/Waybills/Show.tsx` - ✅ Inclut `company` + `waybillId`
5. `resources/js/Components/BranchSwitcher.tsx` - ✅ Inclut `company` + `branchId`

### ❌ À CORRIGER:

#### 1. `resources/js/Pages/Invoices/Create.tsx`
**Lignes à modifier:**
- Ligne ~1-2: Ajouter `usePage` dans les imports
- Ligne ~11-12: Ajouter extraction de `currentCompany`
- Ligne ~75: `post(route('invoices.store'))` → `post(route('invoices.store', { company: currentCompany.slug }))`
- Ligne ~336: `route('invoices.index')` → `route('invoices.index', { company: currentCompany.slug })`

#### 2. `resources/js/Pages/Waybills/Create.tsx`
**DÉJÀ CORRIGÉ** ✅ lors de la dernière session

#### 3. Tous les autres fichiers qui utilisent des routes
Chercher tous les fichiers avec: `route('invoices.` ou `route('waybills.` ou `route('branch.`

## Pattern de Correction Standard

### 1. Dans les imports:
```tsx
import { Head, router, usePage } from '@inertiajs/react';
```

### 2. Au début du composant:
```tsx
export default function MonComposant({ props }) {
    const page = usePage<any>();
    const { currentCompany } = page.props.auth;
    // ... reste du code
}
```

### 3. Dans les appels route():
```tsx
// ❌ INCORRECT:
route('invoices.show', invoiceId)
route('waybills.store')
route('branch.switch', branchId)

// ✅ CORRECT:
route('invoices.show', { company: currentCompany.slug, invoiceId: invoiceId })
route('waybills.store', { company: currentCompany.slug })
route('branch.switch', { company: currentCompany.slug, branchId: branchId })
```

## Commandes à Exécuter Après Corrections

```bash
# 1. Nettoyer tous les caches
php artisan optimize:clear

# 2. Recacher les routes
php artisan route:cache

# 3. Régénérer Ziggy
php artisan ziggy:generate

# 4. Rebuild frontend
npm run build

# 5. Hard refresh navigateur
# Chrome/Firefox Mac: Cmd + Shift + R
# Chrome/Firefox Windows: Ctrl + Shift + R
```

## Vérification Finale

Après corrections, vérifier que Ziggy contient bien les bons paramètres:
```bash
grep "invoices.show" resources/js/ziggy.js
# Devrait afficher: "parameters":["company","invoiceId"]

grep "waybills.show" resources/js/ziggy.js  
# Devrait afficher: "parameters":["company","waybillId"]

grep "branch.switch" resources/js/ziggy.js
# Devrait afficher: "parameters":["company","branchId"]
```
