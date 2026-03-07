# FreeGeny 🌍

Platforme éducative multilingue révolutionnant l'accès à l'éducation mondiale.
Supporte actuellement 35 langues.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- npm

### Installation
```bash
cd apps/web
npm install
```

### Développement
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:3000`.

## 🧪 Tests
Le projet utilise Jest et React Testing Library.

```bash
# Lancer les tests
npm test

# Lancer les tests en mode watch
npm test -- --watch
```

## 🌍 Internationalisation
- **Framework** : `next-intl` (Server Components) + `react-i18next` (Client Components)
- **Fichiers de traduction** : `apps/web/messages/*.json`
- **Configuration** : `apps/web/lib/i18n/config.ts`

## 🏗 Architecture
- **Frontend** : Next.js 14 (App Router)
- **UI** : Tailwind CSS + shadcn/ui
- **Tests** : Jest + React Testing Library
- **CI/CD** : GitHub Actions

## 🤝 Contribution
Les Pull Requests sont les bienvenues. Assurez-vous que les tests passent avant de soumettre.

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

<!-- Small change to triggered deployment -->
