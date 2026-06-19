# Idées & chantiers FreeGeny

> **Fichier de suivi partagé** — tu me dis une idée, je l’ajoute ici.  
> Quand c’est livré, je la déplace en **✅ Fait**.

_Dernière mise à jour : 10 juin 2026_

---

## 🎯 Vision produit (rappel)

| Rôle | Web (vitrine) | App native (téléphone) | PC |
|------|-----------------|------------------------|-----|
| **Parent** | Inscription, infos, suivi léger | À définir | Optionnel |
| **Enfant** | Minimal | **Cœur de l’expérience** | Non |
| **Enseignant** | Profil public, admin léger | Oui | **Oui (travail)** |

> Pas de PWA — **vraie app native** (React Native vs Flutter à trancher).  
> Démarrage sur un **template premium** soigné.

---

## 🔜 À faire — Priorité stratégique

### B1 — App native FreeGeny (grand chantier) — **REPORTÉ**

---

### Reste optionnel (polish / long terme)

| # | Idée | Notes |
|---|------|--------|
| O1 | **TTS Coqui self-hosted** | Web Speech / expo-speech OK court terme |
| O2 | **Export PDF/Word réel** génération enseignant | Documents JSON en DB, export à brancher |
| O3 | **Calibre-Web prod** | `CALIBRE_WEB_URL` + token dans `.env.local` |
| O4 | **Impersonate admin** | Non implémenté (sécurité) |
| O5 | **i18n complète** toutes locales TeacherSpace | fr / ar / en OK ; Library dans 28 locales |

---

## 🚧 En cours

| # | Idée | Notes |
|---|------|--------|
| — | — | — |

---

## ✅ Fait (session 10 juin 2026)

| # | Idée | Livré |
|---|------|--------|
| F11 | Onboarding B2+B3 + profil enfant éditable | ✓ |
| F12 | Profil enseignant cliquable (Mur, actualités, messagerie, SharePost) | ✓ |
| F13 | Console admin étendue (users CSV, flags DB, modération médias, contacts…) | ✓ |
| F14 | Bibliothèque EPUB+PDF bout en bout, i18n complète (28 locales), admin/quiz/assignations | ✓ |
| F15 | Temps d’écran lobby enfant (compteur + mode guidé/semi/explorateur) | ✓ |
| F16 | Formation & Générer enseignant branchés DB | ✓ |
| F17 | Formulaire contact → admin | ✓ |
| F18 | Maintenance mode (flag DB + MaintenanceGate) | ✓ |
| F19 | Cleanup RegisterClient / AdminNav obsolètes | ✓ |
| F20 | en.json TeacherSpace complet | ✓ |

---

## 💡 Idées en vrac

- Template app : viser niveau Duolingo / Khan Academy Kids
- Monorepo `web/` + `mobile/` + `packages/api-types`
- Calibre-Web : hébergement Docker à côté de la DB

---

## Scripts utiles

```bash
npm run db:migrate:platform-v1   # app_settings, teacher_courses, teacher_documents
npm run db:seed:platform         # livre test EPUB + cours enseignant
node scripts/create-sample-epub.js
```
