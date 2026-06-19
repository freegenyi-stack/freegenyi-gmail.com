# Backlog FreeGeny — ce qui reste à faire

> **Document de suivi global** — tout ce qui a été créé jusqu’ici, et ce qui manque encore.  
> Focus détaillé : **Bibliothèque** et **Messagerie** (on y reviendra plus tard).  
> Référence code messagerie : `web/src/lib/messaging/messaging-policy.ts`

_Dernière mise à jour : 5 juin 2026_

---

## Légende

| Symbole | Signification |
|---------|----------------|
| ✅ | Livré — MVP utilisable en conditions réelles (Algérie / DZ) |
| 🔶 | Reste à faire — polish, prod, ou évolution |
| ⏸️ | Volontairement reporté (décision produit explicite) |
| ❌ | Hors scope actuel — ne pas implémenter sans nouveau cadrage |

---

## 1. Messagerie

### ✅ Livré (clôturé côté polish)

| Zone | Détail |
|------|--------|
| **Conversations** | DM (permissions métier), salons école auto-provisionnés, suggestions, mute |
| **Contenu** | Texte, médias (image / PDF / vidéo / audio / vocal), réactions, réponses, épinglage (max 3), édition 15 min, suppression soft, transfert texte + fichiers |
| **Recherche** | Intra-fil uniquement |
| **Temps réel** | SSE + `getMessagesSince`, poll **2 s** (`/api/chat/stream`) |
| **Typing** | Persistant en DB (`chat_typing`, migration v7) |
| **Notifications** | In-app + Web Push VAPID |
| **Modération** | Signalement utilisateur, masquage admin, modération médias école, onglet admin « Messages signalés » |
| **Horaires parents** | Lun–ven 8h–17h, fuseau global `Africa/Algiers` (`FREEGENY_MESSAGING_TZ`) |
| **UX** | `ChatOpener` (`?u=` / `?c=` / `?voice=1`), accusés de lecture corrigés, pagination historique au scroll, emoji picker Twemoji + stickers |
| **Visio** | Bouton + `FeatureSoonModal` « bientôt » — **pas de WebRTC** |
| **Sécurité médias** | Fichiers `public/uploads/chat/` + ACL `/api/chat/media` |
| **API / i18n** | Codes `messaging-errors` sur toutes les routes `/api/chat/*`, namespace `Messages` + `AdminMessages` (28 locales via `npm run i18n:sync:messages`) |
| **Rôles** | parent, coparent, enseignant, ecole, ong — garde-fous `messaging-policy.ts` |

**Migrations utiles :**
```bash
npm run db:migrate:messaging-v7   # signalements, typing DB
npm run db:migrate:messaging-v8   # legacy Rocket.Chat + is_read
npm run i18n:sync:messages
```

---

### 🔶 Reste — infra / scale (non bloquant mono-instance)

| Sujet | État actuel | À faire si scale |
|--------|-------------|------------------|
| **WebSocket / broker** | SSE optimisé suffit | Redis pub/sub ou broker dédié si multi-instances |
| **Stockage S3 + URLs signées** | `public/uploads/chat/` + ACL API | Migrer vers MinIO/S3 (compose Docker déjà présent) + URLs signées |
| **Push natif FCM/APNs** | Web Push PWA OK | SDK mobile + tokens device (avec app native B1) |
| **Rate-limit cluster** | Map en mémoire (`conversations.server.ts`) | Redis ou table DB partagée |
| **Fuseau horaire par école** | Global Algérie | Colonne TZ école / pays → `isWithinSchoolMessagingHours(tz)` |

---

### ⏸️ Reste — stand-by volontaire

| Sujet | Décision |
|--------|----------|
| **Visio / appels audio live** | Stand-by UI — WebRTC quand tu décides |
| **Messagerie comptes enfants** | ❌ Pas de compte utilisateur enfant — profils `children` liés au parent uniquement |

---

### ❌ Reste — features produit hors scope (nouveau chantier si demandé)

| Feature | Notes |
|---------|-------|
| **Groupes privés ad hoc** | Schéma `conversations.type = group` existe, pas d’UI/API création |
| **Recherche globale** | Tous les fils — seule la recherche intra-fil est livrée |
| **Chiffrement E2E** | Chantier cryptographique lourd (échange de clés, rotation, perte d’appareil…) |
| **Brouillons / mode offline** | Pas de persistance serveur ; le champ `draft` UI est éphémère (perdu au refresh) |
| **Export / rétention légale** | Pas d’export admin/conversation ni politique de rétention |
| **Sync auto changement d’école** | Pas de resync auditée des salons/DM si affectation enfant change |

---

### 🔶 Reste — polish optionnel messagerie

| Sujet | Détail |
|--------|--------|
| **Aperçu de liens** | Open Graph / unfurl dans le fil |
| **Mentions @** | Notification ciblée |
| **Messages éphémères** | TTL + purge |
| **Refactor UI** | `MessagesClient.tsx` monolithique (~2 350 lignes) → sous-composants |
| **Tests par rôle** | Parent / enseignant / école / ONG — checklist manuelle prod |
| **Déploiement VPS** | HTTPS, permissions dossiers upload, backup, monitoring |

---

## 2. Bibliothèque

### ✅ Livré (plan vagues A → F terminé)

| Zone | Détail |
|------|--------|
| **Catalogue** | Table `library_books`, admin CRUD, upload **EPUB + PDF** direct, couverture, métadonnées (âge, matière, audience, langue) |
| **Admin détail livre** | Page `/dashboard/admin/library/[id]` — quiz, annexes, édition métadonnées, à la une |
| **Lecteur EPUB** | Readium / Thorium (`ReadiumLuxuryReader`) — i18n lecteur, surlignage couleurs, soulignement, notes, panneau latéral, progression |
| **Lecteur PDF** | `PdfReaderClient` — navigation pages, progression, TTS navigateur basique |
| **TTS** | Web Speech API + proxy **Coqui** (`/api/tts/coqui`) si `COQUI_TTS_URL` configuré |
| **Parent** | Hub bibliothèque, onglets recommandés / catalogue, stats, sélecteur enfant sur le lecteur |
| **Enseignant** | Assignation élèves, stats perso, **vue classe** |
| **Enfant** | Progression, quiz (`ChildBookQuiz`), badges, streak |
| **Annotations** | Export `.md` + `.pdf` (parent / enseignant) |
| **Offline** | Quota **1 livre / semaine** (`library_offline_downloads`) + cache SW (`public/sw.js`) |
| **Calibre** | Code sync `calibre.server.ts` + bouton admin (nécessite Calibre-Web actif) |
| **i18n** | Namespace `Library` synchronisé 28 locales (`npm run i18n:sync:library`) |
| **Seed test** | `public/test/sample.epub` + entrée catalogue test |

**Migrations utiles :**
```bash
npm run db:migrate:library      # v1
npm run db:migrate:library-v2   # … jusqu’à v9 selon environnement
npm run db:seed:library         # livre test
npm run i18n:sync:library
```

---

### 🔶 Reste — admin & catalogue

| Sujet | Détail |
|--------|--------|
| **Calibre-Web en prod** | Service Docker `calibre-web` dans `docker-compose.yml` — configurer `CALIBRE_WEB_URL`, token/login, volumes livres, cron sync |
| **Logs d’import** | Historique succès / échecs / doublons Calibre |
| **Import bulk** | CSV / ZIP massif (hors sync Calibre unitaire) |
| **Prévisualisation admin** | Ouvrir le livre avant publication sans quitter l’admin |
| **Rôles publication** | Super-admin vs modérateur bibliothèque |
| **Tags / taxonomie** | Au-delà du champ `subject` libre |
| **Dédoublonnage** | Fusion titres / auteurs proches |

---

### 🔶 Reste — lecteurs & expérience lecture

| Sujet | État actuel | À faire |
|--------|-------------|---------|
| **Parité PDF ↔ EPUB** | PDF = iframe + navigation ; pas surlignage / notes Thorium | Annoter PDF ou lecteur unifié |
| **TTS Coqui prod** | Image Docker `coqui-tts` (profile `tts`) — souvent absent en dev | `docker compose --profile tts up`, `COQUI_TTS_URL`, voix ar/en |
| **TTS avancé** | Rate limit basique | Rate limit cluster si abus |
| **Offline EPUB complet** | SW cache routes `/api/library/` | Stratégie cache EPUB entier vs chapitres, invalidation |
| **Accessibilité dys** | Profil enfant avec troubles en onboarding | Adapter police / espacement lecteur selon `learning_profile` |
| **Kiosk enfant** | Mode kiosk partiel | Renforcer verrou navigation / temps écran intégré lecteur |

---

### 🔶 Reste — social & découverte bibliothèque

| Sujet | Détail |
|--------|--------|
| **Avis publics** | Table `library_reviews` + API — UI communautaire limitée ; champ `visibility` peu exploité |
| **Recommandations IA** | Discovery basique — pas de moteur personnalisé profond |
| **Classement / tendances** | Partiel via `isFeatured` — pas de leaderboard global |

---

### 🔶 Reste — infra bibliothèque

| Sujet | État actuel | À faire |
|--------|-------------|---------|
| **Stockage fichiers** | `uploads/library/` local | Brancher **MinIO** (déjà dans compose) ou S3 prod |
| **CDN** | Fichiers servis par Next | CDN devant couvertures + EPUB lourds |
| **Backup catalogue** | Manuel | Sauvegarde `uploads/` + table `library_books` |
| **Antivirus scan** | Absent | Scan upload admin (ClamAV ou service cloud) |

---

## 3. Espace enseignant (hors biblio / messagerie)

| Module | ✅ Livré | 🔶 Reste |
|--------|---------|---------|
| **Accueil hub** | Tuiles complètes (classe, profil, mur, actualités, formation, atelier, biblio), raccourcis stats, messages | Personnalisation tuiles, analytics agrégées |
| **Profil enseignant** | 5 onglets, avatar catalogue, multi-matières, contact opt-in, lien public, stats biblio i18n | i18n 28 locales complètes ; changement d’école self-service |
| **Mur pédagogique** | Publications DB, likes, push parents/collègues, modération | Modération admin centralisée, signalement posts |
| **Actualités** | Fil admin + commentaires + likes, marquage lu à la lecture, seed script | Agrégation RSS, digest push hebdo, contenu éditorial DZ continu |
| **Formation** | Catalogue DB, lecteur vidéo, progression, push épisodes, certificats PDF | Contenu vidéo réel (remplacer démos YouTube) |
| **Mon Atelier** | Documents TipTap, 12 activités, assignation, export PDF/Word, mur auto | WhatsApp natif, certificats atelier, assistant IA au-delà QCM/VF |

---

## 4. Parent, enfant & onboarding

| Zone | ✅ Livré | 🔶 Reste |
|------|---------|---------|
| **Onboarding parent** | 5 étapes, troubles/maladies, mode apprentissage, durée écran | Édition post-inscription des 8 questions détaillées |
| **Profil enfant** | Éditable (école, learning_profile) | Sync automatique changement école → salons/mur |
| **Lobby enfant** | Temps écran, modes guidé / semi / explorateur | Sync cloud temps écran (au lieu localStorage seul) |
| **Dashboard parent** | Cockpit, liens biblio/mur/messages, **Mon Atelier** (missions + création perso) | Génération cahiers personnalisés (Geny) — mock / partiel |
| **Mode enfant** | Accès lobby + biblio | Pas de messagerie enfant (volontaire) |

---

## 5. École, ONG & ERP

| Zone | ✅ Livré | 🔶 Reste |
|------|---------|---------|
| **Vérification org** | Upload documents, statuts pending/approved/rejected | SLA modération, relances email |
| **Dashboard école/ONG** | `OrgVerificationDashboard`, bouton accès ERP | **ERPNext** réel (iframe/SSO), formation directeurs, landing Écoles/ONG marketing → produit |
| **Salons messagerie école** | Auto-provision | Sync effectifs élèves / changement d’année scolaire |

---

## 6. Console admin (B5)

| Module | ✅ Livré | 🔶 Reste |
|--------|---------|---------|
| **Hub + navigation** | Users, stats, config, bibliothèque, vérifs, actualités, messages, emails, contacts, notifs | Dashboard KPI temps réel |
| **Users** | Liste, CSV, impersonate | Impersonate : audit log, durée limitée, bannière (bannière OK) |
| **Modération** | Messages signalés, médias chat, commentaires actu | Workflow unifié file d’attente |
| **Mailing** | Campagnes admin | Templates HTML, A/B, désabonnement légal |
| **Maintenance** | Flag DB + `MaintenanceGate` | Planification créneaux |

---

## 7. Plateforme transverse

| Sujet | ✅ Livré | 🔶 Reste |
|--------|---------|---------|
| **Pays actifs** | **DZ seul** (`ACTIVE_COUNTRY_CODE`) — modal « not available » pour les autres | Ouvrir pays un par un via `activeCountry.ts` + tests seed |
| **Base écoles** | Seeds ~40+ pays en DB | Hongrie, Sénégal, autres CSV manquants |
| **i18n site** | fr / ar / en solides ; 28 fichiers messages | Qualité traduction auto autres locales |
| **UI shadcn** | Migration partielle (modals, composants isolés) | Inscription DZ 100 % shadcn strict |
| **Auth mobile** | NextAuth cookies web | Tokens API pour app native |
| **Push** | VAPID web | FCM/APNs avec B1 |
| **Email** | Invitations, contact → admin | SPF/DKIM prod, file d’envoi |
| **Sécurité VPS** | — | HTTPS, firewall, secrets, backup DB + uploads |
| **Redis** | Container compose | Utilisation app (sessions, rate limit, cache) — **non branché** |

---

## 8. App native (B1) — ⏸️ REPORTÉ

| Décision | Détail |
|----------|--------|
| **Stack recommandée** | React Native (Expo) — aligné web TS |
| **Périmètre** | Web = vitrine parent ; **téléphone = cœur enfant** ; enseignant mobile + PC |
| **Prérequis web** | API token auth, deep links, FCM/APNs, template premium |
| **Bibliothèque mobile** | WebView lecteur ou port Readium natif |

---

## 9. Idées backlog général (hors biblio / messagerie)

Voir aussi `web/docs/idees-freegeny.md` pour l’historique des sessions.

| # | Idée | Statut |
|---|------|--------|
| O1 | TTS Coqui self-hosted (prod) | 🔶 Docker prêt, env à configurer |
| O2 | Export PDF/Word génération enseignant | ✅ Export basique ; 🔶 éditeur riche + mise en page logo |
| O3 | Calibre-Web prod | 🔶 |
| O4 | Impersonate admin | ✅ Livré |
| O5 | i18n TeacherSpace 28 locales | 🔶 fr/ar/en OK |
| — | Shop / marketing pages | Placeholder « revenez bientôt » |
| — | ERP école/ONG complet | 🔶 |
| — | Geny IA cahiers parent | 🔶 |

---

## 10. Ordre de reprise suggéré (quand tu reviendras)

### Messagerie
1. VPS : HTTPS + permissions uploads + backup  
2. (Option) Fuseau par école si multi-pays actif  
3. (Option) Visio WebRTC ou groupes privés — **cadrage produit d’abord**

### Bibliothèque
1. Calibre-Web + catalogue réel EPUB  
2. Coqui TTS prod (qualité voix ar/fr)  
3. Parité PDF annotations  
4. MinIO/S3 fichiers  
5. Avis publics + discovery

### Plateforme
1. Stabiliser DZ bout en bout  
2. Générer enseignant (éditeur + partage)  
3. Formation (lecteur contenu)  
4. B1 app native quand web DZ stable  

---

## Scripts de référence

```bash
# Messagerie
npm run db:migrate:messaging-v7
npm run db:migrate:messaging-v8
npm run i18n:sync:messages

# Bibliothèque
npm run db:migrate:library
npm run db:migrate:library-v2   # … v9 selon env
npm run db:seed:library
npm run i18n:sync:library

# Infra locale
docker compose up -d postgres redis minio calibre-web
docker compose --profile tts up -d coqui-tts

# Push keys
npm run push:keys
```

---

## Fichiers clés

| Domaine | Chemins |
|---------|---------|
| Messagerie UI | `web/src/components/messages/MessagesClient.tsx` |
| Messagerie API | `web/app/api/chat/**` |
| Messagerie serveur | `web/src/lib/messaging/*.server.ts`, `messaging-policy.ts` |
| Biblio lecteur | `web/src/components/library/ReadiumLuxuryReader.tsx`, `PdfReaderClient.tsx` |
| Biblio admin | `web/app/[locale]/dashboard/admin/library/**` |
| Biblio serveur | `web/src/lib/library/**` |
| Enseignant | `web/src/components/teacher/**`, `web/src/lib/teacher/**` |

---

_Document vivant — à mettre à jour quand un item passe en ✅ ou qu’un nouveau chantier est ouvert._
