# FreeGeny — Usine curriculum

Source de vérité **fichiers JSON** → validation → import PostgreSQL → APIs mobile/web.

## Arborescence

```
curriculum/
├── factory.config.json       # config globale usine
├── schemas/                  # contrats JSON
├── manifests/                # profils parent / enseignant / enfant
└── countries/
    └── DZ/
        ├── registry.json       # niveaux 1AP–5AP, matières, statuts
        └── levels/
            └── {1AP|2AP|…}/
                ├── meta.json
                └── {subject}/
                    ├── curriculum.json
                    ├── competences.json
                    ├── exercise_bank.json
                    └── evaluations.json
```

## Codes Algérie

| Niveau | Code   |
|--------|--------|
| 1ère AP | `1AP` |
| 2ème AP | `2AP` |
| …      | `5AP` |

| Matière officielle | Code |
|--------------------|------|
| Arabe + islamique + civique | `ar_islam_civique` |
| Maths + EST | `math_est` |

## Commandes (depuis `web/`)

```bash
npm run curriculum:validate          # valide tous les bundles DZ
npm run curriculum:scaffold -- DZ 2AP  # génère structure vide 2AP depuis _TEMPLATE
npm run curriculum:import -- DZ 1AP    # importe un niveau en base
npm run db:migrate:curriculum-v1       # crée les tables (1×)
```

## Flux produit

1. **Édition** — JSON dans `countries/DZ/levels/…` (IA, toi, équipe pédagogique)
2. **Validation** — `curriculum:validate`
3. **Import** — snapshot versionné en DB (`curriculum_bundles`)
4. **Runtime** — loader serveur + `session-builder` (variantes d’énoncés)
5. **Mobile** — parcours Duolingo + Geny parent + missions enseignant (même player)

## Scalabilité

- Nouveau pays → `countries/MA/registry.json` + mêmes manifests adaptés
- Nouveau niveau DZ → `npm run curriculum:scaffold -- DZ 2AP` (depuis `web/`) → remplir → validate → import
- Changer d’avis → modifier JSON, re-valider, re-importer (version incrémentée)

## Pilote actuel

- **DZ · 1AP · maqta 1** (arabe « عائلتي ») + **maths nombres 1–5**
- Niveaux **2AP–5AP** : stubs `status: planned` (structure prête)
