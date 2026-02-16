# Configuration Google Maps pour le Tracking GPS

## 📍 Obtenir une clé API Google Maps

### 1. Créer un projet Google Cloud

1. Accédez à [Google Cloud Console](https://console.cloud.google.com/)
2. Cliquez sur le sélecteur de projet en haut à gauche
3. Cliquez sur "Nouveau projet"
4. Donnez un nom à votre projet (ex: "Delivery SaaS")
5. Cliquez sur "Créer"

### 2. Activer les APIs nécessaires

1. Dans le menu de navigation, allez à **APIs et Services > Bibliothèque**
2. Activez les APIs suivantes :
   - **Maps JavaScript API** (pour afficher la carte)
   - **Geocoding API** (optionnel : pour convertir coordonnées → adresses)
   - **Directions API** (optionnel : pour calculer les itinéraires)
   - **Distance Matrix API** (optionnel : pour calculer les distances)

### 3. Créer une clé API

1. Dans le menu, allez à **APIs et Services > Identifiants**
2. Cliquez sur **+ CRÉER DES IDENTIFIANTS**
3. Sélectionnez **Clé API**
4. Copiez la clé API générée

### 4. Sécuriser votre clé API (IMPORTANT)

1. Cliquez sur le nom de votre clé API
2. Sous **Restrictions de l'application**, sélectionnez :
   - **Référents HTTP (sites web)**
3. Ajoutez vos domaines autorisés :
   ```
   http://localhost:5173/*
   http://localhost/*
   https://votre-domaine.com/*
   ```
4. Sous **Restrictions liées aux API**, sélectionnez :
   - **Limiter la clé aux API sélectionnées**
   - Cochez : Maps JavaScript API
5. Cliquez sur **Enregistrer**

### 5. Configuration Laravel

1. Ouvrez le fichier `.env` à la racine du projet
2. Ajoutez votre clé API :
   ```bash
   VITE_GOOGLE_MAPS_API_KEY=AIzaSy...votre-cle-ici
   ```
3. Redémarrez le serveur Vite :
   ```bash
   npm run dev
   ```

## 🗺️ Utilisation

Une fois configuré, accédez à **Tracking GPS** dans le menu de navigation pour voir la carte interactive avec vos véhicules en temps réel.

### Fonctionnalités de la carte

- ✅ **Marqueurs animés** : Les véhicules en mouvement ont une animation pulsante
- ✅ **InfoWindows** : Cliquez sur un marqueur pour voir les détails
- ✅ **Couleurs de statut** :
  - 🟢 Vert : En mouvement
  - 🟡 Ambre : Arrêté
  - 🔵 Bleu : Au ralenti
  - ⚪ Gris : Hors ligne
- ✅ **Auto-centrage** : Sélection d'un véhicule centre la carte
- ✅ **Zoom et contrôles** : Navigation complète de la carte

## 💰 Tarification Google Maps

- **200 $ de crédit gratuit/mois** (environ 28 000 chargements de carte)
- Au-delà : 7 $ pour 1000 chargements
- [Détails de la tarification](https://mapsplatform.google.com/pricing/)

## 🔧 Dépannage

### La carte n'apparaît pas

1. Vérifiez que la clé API est correctement configurée dans `.env`
2. Assurez-vous que `VITE_GOOGLE_MAPS_API_KEY` commence bien par `VITE_`
3. Redémarrez le serveur Vite : `npm run dev`
4. Vérifiez la console du navigateur pour les erreurs

### Erreur "RefererNotAllowedMapError"

- Vérifiez que votre domaine est autorisé dans les restrictions de la clé API
- Ajoutez `http://localhost:5173/*` dans les référents HTTP

### Erreur "This API project is not authorized"

- Vérifiez que Maps JavaScript API est activée dans votre projet Google Cloud
- Attendez quelques minutes après l'activation (propagation)

## 📚 Documentation

- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [React Google Maps API](https://react-google-maps-api-docs.netlify.app/)
