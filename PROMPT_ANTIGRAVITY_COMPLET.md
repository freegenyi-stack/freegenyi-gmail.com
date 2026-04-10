# FREEGENY — PROMPT ANTIGRAVITY COMPLET
## Mission : Construire la plateforme éducative mondiale à 7 chiffres
## Date : Mars 2026

---

## 🎯 CONTEXTE & VISION

Freegeny est une plateforme EdTech mondiale (Web + iOS + Android) pour enfants 5-12 ans.
- 75 pays · 61 langues · 333 jeux éducatifs · objectif vente 7 chiffres
- Stack existant : Next.js 15 + Tailwind + Supabase + Vercel
- Authentification déjà en place
- Objectif immédiat : Algérie 1AP (Arabe + Maths) — version production

> 💡 **Analyse Concurrentielle (The Moat)** : Khan Academy Kids et Duolingo dominent la *gamification globale*. Freegeny gagne sur la **conformité stricte aux programmes locaux de l'Éducation Nationale (ex: MEN Algérie)**. Les parents achètent la garantie du programme officiel qu'ils maîtrisent mal, pas juste un jeu générique.

---

## 💰 MODÈLE ÉCONOMIQUE (4 niveaux) — RÈGLE ABSOLUE

> ⚠️ **RÈGLE CRITIQUE** : Les pays riches n'ont JAMAIS accès gratuit et ne voient JAMAIS de publicité.
> Les publicités sont UNIQUEMENT pour les pays pauvres/émergents qui ont accès gratuit.
> Pays riche = Abonnement obligatoire ou pas d'accès. Point final.

### Niveau 1 — Pays en développement (Algérie, Maroc, Afrique, MENA)
- Accès **GRATUIT** avec publicités Google AdMob/AdSense
- Contenu limité au pays de l'utilisateur (géolocalisation IP Vercel Edge)
- Publicités non intrusives : bannières, interstitiels entre leçons
- Zéro abonnement requis

### Niveau 2 — Pays émergents (Turquie, Inde, Vietnam...)
- Accès **GRATUIT** avec publicités
- Option abonnement light pour retirer les pubs

### Niveau 2.5 — La Diaspora (Le Hack d'Acquisition)
- **Cible** : Familles immigrées (ex: Famille algérienne en France voulant préserver la langue/culture).
- **Tarif adapté** : Prix "Diaspora" attractif (ex: 5€/mois).
- **Techniquement** : Middleware croise (`IP == Premium Country` && `Curriculum == Developing Country`) → Redirect Stripe "Diaspora Tier". Captation d'un marché très engagé et loyal.

### Niveau 3 — Pays riches (France, UK, USA, Allemagne, Japon...)
### Niveau 3 — Pays riches (France, UK, USA, Allemagne, Japon...)
- **Accès Freemium (Metered Paywall)** : Règle psychologique absolue : on ne bloque JAMAIS à l'entrée. 
  - L'enfant a accès à **3 leçons gratuites** pour s'attacher au produit (le "Hook").
  - À la 4ème leçon : Paywall strict. C'est l'enfant qui exige l'achat au parent ("Pester Power"). Conversion x4 garantie vs un blocage IP à l'entrée.
  - Zéro publicité, jamais.
- **Tiered Pricing SaaS** :
  - **Basique** ($9.99/mo) : Accès complet au programme localisé.
  - **Premium IA** ($19.99/mo) : Inclus le Diagnostic Cognitif IA (voir l'IA comme Moat Data).
  - **Famille Annuel** ($49.99/an) : Jusqu'à 3 enfants (Optimisation LTV et Cash-flow immédiat).
- **Sécurité Partage de Compte** : Limite stricte de 2 appareils simultanés par mois (Device Fingerprinting).

### Niveau 4 — Licence École (tous pays, paiement unique)
- Tarif unique par établissement (ex: 299€/an ou 999€ illimité)
- **ZÉRO PUBLICITÉ**
- Dashboard enseignant complet
- Gestion de classes (30-500 élèves)
- Rapports par élève exportables PDF
- Marque blanche optionnelle
- Cible : écoles privées, ONG, ministères

**Implémentation technique — RÈGLE ABSOLUE dans le code :**

> ⚠️ **SÉCURITÉ MULTI-COUCHES** : La détection pays ne repose PAS uniquement sur l'IP.
> L'IP est le premier filtre. Le compte utilisateur est le filtre définitif.
> Un VPN ne peut pas contourner les deux simultanément.

### Couche 1 — Middleware Vercel Edge (première barrière, ~0ms latence)

```typescript
// middleware.ts — Exécuté AVANT toute page, côté Edge
import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

const PAYS_GRATUITS_PUBS = new Set([
  'DZ','MA','TN','EG','LY','SN','CI','NG','KE','SD',
  'AF','IQ','YE','SY','ML','BF','NE','MR','DJ','MG'
])
const PAYS_EMERGENTS_PUBS = new Set([
  'TR','IN','VN','TH','ID','PH','MY','KZ','UZ','KG','KH','MM'
])
const PAYS_PREMIUM_ZERO_PUB = new Set([
  'FR','GB','US','DE','JP','AU','CA','CH','NL',
  'SE','NO','DK','FI','BE','AT','IE','NZ','SG','KR'
])

export function getMonetizationTier(country: string): MonetizationTier {
  if (PAYS_GRATUITS_PUBS.has(country)) return 'free_ads'
  if (PAYS_EMERGENTS_PUBS.has(country)) return 'free_ads_light'
  if (PAYS_PREMIUM_ZERO_PUB.has(country)) return 'premium_only'
  return 'premium_only' // Par défaut = premium (sécurité max)
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // 1. Détection IP pays (Vercel Edge) + Bypass Geo Proxy (QA/Admin)
  const bypassGeo = req.cookies.get('admin_bypass_geo')?.value
  const ipCountry = bypassGeo || req.geo?.country || 'XX'
  let ipTier = getMonetizationTier(ipCountry)

  // 1.b. AB Testing Monétisation Edge (sans flickering UI)
  // Ex: 50% voient 'free_ads', 50% voient 'free_ads_light'
  const abTestBucket = req.cookies.get('ab_bucket')?.value || (Math.random() > 0.5 ? 'A' : 'B')
  res.cookies.set('ab_bucket', abTestBucket)

  // 2. Récupération performante et SÉCURISÉE du JWT (évite getSession() DB call)
  const token = req.cookies.get('sb-access-token')?.value
  let session = null
  if (token) {
    // Vérification cryptographique stricte côté Edge via 'jose' (Bloque le hacking pur)
    const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET)
    try {
      const { payload } = await jwtVerify(token, secret)
      session = { user: payload } // Assure que le metadata tier n'est pas falsifié
    } catch (e) {
      // Token falsifié ou expiré
    }
  }

  // 3. Lire le pays DÉCLARÉ sur le compte (priorité sur l'IP)
  let effectiveCountry = ipCountry
  let effectiveTier = ipTier

  if (session?.user) {
    const declaredCountry = session.user.user_metadata?.declared_country
    const isVerified = session.user.user_metadata?.country_verified === true

    if (declaredCountry && isVerified) {
      // Pays vérifié sur le compte → utilisé en priorité
      effectiveCountry = declaredCountry
      effectiveTier = getMonetizationTier(declaredCountry)
    } else if (declaredCountry && !isVerified) {
      // Pays déclaré mais non vérifié → conflit IP vs déclaration = premium par défaut
      if (getMonetizationTier(declaredCountry) !== ipTier) {
        effectiveTier = 'premium_only' // Sécurité : on ne laisse pas l'avantage au doute
      }
    }
  }

  // 4. ENFORCEMENT STRICT pour les pages contenu
  const isContentPage = req.nextUrl.pathname.match(/\/(cours|exercices|examens|revisions)\//) 
  if (isContentPage && effectiveTier === 'premium_only') {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    // Vérifier l'abonnement actif via header injecté côté serveur
    const hasSubscription = session.user.user_metadata?.subscription_status === 'active'
    if (!hasSubscription) {
      return NextResponse.redirect(new URL('/paywall', req.url))
    }
  }

  // 5. Injecter les headers pour les Server Components (évite un 2e appel DB)
  res.headers.set('x-monetization-tier', effectiveTier)
  res.headers.set('x-user-country', effectiveCountry)
  res.headers.set('x-show-ads', effectiveTier.startsWith('free_') ? '1' : '0')

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/webhook).*)'],
}
```

### Couche 2 — API Routes (deuxième barrière, vérification DB)

```typescript
// lib/monetization-server.ts — Utilisé dans toutes les API Routes sensibles
import { createServerClient } from '@supabase/ssr'
import { headers } from 'next/headers'

export async function verifyAccessServer(): Promise<{
  allowed: boolean
  tier: MonetizationTier
  reason?: string
}> {
  const headersList = headers()
  const tier = headersList.get('x-monetization-tier') as MonetizationTier
  const supabase = createServerClient(...)

  const { data: { user } } = await supabase.auth.getUser()

  if (tier === 'premium_only') {
    if (!user) return { allowed: false, tier, reason: 'not_authenticated' }

    // Vérification directe en DB (pas de trust sur le JWT metadata)
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('status, expires_at')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .single()

    if (!sub) return { allowed: false, tier, reason: 'no_active_subscription' }
  }

  return { allowed: true, tier }
}

// Exemple d'usage dans une API Route
export async function GET(req: Request) {
  const { allowed, reason } = await verifyAccessServer()
  if (!allowed) {
    return Response.json({ error: reason }, { status: 403 })
  }
  // ... retourner le contenu
}
```

### Couche 3 — RLS Supabase (troisième barrière, base de données)

```sql
-- Politique RLS sur la table child_progress
-- MÊME si quelqu'un accède directement à Supabase REST API,
-- il ne peut lire/écrire que ses propres données
CREATE POLICY "users_own_progress" ON child_progress
  FOR ALL USING (auth.uid() = user_id);

-- Politique sur subscriptions : lecture seule par le propriétaire
CREATE POLICY "users_read_own_subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Aucune écriture directe sur subscriptions par le client
-- UNIQUEMENT via webhook Stripe (service_role)
CREATE POLICY "stripe_webhook_write" ON subscriptions
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
```

```dart
// Flutter — Logique monétisation STRICTE (même principe 3 couches)
switch (tier) {
  case MonetizationTier.freeAds:
  case MonetizationTier.freeAdsLight:
    AdService.initialize();
    return HomeScreen(showAds: true);

  case MonetizationTier.premiumOnly:
    // Vérification côté serveur via API (pas de trust local)
    final access = await ApiService.verifyAccess();
    if (!access.allowed) return PaywallScreen();
    return HomeScreen(showAds: false);

  case MonetizationTier.school:
    return HomeScreen(showAds: false);
}
```

**Tableau récapitulatif DÉFINITIF :**

| Type de pays | Accès | Publicités | Paiement |
|---|---|---|---|
| 🌍 Pays pauvres (DZ, MA, NG...) | ✅ Gratuit | ✅ AdMob/AdSense | ❌ Jamais obligatoire |
| 🌏 Pays émergents (TR, IN, VN...) | ✅ Gratuit | ✅ Pubs (retirables) | 💳 Optionnel |
| 🌎 Pays riches (FR, US, DE...) | ❌ Bloqué sans paiement | ❌ **JAMAIS** | 💳 **Stripe obligatoire** |
| 🏫 Écoles (tous pays) | ✅ Complet | ❌ **JAMAIS** | 💳 Licence unique |

---

## 🎨 DESIGN & IDENTITÉ VISUELLE

### Analyse de l'existant
Conservez l'architecture et la logique actuelle. Proposez des améliorations sur :

### Direction créative recommandée
- **Style** : Moderne, vibrant, chaleureux — inspiré de Duolingo mais plus sérieux
- **Typographie principale** : Inter ou Plus Jakarta Sans (latin) + Noto Naskh Arabic (arabe)
- **Palette de couleurs** :
  - Primaire : #1a237e (bleu marine profond) — confiance, éducation
  - Accent : #FF6B35 (orange vif) — énergie, gamification
  - Succès : #00C853 (vert) — progression, validation
  - Fond : #F8F9FA (gris très clair) — lisibilité
  - Texte arabe RTL : même palette, direction inversée
- **Iconographie** : Phosphor Icons ou Heroicons — cohérence cross-platform
- **Illustrations** : Personnages enfants diversifiés culturellement (Ahmed, Amina, Yasmine...)
- **Animations** : Framer Motion — micro-interactions sur les réussites
- **Dark mode** : Obligatoire — enfants utilisent souvent le soir

### Composants UI prioritaires à créer/améliorer
```
<HeroSection>          — Page d'accueil avec démo interactive
<LessonCard>           — Carte leçon avec progression visuelle
<ExercisePlayer>       — Lecteur exercices (11 types différents)
<ProgressRing>         — Anneau progression enfant
<BadgeGallery>         — Collection badges/récompenses
<AdZone>               — Publicité conditionnelle selon pays
<ParentDashboard>      — Dashboard temps réel parents
<SchoolDashboard>      — Dashboard enseignant/école
<AICoachCard>          — Conseil IA personnalisé hebdomadaire
<RevisionSheet>        — Fiche révision imprimable A4
<ExamPlayer>           — Interface examen /10
<GameLauncher>         — Lanceur jeux éducatifs
```

---

## 📂 DONNÉES DISPONIBLES — Algérie 1AP

### Emplacement des JSONs validés (v2)
```
freegonya/Documentation_Programs_Contry/ar/algeria/1_ap/arabe/output/
freegonya/Documentation_Programs_Contry/ar/algeria/1_ap/mathematiques/output/
```

### Les 15 JSONs par matière (× 2 matières = 30 fichiers)
| # | Fichier | Contenu | Taille |
|---|---------|---------|--------|
| 01 | curriculum_map_v2.json | 115 leçons structurées | 114 Ko |
| 02 | competences_v2.json | Référentiel compétences | 61 Ko |
| 03 | cours_v2.json | Cours bilingues AR+FR | 512 Ko |
| 04 | exercices_v2.json | Exercices interactifs | 120 Ko |
| 05 | revisions_v2.json | Fiches révision | 148 Ko |
| 06 | examens_v2.json | Sujets d'examens /10 | 15 Ko |
| 07 | presentation_v2.json | Page marketing | 5 Ko |
| 08 | international_v2.json | Comparaison internationale | 11 Ko |
| 09 | courses_mobile_v2.json | Version micro-learning | 368 Ko |
| 10 | games_config_v2.json | Configuration 6 jeux | 11 Ko |
| 11 | progress_schema_v2.json | Schéma BDD Supabase | 29 Ko |
| 12 | media_manifest_v2.json | Catalogue 327 assets (CDN R2) | 4 Ko |
| 13 | config_pays_v2.json | Config officielle Algérie | 5 Ko |

> ⚠️ **STRATÉGIE ASSETS (CDN & Signed URLs)**
> Ne jamais servir ces 327 fichiers depuis l'hébergeur frontend (Vercel) pour éviter d'exploser le bandwidth.
> - **Stockage** : Supabase Storage (ou Cloudflare R2).
> - **Sécurité** : Hébergement des assets premium via *Signed URLs* générés à la volée pour interdire le Hotlinking.
> - **Performance** : Lazy Loading strict (Intersection Observer) et pré-chargement uniquement de la leçon ciblée.
| 14 | contenu_parents_v2.json | Guide parents complet | 36 Ko |
| 15 | dashboard_config_v2.json | Config dashboard & stats | 11 Ko |

---

## 🏗️ PAGES À CRÉER — Priorité 1

### 1. Page vitrine matière
**URL** : `/ar/algeria/1ap/arabe` et `/ar/algeria/1ap/mathematiques`
**Source** : `07_presentation_v2.json`
**Contenu** :
- Hero avec animation de leçon démo
- Stats : 115 leçons, 460 exercices, 6 jeux, 3 trimestres
- Programme par trimestre avec objectifs
- Témoignages parents
- CTA : "Commencer gratuitement" (pays DZ) ou "S'abonner" (pays riches)
- Section AdSense si pays développement
- SEO complet (meta, og, schema.org)
- RTL complet pour l'arabe

### 2. Dashboard Parent — priorité absolue (rétention)
**URL** : `/dashboard/parent` (avec paramètre de switch `/dashboard/child/[child_id]/home`)
**Source** : `15_dashboard_config_v2.json` + `11_progress_schema_v2.json`

**Trust & Authority (Le déclencheur d'Achat Paywall)** :
- Bandeau permanent Parent : *"Conformité 100% au programme du Ministère de l'Éducation Nationale"*. (Mot 'Officiel' banni par prudence légale).
- Footer de confiance : *"Application revue et validée par un panel de professeurs des écoles"*. Ce n'est pas un énième jeu, c'est l'école à la maison.

**Gestion Multi-profils (Mode Enfant)** :
- Un parent peut gérer plusieurs enfants selon son abonnement/son activité.
- Sélecteur global dans la Navbar.
- Sécurité RLS stricte garantissant qu'un parent ne lit que les IDs enfants qui lui appartiennent.

**Contrôle Parental & Compliance (COPPA)** :
- **Screen Time Lock** : Le parent définit une limite (ex: 20 min/jour). L'app se bloque au-delà. Argument marketing MVP pour rassurer contre l'addiction aux écrans.

**Widgets temps réel & Boucle d'Addiction (Rétention Maximale)** :
- **La Boucle de Base (Core Loop OBLIGATOIRE)** : *Exercice réussi → +10 XP immédiat → Avatar qui évolue → Effet sonore hyper-satisfaisant (type Mario) → Confettis*. Si le feedback n'est pas viscéral et immédiat, l'enfant s'ennuiera en 5 minutes chrono.
- **Current Streak (Le Hook Parent/Enfant)** : Série de jours consécutifs. Relances push agressives : *"Ahmed va perdre son Streak de 5 jours dans 2h !"*. C'est le moteur de Duolingo.
- **Anneau de Progression** : Calculé via `count(*)` sur `child_progress` vs total leçons du `curriculum_map`.
- **Maîtrise Mensuelle** : Vue SQL matérialisée pour les scores > 8/10 ce mois-ci.
- **L'IA Diagnostique & Profil Cognitif (Le Vrai Moat Data de Demain)** :  
  - *Fini le chatbot réactif* : L'IA ne sert pas juste à filer une correction instantanée. L'objectif est l'Ultime Personnalisation.
  - *Le Diagnostic Actif* : Groq (Llama-3/Mistral) analyse les *patterns* d'erreurs en fond et remonte un profil cognitif au Parent : *"Ahmed a un profil visuel. Il est très fort en logique mais bloque systématiquement sur la différenciation b/d"*.
  - *Contrôle des Coûts* : L'IA de diagnostic en temps réel (au milieu d'un exo) ne se déclenche activement qu'**après 3 échecs consécutifs** sur une même question pour bloquer les appels API inutiles.
- **Rapport Hebdomadaire** : Bouton déclenchant une Edge Function qui génère un PDF (via `resvg` ou `jspdf`) et l'envoie par email via Resend.

```typescript
// Exemple de requête optimisée pour le Dashboard
const { data: stats } = await supabase
  .from('exercise_attempts')
  .select('score, created_at')
  .eq('child_id', activeChildId)
  .gte('created_at', last7DaysISO)
```

### 3. Lecteur de cours
**URL** : `/ar/algeria/1ap/arabe/cours/[lecon_id]`
**Source** : `03_cours_v2.json`
**Features** :
- 7 étapes mobile-first
- Audio narration (placeholder vers CDN)
- Mode enfant (grandes polices, couleurs vives)
- Mode parent (explication pédagogique)
- Progression sauvegardée Supabase
- Navigation leçon précédente/suivante

### 4. Exercices interactifs
**URL** : `/ar/algeria/1ap/arabe/exercices/[lecon_id]`
**Source** : `04_exercices_v2.json`
**MOTEUR D'EXERCICES UNIVERSEL (Faisabilité 9/10)**

Pour éviter de coder 11 pages différentes, implémentez un composant unique `<ExercisePlayer>` piloté par le type défini dans le JSON.
> ⚠️ **Focus Phase 1** : Limiter strictement à 5 types max. **Prioriser absolument le Drag & Drop (`association`/`tri`)** qui offre le meilleur ROA (Return On Attention) interactif pour les 5-8 ans sur tablette.

```typescript
// types/exercise.ts
// Phase 1 Limitée :
export type ExerciseType = 'qcm' | 'vrai_faux' | 'association' | 'completude' | 'audio'

interface ExerciseData {
  id: string
  type: ExerciseType
  question: string
  options?: string[]
  answer: string | string[]
  audio_url?: string
  hint?: string
}

// components/ExercisePlayer.tsx
export function ExercisePlayer({ data }: { data: ExerciseData }) {
  const [attempt, setAttempt] = useState('')
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null)

  // Rendu dynamique par type
  const renderInteractiveArea = () => {
    switch(data.type) {
      case 'qcm': return <QcmArea options={data.options} onSelect={setAttempt} />
      case 'association': return <AssociationArea pairs={data.options} onMatch={setAttempt} />
      case 'dictee': return <AudioInputArea audio={data.audio_url} onType={setAttempt} />
      default: return <DefaultTextInput onInput={setAttempt} />
    }
  }

  const handleValidate = async () => {
    const isCorrect = validateAnswer(attempt, data.answer)
    setFeedback(isCorrect ? 'success' : 'error')
    
    // Sauvegarder dans Supabase (Couche 3 + RLS)
    await saveAttemptToSupabase({
      exercise_id: data.id,
      is_correct: isCorrect,
      attempt_data: attempt
    })
  }

  return (
    <div className="exercise-container">
      <h2>{data.question}</h2>
      {renderInteractiveArea()}
      <button onClick={handleValidate}>Valider</button>
      {feedback === 'success' && <ConfettiAnimation />}
    </div>
  )
}
```

### 🎯 Avantage Stratégique
1. **Évolutivité** : Ajouter un nouveau type d'exercice = ajouter une seule "Case" dans le switch.
2. **Maintenance** : Un seul endroit pour corriger bug, gestion audio, et sauvegarde de progression.
3. **Consommation JSON** : Mapping direct avec les fichiers `04_exercices_v2.json`.

---

### 🏆 RÉCAPITULATIF TECHNIQUE — Pourquoi c'est faisable ?
- **Pipeline IA** : Le contenu est déja généré (v2 validé).
- **Architecture Modulaire** : Réduit le code UI de 11 pages à 1 moteur + 11 sous-composants légers.
- **Sécurité Edge** : Middleware Vercel bloque la fraude monétaire avant même de charger un octet de code.
- **Séquençage Itératif** : Ne construire que 3 types d'exercices (Phase 1) pour lancer en 6 semaines.


### 5. Examens
**URL** : `/ar/algeria/1ap/arabe/examens/[trimestre]`
**Source** : `06_examens_v2.json`
- Interface examen /10 chronométrée
- Grille de correction automatique
- Rapport résultats avec conseils parents
- Export PDF

### 6. Fiches révision
**URL** : `/ar/algeria/1ap/arabe/revisions/[lecon_id]`
**Source** : `05_revisions_v2.json`
- Fiche A4 imprimable
- QR code vers leçon en ligne
- Mode flashcard interactif

### 7. Espace parents — guide officiel
**URL** : `/parents/guide/algeria/1ap/arabe`
**Source** : `14_contenu_parents_v2.json`
- Guide programme officiel
- Conseils par trimestre
- Activités maison
- FAQ officielle basée circulaires MEN
- Glossaire bilingue

---

## 🏫 DASHBOARD ÉCOLE (nouveau)

**URL** : `/school/dashboard`
**Fonctionnalités** :
```
- Gestion classes (créer, modifier, archiver)
- Liste élèves avec progression individuelle
- Vue par compétence pour toute la classe
- Identification élèves en difficulté (alertes)
- Devoirs assignables depuis la banque exercices
- Rapports de classe exportables PDF/Excel
- Calendrier pédagogique avec le programme officiel
- Messagerie parent-enseignant
- Statistiques usage (temps/élève, exercices complétés)
```

---

## 📱 APP FLUTTER — Début immédiat

### Architecture recommandée
```
lib/
├── main.dart
├── core/
│   ├── theme/          ← thème AR/FR, RTL, couleurs
│   ├── router/         ← GoRouter avec deep links
│   ├── supabase/       ← client Supabase
│   └── ads/            ← AdMob conditionnel par pays
├── features/
│   ├── auth/           ← login parent/enfant
│   ├── home/           ← écran accueil enfant
│   ├── lesson/         ← lecteur leçon 7 étapes
│   ├── exercise/       ← 11 types exercices
│   ├── games/          ← 6 jeux éducatifs
│   ├── revision/       ← fiches révision
│   ├── exam/           ← interface examen
│   ├── parent/         ← dashboard parent
│   └── school/         ← dashboard école
└── shared/
    ├── widgets/        ← composants réutilisables
    └── models/         ← modèles JSON typés
```

### Écrans prioritaires (ordre de développement)
1. **Splash + Onboarding** — sélection pays/langue
2. **Auth** — login parent + profil enfant
3. **Home enfant** — leçons du jour + jeux
4. **Lecteur leçon** — 7 étapes animées
5. **Exercice** — QCM + drag&drop + audio
6. **Dashboard parent** — progression temps réel
7. **Jeux** — 6 jeux intégrés
8. **Mode offline** — sync différée Supabase

### 🌐 Stratégie Offline-First (Web & Flutter)
> Dans les pays cibles où la 3G/4G est instable, l'app ne doit jamais perdre la progression suite à une déconnexion.

**Pour le Web (PWA)** : 
- Configuration globale avec `next-pwa` (Workbox) pour la mise en cache des assets UI vitaux.
- Service Workers pour intercepter les requêtes et servir une copie locale en mode dégradé.

**Pour Flutter (Contraintes techniques)** :
- **JSON Local Fallback** : Pré-embarquer une version compressée des JSON dans l'app (`fallback_assets.db`) = temps de chargement 0ms.
- Utiliser **SQLite locale** comme base de vérité pour les sessions de jeu (Aucun appel Supabase On-The-Fly inopiné).
- **CRDT / Résolution de conflits** : Synchronisation différée vers Supabase basée sur le timestamp (`updated_at`) pour gérer les cas où la tablette offline entre en conflit avec le dashboard parent connecté.
```dart
// Détection pays → monétisation
final country = await DeviceInfoService.getCountry();
final tier = MonetizationTier.fromCountry(country);
if (tier == MonetizationTier.freeAds) {
  AdService.initialize(); // AdMob
}

// RTL automatique
Directionality(
  textDirection: cfg.langue.direction == 'rtl'
    ? TextDirection.rtl
    : TextDirection.ltr,
  child: MaterialApp(...)
)

// Sync offline
await SupabaseSync.syncWhenOnline(localProgress);
```

---

## 📣 SYSTÈME PUBLICITAIRE

### Google AdMob (app Flutter)
```dart
// Bannière non intrusive
BannerAd(
  adUnitId: 'ca-app-pub-XXXXX/XXXXX',
  size: AdSize.banner,
  listener: BannerAdListener(...)
)

// Interstitiel entre leçons (max 1/3 leçons)
InterstitialAd.load(
  adUnitId: 'ca-app-pub-XXXXX/XXXXX',
  request: AdRequest(),
)
```

### Google AdSense (site web)
```typescript
// Composant conditionnel
export function AdZone({ position }: { position: 'banner' | 'sidebar' | 'between-lessons' }) {
  const { country, tier } = useMonetization()
  if (tier !== 'free_ads') return null
  return <GoogleAdSense slot={AD_SLOTS[position]} />
}
```

### Règles publicitaires — NON NÉGOCIABLES
- **UNIQUEMENT** pour pays pauvres et émergents — JAMAIS pour pays riches
- Max 2 publicités par page
- Jamais pendant un exercice, un examen ou une leçon active
- Format accepté : bannière 320×50, rectangle 300×250
- Contenu publicitaire : éducatif uniquement (filtrage thématique Google)
- Pays premium → PAYWALL Stripe obligatoire, zéro pub, zéro contenu gratuit
- Vérification côté serveur obligatoire (ne pas faire confiance au client seul)

---

## 🔧 INTÉGRATION TECHNIQUE

### Variables d'environnement à ajouter
```env
# Monétisation
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXX
NEXT_PUBLIC_ADMOB_APP_ID=ca-app-pub-XXXXX

# Stripe (abonnements pays riches)
STRIPE_SECRET_KEY=sk_XXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXX
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_XXXXX

# Emails (rapports parents)
RESEND_API_KEY=re_XXXXX

# Pipeline (pour interface admin)
GEMINI_API_KEY=XXXXX
GROQ_API_KEY=XXXXX
```

### Tables Supabase à créer (depuis progress_schema_v2.json)
```sql
-- ⚠️ NOUVEAUTÉ : Gestion Multi-profils et Versioning (Append-Only)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id),
  type VARCHAR CHECK (type IN ('parent', 'child'))
);

-- Gestion du Changement de Programme Officiel (Soft-Delete)
CREATE TABLE content_versions (
  version_id VARCHAR PRIMARY KEY, -- ex: 'men_dz_2026'
  released_at TIMESTAMP
);
ALTER TABLE children ADD COLUMN curriculum_version VARCHAR REFERENCES content_versions(version_id);
-- Ne JAMAIS faire de DELETE pur sur un exercice lors d'une MAJ (ex: 2026 -> 2027). Utiliser `is_archived = true` (Soft Delete)
-- L'enfant garde son score figé sur la version précédente sans rien casser.

-- Exécuter le reste du SQL généré dans Supabase Dashboard
-- Tables : children, child_progress, exercise_attempts,
--          sessions, achievements, school_classes,
--          school_students, parent_notifications,
--          subscriptions, school_licenses
```

### Moteur de Mutations (Server Actions Next.js 15)
> ⚠️ **Standard Next.js App Router** : Remplacez les traditionnelles API Routes (`GET/POST /api/...`) par des Server Actions pour les mutations. Cela réduit le boilerplate, sécurise l'exécution et accélère les form submissions.

```typescript
// app/actions/progress.ts
'use server'
export async function updateProgressAction(exerciseId: string, score: number) { ... }

// app/actions/parent.ts
'use server'
export async function generateReportAction(childId: string) { ... }
export async function updateScreenTimeLimit(childId: string, minutes: number) { ... }
```
*(Note : Le Webhook Stripe reste un endpoint `/api/webhook/stripe` classique car il doit être exposé à un service externe).*

---

## 🛡️ PROTECTION ANTI-VPN & FRAUDE PAYS

### Le problème
Un utilisateur français peut se connecter avec un VPN algérien pour accéder gratuitement. L'IP seule ne suffit pas.

### Solution : Système de vérification pays en 3 étapes

#### Étape 1 — Déclaration à l'inscription
```typescript
// Onboarding : l'utilisateur CHOISIT son pays
// Ce choix est stocké dans le profil Supabase
const onboardingSchema = z.object({
  declared_country: z.string().length(2), // code ISO
  phone_number: z.string().optional(),    // optionnel pour vérification
})
```

#### Étape 2 — Détection de conflit IP vs déclaration
```typescript
// Règle : si IP pays ≠ pays déclaré ET l'écart est significatif
// (ex: IP = FR et déclaré = DZ), appliquer le tier le plus restrictif
export function resolveEffectiveTier(
  ipCountry: string,
  declaredCountry: string,
  isVerified: boolean
): MonetizationTier {
  const ipTier = getMonetizationTier(ipCountry)
  const declaredTier = getMonetizationTier(declaredCountry)

  // Pas de conflit → utiliser le pays déclaré vérifié
  if (ipTier === declaredTier || isVerified) {
    return declaredTier
  }

  // Conflit IP=premium / déclaré=free → appliquer premium (sécurité)
  if (ipTier === 'premium_only' && declaredTier === 'free_ads') {
    return 'premium_only' // Ne jamais avantager le doute
  }

  // Conflit IP=free / déclaré=premium → laisser premium (pas de fraude)
  return declaredTier
}
```

#### Étape 3 — Vérification douce (optionnelle, non bloquante)
```typescript
// Option A : Vérification numéro de téléphone local (Twilio)
// Un +213 (Algérie) confirme la résidence sans être bloquant
// Option B : Quiz culturel « Quelle est la capitale de votre wilaya ? »
// Option C : Laisser faire. L'utilisateur abuse d'un accès free ads
// → il voit des pubs → aucune perte pour nous
// → le cas pathologique (éviter Stripe) est marginal et auto-détecté si
//   la même IP premium accède toujours since 'DZ'

// SECURITÉ ACTIVE : Bannissement automatique après abus (3 Strikes)
const { count } = await supabase.from('country_conflicts').select('*', { count: 'exact' }).eq('user_id', user.id)
if (count && count >= 3) {
  // Verrouillage de l'accès. Nécessite validation manuelle (facture/pièce identité) via le support.
  await supabaseAdmin.auth.admin.updateUserById(user.id, { ban_duration: '87600h' }) 
} else {
  // Log l'infraction silencieusement pour alimenter le compteur "Strikes"
  await supabase.from('country_conflicts').insert({ user_id: user.id, ip_country: ipCountry, resolved_tier: effectiveTier })
}
```

### ⚡ Règle de décision simplifiée

| IP pays | Pays déclaré | Résultat | Raison |
|---|---|---|---|
| DZ (free) | DZ (free) | ✅ Gratuit + pubs | Cohérent |
| FR (premium) | FR (premium) | 💳 Paywall | Cohérent |
| FR (premium) | DZ (free) | 💳 Paywall | Conflit → sécurité |
| DZ (free) | FR (premium) | 💳 Paywall | Logique normale |
| VPN inconnu | DZ (free) | 💳 Paywall | IP inconnue → sécurité |

### Webhook Stripe — Source de Vérité Ultime
```typescript
// /api/webhook/stripe — SEUL endroit qui écrit le statut d'abonnement
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)

  if (event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    // Mise à jour en DB via service_role (contourne RLS)
    await supabaseAdmin.from('subscriptions').upsert({
      stripe_subscription_id: subscription.id,
      user_id: subscription.metadata.user_id,
      status: subscription.status, // 'active' | 'canceled' | 'past_due'
      expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    // Invalider le cache JWT metadata
    await supabaseAdmin.auth.admin.updateUserById(subscription.metadata.user_id, {
      user_metadata: { subscription_status: subscription.status }
    })
  }

  return Response.json({ received: true })
}
```

---

## 📅 SÉQUENÇAGE RÉALISTE — Phases de développement

> ⚠️ Vouloir tout construire en même temps = ne rien finir. Ce projet nécessite un séquençage strict.

### Phase 1 — MVP Algérie (6-8 semaines, développeur solo)
**Objectifs de Succès Chiffrés (Cibles strictes pour validation MVP)** :
- Trafic mensuel SEO/Organique : **50 000 visites** (Target long terme : 5M+)
- Taux de conversion Paywall FR/Diaspora : **2%** (Target long terme : 5%)
- Revenu mensuel Pubs (Algérie) : **$5 000** (Target long terme : $50k+)
- Revenu mensuel Abos : **$2 000** (Target long terme : $200k+)
- Rétention J30 sur les WAU : **30%** (Target long terme : 50%)

```
Semaine 1-2 : Infrastructure
  ✅ Tables Supabase (depuis progress_schema_v2.json)
  ✅ Middleware monétisation (IP + JWT + A/B Testing)
  ✅ Intégration Analytics strict : PostHog ou Mixpanel (AARRR)
  ✅ Webhook Stripe fonctionnel
  ✅ Variables d'environnement prod

Semaine 3-4 : Pages contenu
  ✅ Page vitrine matière (arabe + maths)
  ✅ Lecteur de cours (7 étapes)
  ✅ Exercices prioritaires : qcm, vrai_faux, association (3 types sur 11)

Semaine 5-6 : Rétention
  ✅ Dashboard Parent (widgets temps réel Supabase)
  ✅ Fiches révision imprimables
  ✅ AdSense opérationnel (pays DZ)

Semaine 7-8 : Stabilisation
  ✅ RTL testé Safari iOS + Chrome Android
  ✅ Lighthouse > 90
  ✅ RGPD + COPPA
  ✅ CI/CD Vercel
```

**Deliverable Phase 1** : Site en prod, Algérie fonctionnelle, premiers utilisateurs

---

### Phase 2 — Expansion MENA + Stripe (8-10 semaines)
**Objectif : premiers revenus réels**

```
  - Maroc (programme proche Algérie → 1-2 semaines)
  - Tunisie (notation /20, adaptation rapide)
  - Stripe complet (paywall FR, UK, US)
  - Exercices manquants : dictee, copier, calcul, probleme (4 types)
  - Examens + correction automatique + PDF
  - Dashboard École (beta)
```

**Deliverable Phase 2** : MRR > 0, premiers abonnés pays riches

---

### Phase 3 — Flutter App (12-16 semaines, après Phase 1 stable)
**Objectif : app stores = revenus passifs**

```
  - Partir SEULEMENT quand le web tourne et génère des données
  - Réutiliser 100% des JSONs et APIs déjà en prod
  - Écrans dans l'ordre : Splash → Auth → Home → Leçon → Exercice → Parent
  - Mode offline en DERNIER (complexité élevée)
```

> ⚠️ **Règle absolue** : Ne pas commencer Flutter avant que Phase 1 soit validée en production.
> Un app Flutter sans backend stable = retravail garanti.

---

### Phase 4 — Scale 75 pays (ongoing)
```
  - Égypte (100M habitants → priorité après Tunisie)
  - France (premier pays riche = validation modèle premium)
  - Arabie Saoudite (pouvoir d'achat élevé)
  - Utiliser le pipeline automatique pour chaque nouveau pays
```

### Estimation ressources réalistes
| Configuration | Phase 1 | Phase 1+2 | Phase 1+2+3 |
|---|---|---|---|
| Développeur solo | 8 semaines | 6 mois | 12 mois |
| 2 développeurs | 4 semaines | 3 mois | 6 mois |
| Équipe 3+ | 3 semaines | 2 mois | 4 mois |

---

## 🌍 AUTRES PAYS — Préparation

> ⚠️ **Conformité & Droits d'Auteur (Legal)** : L'extraction PDF des Ministères de l'Éducation est extrêmement sensible juridiquement. 
> L'utilisation de la Pipeline IA est obligatoire *précisément* pour transformer la matière brute de l'État en une architecture gamifiée inédite qui relève du **"Fair Use" (Usage Pédagogique Transformé)**. Une copie PDF est illégale, une adaptation structurée IA est une *Propriété Intellectuelle (IP)* libre et défendable.

### Structure dossiers déjà créée
```
Documentation_Programs_Contry/
├── ar/
│   ├── algeria/      ✅ 1AP arabe + maths FAIT
│   ├── morocco/      ⬜ PDFs à déposer
│   ├── egypt/        ⬜ PDFs à déposer
│   ├── tunisia/      ⬜ PDFs à déposer
│   ├── saudi_arabia/ ⬜ PDFs à déposer
│   └── ...
├── fr/
│   └── france/       ⬜ PDFs à déposer
└── ...
```

### Ordre de priorité pour les prochains pays
1. **Maroc** — programme arabe proche Algérie, marché 36M habitants
2. **Tunisie** — notation /20, adaptation rapide
3. **Égypte** — plus grand marché arabe (100M habitants)
4. **France** — premier pays riche = premiers abonnements premium
5. **Arabie Saoudite** — marché premium, pouvoir d'achat élevé

### 🎛️ INTERFACE ADMIN PIPELINE (Le Secret de Valorisation à 7 Chiffres)
**URL** : `/admin/pipeline` (Sécurisé RLS `role: admin`)

Pour qu'un acquéreur potentiel comprenne la valeur de la propriété intellectuelle (IP), le processus de scaling doit être "presse-bouton", sans intervention dans le terminal. L'interface permet d'ajouter un pays entier en 3 clics, rendant la plateforme ultra-scalable :

1. **Zone de Drop** : Glisser-déposer les PDF officiels du Ministère de l'Éducation (ou les liens).
2. **Configuration** : Sélection simple : Pays, Langue, Niveau, Matière (ex: "Maroc", "Arabe", "1AP").
3. **Dashboard de Génération Temps Réel** :
   - Barre de progression globale du pipeline.
   - Statut étape par étape (Extraction texte → Structuration → Génération Leçons → Exercices → Assets).
   - Log des appels API Gemini/Groq (tokens, coûts) visible en direct.
4. **Outils QA (Bypass)** : Bouton "Simuler Navigation Pays Riche" générant un cookie `admin_bypass_geo=FR` pour tester en direct le mur de paiement Stripe depuis le Maghreb.
5. **Validation** : Preview interactive des JSON générés. Un clic sur "Approuver et Déployer", et le contenu du nouveau pays est propulsé en production sur `/ar/morocco/...`.

```typescript
// Concept métier : Lancement de la pipeline IA The Antigravity Way
const startPipeline = async (country, level, subject, pdfFile) => {
  // 1. Upload du PDF vers Supabase Storage 'curriculums'
  const { path } = await supabase.storage.from('curriculums')
    .upload(`${country}/${level}/${pdfFile.name}`, pdfFile)
  
  // 2. Déclenchement de l'Edge Function Vercel (Streaming Response)
  const response = await fetch('/api/admin/pipeline/trigger', {
    method: 'POST',
    body: JSON.stringify({ filePath: path, country, level, subject }),
    // ... headers et auth ...
  })

  // 3. Écoute des SSE (Server-Sent Events) pour maj la barre de progression UI
  const reader = response.body.getReader()
  // ... loop update UI ...
}
```
---

## ✅ CHECKLIST DÉPLOIEMENT

### Avant mise en ligne (Infrastructure & Fiabilité)
- [ ] **Tests de charge Middleware** : Simuler 10k users pour s'assurer que `req.geo` + décodage JWT Edge ne timeout jamais.
- [ ] **Observabilité Avancée** : Intégration Sentry (Erreurs JS) + Logtail/Axiom (Logs backend complets). Si un enfant est bloqué, l'équipe doit le savoir avant qu'il ne 'bounce'.
- [ ] **Stripe Grace Period** : Si l'API Stripe tombe, mode dégradé via le cache Redis/Upstash (accès maintenu 24h).
- [ ] Score Lighthouse > 90 (Performance, SEO, Accessibilité)
- [ ] PWA configurée (Service Workers) pour résilience Offline-Web
- [ ] RTL testé sur Safari iOS + Chrome Android
- [ ] Assets sécurisés via cloud CDN (Signed URLs)
- [ ] Sécurité RLS et isolation `profiles` Supabase
- [ ] **Micro-Analytics Produit** : L'AARRR classique ne suffit pas. L'équipe DOIT tracker : le **Taux de Drop par Exercice Spécifique**, le Temps par Écran, et la "Frustration Map" (Clics rageurs répétés au même endroit). Le produit se corrige là où l'enfant rage-quit.
- [ ] **COPPA Full Audit** : Consentement parental strict et vérifiable en DB (`parent_consents`). Anonymisation légale inattaquable. Sans cela, aucun VC (Venture Capital) ne passera la Due Diligence.

### Évolution Économique Constante (Phase 2 & 3)
- **Partenariats Locaux Directs** : Les revenus AdSense sont trop faibles ($0.10-$0.50/MAU). Une fois les 100k DAU atteints en Algérie, remplacez les pubs Google par des encarts sponsorisés vendus en direct aux **écoles privées locales** pour multiplier les revenus publicitaires par 10.
- **Ré-Engagement Agressif** : Intégration de *OneSignal / Firebase Cloud Messaging* pour les Push Notifications ("Amina, termine ton chapitre de Sciences pour le badge de la semaine !").
- **AB Testing Continue** : Les tarifs de $9.99 à $19.99 (ou les prix du Diaspora Tier) doivent être testés continuellement aléatoirement dans le middleware Vercel.

---

---

## 🚀 LES 3 LEVIERS MASSIFS "7-CHIFFRES" (THE MOATS)

Pour qu'un fonds d'investissement ou un géant de l'EdTech rachète Freegeny entre 1M€ et 10M€, la plateforme ne doit pas être "juste une app". Elle doit posséder des **Moats** (douves de protection) impossibles à rattraper par la concurrence.

### 1. Le Moteur d'Acquisition (Go-To-Market & Scalability)
- **Acquisition Terrain Jour 1 (La Survie Hacking)** : Le SEO prend 6 mois. Les 2 000 premiers WAU s'iront chercher à la mano dans la boue :
  - **Groupes Facebook** : Assaut communautaire sur "Moms of Algiers" et autres réseaux de mamans.
  - **TikTok Éducatif** : Production de 3 shorts natifs par jour montrant spécifiquement le Drag&Drop, l'Avatar et la voix de l'app.
- **Anti-Thin Content SEO (La Victoire Moyen-Terme)** : 1 875 Landing Pages générées automatiquement (`/ar/algeria/1ap/mathematiques`, etc.). Pour éviter la pénalité Spam algorithmique :
  - Balisage strict `<link rel="canonical">` et `<link hreflang="...">` pour empêcher le Duplicate Content inter-pays.
  - **Content Injection** : Chaque page intègre des données dynamiques (Témoignages fictifs/réels *localisés*, FAQs générées spécifiquement depuis les circulaires du ministère ciblé). 
- **La Boucle de Viralité (Referral)** : Programme de parrainage intégré au Parent Dashboard : *"Invite 3 parents de la classe = Débloque le Coach IA Premium pour l'année"*. Le CAC (Coût d'Acquisition Client) organique tombe à 0$ pour une volumétrie monstrueuse.

### 2. Le Modèle Enterprise API First : Licences B2B Télécoms
Vendre aux opérateurs nécessite une infra mature capable de provisionner massivement, pas de créer les comptes à la main.
- **Le Hack** : Freegeny intègre une "Fleet Management API" accessible via Clé d'API B2B :
  - `POST /api/b2b/provision` : Crée 5 000 comptes d'un clic via fichier CSV (Ooredoo / Orange).
  - `GET /api/b2b/usage` : Rapports JSON en temps réel.
- **Valeur 7 chiffres** : Les acquéreurs valorisent le SaaS B2B *API First* avec un multiple jusqu'à +20% car c'est la promesse d'Abonnements Annules Récurrents à 6 chiffres.

### 3. L'Or Noir : Data Warehouse & Intelligence Pédagogique
La face visible, ce sont les Exercices. Le trésor enfoui, c'est le dataset d'apprentissage Nord-Africain.
- **Le Hack** : Les statistiques ne polluent pas la BDD Production. Elles sont répliquées vers un **Data Warehouse** via des vues matérialisées purement statistiques et *anonymisées* (*Pays, Age, Thème, Taux de Réussite*).
- **Valeur 7 chiffres** : En revendant ces rapports de performance scolaire exclusifs aux Ministères ou à l'UNESCO, Freegeny se positionne non comme une app, mais comme un moteur de R&D Pédagogique à l'échelle nationale.

---

## 🏆 OBJECTIF FINAL

**Valorisation cible pour vente** : 7 chiffres (1M€ - 10M€)

**Métriques de valorisation (The 7-Figure Pitch)** :
- 75 pays × 5 niveaux × 5 matières = 1 875 landing pages SEO (Acquisition organique).
- Interface Admin Pipeline = "L'usine à contenu automatisée" (IP Tech).
- Double monétisation pub + abonnement + Licences Télécoms (B2C + B2B).
- Base de données prédictive sur l'apprentissage (Data SaaS).
- App stores iOS + Android = revenus passifs.

**Ce qui justifie la valorisation :**
1. **L'IP Technologique** : Le Moteur d'Exercices Universel + l'Admin Pipeline.
2. **Le Moat Contenu** : Aucun concurrent ne couvre 75 pays avec le programme *officiel* exact de chaque ministère.
3. **Le Moat Data** : Un monopole sur l'analyse de l'échec/réussite scolaire dans les pays émergents.

---

*Freegeny — EdTech mondiale · Algérie 1AP ready · Pipeline v4.0*
*Score qualité JSONs : 97/100 · 28/28 fichiers validés*
