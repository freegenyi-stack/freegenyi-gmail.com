---
description: Guide complet pour ajouter une nouvelle base de données de pays
---

# Guide complet pour ajouter une nouvelle base de données de pays

## Étape 1 : Préparation du fichier CSV

1. Placer le fichier CSV dans `web/src/db/seeds/data/`
2. Vérifier la structure du CSV (colonnes, format des données)
3. Identifier les colonnes clés :
   - Nom de l'école
   - Code de la région/comté
   - Code du district/commune
   - Nom du district/commune
   - Type d'école (public/privé)
   - Coordonnées GPS (latitude, longitude)

## Étape 2 : Création du script de seed

1. Créer un nouveau fichier `seed-schools-[CODE_PAYS].js` dans `web/src/db/seeds/`
2. Copier la structure du script existant (ex: `seed-schools-sweden.js`)
3. Adapter les constantes :
   ```javascript
   const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/freegenydb";
   const CSV_[CODE] = path.join(__dirname, "data", "[nom_fichier].csv");
   const COUNTRY_CODE = "[CODE_PAYS]"; // ex: "SE", "FR", "DZ"
   ```

## Étape 3 : Mapping des régions

1. **Créer un mapping des codes de régions vers les noms officiels**
   - Utiliser les codes officiels du pays (2-3 chiffres/lettres)
   - Mapper chaque code vers le nom officiel de la région
   - Exemple pour la Suède :
     ```javascript
     const SWEDISH_COUNTIES = {
       "01": "Stockholm",
       "02": "Uppsala",
       // ...
     };
     ```

2. **IMPORTANT : Utiliser le code le plus court possible comme clé**
   - Pour les codes numériques : utiliser les 2 premiers chiffres (ex: "01" au lieu de "0180")
   - Cela évite les duplications (ex: 290 régions au lieu de 21)

3. **Filtrer les codes invalides**
   - Ajouter une condition pour ignorer les codes qui ne sont pas dans le mapping
   - ```javascript
     const regionName = SWEDISH_COUNTIES[countyCode];
     if (regionName) {
       // Ajouter la région
     }
     ```

## Étape 4 : Adaptation de la logique de parsing

1. **Adapter les noms de colonnes CSV**
   - Modifier les clés d'accès aux données CSV
   - Exemple : `s["nom"]` → `s["school_name"]`

2. **Adapter la logique de région/district**
   - Déterminer comment extraire le code de région depuis le code de commune
   - Exemple Suède : `regionCode.substring(0, 2)` pour les 2 premiers chiffres

3. **Adapter le type d'école**
   - Mapper les valeurs du CSV vers "public" ou "private"
   - ```javascript
     const type = s["type"] === "Public" ? "public" : "private";
     ```

## Étape 5 : Nettoyage des données

1. **Supprimer les anciennes données avant l'insertion**
   - ```javascript
     await client.query("DELETE FROM regions WHERE country_code = 'SE'");
     await client.query("DELETE FROM districts WHERE region_id IN (SELECT id FROM regions WHERE country_code = 'SE')");
     await client.query("DELETE FROM schools WHERE country_code = 'SE'");
     ```

2. **Ajouter les régions manquantes**
   - Si certaines régions n'ont pas d'écoles dans le CSV, les ajouter manuellement
   - ```javascript
     const missingCounties = ["02", "11", "15", "16"];
     for (const code of missingCounties) {
       if (!regionsMap.has(code) && SWEDISH_COUNTIES[code]) {
         regionsMap.set(code, SWEDISH_COUNTIES[code]);
       }
     }
     ```

## Étape 6 : Traductions

1. **Ajouter le code pays dans `middleware.ts`**
   - Ajouter dans `DEFAULT_COUNTRY_FOR_LOCALE` : `'no: "NO"'`
   - Ajouter la condition de détection de locale pour le nouveau pays

2. **Ajouter la locale dans `i18n/routing.ts`**
   - Ajouter dans le tableau `locales` : `'no'`

3. **Créer le fichier de traduction JSON**
   - Créer `web/messages/[code_locale].json` (ex: `no.json`)
   - Copier la structure depuis un fichier existant (ex: `sv.json`)
   - Traduire toutes les sections :
     - **Hero** : titre, sous-titre, CTA
     - **Impact** : Geniuses, Countries, Schools, Languages, Courses
     - **Nav** : About, Approach, Parents, Schools, NGOs, Science, FreeExplore
     - **Auth** : Login, Register, Agreement, AlreadyHaveAccount, Placeholders
     - **Portals** : Tag, Title, Subtitle, Local/World/Magic sections
     - **Ecosystem** : Tag, Title, Subtitle, Parents, Schools
     - **EmotionBoost** : Tag, MomVoice, Congratulation
     - **Innovation** : Tag, Title, Boost, AI
     - **Footer** : Title, CTA
     - **Dashboard** : Title, Subtitle, AddChild, ChildCard, Alliance, Printable, Bridge
     - **ChildLobby** : Greeting, ParentDashboard, Portals, Mascot
     - **Onboarding** : Steps, LeftPanel, Form
     - **Regions** (nouvelle section pour les pays avec divisions administratives spécifiques) :
       - Title (ex: "Fylker")
       - Description (explication des divisions)
       - Municipalities (Title, Description)
       - Counties (Title, List of all regions)

4. **Traduire les labels dans `RegisterClient.tsx`**
   - Ajouter le dictionnaire de traduction pour le nouveau pays
   - Labels à traduire :
     - `vosAcces`, `lAlliance`, `sonProfil`
     - `stepText`, `chooseRole`, `parentTab`, `schoolTab`, `ngoTab`
     - `instantGoogle`, `orEmail`
     - `fullNameParent`, `fullNameSchool`, `fullNameNgo`
     - `fullNamePlaceholderParent`, `fullNamePlaceholderSchool`, `fullNamePlaceholderNgo`
     - `username`, `usernamePlaceholder`
     - `email`, `emailPlaceholder`
     - `phone`, `phonePlaceholder` (indicatif téléphonique)
     - `password`, `passwordPlaceholder`
     - `confirmPassword`, `confirmPasswordPlaceholder`
     - `matchPerfect`, `matchError`
     - `eightChars`, `uppercase`, `number`, `specialChar`
     - `next`, `previous`
     - `titleParentStep1`, `titleSchoolStep1`, `titleNgoStep1`
     - `subStep1Parent`, `subStep1School`, `subStep1Ngo`
     - `leftTitle1`, `leftTitle1Orange`, `leftSub1`
     - `leftTitle2`, `leftTitle2Orange`, `leftSub2`
     - `leftTitle3`, `leftTitle3Orange`, `leftSub3`
     - `allyTitle`, `allyDesc`
     - `allyNamePlaceholder`, `allyEmailPlaceholder`
     - `schoolIdentityTitle`, `schoolIdentityDesc`
     - `privateSchool`, `publicSchool`
     - `schoolAddressPlaceholder`, `schoolManagerPlaceholder`
     - `ngoTitle`, `ngoDesc`
     - `ngoDomainPlaceholder`, `ngoDomainEducation`, `ngoDomainSocial`, `ngoDomainCulture`, `ngoDomainHumanitarian`
     - `ngoAddressPlaceholder`, `ngoManagerPlaceholder`
     - `childFirstName`, `childFirstNamePlaceholder`
     - `childAge`, `childAgePlaceholder`
     - `childLevel` (niveaux scolaires)
     - `childSchool` (nom de la région)
     - `childSchoolPlaceholder` (placeholder de recherche)
     - `securityCheck`, `securityCheckDesc`, `securityCodePlaceholder`
     - `finalizeButton`, `registerSchoolButton`, `registerNgoButton`
     - `termsText` (conditions et politique de confidentialité)
     - `alreadyHaveAccount`, `loginLink`
     - `digitalPresence`, `digitalPresencePlaceholderSchool`, `digitalPresencePlaceholderNgo`
     - `schoolDimension`, `classesCountPlaceholder`
     - `instCheck`, `instCheckDesc`
     - `beneficiariesCount`, `beneficiariesPlaceholder`
     - `orgCheck`, `orgCheckDesc`
     - Messages d'erreur : `errNameEmpty`, `errUsernameEmpty`, `errUsernameTaken`, `errEmailEmpty`, `errPasswordEmpty`, `errPasswordsDoNotMatch`, `errCaptchaIncorrect`
     - `welcomeTitle`

5. **Ajouter les niveaux scolaires dans `RegisterClient.tsx`**
   - Ajouter dans l'objet `levels` :
     ```javascript
     const levels: Record<string, string[]> = {
       // ...
       [COUNTRY_CODE]: ['Niveau 1', 'Niveau 2', 'Niveau 3'],
     };
     ```

6. **Traduire dans `SchoolPicker.tsx`**
   - Ajouter la condition `is[Country]` pour la détection de locale
   - Traduire tous les éléments :
     - Labels de types d'écoles ("All", "Public", "Private")
     - Placeholder de recherche
     - Message "no school found"
     - Message de suggestion ("Modify your filters or try another search")
     - Label "Selected School"
   - Mettre à jour les fonctions `getSchoolName`, `getRegionName`, `getDistrictName`, `getSchoolRegion`, `getSchoolDistrict` pour prioriser `nameLocal` quand la locale correspond

7. **Traduire dans `LoginClient.tsx`**
   - Ajouter la condition `is[Country]` pour la détection de locale
   - Traduire tous les éléments :
     - Messages d'erreur/succès (toast)
     - Citation motivante (titre et sous-titre)
     - Texte "Welcome"
     - Texte "Your Credentials"
     - Texte "No account? Start the adventure"
     - Label "E-mail"
     - Placeholder d'email
     - Label "Password"
     - Texte "Forgot?"
     - Texte bouton "Google Sign In"
     - Texte bouton "Sign In" (état normal et "Connecting..." pendant le chargement)

## Étape 7 : Test et validation

1. **Exécuter le script de seed**
   ```bash
   npm run db:seed:[code_pays]
   ```

2. **Vérifier le nombre de régions**
   - Doit correspondre au nombre officiel de régions du pays
   - Pas de duplications

3. **Vérifier les noms des régions**
   - Doivent être des noms officiels, pas des codes numériques
   - Créer un script de vérification temporaire si nécessaire

4. **Vérifier les districts**
   - Doivent être correctement liés aux régions
   - Noms corrects

5. **Vérifier les écoles**
   - Toutes les écoles doivent avoir un nom valide
   - Coordonnées GPS valides
   - Type d'école correct

6. **Vérifier les traductions**
   - Fichier JSON de traduction créé et complet
   - RegisterClient.tsx : dictionnaire complet
   - SchoolPicker.tsx : tous les labels traduits
   - LoginClient.tsx : tous les labels traduits
   - Middleware et routing mis à jour

## Étape 8 : Ajouter le script npm

1. **Ajouter dans `package.json`**
   ```json
   "scripts": {
     "db:seed:[code_pays]": "node src/db/seeds/seed-schools-[code_pays].js"
   }
   ```

## Étape 9 : Nettoyage

1. **Supprimer les scripts de vérification temporaires**
2. **Commit et push des changements**
   ```bash
   git add .
   git commit -m "Add [PAYS] schools database"
   git push
   ```

## Checklist de validation

- [ ] Fichier CSV placé dans le bon dossier
- [ ] Script de seed créé et configuré
- [ ] Mapping des régions créé avec codes officiels
- [ ] Codes invalides filtrés
- [ ] Anciennes données supprimées avant insertion
- [ ] Régions manquantes ajoutées
- [ ] Traductions ajoutées (middleware, routing, messages/[locale].json, RegisterClient, SchoolPicker, LoginClient)
- [ ] Niveaux scolaires ajoutés
- [ ] Script npm ajouté
- [ ] Base de données testée et validée
- [ ] Pas de codes numériques dans les noms de régions
- [ ] Nombre correct de régions
- [ ] Nettoyage effectué
- [ ] Changements commités et poussés

## Points critiques à retenir

1. **Toujours utiliser le code le plus court possible comme clé de région** (évite les duplications)
2. **Toujours filtrer les codes invalides** (évite les régions avec des noms numériques)
3. **Toujours supprimer les anciennes données avant insertion** (évite les conflits)
4. **Toujours ajouter les régions manquantes** (complétude des données)
5. **Toujours créer le fichier JSON de traduction complet** (toutes les sections Hero, Impact, Nav, Auth, Portals, Ecosystem, etc.)
6. **Toujours vérifier toutes les traductions dans les composants** (RegisterClient, SchoolPicker, LoginClient)
