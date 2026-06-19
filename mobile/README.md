# FreeGeny Mobile (Expo)

Parité fonctionnelle **parent + enfant** avec le site web FreeGeny.

## Démarrage

```bash
cd web && npm run dev
cd mobile && npm install --legacy-peer-deps && npm start
```

`.env` : `EXPO_PUBLIC_API_URL=http://<IP-LOCAL>:3000`

## Parcours parent (5 onglets)

| Onglet | Équivalent web |
|--------|----------------|
| Accueil | Dashboard parent |
| Enfants | Codes appairage + PIN |
| Progrès | `/dashboard/parent/progres` + historique |
| Messages | `/dashboard/messages` |
| Réglages | Mode apprentissage + temps d'écran |

## Parcours enfant

| Écran | Équivalent web |
|-------|----------------|
| Lobby | Portails + XP + temps d'écran |
| Geny | Exercices parents |
| Missions | Missions enseignant + **12 types d'activités natifs** |
| Bibliothèque | Livres assignés (PDF in-app, EPUB externe) |

## Activités natives (12/12)

QCM, Vrai/Faux, Flashcards, Memory, Texte à trous, Drag & drop (tap), Sequencing, Matching, Image hotspot, Coloriage, Lettres manquantes, Calcul interactif.

## API mobile (`/api/mobile/`)

Auth, parent (home, progress, history, children, chat), enfant (lobby, missions, geny, library, screen-time).
