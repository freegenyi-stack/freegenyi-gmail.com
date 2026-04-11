<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';
initSession();

if (!isset($_SESSION['logged_in'])) { header('Location: /auth/login'); exit; }

$userId = $_SESSION['user_id'];
$success = ''; $error = '';

// Détection de la locale
$requestUri = $_SERVER['REQUEST_URI'];
preg_match('/^\/([A-Z]{2}-[a-z]{2})/', $requestUri, $matches);
$locale = $matches[1] ?? 'DZ-fr';
$baseUrl = "/" . $locale;

// ── Traitement des Actions BDD ────────────────────────────────────────────────
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
            DB::insert(
                "INSERT INTO children (parent_id, first_name, last_name, birth_date, grade_level, avatar_color, pin_code, child_id_alias, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)",
                [$userId, $prenom, $nom, $naiss, $niveau, $couleur, $pin, $alias]
            );
            $success = "Profil ajouté ! ID : <strong>$alias</strong> · PIN : <strong>$pin</strong>";
        } else { $error = 'Tous les champs étoilés sont obligatoires.'; }
    }
    if ($action === 'modifier') {
        $id = (int)$_POST['enfant_id'];
        DB::execute(
            "UPDATE children SET first_name = ?, last_name = ?, birth_date = ?, grade_level = ?, avatar_color = ? WHERE id = ? AND parent_id = ?",
            [trim($_POST['prenom']), trim($_POST['nom']), $_POST['naissance'], $_POST['niveau'], $_POST['avatar_color'], $id, $userId]
        );
        $success = "Profil mis à jour.";
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
$initials_parent = getInitials($user['full_name']);

$niveaux = ['Maternelle','CP','CE1','CE2','CM1','CM2','6ème','5ème','4ème','3ème'];
$palette = ['#7c3aed','#059669','#ea580c','#0891b2','#be185d','#dc2626','#ca8a04','#374151'];

function age($naissance) {
    if (!$naissance) return '—';
    $diff = (new DateTime())->diff(new DateTime($naissance));
    return $diff->y . ' ans';
}
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
[x-cloak] { display: none !important; }
.sidebar{width:var(--sidebar-w);background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;transition:transform var(--tr)}
.sidebar-logo{padding:28px 24px 20px;border-bottom:1px solid var(--border-soft);display:flex;align-items:center;gap:10px}
.logo-mark{width:32px;height:32px;border-radius:9px;background:var(--accent);display:flex;align-items:center;justify-content:center;font-family:'DM Serif Display',serif;color:#fff;font-size:16px}
.logo-text{font-size:17px;font-weight:600;}
.sidebar-user{padding:20px 24px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border-soft)}
.s-avatar{width:42px;height:42px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:#fff;position:relative;overflow:hidden;}
.s-avatar img{width:100%;height:100%;object-fit:cover;}
.sidebar-nav{padding:12px;flex:1;overflow-y:auto}
.nav-label{font-size:10px;font-weight:600;text-transform:uppercase;color:var(--text-3);padding:8px 12px 6px}
.nav-item{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:var(--radius-sm);font-size:14px;color:var(--text-2);text-decoration:none;transition:all var(--tr);margin-bottom:2px}
.nav-item:hover{background:var(--bg);color:var(--text-1)}
.nav-item.active{background:var(--accent-light);color:var(--accent);font-weight:500}
.nav-badge{margin-left:auto;font-size:11px;font-weight:600;background:var(--accent);color:#fff;padding:2px 7px;border-radius:20px}
.sidebar-footer{padding:16px 12px;border-top:1px solid var(--border-soft)}
.btn-logout{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--radius-sm);font-size:14px;color:var(--text-2);text-decoration:none;}
.main{margin-left:var(--sidebar-w);flex:1;display:flex;flex-direction:column;min-height:100vh}
.topbar{background:var(--surface);border-bottom:1px solid var(--border);padding:0 40px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
.t-avatar{width:34px;height:34px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:#fff;overflow:hidden;}
.t-avatar img{width:100%;height:100%;object-fit:cover;}
.content{padding:40px;flex:1}
.page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:36px;gap:16px;flex-wrap:wrap}
.page-title{font-family:'DM Serif Display',serif;font-size:30px;letter-spacing:-.5px;}
.btn-add-main{display:flex;align-items:center;gap:8px;height:42px;padding:0 20px;background:var(--accent);color:#fff;border:none;border-radius:var(--radius-sm);font-size:14px;font-weight:500;cursor:pointer;transition:all var(--tr)}
.children-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:18px;}
.child-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow-sm);transition:all var(--tr)}
.child-card-top{padding:22px 22px 18px;display:flex;align-items:center;gap:16px;border-bottom:1px solid var(--border-soft)}
.child-avatar{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:600;color:#fff;position:relative}
.niveau-pill{display:inline-flex;align-items:center;margin-top:6px;font-size:11px;font-weight:600;padding:3px 9px;border-radius:20px;color:#fff}
.child-card-body{padding:16px 22px}
.child-detail-row{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border-soft);font-size:13px}
.pin-blur{filter:blur(4px);cursor:pointer;}
.child-card-actions{display:flex;gap:8px;padding:14px 22px;border-top:1px solid var(--border-soft);background:var(--bg)}
.btn-action{flex:1;height:34px;border-radius:var(--radius-sm);font-size:13px;cursor:pointer;border:1px solid var(--border);background:var(--surface);display:flex;align-items:center;justify-content:center;gap:6px;}
.btn-switch{flex:1;height:34px;border-radius:var(--radius-sm);font-size:13px;cursor:pointer;border:none;display:flex;align-items:center;justify-content:center;gap:6px}
.btn-switch.actif{background:var(--accent-light);color:var(--accent)}
.btn-switch.inactif{background:#f1f5f9;color:#64748b}

.modal-overlay{position:fixed;inset:0;background:rgba(15,15,15,.55);z-index:200;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(2px);display:flex;}
.modal{background:var(--surface);border-radius:var(--radius);width:100%;max-width:520px;box-shadow:var(--shadow-md);}
.modal-header{padding:28px 32px 0;display:flex;align-items:flex-start;justify-content:space-between}
.modal-title{font-family:'DM Serif Display',serif;font-size:22px;}
.modal-close{cursor:pointer;font-weight:black;}
.modal-body{padding:24px 32px}
.modal-footer{padding:0 32px 28px;display:flex;gap:10px;justify-content:flex-end}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.form-group{display:flex;flex-direction:column;gap:6px}
.form-group.full{grid-column:1/-1}
label{font-size:12px;font-weight:500;text-transform:uppercase;color:var(--text-3)}
input[type=text],input[type=date],select{height:44px;padding:0 14px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:14px;background:var(--bg);outline:none;width:100%}
.color-row{display:flex;gap:10px;flex-wrap:wrap;}
.c-swatch{width:30px;height:30px;border-radius:50%;cursor:pointer;border:2px solid transparent;display:flex;align-items:center;justify-content:center;color:#fff;}
.c-swatch.sel{border-color:var(--text-1);box-shadow:0 0 0 2px #fff inset;}
.btn-primary{height:42px;padding:0 22px;background:var(--accent);color:#fff;border:none;border-radius:var(--radius-sm);font-size:14px;font-weight:500;cursor:pointer;}
.btn-secondary{height:42px;padding:0 20px;background:var(--bg);color:var(--text-2);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:14px;cursor:pointer;}

.avatar-preview{display:flex;align-items:center;gap:14px;background:var(--bg);border:1px solid var(--border-soft);border-radius:var(--radius-sm);padding:14px 16px;margin-bottom:20px}
.preview-circle{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:600;color:#fff;}
</style>
</head>
<body x-data="{
    prenomInput: '', nomInput: '', colorInput: '<?= $palette[0] ?>',
    getInitials() { return ((this.prenomInput[0] || '') + (this.nomInput[0] || '')).toUpperCase() || '??'; },
    setupEdit(enfant) { this.editingEnfant = enfant; this.modalEditer = true; }
}">

<div class="fixed inset-0 bg-slate-900/40 z-[99] lg:hidden" x-show="sidebarOpen" @click="sidebarOpen = false" x-cloak></div>

<!-- ════════════════ SIDEBAR ════════════════ -->
<aside class="sidebar" :class="sidebarOpen ? 'open' : ''">
  <div class="sidebar-logo">
    <div class="logo-mark">F</div>
    <div class="logo-text">FreeGeny</div>
  </div>
  <div class="sidebar-user">
    <div class="s-avatar">
        <?php if ($user['profile_photo']): ?><img src="<?= $user['profile_photo'] ?>"><?php else: ?><?= $initials_parent ?><?php endif; ?>
    </div>
    <div>
      <div class="u-name"><?= $user['full_name'] ?></div>
      <div class="u-role">Parent · <?= count($enfants) ?> enfant<?= count($enfants)>1?'s':'' ?></div>
    </div>
  </div>
  <nav class="sidebar-nav">
    <div class="nav-label">Principal</div>
    <a href="<?= $baseUrl ?>/dashboard/parent" class="nav-item <?= strpos($requestUri, 'parent') ? 'active' : '' ?>">
      Tableau de bord
    </a>
    <a href="<?= $baseUrl ?>/dashboard/children" class="nav-item <?= strpos($requestUri, 'children') ? 'active' : '' ?>">
      Mes enfants <span class="nav-badge"><?= count($enfants) ?></span>
    </a>
    <div class="nav-label" style="margin-top:10px">Compte</div>
    <a href="<?= $baseUrl ?>/dashboard/parent" class="nav-item">Mon profil</a>
  </nav>
  <div class="sidebar-footer">
    <a href="/api/auth/logout.php" class="btn-logout">Se déconnecter</a>
  </div>
</aside>

<!-- ════════════════ MAIN ════════════════ -->
<div class="main">
  <header class="topbar">
    <div style="display:flex;align-items:center;gap:8px">
      <button class="burger lg:hidden" @click="sidebarOpen = true">☰</button>
      <span class="breadcrumb">FreeGeny &rsaquo; <span>Mes enfants</span></span>
    </div>
    <div class="topbar-right">
      <div class="t-avatar"><?php if ($user['profile_photo']): ?><img src="<?= $user['profile_photo'] ?>"><?php else: ?><?= $initials_parent ?><?php endif; ?></div>
    </div>
  </header>

  <div class="content">
    <div class="page-header">
      <div><h1 class="page-title">Mes enfants</h1><p class="page-subtitle">Gérez les profils élite de vos enfants</p></div>
      <button class="btn-add-main" @click="modalAjouter = true">+ Ajouter un enfant</button>
    </div>

    <?php if ($success): ?><div class="toast-ok"><?= $success ?></div><?php endif; ?>

    <div class="children-grid">
      <?php if (empty($enfants)): ?>
        <div class="empty-state">Aucun enfant. Commencez maintenant !</div>
      <?php else: foreach ($enfants as $e): 
          $cInit = strtoupper(substr($e['first_name'],0,1).(isset($e['last_name'][0])?substr($e['last_name'],0,1):''));
      ?>
      <div class="child-card <?= $e['is_active'] ? '' : 'inactive' ?>">
        <div class="child-card-top">
          <div class="child-avatar" style="background:<?= $e['avatar_color'] ?>"><?= $cInit ?></div>
          <div class="child-info">
            <div class="child-name"><?= $e['first_name'].' '.$e['last_name'] ?></div>
            <span class="niveau-pill" style="background:<?= niveau_badge($e['grade_level']) ?>"><?= $e['grade_level'] ?></span>
          </div>
        </div>
        <div class="child-card-body">
          <div class="child-detail-row"><span>ID</span><strong><?= $e['child_id_alias'] ?></strong></div>
          <div class="child-detail-row"><span>PIN</span><strong class="pin-blur" @click="$el.classList.toggle('pin-blur')"><?= $e['pin_code'] ?></strong></div>
        </div>
        <div class="child-card-actions">
           <form method="POST"><input type="hidden" name="action" value="toggle_actif"><input type="hidden" name="enfant_id" value="<?= $e['id'] ?>"><button type="submit" class="btn-switch <?= $e['is_active']?'actif':'inactif' ?>"><?= $e['is_active']?'Actif':'Archivé' ?></button></form>
           <button class="btn-action" @click="setupEdit(<?= htmlspecialchars(json_encode($e)) ?>)">Editer</button>
           <form method="POST"><input type="hidden" name="action" value="supprimer"><input type="hidden" name="enfant_id" value="<?= $e['id'] ?>"><button type="submit" class="btn-action danger">🗑</button></form>
        </div>
      </div>
      <?php endforeach; endif; ?>
    </div>
  </div>
</div>

<!-- ════════════════ MODALS ════════════════ -->
<template x-teleport="body">
    <div class="modal-overlay" x-show="modalAjouter" x-cloak>
      <div class="modal" @click.away="modalAjouter = false">
        <div class="modal-header"><h3 class="modal-title">Ajouter un enfant</h3><button @click="modalAjouter = false">✕</button></div>
        <form method="POST">
          <input type="hidden" name="action" value="ajouter">
          <div class="modal-body">
            <div class="avatar-preview"><div class="preview-circle" :style="'background:' + colorInput" x-text="getInitials()"></div><div x-text="(prenomInput + ' ' + nomInput).trim() || 'Prénom Nom'"></div></div>
            <div class="form-grid">
              <div class="form-group"><label>Prénom</label><input type="text" name="prenom" x-model="prenomInput" required></div>
              <div class="form-group"><label>Nom</label><input type="text" name="nom" x-model="nomInput" required></div>
              <div class="form-group"><label>Naissance</label><input type="date" name="naissance" required></div>
              <div class="form-group"><label>Niveau</label><select name="niveau" required><?php foreach ($niveaux as $n): ?><option value="<?= $n ?>"><?= $n ?></option><?php endforeach; ?></select></div>
              <div class="form-group full"><div class="color-row"><?php foreach ($palette as $c): ?><div class="c-swatch" :class="colorInput === '<?= $c ?>' ? 'sel' : ''" style="background:<?= $c ?>" @click="colorInput = '<?= $c ?>'">✓</div><?php endforeach; ?></div><input type="hidden" name="avatar_color" :value="colorInput"></div>
            </div>
          </div>
          <div class="modal-footer"><button type="submit" class="btn-primary">Créer</button></div>
        </form>
      </div>
    </div>
</template>

<template x-teleport="body">
    <div class="modal-overlay" x-show="modalEditer" x-cloak>
      <div class="modal" @click.away="modalEditer = false">
        <div class="modal-header"><h3 class="modal-title">Modifier l'enfant</h3><button @click="modalEditer = false">✕</button></div>
        <form method="POST">
          <input type="hidden" name="action" value="modifier"><input type="hidden" name="enfant_id" :value="editingEnfant.id">
          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group"><label>Prénom</label><input type="text" name="prenom" :value="editingEnfant.first_name"></div>
              <div class="form-group"><label>Nom</label><input type="text" name="nom" :value="editingEnfant.last_name"></div>
              <div class="form-group"><label>Naissance</label><input type="date" name="naissance" :value="editingEnfant.birth_date"></div>
              <div class="form-group"><label>Niveau</label><select name="niveau" :value="editingEnfant.grade_level"><?php foreach ($niveaux as $n): ?><option value="<?= $n ?>"><?= $n ?></option><?php endforeach; ?></select></div>
              <div class="form-group full"><div class="color-row"><?php foreach ($palette as $c): ?><div class="c-swatch" :class="editingEnfant.avatar_color === '<?= $c ?>' ? 'sel' : ''" style="background:<?= $c ?>" @click="editingEnfant.avatar_color = '<?= $c ?>'">✓</div><?php endforeach; ?></div><input type="hidden" name="avatar_color" :value="editingEnfant.avatar_color"></div>
            </div>
          </div>
          <div class="modal-footer"><button type="submit" class="btn-primary">Enregistrer</button></div>
        </form>
      </div>
    </div>
</template>

</body>
</html>
