# Documentation Technique - FreeGeny Dashboards

## Variables d'Environnement (.env.local)

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/freegeny?schema=public"

# Authentification
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre_secret_ici"

# Services Tiers (Optionnel pour le moment)
NEXT_PUBLIC_MAPBOX_TOKEN="votre_token_mapbox"
STRIPE_SECRET_KEY="votre_cle_stripe"
AWS_S3_BUCKET="freegeny-assets"
```

## Structure des Rôles (RBAC)
Les accès sont gérés par le champ `role` dans le modèle `User` :
- `PARENT` -> `/dashboard/parent`
- `TEACHER` -> `/dashboard/teacher`
- `NGO_ADMIN` -> `/dashboard/ngo`
- `ORG_ADMIN` -> `/dashboard/admin`

## API Endpoints (Prévus)
- `GET /api/progress`: Récupère la progression de l'élève.
- `POST /api/exercises/generate`: Algorithme de génération d'exercices.
- `GET /api/ngo/impact`: Agrégation des KPIs pour les ONG.
- `GET /api/admin/metrics`: Statistiques nationales consolidées.

## Déploiement
- **Frontend** : Connecter le repo à Vercel. Les variables `@/*` sont configurées dans `tsconfig.json`.
- **Database** : `npx prisma migrate dev` pour initialiser le schéma.
