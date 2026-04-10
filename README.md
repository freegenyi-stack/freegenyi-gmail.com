# FreeGeny PHP — Guide de Déploiement DZHoster

## 📋 Prérequis
- Hébergeur : **DZHoster** (cPanel)
- PHP : **ea-php80** (PHP 8.0)
- Domaine : **freegeny.com**
- Accès : **FTP** + **phpMyAdmin**

---

## 🗄️ ÉTAPE 1 — Base de données MySQL

1. Ouvrir **cPanel → MySQL Databases**
2. Créer une base : `freegeny_db` (ou avec le préfixe cPanel)
3. Créer un utilisateur MySQL et lui attribuer **tous les droits** sur la base
4. Ouvrir **phpMyAdmin**
5. Sélectionner la base `freegeny_db`
6. Cliquer sur **Importer** → choisir le fichier : `install/schema.sql`
7. Cliquer **Exécuter** ✅

---

## ⚙️ ÉTAPE 2 — Fichier .env

1. Copier `.env.example` → `.env`
2. Editer `.env` avec vos valeurs réelles :

```env
APP_ENV=production
APP_DEBUG=false

DB_HOST=localhost
DB_NAME=votre_prefix_freegenydb   # Exactement comme dans cPanel
DB_USER=votre_prefix_freeuser
DB_PASS=votre_mot_de_passe_fort
```

> ⚠️ Ne jamais uploader `.env` sur GitHub (déjà dans `.gitignore`)

---

## 📁 ÉTAPE 3 — Upload FTP

### Option A — FTP classique (FileZilla)

**Paramètres FTP DZHoster :**
- Hôte : `ftp.freegeny.com` ou l'IP fournie par DZHoster
- Port : 21
- Identifiants : vos credentials cPanel

**Ce que vous uploadez dans `public_html/` :**
```
Depuis votre PC : apps/web-php/
↓
Sur le serveur : public_html/
```

**Structure finale sur le serveur :**
```
public_html/
├── .htaccess        ✅
├── .env             ✅ (votre .env rempli, PAS le .env.example)
├── index.php        ✅
├── config/          ✅
├── includes/        ✅
├── api/             ✅
├── pages/           ✅
├── assets/          ✅
├── data/            ✅ (contient les JSONs)
├── lang/            ✅
├── install/         ✅
└── ...
```

> ⚠️ Ne pas uploader `node_modules/`, `.git/`, `.env.example`

### Option B — Git via cPanel (si activé sur DZHoster)

```bash
# Dans cPanel Terminal ou SSH
cd public_html
git clone https://github.com/votre-repo/freegonya.git .
# Copier le contenu de apps/web-php/ à la racine
```

---

## 📦 ÉTAPE 4 — Copie des fichiers JSON

Avant d'uploader, exécuter le script PowerShell pour copier les JSONs :

```powershell
# Dans PowerShell, depuis la racine du projet
.\apps\web-php\install\copy-json-data.ps1
```

Cela copie les JSONs depuis `Documentation_Programs_Contry/` vers `apps/web-php/data/`.

---

## 🔧 ÉTAPE 5 — Configuration PHP DZHoster

Dans **cPanel → MultiPHP Manager** :
- Sélectionner `public_html/`
- Choisir **ea-php80**

Dans **cPanel → PHP Selector** ou via `.htaccess` (déjà inclus) :
- `display_errors = Off`
- `memory_limit = 256M`

---

## ✅ ÉTAPE 6 — Test de déploiement

1. Ouvrir `https://freegeny.com` → doit afficher la landing page
2. Ouvrir `https://freegeny.com/auth/register` → page d'inscription
3. S'inscrire avec un compte test
4. Ouvrir `https://freegeny.com/dashboard/parent` → dashboard parent
5. Ouvrir `https://freegeny.com/algeria/1ap/arabe` → page matière Arabe

---

## 🔒 Sécurité post-déploiement

```bash
# Via cPanel File Manager — changer les permissions
chmod 644 .env          # Lecture seule
chmod 755 public_html/  # Répertoire traversable
chmod 644 *.php         # Fichiers PHP
```

- Vérifier que l'accès direct à `/config/` retourne 403 ✅
- Vérifier que l'accès direct à `/.env` retourne 403 ✅
- Vérifier HTTPS forcé ✅

---

## 🔄 Workflow de mise à jour

```
1. Modifier les fichiers localement (apps/web-php/)
2. git add . && git commit -m "feat: ..."
3. git push origin main
4. Sur DZHoster : FTP upload des fichiers modifiés
   OU git pull (si cPanel Git activé)
```

---

## 📞 Support DZHoster

- **Panel** : https://panel.dzhoster.com
- **phpMyAdmin** : accessible depuis cPanel
- **PHP version** : cPanel → MultiPHP Manager → ea-php80

---

## 🗂️ Structure des fichiers JSON sur le serveur

```
public_html/data/algeria/1ap/
├── arabe/
│   ├── presentation_arabe_1ap_latest.json
│   ├── curriculum_map_arabe_1ap_latest.json
│   ├── cours_arabe_1ap_latest.json
│   ├── exercices_arabe_1ap_latest.json
│   └── ... (autres JSONs)
└── mathematiques/
    ├── presentation_maths_1ap_latest.json
    ├── curriculum_map_maths_1ap_latest.json
    └── ... (autres JSONs)
```
