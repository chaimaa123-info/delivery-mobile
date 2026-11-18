📦 Delivery Management Mobile App
Application mobile de gestion de livraison de colis développée dans le cadre d’un Projet de Fin d’Études (PFE).
Elle permet aux livreurs de consulter leurs tournées, suivre les colis à livrer et mettre à jour le statut des livraisons, avec une intégration à Odoo ERP via API REST.

🚀 Fonctionnalités
Authentification des utilisateurs (livreurs).

Consultation des tournées de livraison.

Affichage des colis à livrer.

Mise à jour du statut de livraison.

Suivi en temps réel des colis via Odoo ERP.

Communication avec l’API Odoo via REST.

Interface mobile compatible Android et iOS.

Design simple et adapté à une utilisation terrain.

🛠️ Technologies utilisées
React Native

JavaScript / TypeScript

Odoo ERP

API REST

Postman

Git / GitHub

Visual Studio Code

📱 Aperçu de l’application
Ajoute ici 2 ou 3 captures d’écran de ton application pour rendre le README plus attractif.

md
![Login Screen](screenshots/login.png)
![Delivery List](screenshots/delivery-list.png)
![Parcel Details](screenshots/parcel-details.png)
⚙️ Installation
Prérequis
Avant de lancer le projet, assure-toi d’avoir installé :

Node.js

npm ou yarn

Expo CLI (si tu utilises Expo)

Android Studio / émulateur Android

Xcode (pour iOS, si tu es sur Mac)

Un serveur Odoo accessible avec API REST activée

Étapes d’installation
bash
git clone https://github.com/ton-username/delivery-management-app.git
cd delivery-management-app
npm install
▶️ Lancement du projet
Si le projet utilise Expo :

bash
npx expo start
Si tu utilises React Native CLI :

bash
npx react-native run-android
npx react-native run-ios
🔗 Configuration de l’API
Dans le fichier de configuration du projet, renseigne l’URL de ton serveur Odoo :

env
API_BASE_URL=http://localhost:8069
Adapte cette valeur selon l’adresse réelle de ton serveur Odoo.

🧭 Utilisation
Le livreur se connecte à l’application.

Il consulte la liste de ses tournées.

Il accède aux détails des colis à livrer.

Il met à jour le statut de chaque livraison.

Les données sont synchronisées avec Odoo ERP via l’API REST.

🧱 Structure du projet
bash
src/
 ├── components/      # Composants réutilisables
 ├── screens/         # Écrans de l’application
 ├── navigation/      # Navigation entre les écrans
 ├── services/        # Appels API et logique métier
 ├── utils/           # Fonctions utilitaires
 └── assets/          # Images, icônes, polices
🎯 Objectifs du projet
Digitaliser le processus de livraison.

Améliorer la traçabilité des colis.

Simplifier le travail des livreurs.

Réduire les erreurs de traitement.

Centraliser les informations dans un système fiable.

👩‍💻 Rôle personnel
Dans le cadre de ce projet, j’ai participé à :

L’analyse du besoin fonctionnel.

La conception de l’application mobile.

Le développement des écrans principaux.

L’intégration avec l’API REST d’Odoo.

Les tests fonctionnels de l’application.

📈 Améliorations possibles
Intégration du scan de code-barres.

Ajout de la géolocalisation.

Notifications push pour les livreurs.

Historique détaillé des livraisons.

Tableau de bord analytique.

Mode hors ligne.

🤝 Contribution
Les contributions sont les bienvenues.
Si vous souhaitez améliorer ce projet :

Forkez le dépôt.

Créez une branche dédiée.

Proposez vos modifications via une Pull Request.

📄 Licence
Ce projet est développé dans un cadre académique.

👤 Auteur
Chaimaa Hajib
GitHub : chaimaa123-info
Email : chaimaahajib056@gmail.com