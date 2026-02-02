# Configuration Git Double Push - FreeGeny

## ✅ Étape 1 : Clé SSH Créée

**Date :** 2026-02-02 11:17
**Emplacement :** `C:\Users\Yousr\.ssh\id_rsa`
**Fingerprint :** `SHA256:bn1PObr0YnTtXqtEwjEQhlGe01cZgebT6xA35iySc6I`

---

## 📋 Prochaines Étapes

### Étape 2 : Copier la Clé Publique dans cPanel

1. **Ouvrez cPanel** → SSH Access → Manage SSH Keys
2. Cliquez sur **"Import Key"**
3. **Collez la clé publique** (voir ci-dessous)
4. Cliquez sur **"Import"**
5. Cliquez sur **"Authorize"**

### Étape 3 : Obtenir les Informations SSH

Dans cPanel, notez :
- **Nom d'utilisateur SSH** : (généralement votre nom d'utilisateur cPanel)
- **Serveur SSH** : (généralement votre domaine ou IP)
- **Port SSH** : (généralement 22)

### Étape 4 : Configurer Git Remote

Une fois la clé autorisée, exécutez :

```powershell
# Remplacez USERNAME et DOMAIN par vos vraies valeurs
git remote set-url --add --push origin ssh://USERNAME@DOMAIN/home/USERNAME/public_html

# Ajouter aussi GitHub
git remote set-url --add --push origin https://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@github.com/freegenyi-stack/freegenyi-gmail.com.git
```

### Étape 5 : Tester

```powershell
# Tester la connexion SSH
ssh USERNAME@DOMAIN

# Si ça marche, tester le push
git push origin master
```

---

## 🔑 Votre Clé Publique SSH

**À copier dans cPanel :**

(La clé sera affichée dans le terminal)

---

## 📝 Notes

- La clé privée (`id_rsa`) reste sur votre ordinateur
- Ne partagez JAMAIS la clé privée
- La clé publique (`id_rsa.pub`) peut être partagée avec cPanel

---

**Statut :** 🔄 Test de connexion en cours...
