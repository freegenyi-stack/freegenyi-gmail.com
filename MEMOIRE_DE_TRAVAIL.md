# MÉMOIRE DE TRAVAIL - RÉGLAGES VALIDÉS PAR L'UTILISATEUR
# NE JAMAIS MODIFIER SANS ORDRE EXPLICITE

---

## 1. HEADER — BARRE DE NAVIGATION (Header.tsx)

- **Position :** `top-0` FIXE. Collée en haut sans aucun espace.
- **Style :** Barre NORMALE pleine largeur. PAS de bords arrondis. Fond `bg-white/90` avec `border-b` en bas. Hauteur fixe `h-14`.
- **Largeur Contenu :** `w-[74%] mx-auto` (soit 13% de marge de chaque côté). Appliqué au Header et à toutes les sections de la page.
- **Éléments agrandis :**
  - Logo : `h-9 md:h-11` (texte `text-2xl md:text-3xl`).
  - Nav links : `text-[11px]`.
  - Boutons : `px-7 py-3 text-[12px]`.
- **Logo :** Utiliser `<Image src="/assets/img/logo.png" .../>` (le vrai logo PNG du projet) et texte `FREEGENY` (majuscules).
- **Sélecteur de pays/langue :**
  - Drapeaux PETITS (`w-4 h-auto` dans la liste, `w-5 h-auto` sur le bouton) SANS BORDURE.
  - Le pays actuellement sélectionné apparaît **EN PREMIER** dans la liste déroulante.
  - Clic sur une langue → changement immédiat (`setRegion(code, l); setCountryOpen(false);`).
  - Design simple : fond blanc, pas de glassmorphism complexe sur le sélecteur.

---

## 2. HERO SECTION — LAYOUT RTL (page.tsx)

- **En mode Arabe (`isRTL = true`) :**
  - Le **TEXTE** est à **DROITE** (`order-1 lg:order-2`)
  - La **PHOTO** est à **GAUCHE** (`order-2 lg:order-1`)
  - Le container flex utilise `lg:flex-row-reverse` quand `isRTL`
- **Ne JAMAIS supprimer les classes `order-X` sur ces deux divs.**

---

## 3. CITATIONS — STYLE LUXE (page.tsx)

- **Cadre :** Glassmorphism pur → `backdrop-blur-2xl bg-white/40 border border-white/50`
- **Guillemets :** Orange foncé → `text-orange-600/30` (pas `/10` ou `/20`)
- **Rotation :** `-2 degrés` (`rotate: -2` dans l'animation whileInView)
- **Citation Science (section Innovation) :** Même traitement glassmorphique.

---

## 4. ESPACEMENTS & POLICES

- **Padding Hero :** `md:pt-12` (ne pas remettre `pt-32`).
- **Police principale :** Plus Jakarta Sans.
- **Polices Arabe :** `font-amiri` pour les titres, `font-lateef` pour les paragraphes.

---

## 5. RÈGLES DE COMPORTEMENT

- Ne jamais faire de changements visuels massifs sans prévenir.
- Ne jamais remplacer le fichier entier si on peut faire un remplacement ciblé.
- En cas de doute sur le JSX : utiliser des en-têtes de section en ASCII pur (pas d'accents dans les commentaires JSX).
