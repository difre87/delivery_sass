# Migration TypeScript

Ce projet a été migré vers TypeScript pour améliorer la sécurité des types et l'expérience de développement.

## Structure des types

### Types principaux (`resources/js/types/index.ts`)
- **User** : Type pour les utilisateurs
- **Company** : Type pour les entreprises
- **Client, Driver, Vehicle, Shipment** : Types pour les entités métier
- **PageProps** : Type pour les props Inertia avec auth, flash, errors
- **PaginatedData<T>** : Type générique pour les données paginées

### Types des composants (`resources/js/types/components.ts`)
- **IconProps** : Props pour les composants d'icônes SVG
- **ButtonProps** : Props pour les boutons avec variants
- **FormInputProps, FormSelectProps, FormTextareaProps** : Props pour les formulaires
- **ModalProps, AlertProps, BadgeProps** : Props pour les composants UI
- **DataTableColumn, DataTableProps** : Props pour les tables de données

### Hooks typés (`resources/js/hooks/usePage.ts`)
```typescript
import { useAuth, useUser, useCurrentCompany, useFlash, useErrors } from '@/hooks/usePage';

// Utilisation
const auth = useAuth();
const user = useUser();
const company = useCurrentCompany();
const flash = useFlash();
const errors = useErrors();
```

## Configuration

### tsconfig.json
- **strict**: false (mode progressif pour faciliter la migration)
- **jsx**: "react-jsx" (support JSX natif)
- **allowJs**: true (permet de mélanger JS et TS pendant la migration)
- **Path aliases**: `@/*` pointe vers `resources/js/*`

### Fichiers de configuration
- `tsconfig.json` : Configuration principale
- `tsconfig.app.json` : Configuration pour l'application
- `tsconfig.node.json` : Configuration pour Vite
- `resources/js/types/global.d.ts` : Déclarations globales (window, route)

## Migration progressive

Tous les fichiers `.jsx` ont été renommés en `.tsx`, mais le mode `strict` est désactivé pour permettre une migration progressive. Vous pouvez progressivement ajouter des types plus stricts :

### Exemple de migration d'un composant

**Avant (JSX):**
```jsx
export default function Button({ children, onClick }) {
    return <button onClick={onClick}>{children}</button>;
}
```

**Après (TSX):**
```tsx
import { ButtonProps } from '@/types/components';

export default function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
    return (
        <button 
            onClick={onClick}
            className={`btn btn-${variant}`}
        >
            {children}
        </button>
    );
}
```

## Avantages

✅ **Autocomplétion améliorée** dans VS Code
✅ **Détection d'erreurs à la compilation** au lieu du runtime
✅ **Documentation inline** avec les types
✅ **Refactoring plus sûr** avec la détection des usages
✅ **IntelliSense** pour les props des composants
✅ **Types pour les données Laravel** (User, Company, etc.)

## Commandes

```bash
# Build de production
npm run build

# Mode développement
npm run dev

# Vérification des types
npx tsc --noEmit
```

## Notes

- Les warnings de duplicate keys dans `Icons.tsx` sont connus et n'empêchent pas le build
- Le mode `strict: false` permet d'utiliser `any` temporairement pendant la migration
- Tous les nouveaux composants doivent être créés en `.tsx` avec des types appropriés
