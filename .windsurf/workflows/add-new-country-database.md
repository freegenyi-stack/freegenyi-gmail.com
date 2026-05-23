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
   - Ajouter dans `DEFAULT_COUNTRY_FOR_LOCALE` : `'sv: "SE"'`
   - Ajouter la condition de détection de locale

2. **Ajouter la locale dans `i18n/routing.ts`**
   - Ajouter dans le tableau `locales` : `'SE-sv'`

3. **Traduire les labels dans `RegisterClient.tsx`**
   - Ajouter les traductions pour le nouveau pays
   - Labels à traduire :
     - `childSchool` (nom de la région)
     - `childSchoolPlaceholder` (placeholder de recherche)
     - `childLevel` (niveaux scolaires)
     - `privateSchool`, `publicSchool` (types d'écoles)

4. **Traduire dans `SchoolPicker.tsx`**
   - Ajouter les conditions `is[Country]` pour :
     - Labels de types d'écoles ("All", "Public", "Private")
     - Placeholder de recherche
     - Message "no school found"
     - Label "Selected School"
   - Mettre à jour les fonctions `getSchoolName`, `getRegionName`, `getDistrictName` pour prioriser `nameLocal` quand la locale correspond

5. **Traduire dans `LoginClient.tsx`**
   - Ajouter les traductions pour :
     - Citation motivante
     - Texte du bouton de connexion

## Étape 7 : Niveaux scolaires

1. **Ajouter les niveaux dans `RegisterClient.tsx`**
   - Ajouter dans l'objet `levels` :
     ```javascript
     const levels: Record<string, string[]> = {
       // ...
       [COUNTRY_CODE]: ['Niveau 1', 'Niveau 2', 'Niveau 3'],
     };
     ```

## Étape 8 : Test et validation

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

## Étape 9 : Ajouter le script npm

1. **Ajouter dans `package.json`**
   ```json
   "scripts": {
     "db:seed:[code_pays]": "node src/db/seeds/seed-schools-[code_pays].js"
   }
   ```

## Étape 10 : Nettoyage

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
- [ ] Traductions ajoutées (middleware, routing, RegisterClient, SchoolPicker, LoginClient)
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
5. **Toujours vérifier les traductions** (cohérence de l'interface)
