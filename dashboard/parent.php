<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';
initSession();

if (!isset($_SESSION['logged_in'])) { header('Location: /auth/login'); exit; }

$userId = $_SESSION['user_id'];
$success_msg = '';

// ── Traitement Formulaire ────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $prenom = htmlspecialchars(trim($_POST['prenom'] ?? ''));
    $nom    = htmlspecialchars(trim($_POST['nom'] ?? ''));
    $phone  = htmlspecialchars(trim($_POST['telephone'] ?? ''));
    $color  = $_POST['couleur'] ?? '#2563eb';
    $fullName = trim($prenom . ' ' . $nom);

    DB::execute(
        "UPDATE users SET full_name = ?, phone = ?, preferred_color = ? WHERE id = ?",
        [$fullName, $phone, $color, $userId]
    );
    $_SESSION['user_name'] = $fullName;
    $success_msg = 'Profil mis à jour avec succès.';
}

$user = DB::fetchOne("SELECT * FROM users WHERE id = ?", [$userId]);
$childrenCount = DB::fetchOne("SELECT COUNT(*) as total FROM children WHERE parent_id = ?", [$userId])['total'];
$initiales = getInitials($user['full_name']);

$nameParts = explode(' ', $user['full_name'], 2);
$prenom = $nameParts[0] ?? '';
$nom = $nameParts[1] ?? '';
$accentColor = $user['preferred_color'] ?? '#2563eb';

// Détection locale pour liens
$requestUri = $_SERVER['REQUEST_URI'];
preg_match('/^\/([A-Z]{2}-[a-z]{2})/', $requestUri, $matches);
$loc = $matches[1] ?? 'DZ-fr';
$baseUrl = "/" . $loc;

$avatarStyles = [
    'micah' => ['Oliver', 'Caleb', 'Jack', 'Avery', 'Riley', 'Jordan'],
    'avataaars' => ['Robert', 'Kimberly', 'Matthew', 'Susan', 'James', 'Linda'],
    'personas' => ['Felix', 'Aneka', 'Sasha', 'Matti', 'Lukas', 'Klaus']
];
?>
<!DOCTYPE html>
<html lang="fr" x-data="{ sidebarOpen: false, modalOpen: false, loading: false, selectedColor: '<?= $accentColor ?>' }">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mon Profil — FreeGeny</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
<style>
:root{
  --accent:<?= $accentColor ?>;
  --accent-light:<?= $accentColor ?>18;
  --accent-mid:<?= $accentColor ?>40;
  --bg:#fafaf9;--surface:#fff;--border:#e8e6e1;--border-soft:#f0ede8;
  --text-1:#1a1917;--text-2:#6b6860;--text-3:#a8a49e;
  --sidebar-w:260px;--radius:14px;--radius-sm:8px;
  --shadow-sm:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
  --shadow-md:0 8px 24px rgba(0,0,0,.10);
  --tr:.2s cubic-bezier(.4,0,.2,1);
}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text-1);min-height:100vh;display:flex;margin:0;}
[x-cloak]{display:none !important;}

/* ── Sidebar ─────────────────────────── */
.sidebar{width:var(--sidebar-w);background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;transition:transform var(--tr)}
.sidebar-logo{padding:28px 24px 20px;border-bottom:1px solid var(--border-soft);display:flex;align-items:center;gap:10px}
.logo-mark{width:32px;height:32px;border-radius:9px;background:var(--accent);display:flex;align-items:center;justify-content:center;font-family:'DM Serif Display',serif;color:#fff;font-size:16px}
.logo-text{font-size:17px;font-weight:600;letter-spacing:-.3px}
.sidebar-user{padding:20px 24px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border-soft)}
.s-avatar{width:42px;height:42px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:#fff;position:relative;overflow:hidden;}
.s-avatar img{width:100%;height:100%;object-fit:cover;}
.sidebar-nav{padding:12px;flex:1;overflow-y:auto}
.nav-label{font-size:10px;font-weight:600;text-transform:uppercase;color:var(--text-3);padding:8px 12px 6px}
.nav-item{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:var(--radius-sm);font-size:14px;color:var(--text-2);text-decoration:none;transition:all var(--tr);margin-bottom:2px}
.nav-item:hover{background:var(--bg);color:var(--text-1)}
.nav-item.active{background:var(--accent-light);color:var(--accent);font-weight:500}
.sidebar-footer{padding:16px 12px;border-top:1px solid var(--border-soft)}
.btn-logout{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--radius-sm);font-size:14px;color:var(--text-2);text-decoration:none;}

/* ── Main ───────────────────────────── */
.main{margin-left:var(--sidebar-w);flex:1;display:flex;flex-direction:column;min-height:100vh}
.topbar{background:var(--surface);border-bottom:1px solid var(--border);padding:0 40px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
.content{padding:40px;flex:1;max-width:900px;}
.page-title{font-family:'DM Serif Display',serif;font-size:30px;margin-bottom:6px}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:32px;box-shadow:var(--shadow-sm);margin-bottom:24px}

.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.form-group.full{grid-column:1/-1}
label{font-size:12px;font-weight:600;text-transform:uppercase;color:var(--text-3);display:block;margin-bottom:8px}
input{height:46px;padding:0 16px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:14px;width:100%;background:var(--bg);outline:none;}
input:focus{border-color:var(--accent);background:#fff;}

.btn-primary{height:46px;padding:0 24px;background:var(--accent);color:#fff;border:none;border-radius:var(--radius-sm);font-size:14px;font-weight:600;cursor:pointer;transition:all var(--tr)}
.btn-primary:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 4px 12px var(--accent-mid)}

.color-swatches{display:flex;gap:12px;margin-top:8px}
.swatch{width:34px;height:34px;border-radius:50%;cursor:pointer;border:3px solid #fff;box-shadow:0 0 0 1px var(--border);transition:all var(--tr)}
.swatch.selected{box-shadow:0 0 0 2px var(--text-1)}

@media(max-width:1024px){
  .sidebar{transform:translateX(-100%)}.sidebar.open{transform:translateX(0)}
  .main{margin-left:0}.topbar{padding:0 20px}
}
</style>
</head>
<body>

<aside class="sidebar" :class="sidebarOpen ? 'open' : ''">
  <div class="sidebar-logo">
    <div class="logo-mark">F</div>
    <div class="logo-text">FreeGeny</div>
  </div>

  <div class="sidebar-user">
    <div class="s-avatar">
        <?php if ($user['profile_photo']): ?><img src="<?= $user['profile_photo'] ?>"><?php else: ?><?= $initiales ?><?php endif; ?>
    </div>
    <div>
      <div class="u-name"><?= $user['full_name'] ?></div>
      <div class="u-role">Parent · <?= $childrenCount ?> enfant<?= $childrenCount>1?'s':'' ?></div>
    </div>
  </div>

  <nav class="sidebar-nav">
    <div class="nav-label">Principal</div>
    <a href="<?= $baseUrl ?>/dashboard/parent" class="nav-item">Tableau de bord</a>
    <a href="<?= $baseUrl ?>/dashboard/children" class="nav-item">Mes enfants</a>
    <div class="nav-label" style="margin-top:20px">Compte</div>
    <a href="<?= $baseUrl ?>/dashboard/parent" class="nav-item active">Mon profil</a>
  </nav>

  <div class="sidebar-footer">
    <a href="/api/auth/logout.php" class="btn-logout">Déconnexion</a>
  </div>
</aside>

<div class="main">
  <header class="topbar">
    <button class="lg:hidden" @click="sidebarOpen = true">☰</button>
    <span class="text-sm text-slate-400 italic">FreeGeny &rsaquo; Profil</span>
    <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black"><?= $initiales ?></div>
  </header>

  <div class="content">
    <h1 class="page-title">Mon profil parent</h1>
    <p class="text-slate-400 mb-10">Gérez vos informations et préférences FreeGeny</p>

    <?php if ($success_msg): ?>
        <div class="bg-green-50 text-green-600 p-4 rounded-xl mb-6 font-bold text-sm italic">✓ <?= $success_msg ?></div>
    <?php endif; ?>

    <form method="POST">
      <div class="card">
        <div class="flex items-center gap-6 mb-10 pb-10 border-b border-slate-50">
            <div class="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden cursor-pointer" @click="modalOpen = true">
                 <?php if ($user['profile_photo']): ?><img src="<?= $user['profile_photo'] ?>"><?php else: ?><?= $initiales ?><?php endif; ?>
            </div>
            <div>
                <h3 class="font-black text-slate-900"><?= $user['full_name'] ?></h3>
                <button type="button" @click="modalOpen = true" class="text-xs font-bold text-orange-600 underline">Changer ma photo</button>
            </div>
        </div>

        <div class="form-grid">
          <div class="form-group"><label>Prénom</label><input type="text" name="prenom" value="<?= $prenom ?>" required></div>
          <div class="form-group"><label>Nom</label><input type="text" name="nom" value="<?= $nom ?>" required></div>
          <div class="form-group full"><label>E-mail</label><input type="email" value="<?= $user['email'] ?>" disabled class="opacity-50"></div>
          <div class="form-group full"><label>Téléphone</label><input type="tel" name="telephone" value="<?= $user['phone'] ?>"></div>
        </div>

        <div class="mt-10">
            <label>Couleur du thème</label>
            <div class="color-swatches">
                <?php foreach (['#2563eb','#7c3aed','#059669','#dc2626','#ea580c','#374151'] as $c): ?>
                    <div class="swatch" :class="selectedColor === '<?= $c ?>' ? 'selected' : ''" 
                         style="background:<?= $c ?>"
                         @click="selectedColor = '<?= $c ?>'; document.getElementById('c_field').value = '<?= $c ?>'"></div>
                <?php endforeach; ?>
                <input type="hidden" name="couleur" id="c_field" value="<?= $accentColor ?>">
            </div>
        </div>

        <div class="flex justify-end mt-10">
            <button type="submit" class="btn-primary">Enregistrer les modifications</button>
        </div>
      </div>
    </form>
  </div>
</div>

<!-- MODAL AVATAR (Same Engine) -->
<template x-teleport="body">
    <div x-show="modalOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-6" x-cloak>
        <div class="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" @click="modalOpen = false"></div>
        <div class="relative bg-white w-full max-w-4xl rounded-[3rem] p-10 shadow-2xl overflow-hidden" x-transition>
            <div class="flex justify-between items-center mb-8">
                <h3 class="text-3xl font-black text-slate-900 italic tracking-tighter">Galerie d'avatars</h3>
                <button @click="modalOpen = false" class="text-slate-400 font-bold">✕</button>
            </div>
            
            <label class="block p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center cursor-pointer hover:bg-orange-50 transition-all">
                <span class="text-2xl block mb-2">📸</span>
                <span class="text-[10px] font-black uppercase text-slate-500">Uploader une photo</span>
                <input type="file" class="hidden" @change="loading = true; const fd = new FormData(); fd.append('avatar_file', $event.target.files[0]); fetch('/api/user/upload_avatar.php', { method: 'POST', body: fd }).then(r => window.location.reload())">
            </label>

            <div class="max-h-[50vh] overflow-y-auto mt-8 pr-4">
                <?php foreach ($avatarStyles as $style => $seeds): ?>
                    <h4 class="text-[9px] font-black text-slate-300 uppercase mt-6 mb-4">— STYLE <?= strtoupper($style) ?> —</h4>
                    <div class="grid grid-cols-6 gap-4">
                        <?php foreach ($seeds as $s): $url = "https://api.dicebear.com/7.x/$style/svg?seed=$s&backgroundColor=f8fafc"; ?>
                            <img src="<?= $url ?>" class="w-full aspect-square bg-slate-50 rounded-2xl p-2 cursor-pointer hover:border-orange-500 border-2 border-transparent transition-all" @click="loading = true; fetch('/api/user/upload_avatar.php', { method: 'POST', body: JSON.stringify({ avatar_choice: '<?= $url ?>' }) }).then(r => window.location.reload())">
                        <?php endforeach; ?>
                    </div>
                <?php endforeach; ?>
            </div>

            <div x-show="loading" class="absolute inset-0 bg-white/90 flex items-center justify-center text-xs font-black uppercase tracking-widest animate-pulse">Chargement...</div>
        </div>
    </div>
</template>

</body>
</html>
