# Architecture FreeGeny - Guide de Référence

> **Date de mise à jour :** 2026-02-02  
> **Statut :** ✅ Architecture validée et documentée

## 🎯 Décisions Architecturales Clés

### 1. Gestion des Traductions (39 langues)

**✅ DÉCISION FINALE : Approche Hybride**

#### Pour l'Interface Utilisateur (UI)
- **Fichier unique** : `assets/js/i18n.js` (401 KB actuellement)
- **Contenu** : Navigation, boutons, labels, messages courts
- **Limite recommandée** : Maximum 1 MB
- **Chargement** : Au démarrage de chaque page

#### Pour le Contenu Éducatif
- **Stockage** : Base de données MySQL/PostgreSQL
- **Accès** : API REST (`api/get_content.php`)
- **Chargement** : Dynamique, à la demande
- **Capacité** : Illimitée

### 2. Règle d'Or

```
┌────────────────────────────────────────────┐
│  INTERFACE (< 100 caractères) → i18n.js   │
│  CONTENU ÉDUCATIF → Base de données       │
└────────────────────────────────────────────┘
```

## 📁 Structure des Fichiers

### Traductions UI
```
assets/js/i18n.js
├─ 39 langues complètes
├─ Traductions d'interface uniquement
└─ Taille : ~400 KB (OK ✅)
```

### Contenu Éducatif
```
Base de données : educational_content
├─ content_type (lesson, exercise, quiz, game)
├─ content_key (identifiant unique)
├─ language (fr, ar, en, etc.)
├─ title, description, body
└─ media_url, difficulty_level, age_group
```

## 🚫 Ce qu'il NE FAUT JAMAIS FAIRE

❌ **Ne créez JAMAIS de fichiers `i18n_*.js` supplémentaires**  
❌ **Ne mettez JAMAIS le contenu éducatif dans `i18n.js`**  
❌ **Ne lancez JAMAIS de scripts qui modifient automatiquement `i18n.js`**  
❌ **Ne dupliquez JAMAIS les traductions dans plusieurs fichiers**

## ✅ Bonnes Pratiques

### Ajouter une Traduction UI
1. Ouvrir `assets/js/i18n.js`
2. Ajouter la clé dans TOUTES les 39 langues
3. Tester dans le navigateur
4. Commiter sur GitHub

### Ajouter du Contenu Éducatif
1. Insérer dans la base de données via SQL
2. Utiliser l'API `get_content.php` pour charger
3. Ne JAMAIS mettre dans `i18n.js`

## 📊 Limites Techniques

| Élément | Limite Actuelle | Limite Max | Statut |
|---------|----------------|------------|--------|
| `i18n.js` | 401 KB | 1 MB | ✅ OK |
| Langues supportées | 39 | 50 | ✅ OK |
| Clés par langue | ~150 | ~400 | ✅ OK |
| Contenu éducatif | 0 (en DB) | Illimité | ✅ OK |

## 🔧 Fichiers Critiques

### À NE JAMAIS SUPPRIMER
- `assets/js/i18n.js` - Traductions UI
- `home.html`, `login.html` - Pages principales
- `*_dashboard.html` - Dashboards
- `.htaccess` - Configuration serveur

### Fichiers Temporaires Nettoyés (2026-02-02)
- ❌ `generate_translations.py` (supprimé)
- ❌ `inject_translations.py` (supprimé)
- ❌ `verify_translations.js` (supprimé)
- ❌ `i18n_missing_translations.js` (supprimé)
- ❌ Fichiers markdown obsolètes (supprimés)

## 🗄️ Base de Données (À Créer)

### Table : educational_content
```sql
CREATE TABLE educational_content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content_type VARCHAR(50) NOT NULL,
    content_key VARCHAR(100) NOT NULL,
    language VARCHAR(10) NOT NULL,
    title TEXT,
    description TEXT,
    body LONGTEXT,
    media_url VARCHAR(500),
    difficulty_level INT,
    age_group VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_content (content_key, language)
);
```

## 📝 Historique des Problèmes Résolus

### Problème : Traductions qui disparaissent (Jan 2026)
**Cause** : Multiples fichiers de traductions en conflit  
**Solution** : Fichier unique `i18n.js` + nettoyage de 11 fichiers  
**Statut** : ✅ Résolu définitivement (2026-02-02)

### Problème : Risque de débordement de i18n.js
**Cause** : Tentation de mettre tout le contenu dans un seul fichier  
**Solution** : Architecture hybride (UI dans fichier, contenu en DB)  
**Statut** : ✅ Architecture documentée (2026-02-02)

## 🚀 Prochaines Étapes

### Court Terme (1-2 mois)
- [ ] Créer la base de données MySQL
- [ ] Créer l'API `api/get_content.php`
- [ ] Migrer 1-2 leçons test
- [ ] Tester le chargement dynamique

### Moyen Terme (3-6 mois)
- [ ] Migrer tout le contenu du dossier `programs/`
- [ ] Optimiser avec cache Redis
- [ ] Ajouter CDN pour les médias

### Long Terme (6-12 mois)
- [ ] Interface admin pour gérer le contenu
- [ ] Workflow de traduction intégré
- [ ] Versioning du contenu

## 📚 Documents de Référence

- [`decision_finale_langues.md`](file:///C:/Users/Yousr/.gemini/antigravity/brain/2f825179-b9b5-4411-9777-40daddeafe2f/decision_finale_langues.md) - Analyse complète des 3 discussions
- [`architecture_contenu_massif.md`](file:///C:/Users/Yousr/.gemini/antigravity/brain/2f825179-b9b5-4411-9777-40daddeafe2f/architecture_contenu_massif.md) - Plan détaillé avec code
- [`walkthrough.md`](file:///C:/Users/Yousr/.gemini/antigravity/brain/2f825179-b9b5-4411-9777-40daddeafe2f/walkthrough.md) - Résumé des travaux effectués

## 💡 Principe Directeur

> **"Start simple, scale smart"**
> 
> Commencez avec ce qui fonctionne (`i18n.js`), puis évoluez progressivement vers une architecture plus sophistiquée (base de données) quand le besoin se présente.

---

**Maintenu par :** Équipe FreeGeny  
**Dernière révision :** 2026-02-02  
**Version :** 1.0
