<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';
initSession();

if (!isset($_SESSION['logged_in'])) { header('Location: /auth/login'); exit; }

$userId = $_SESSION['user_id'];
$success = ''; $error = '';

// ── Traitement BDD ───────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    if ($action === 'ajouter') {
        $prenom  = trim($_POST['prenom'] ?? '');
        $nom     = trim($_POST['nom'] ?? '');
        $naiss   = $_POST['naissance'] ?? '';
        $niveau  = $_POST['niveau'] ?? '';
        $couleur = $_POST['avatar_color'] ?? '#7c3aed';
        if ($prenom && $nom && $naiss && $niveau) {
            $pin = str_pad(rand(1000,9999), 4, '0', STR_PAD_LEFT);
            $alias = strtolower($prenom).rand(100,999);
            DB::insert("INSERT INTO children (parent_id, first_name, last_name, birth_date, grade_level, avatar_color, pin_code, child_id_alias, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)", [$userId, $prenom, $nom, $naiss, $niveau, $couleur, $pin, $alias]);
            $success = "Profil ajouté.";
        }
    }
    if ($action === 'toggle_actif') {
         $id = (int)$_POST['enfant_id'];
         DB::execute("UPDATE children SET is_active = NOT is_active WHERE id = ? AND parent_id = ?", [$id, $userId]);
    }
    if ($action === 'supprimer') {
        $id = (int)$_POST['enfant_id'];
        DB::execute("DELETE FROM children WHERE id = ? AND parent_id = ?", [$id, $userId]);
        $success = 'Profil supprimé.';
    }
}

$user = DB::fetchOne("SELECT * FROM users WHERE id = ?", [$userId]);
$enfants = DB::fetchAll("SELECT * FROM children WHERE parent_id = ? ORDER BY created_at DESC", [$userId]);
$accentColor = $user['preferred_color'] ?? '#2563eb';
$initiales_parent = getInitials($user['full_name']);

$niveaux = ['Maternelle','CP','CE1','CE2','CM1','CM2','6ème','5ème','4ème','3ème'];
$palette = ['#7c3aed','#059669','#ea580c','#0891b2','#be185d','#dc2626','#ca8a04','#374151'];

// Détection locale
$requestUri = $_SERVER['REQUEST_URI'];
preg_match('/^\/([A-Z]{2}-[a-z]{2})/', $requestUri, $matches);
$loc = $matches[1] ?? 'DZ-fr';
$baseUrl = "/" . $loc;

function niveau_badge($niveau) {
    $map = ['Maternelle'=>'#be185d','CP'=>'#7c3aed','CE1'=>'#2563eb','CE2'=>'#0891b2','CM1'=>'#059669','CM2'=>'#16a34a','6ème'=>'#ca8a04','5ème'=>'#dc2626','4ème'=>'#ea580c','3ème'=>'#374151'];
    return $map[$niveau] ?? '#374151';
}
?>
<!DOCTYPE html>
<html lang="fr" x-data="{ sidebarOpen: false, modalAjouter: false, modalEditer: false, editingEnfant: {} }">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mes enfants — FreeGeny</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
<style>
:root{
  --accent:<?= $accentColor ?>;
  --accent-light:<?= $accentColor ?>18;
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
.logo-text{font-size:17px;font-weight:600;}
.sidebar-user{padding:20px 24px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border-soft)}
.s-avatar{width:42px;height:42px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:#fff;position:relative;overflow:hidden;}
.s-avatar img{width:100%;height:100%;object-fit:cover;}
.sidebar-nav{padding:12px;flex:1;overflow-y:auto}
.nav-item{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:var(--radius-sm);font-size:14px;color:var(--text-2);text-decoration:none;transition:all var(--tr);margin-bottom:2px}
.nav-item.active{background:var(--accent-light);color:var(--accent);font-weight:500}
.sidebar-footer{padding:16px 12px;border-top:1px solid var(--border-soft)}
.btn-logout{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--radius-sm);font-size:14px;color:var(--text-2);text-decoration:none;}

/* ── Main ───────────────────────────── */
.main{margin-left:var(--sidebar-w);flex:1;display:flex;flex-direction:column;min-height:100vh}
.topbar{background:var(--surface);border-bottom:1px solid var(--border);padding:0 40px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
.content{padding:40px;flex:1}
.page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:36px}
.btn-add{height:42px;padding:0 20px;background:var(--accent);color:#fff;border-radius:var(--radius-sm);font-size:14px;font-weight:500;cursor:pointer;border:none;}

.children-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:20px}
.child-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow-sm);transition:all var(--tr)}
.child-card.inactive{opacity:.6}
.child-card-top{padding:22px;display:flex;align-items:center;gap:16px;border-bottom:1px solid var(--border-soft)}
.child-avatar{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:600;color:#fff;}
.child-card-body{padding:16px 22px}
.child-detail-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border-soft);font-size:13px}
.pin-blur{filter:blur(4px);cursor:pointer;}
.pin-blur:hover{filter:blur(0)}
.child-card-actions{display:flex;gap:8px;padding:16px 22px;border-top:1px solid var(--border-soft);background:var(--bg)}
.btn-sw{flex:1;height:34px;border-radius:var(--radius-sm);font-size:12px;font-weight:600;cursor:pointer;border:none;display:flex;align-items:center;justify-content:center;gap:6px;}
.btn-sw.actif{background:var(--accent-light);color:var(--accent)}
.btn-sw.inactif{background:#f1f5f9;color:#64748b}

.modal-overlay{position:fixed;inset:0;background:rgba(15,15,15,.55);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(2px)}
.modal{background:#fff;border-radius:var(--radius);width:100%;max-width:520px;box-shadow:var(--shadow-md)}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:24px 32px}
.btn-p{height:42px;padding:0 24px;background:var(--accent);color:#fff;border-radius:8px;border:none;font-weight:600;}

@media(max-width:1024px){
  .sidebar{transform:translateX(-100%)}.sidebar.open{transform:translateX(0)}
  .main{margin-left:0}
}
</style>
</head>
<body x-data="{ sidebarOpen: false, modalAjouter: false, editingEnfant: {} }">

<aside class="sidebar" :class="sidebarOpen ? 'open' : ''">
  <div class="sidebar-logo">
    <div class="logo-mark">F</div>
    <div class="logo-text">FreeGeny</div>
  </div>
  <div class="sidebar-user">
    <div class="s-avatar">
        <?php if ($user['profile_photo']): ?><img src="<?= $user['profile_photo'] ?>"><?php else: ?><?= $initiales_parent ?><?php endif; ?>
    </div>
    <div><p class="font-bold text-sm"><?= $user['full_name'] ?></p><p class="text-[10px] text-slate-400">Parent Elite</p></div>
  </div>
  <nav class="sidebar-nav">
    <div class="nav-label">Principal</div>
    <a href="<?= $baseUrl ?>/dashboard/parent" class="nav-item">Tableau de bord</a>
    <a href="<?= $baseUrl ?>/dashboard/children" class="nav-item active">Mes enfants</a>
  </nav>
  <div class="sidebar-footer"><a href="/api/auth/logout.php" class="btn-logout">Déconnexion</a></div>
</aside>

<div class="main">
  <header class="topbar">
    <button class="lg:hidden" @click="sidebarOpen = true">☰</button>
    <span class="text-sm text-slate-400 italic">Mes enfants</span>
    <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black"><?= $initiales_parent ?></div>
  </header>

  <div class="content">
    <div class="page-header">
      <div><h1 class="font-black text-3xl">Gestion des enfants</h1><p class="text-slate-400">Gérez les profils et les accès</p></div>
      <button class="btn-add" @click="modalAjouter = true">+ Ajouter un enfant</button>
    </div>

    <?php if ($success): ?><div class="bg-green-50 text-green-600 p-4 rounded-xl mb-6 font-bold text-sm italic">✓ <?= $success ?></div><?php endif; ?>

    <div class="children-grid">
      <?php foreach ($enfants as $e): 
          $initiales = strtoupper(substr($e['first_name'],0,1).(isset($e['last_name'][0])?substr($e['last_name'],0,1):''));
      ?>
      <div class="child-card <?= $e['is_active'] ? '' : 'inactive' ?>">
        <div class="child-card-top">
          <div class="child-avatar" style="background:<?= $e['avatar_color'] ?>"><?= $initiales ?></div>
          <div class="child-info"><h3 class="font-bold"><?= $e['first_name'].' '.$e['last_name'] ?></h3><p class="text-xs text-slate-400"><?= $e['grade_level'] ?></p></div>
        </div>
        <div class="child-card-body">
          <div class="child-detail-row"><span>ID</span><strong><?= $e['child_id_alias'] ?></strong></div>
          <div class="child-detail-row"><span>PIN</span><strong class="pin-blur"><?= $e['pin_code'] ?></strong></div>
        </div>
        <div class="child-card-actions">
           <form method="POST"><input type="hidden" name="action" value="toggle_actif"><input type="hidden" name="enfant_id" value="<?= $e['id'] ?>"><button type="submit" class="btn-sw <?= $e['is_active']?'actif':'inactif' ?>"><?= $e['is_active']?'Actif':'Archivé' ?></button></form>
           <form method="POST"><input type="hidden" name="action" value="supprimer"><input type="hidden" name="enfant_id" value="<?= $e['id'] ?>"><button type="submit" class="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">🗑</button></form>
        </div>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</div>

<!-- MODAL AJOUTER -->
<template x-teleport="body">
    <div x-show="modalAjouter" class="modal-overlay" x-cloak>
      <div class="modal" @click.away="modalAjouter = false">
        <h3 class="p-8 pb-0 text-2xl font-black italic">Ajouter un enfant</h3>
        <form method="POST">
          <input type="hidden" name="action" value="ajouter">
          <div class="form-grid">
            <div><label>Prénom</label><input type="text" name="prenom" required class="w-full bg-slate-50 border p-3 rounded-lg"></div>
            <div><label>Nom</label><input type="text" name="nom" required class="w-full bg-slate-50 border p-3 rounded-lg"></div>
            <div><label>Naissance</label><input type="date" name="naissance" required class="w-full bg-slate-50 border p-3 rounded-lg"></div>
            <div><label>Niveau</label><select name="niveau" class="w-full bg-slate-50 border p-3 rounded-lg"><?php foreach ($niveaux as $n): ?><option value="<?= $n ?>"><?= $n ?></option><?php endforeach; ?></select></div>
            <div class="col-span-2 pt-4 border-t"><button type="submit" class="btn-p w-full">Créer le profil</button></div>
          </div>
        </form>
      </div>
    </div>
</template>

</body>
</html>
