# 🎓 Méthodologie Globale de Production Éducative — FreeGeny

Ce dossier est le **centre de pilotage pédagogique** de la plateforme FreeGeny. Les ressources ici sont conçues pour n'importe quel pays, niveau et matière.

---

## 📁 Organisation

```
prompts/
├── README.md                    ← Ce fichier (Guide d'utilisation)
└── deepseek/
    ├── 0_brief_culturel.md     ← FONDATION : Brief culturel & contextuel (À faire en premier)
    ├── 1_competences.md        ← Étape 1 : Référentiel des compétences
    ├── 2_programme.md          ← Étape 2 : Planning annuel séquencé
    ├── 3_lecons.md             ← Étape 3 : Conception de leçons enrichies
    ├── 4_exercices.md          ← Étape 4 : Banque d'exercices de masse
    ├── 5_examens.md            ← Étape 5 : Examens et remédiation
    ├── 6_checklist_qualite.md  ← VALIDATION : À faire avant d'envoyer à Antigravity
    └── 7_differenciation.md    ← BONUS : Variantes pour élèves en difficulté / en avance
```

## 🚀 Workflow Opérationnel (À SUIVRE DANS L'ORDRE)

### Avant de commencer :
Identifiez et notez ces 4 valeurs. Vous devrez remplacer les balises dans chaque prompt :
| Balise | Valeur à substituer | Exemple |
|--------|---------------------|---------|
| `[PAYS]` | Nom du pays | Algérie |
| `[NIVEAU]` | Niveau scolaire | 1AP |
| `[MATIÈRE]` | Matière | Langue Arabe |
| `[ÂGE]` | Âge moyen des élèves | 6 ans |

---

### Étape 1 — Compétences (`1_competences.md`)
**Ce que vous apportez à DeepSeek :** Photos du livre officiel (couverture + sommaire + 3-4 pages de leçons type).
**Ce que DeepSeek vous rend :** Un référentiel structuré avec compétences, indicateurs et obstacles.
**Où stocker le résultat :** `[CODE PAYS]/[NIVEAU]/[MATIÈRE]/01_competences.md`

### Étape 2 — Programme (`2_programme.md`)
**Ce que vous apportez :** Le calendrier scolaire officiel + le sommaire du manuel.
**Ce que DeepSeek vous rend :** Un planning annuel complet séquence par séquence.
**Où stocker :** `[CODE PAYS]/[NIVEAU]/[MATIÈRE]/02_programme_annuel.md`

### Étape 3 — Leçons (`3_lecons.md`)
**Ce que vous apportez :** Le titre de la leçon et les pages correspondantes du manuel.
**Ce que DeepSeek vous rend :** Une leçon complète avec phases, règle, et micro-exercices intégrés.
**Où stocker :** `[CODE PAYS]/[NIVEAU]/[MATIÈRE]/03_lecon_[N]_[TITRE].md`

### Étape 4 — Exercices (`4_exercices.md`)
**Ce que vous apportez :** Le nom de la notion + la leçon produite à l'étape 3.
**Ce que DeepSeek vous rend :** 30+ exercices variés (digital & print), classifiés et balisés.
**Où stocker :** `[CODE PAYS]/[NIVEAU]/[MATIÈRE]/04_exercices_[NOTION].md`

### Étape 5 — Examens (`5_examens.md`)
**Ce que vous apportez :** La liste des séquences couvertes + le référentiel (étape 1).
**Ce que DeepSeek vous rend :** Sujet complet + barème + corrigé + fiche remédiation parent.
**Où stocker :** `[CODE PAYS]/[NIVEAU]/[MATIÈRE]/05_examen_[PERIODE].md`

---

## ⚠️ Principes Clés de Qualité

1. **Pas de sous-dossiers** dans `[CODE PAYS]/[NIVEAU]/[MATIÈRE]/` — tous les fichiers sont à plat.
2. **Nommage strict :** Préfixe numérique (`01_`, `02_`...) pour un tri automatique correct.
3. **Si un résultat est "banal"** : Demandez à DeepSeek *"Rehausse le niveau de richesse pédagogique et adapte chaque exemple à la réalité culturelle de [PAYS]"*.
4. **Validation par Antigravity** : Après chaque étape, envoyez le résultat à Antigravity pour vérification de la conformité technique avant intégration dans l'application.

---

## 🗂️ Exemple de Structure Finale (Algérie, 1AP, Arabe)
```
dz/
├── signalitique.json
└── 1ap/
    └── arabe/
        ├── 01_competences.md
        ├── 02_programme_annuel.md
        ├── 03_lecon_1_ma_famille.md
        ├── 04_exercices_lettre_ba.md
        ├── 05_examen_trimestre1.md
        └── ...
```
