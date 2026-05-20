# FreeGeny Elite — Modern Stack (Next.js 15)

Bienvenue sur le dépôt de **FreeGeny Elite**, la plateforme éducative d'excellence de nouvelle génération. Le projet a été entièrement migré d'une stack PHP historique vers une architecture moderne et robuste en **Next.js 15**, **TypeScript**, **React 19**, et **Drizzle ORM**.

---

## 🚀 Stack Technique

* **Framework** : [Next.js 15 (App Router)](https://nextjs.org/)
* **Bibliothèque UI** : [React 19](https://react.dev/)
* **Langage** : [TypeScript](https://www.typescriptlang.org/)
* **ORM** : [Drizzle ORM](https://orm.drizzle.team/)
* **Base de données** : PostgreSQL / MySQL
* **Gestion des Langues (i18n)** : [next-intl](https://next-intl-docs.vercel.app/) (Support complet Arabe (ar) RTL, Français (fr) LTR, Anglais (en) LTR)
* **Styling & Animations** : Vanilla CSS, TailwindCSS, Framer Motion et Lottie Animations

---

## 🛠️ Installation & Démarrage en Local

### 1. Prérequis
Assurez-vous d'avoir installé :
* **Node.js** (v18.x ou supérieure)
* **npm** ou **yarn** / **pnpm**
* Un serveur de base de données (PostgreSQL ou MySQL)

### 2. Configuration de l'environnement
Allez dans le dossier `web/` et copiez le fichier d'exemple pour créer votre configuration locale :
```bash
cd web
cp .env.example .env.local
```
Remplissez les variables d'environnement requises (`DATABASE_URL`, `NEXTAUTH_SECRET`, etc.).

### 3. Installation des Dépendances
Installez tous les paquets nécessaires :
```bash
npm install
```

### 4. Lancement du Serveur de Développement
Démarrez le serveur local :
```bash
npm run dev
```
L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

### 5. Peupler la Base de Données (Seeds)
Pour importer les données initiales des écoles de chaque région :
```bash
# Données générales
npm run db:seed

# Données spécifiques à la France
npm run db:seed:fr
```

---

## 🌍 Fonctionnalités Clés & Internationalisation
* **Multi-régions & Multi-langues** : Support de l'Algérie (ar/fr), la France (fr), l'Australie (en) et le Royaume-Uni (en).
* **Mirroring Dynamique RTL/LTR** : Bascule complète de la mise en page selon que la langue courante est l'arabe (RTL) ou une langue latine (LTR).
* **SchoolPicker Intelligent** : Recherche et sélection dynamique des écoles primaires en fonction de la région de l'enfant.
* **Formulaire Elite Flexible** : Flux d'inscription adapté pour les tests utilisateurs (bypass de captcha avec `"1234"` ou vide `""`, alertes non-bloquantes à l'étape 1, et étapes cliquables).
