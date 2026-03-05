# FreeGeny - Guide de Déploiement

## 🚀 Prérequis

- Node.js 18+
- PostgreSQL 14+
- npm ou pnpm
- Comptes services externes (optionnel) :
  - Resend (email)
  - Twilio (SMS)
  - AWS S3 (stockage)
  - Stripe (paiements)

## 📦 Installation

### 1. Cloner et installer

```bash
git clone https://github.com/your-org/freegeny.git
cd freegeny/apps/web
npm install
```

### 2. Configuration environnement

Créer un fichier `.env.local` :

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/freegeny?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-min-32-chars"

# Email (Resend)
RESEND_API_KEY="re_xxxx"

# SMS (Twilio)
TWILIO_ACCOUNT_SID="ACxxxx"
TWILIO_AUTH_TOKEN="xxxx"
TWILIO_PHONE_NUMBER="+1234567890"

# Stockage (AWS S3)
AWS_ACCESS_KEY_ID="AKIAXXXX"
AWS_SECRET_ACCESS_KEY="xxxx"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="freegeny-storage"

# Push Notifications
VAPID_PUBLIC_KEY="xxxx"
VAPID_PRIVATE_KEY="xxxx"
NEXT_PUBLIC_VAPID_PUBLIC_KEY="xxxx"

# Stripe (Paiements)
STRIPE_SECRET_KEY="sk_xxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_xxxx"
```

### 3. Base de données

```bash
# Générer le client Prisma
npx prisma generate

# Créer et appliquer les migrations
npx prisma migrate dev --name init

# (Optionnel) Seed des données de test
npx prisma db seed
```

### 4. Lancer en développement

```bash
npm run dev
# ou avec turbopack
npm run dev -- --turbo
```

Accéder à `http://localhost:3000`

## 🐳 Déploiement Docker

### Build de l'image

```bash
docker build -t freegeny:latest .
```

### Run avec Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    image: freegeny:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/freegeny
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=freegeny
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

```bash
docker-compose up -d
```

## ☁️ Déploiement Vercel

### 1. Configurer le projet

```bash
npm i -g vercel
vercel login
vercel
```

### 2. Variables d'environnement sur Vercel

Dans le dashboard Vercel, ajouter toutes les variables du `.env.local`

### 3. Database (Supabase ou Railway)

Créer une base PostgreSQL et mettre à jour `DATABASE_URL`

## 🔒 Sécurité

### Headers de sécurité (déjà configurés dans next.config.js)

- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

### Rate Limiting

À configurer sur votre reverse proxy (Nginx, Vercel Edge, etc.)

```nginx
# Exemple Nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;
```

## 📊 Monitoring

### Health Check

```bash
curl https://your-domain.com/api/health
```

### Logs

```bash
# Docker
docker logs -f freegeny

# Vercel
vercel logs
```

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests E2E
npm run test:e2e

# Tests avec UI
npm run test:e2e -- --ui
```

## 🔄 CI/CD Pipeline

### GitHub Actions (exemple)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
      - run: npm run test:e2e

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## 📈 Performance

### Optimisations appliquées

- **Next.js 14** avec App Router
- **Turbopack** pour le dev rapide
- **Images** optimisées avec Next/Image
- **Fonts** optimisées avec next/font
- **Code Splitting** automatique
- **PWA** avec service worker et cache

### Lighthouse Scores Target

- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## 🆘 Troubleshooting

### Problèmes courants

**Erreur Prisma Client**
```bash
npx prisma generate
```

**Erreur de connexion DB**
Vérifier `DATABASE_URL` et les permissions PostgreSQL

**NextAuth ne fonctionne pas**
Vérifier `NEXTAUTH_SECRET` et `NEXTAUTH_URL`

**Build échoue**
```bash
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

## 📞 Support

- Documentation: https://docs.freegeny.com
- Email: support@freegeny.com
- Slack: [Workspace FreeGeny]

## 📄 Licences

- Code: MIT
- Contenu éducatif: CC BY-SA 4.0
