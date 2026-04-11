<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';
initSession();

if (!isset($_SESSION['logged_in'])) { header('Location: /auth/login'); exit; }

$userId = $_SESSION['user_id'];
$success = ''; $error = '';

// ── Traitement des Actions BDD ────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    // 1. Ajouter un enfant
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
            $success = "Profil de <strong>$prenom</strong> ajouté ! ID : <strong>$alias</strong> · PIN : <strong>$pin</strong>";
        } else { $error = 'Tous les champs étoilés sont obligatoires.'; }
    }

    // 2. Modifier un enfant
    if ($action === 'modifier') {
        $id      = (int)$_POST['enfant_id'];
        $prenom  = trim($_POST['prenom'] ?? '');
        $nom     = trim($_POST['nom'] ?? '');
        $naiss   = $_POST['naissance'] ?? '';
        $niveau  = $_POST['niveau'] ?? '';
        $couleur = $_POST['avatar_color'] ?? '';

        DB::execute(
            "UPDATE children SET first_name = ?, last_name = ?, birth_date = ?, grade_level = ?, avatar_color = ? WHERE id = ? AND parent_id = ?",
            [$prenom, $nom, $naiss, $niveau, $couleur, $id, $userId]
        );
        $success = "Le profil de $prenom a été mis à jour.";
    }

    // 3. Activer / Désactiver
    if ($action === 'toggle_actif') {
        $id = (int)$_POST['enfant_id'];
        DB::execute("UPDATE children SET is_active = NOT is_active WHERE id = ? AND parent_id = ?", [$id, $userId]);
    }

    // 4. Supprimer
    if ($action === 'supprimer') {
        $id = (int)$_POST['enfant_id'];
        DB::execute("DELETE FROM children WHERE id = ? AND parent_id = ?", [$id, $userId]);
        $success = 'Profil supprimé définitivement.';
    }
}

// ── Récupération des données réelles ──────────────────────────────────────────
$user = DB::fetchOne("SELECT * FROM users WHERE id = ?", [$userId]);
$enfants = DB::fetchAll("SELECT * FROM children WHERE parent_id = ? ORDER BY created_at DESC", [$userId]);
$accentColor = $user['preferred_color'] ?? '#2563eb';
$initials_parent = getInitials($user['full_name']);

$niveaux = ['Maternelle','CP','CE1','CE2','CM1','CM2','6ème','5ème','4ème','3ème'];
$palette = ['#7c3aed','#059669','#ea580c','#0891b2','#be185d','#dc2626','#ca8a04','#374151'];

// Helpers conversion design
function age($naissance) {
    if (!$naissance) return '—';
    $diff = (new DateTime())->diff(new DateTime($naissance));
    return $diff->y . ' ans';
}
function niveau_badge($niveau) {
    $map = ['Maternelle'=>'#be185d','CP'=>'#7c3aed','CE1'=>'#2563eb','CE2'=>'#0891b2',
            'CM1'=>'#059669','CM2'=>'#16a34a','6ème'=>'#ca8a04','5ème'=>'#dc2626',
            '4ème'=>'#ea580c','3ème'=>'#374151'];
    return $map[$niveau] ?? '#374151';
}
?>
<!DOCTYPE html>
<html lang="fr" x-data="{ sidebarOpen: false, modalAjouter: false, modalEditer: false, editingEnfant: {} }">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mes enfants — EduKids</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
/* ── Reset & Variables ─────────────────────────────────────── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
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
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text-1);min-height:100vh;display:flex;-webkit-font-smoothing:antialiased}

[x-cloak] { display: none !important; }

/* ── Sidebar ─────────────────────────── */
.sidebar{width:var(--sidebar-w);background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;transition:transform var(--tr)}
.sidebar-logo{padding:28px 24px 20px;border-bottom:1px solid var(--border-soft);display:flex;align-items:center;gap:10px}
.logo-mark{width:32px;height:32px;border-radius:9px;background:var(--accent);display:flex;align-items:center;justify-content:center;font-family:'DM Serif Display',serif;color:#fff;font-size:16px}
.logo-text{font-size:17px;font-weight:600;letter-spacing:-.3px}
.logo-sub{font-size:11px;color:var(--text-3);margin-top:1px}
.sidebar-user{padding:20px 24px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border-soft)}
.s-avatar{width:42px;height:42px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:#fff;position:relative;flex-shrink:0;overflow:hidden;}
.s-avatar img{width:100%;height:100%;object-fit:cover;}
.s-online{width:10px;height:10px;border-radius:50%;background:#22c55e;border:2px solid #fff;position:absolute;bottom:1px;right:1px}
.u-name{font-size:14px;font-weight:500;line-height:1.3}
.u-role{font-size:12px;color:var(--text-3);margin-top:2px}
.sidebar-nav{padding:12px;flex:1;overflow-y:auto}
.nav-label{font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--text-3);padding:8px 12px 6px}
.nav-item{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:var(--radius-sm);font-size:14px;color:var(--text-2);cursor:pointer;text-decoration:none;transition:all var(--tr);margin-bottom:2px}
.nav-item:hover{background:var(--bg);color:var(--text-1)}
.nav-item.active{background:var(--accent-light);color:var(--accent);font-weight:500}
.nav-item svg{width:17px;height:17px;opacity:.75;flex-shrink:0}
.nav-item.active svg{opacity:1}
.nav-badge{margin-left:auto;font-size:11px;font-weight:600;background:var(--accent);color:#fff;padding:2px 7px;border-radius:20px}
.sidebar-footer{padding:16px 12px;border-top:1px solid var(--border-soft)}
.btn-logout{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--radius-sm);font-size:14px;color:var(--text-2);cursor:pointer;width:100%;background:none;border:none;font-family:inherit;transition:all var(--tr)}
.btn-logout:hover{background:#fff1f0;color:#dc2626}

/* ── Main ─────────────────────────────────────────────── */
.main{margin-left:var(--sidebar-w);flex:1;display:flex;flex-direction:column;min-height:100vh}
.topbar{background:var(--surface);border-bottom:1px solid var(--border);padding:0 40px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
.breadcrumb{font-size:13px;color:var(--text-3)}
.breadcrumb span{color:var(--text-1);font-weight:500}
.burger{display:none;background:none;border:none;cursor:pointer;padding:6px;border-radius:var(--radius-sm);color:var(--text-2)}
.topbar-right{display:flex;align-items:center;gap:10px}
.t-avatar{width:34px;height:34px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:#fff;overflow:hidden;}
.t-avatar img{width:100%;height:100%;object-fit:cover;}
.notif-btn{width:34px;height:34px;border-radius:var(--radius-sm);background:none;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;color:var(--text-2)}
.notif-dot{width:7px;height:7px;border-radius:50%;background:#ef4444;border:1.5px solid #fff;position:absolute;top:6px;right:6px}

.content{padding:40px;flex:1}
.page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:36px;gap:16px;flex-wrap:wrap}
.page-title{font-family:'DM Serif Display',serif;font-size:30px;font-weight:400;letter-spacing:-.5px;margin-bottom:6px}
.page-subtitle{font-size:14px;color:var(--text-3);font-weight:300}
.btn-add-main{display:flex;align-items:center;gap:8px;height:42px;padding:0 20px;background:var(--accent);color:#fff;border:none;border-radius:var(--radius-sm);font-size:14px;font-weight:500;font-family:inherit;cursor:pointer;transition:all var(--tr);white-space:nowrap;flex-shrink:0;text-decoration:none;}
.btn-add-main:hover{opacity:.88;transform:translateY(-1px);box-shadow:0 4px 12px var(--accent-mid)}

.toast-ok{display:flex;align-items:center;gap:10px;background:#f0fdf4;border:1px solid #bbf7d0;color:#15803d;border-radius:var(--radius-sm);padding:12px 16px;margin-bottom:24px;font-size:14px;animation:fadeDown .3s ease}
.toast-err{display:flex;align-items:center;gap:10px;background:#fff5f5;border:1px solid #fecaca;color:#dc2626;border-radius:var(--radius-sm);padding:12px 16px;margin-bottom:24px;font-size:14px;animation:fadeDown .3s ease}
@keyframes fadeDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}

.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:28px}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px 22px;box-shadow:var(--shadow-sm)}
.stat-label{font-size:12px;color:var(--text-3);font-weight:500;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}
.stat-value{font-size:26px;font-weight:600;color:var(--text-1);line-height:1}
.stat-sub{font-size:12px;color:var(--text-3);margin-top:4px}

.children-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:18px;margin-bottom:28px}
.child-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow-sm);transition:all var(--tr)}
.child-card:hover{box-shadow:var(--shadow-md);transform:translateY(-2px)}
.child-card.inactive{opacity:.6}

.child-card-top{padding:22px 22px 18px;display:flex;align-items:center;gap:16px;border-bottom:1px solid var(--border-soft)}
.child-avatar{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:600;color:#fff;flex-shrink:0;position:relative}
.child-status-dot{width:12px;height:12px;border-radius:50%;border:2.5px solid #fff;position:absolute;bottom:1px;right:1px}
.status-actif{background:#22c55e}
.status-inactif{background:#d1d5db}
.child-name{font-size:16px;font-weight:600;letter-spacing:-.2px;margin-bottom:3px}
.child-meta{font-size:13px;color:var(--text-2)}
.niveau-pill{display:inline-flex;align-items:center;margin-top:6px;font-size:11px;font-weight:600;padding:3px 9px;border-radius:20px;color:#fff}

.child-card-body{padding:16px 22px}
.child-detail-row{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border-soft);font-size:13px}
.child-detail-row:last-of-type{border-bottom:none}
.detail-label{color:var(--text-3)}
.detail-val{font-weight:500;color:var(--text-1)}
.pin-blur{filter:blur(4px);transition:filter .2s;cursor:pointer;user-select:none}
.pin-blur:hover{filter:blur(0)}

.child-card-actions{display:flex;gap:8px;padding:14px 22px;border-top:1px solid var(--border-soft);background:var(--bg)}
.btn-action{flex:1;height:34px;border-radius:var(--radius-sm);font-size:13px;font-family:inherit;cursor:pointer;transition:all var(--tr);font-weight:500;border:1px solid var(--border);background:var(--surface);color:var(--text-2);display:flex;align-items:center;justify-content:center;gap:6px;}
.btn-action:hover{border-color:var(--text-2);color:var(--text-1)}
.btn-action.danger:hover{border-color:#fca5a5;color:#dc2626;background:#fff5f5}
.btn-switch{flex:1;height:34px;border-radius:var(--radius-sm);font-size:13px;font-family:inherit;cursor:pointer;transition:all var(--tr);font-weight:500;border:none;display:flex;align-items:center;justify-content:center;gap:6px}
.btn-switch.actif{background:var(--accent-light);color:var(--accent)}
.btn-switch.actif:hover{background:var(--accent-mid)}
.btn-switch.inactif{background:#f1f5f9;color:#64748b}
.btn-switch.inactif:hover{background:#e2e8f0}

.empty-state{text-align:center;padding:60px 20px;background:var(--surface);border:1px dashed var(--border);border-radius:var(--radius);margin-bottom:28px}
.empty-icon{width:64px;height:64px;border-radius:50%;background:var(--accent-light);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;color:var(--accent)}
.empty-icon svg{width:28px;height:28px}
.empty-title{font-size:17px;font-weight:600;margin-bottom:6px}
.empty-sub{font-size:14px;color:var(--text-3);margin-bottom:20px}

/* ── Modal Design ────────────────────────── */
.modal-overlay{position:fixed;inset:0;background:rgba(15,15,15,.55);z-index:200;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(2px);display:flex;}
.modal{background:var(--surface);border-radius:var(--radius);width:100%;max-width:520px;box-shadow:var(--shadow-md);animation:modalIn .25s cubic-bezier(.34,1.56,.64,1)}
@keyframes modalIn{from{opacity:0;transform:scale(.94) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
.modal-header{padding:28px 32px 0;display:flex;align-items:flex-start;justify-content:space-between}
.modal-title{font-family:'DM Serif Display',serif;font-size:22px;font-weight:400}
.modal-sub{font-size:13px;color:var(--text-3);margin-top:4px}
.modal-close{width:32px;height:32px;border-radius:var(--radius-sm);border:1px solid var(--border);background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-2);transition:all var(--tr);flex-shrink:0}
.modal-close:hover{background:var(--bg);color:var(--text-1)}
.modal-body{padding:24px 32px}
.modal-footer{padding:0 32px 28px;display:flex;gap:10px;justify-content:flex-end}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.form-group{display:flex;flex-direction:column;gap:6px}
.form-group.full{grid-column:1/-1}
label{font-size:12px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text-3)}
input[type=text],input[type=date],select{height:44px;padding:0 14px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:14px;font-family:inherit;color:var(--text-1);background:var(--bg);outline:none;transition:all var(--tr);width:100%}
input:focus,select:focus{border-color:var(--accent);background:#fff;box-shadow:0 0 0 3px var(--accent-light)}
.color-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:4px}
.c-swatch{width:30px;height:30px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:all var(--tr);display:flex;align-items:center;justify-content:center;font-size:13px;color:#fff;}
.c-swatch:hover{transform:scale(1.15)}
.c-swatch.sel{border-color:var(--text-1);box-shadow:0 0 0 2px #fff inset;}
.btn-primary{height:42px;padding:0 22px;background:var(--accent);color:#fff;border:none;border-radius:var(--radius-sm);font-size:14px;font-weight:500;font-family:inherit;cursor:pointer;transition:all var(--tr);display:flex;align-items:center;gap:7px}
.btn-primary:hover{opacity:.88;transform:translateY(-1px);box-shadow:0 4px 12px var(--accent-mid)}
.btn-secondary{height:42px;padding:0 20px;background:var(--bg);color:var(--text-2);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:14px;font-family:inherit;cursor:pointer;transition:all var(--tr)}
.btn-secondary:hover{border-color:var(--text-2);color:var(--text-1)}

.avatar-preview{display:flex;align-items:center;gap:14px;background:var(--bg);border:1px solid var(--border-soft);border-radius:var(--radius-sm);padding:14px 16px;margin-bottom:20px}
.preview-circle{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:600;color:#fff;transition:background var(--tr);flex-shrink:0}
.preview-text{font-size:13px;color:var(--text-2)}
.preview-name{font-size:15px;font-weight:500;color:var(--text-1)}

@media(max-width:1024px){
  .sidebar{transform:translateX(-100%)}.sidebar.open{transform:translateX(0)}
  .main{margin-left:0}.topbar{padding:0 20px}
  .burger{display:flex;align-items:center;justify-content:center}
  .content{padding:24px 16px}
  .stats-row{grid-template-columns:1fr}
  .children-grid{grid-template-columns:1fr}
}
.overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:99}
.overlay.show{display:block}
</style>
</head>
<body x-data="{
    prenomInput: '',
    nomInput: '',
    colorInput: '<?= $palette[0] ?>',
    getInitials() {
        return ((this.prenomInput[0] || '') + (this.nomInput[0] || '')).toUpperCase() || '??';
    },
    setupEdit(enfant) {
        this.editingEnfant = enfant;
        this.modalEditer = true;
    }
}">

<div class="overlay" :class="sidebarOpen ? 'show' : ''" @click="sidebarOpen = false"></div>

<!-- ════════════════ SIDEBAR ════════════════ -->
<aside class="sidebar" :class="sidebarOpen ? 'open' : ''">
  <div class="sidebar-logo">
    <div class="logo-mark">F</div>
    <div>
      <div class="logo-text">FreeGeny</div>
      <div class="logo-sub">Espace parent</div>
    </div>
  </div>

  <div class="sidebar-user">
    <div class="s-avatar">
        <?php if ($user['profile_photo']): ?>
            <img src="<?= $user['profile_photo'] ?>">
        <?php else: ?>
            <?= $initials_parent ?>
        <?php endif; ?>
        <span class="s-online"></span>
    </div>
    <div>
      <div class="u-name"><?= $user['full_name'] ?></div>
      <div class="u-role">Parent · <?= count($enfants) ?> enfant<?= count($enfants)>1?'s':'' ?></div>
    </div>
  </div>

  <nav class="sidebar-nav">
    <div class="nav-label">Principal</div>
    <a href="#" class="nav-item">
      <svg fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
      Tableau de bord
    </a>
    <a href="children.php" class="nav-item active">
      <svg fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      Mes enfants
      <span class="nav-badge"><?= count($enfants) ?></span>
    </a>
    <div class="nav-label" style="margin-top:10px">Compte</div>
    <a href="parent.php" class="nav-item">
      <svg fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
      Mon profil
    </a>
    <a href="#" class="nav-item">
      <svg fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      Sécurité
    </a>
    <a href="#" class="nav-item">
      <svg fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      Notifications
    </a>
    <div class="nav-label" style="margin-top:10px">Contrôle</div>
    <a href="#" class="nav-item">
      <svg fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      Contrôle parental
    </a>
  </nav>

  <div class="sidebar-footer">
     <a href="/api/auth/logout.php" class="btn-logout" style="text-decoration:none;">
      <svg fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      Se déconnecter
    </a>
  </div>
</aside>

<!-- ════════════════ MAIN ════════════════ -->
<div class="main">

  <header class="topbar">
    <div style="display:flex;align-items:center;gap:8px">
      <button class="burger" @click="sidebarOpen = true">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <span class="breadcrumb">FreeGeny &rsaquo; <span>Mes enfants</span></span>
    </div>
    <div class="topbar-right">
      <button class="notif-btn">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <span class="notif-dot"></span>
      </button>
      <div class="t-avatar">
         <?php if ($user['profile_photo']): ?>
            <img src="<?= $user['profile_photo'] ?>">
        <?php else: ?>
            <?= $initials_parent ?>
        <?php endif; ?>
      </div>
    </div>
  </header>

  <div class="content">

    <!-- En-tête page -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Mes enfants</h1>
        <p class="page-subtitle">Gérez les profils et les accès de vos enfants</p>
      </div>
      <button class="btn-add-main" @click="modalAjouter = true">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Ajouter un enfant
      </button>
    </div>

    <!-- Toasts -->
    <?php if ($success): ?>
    <div class="toast-ok">
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <?= $success ?>
    </div>
    <?php endif; ?>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Total enfants</div>
        <div class="stat-value"><?= count($enfants) ?></div>
        <div class="stat-sub">Profils créés</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Actifs</div>
        <div class="stat-value"><?= count(array_filter($enfants, fn($e)=>$e['is_active'])) ?></div>
        <div class="stat-sub">Accès activé</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Profils</div>
        <div class="stat-value" style="font-size:18px">Elite Access</div>
        <div class="stat-sub">Sécurité renforcée</div>
      </div>
    </div>

    <!-- Grille enfants -->
    <?php if (empty($enfants)): ?>
    <div class="empty-state">
      <div class="empty-icon">
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <div class="empty-title">Aucun enfant ajouté</div>
      <div class="empty-sub">Créez le premier profil pour commencer l'aventure</div>
      <button class="btn-primary" @click="modalAjouter = true" style="margin:0 auto">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Ajouter le premier enfant
      </button>
    </div>
    <?php else: ?>
    <div class="children-grid">
      <?php foreach ($enfants as $e): 
          $childInitials = strtoupper(substr($e['first_name'],0,1).(isset($e['last_name'][0]) ? substr($e['last_name'],0,1) : ''));
      ?>
      <div class="child-card <?= $e['is_active'] ? '' : 'inactive' ?>">
        <div class="child-card-top">
          <div class="child-avatar" style="background:<?= $e['avatar_color'] ?>">
            <?= $childInitials ?>
            <span class="child-status-dot <?= $e['is_active'] ? 'status-actif' : 'status-inactif' ?>"></span>
          </div>
          <div class="child-info">
            <div class="child-name"><?= $e['first_name'].' '.$e['last_name'] ?></div>
            <div class="child-meta"><?= age($e['birth_date']) ?> · <?= date('d/m/Y', strtotime($e['birth_date'])) ?></div>
            <span class="niveau-pill" style="background:<?= niveau_badge($e['grade_level']) ?>">
              <?= $e['grade_level'] ?>
            </span>
          </div>
        </div>

        <div class="child-card-body">
          <div class="child-detail-row">
            <span class="detail-label">Identifiant</span>
            <span class="detail-val" style="font-family:monospace;letter-spacing:.05em"><?= $e['child_id_alias'] ?></span>
          </div>
          <div class="child-detail-row">
            <span class="detail-label">Code PIN</span>
            <span class="detail-val pin-blur" @click="$el.classList.toggle('pin-blur')" title="Cliquer pour révéler"><?= $e['pin_code'] ?></span>
          </div>
          <div class="child-detail-row">
            <span class="detail-label">Statut</span>
            <span class="detail-val" style="color:<?= $e['is_active']?'#15803d':'#6b7280' ?>">
              <?= $e['is_active'] ? '● Actif' : '● Archivé' ?>
            </span>
          </div>
        </div>

        <div class="child-card-actions">
           <form method="POST" style="flex:1;display:flex">
            <input type="hidden" name="action" value="toggle_actif">
            <input type="hidden" name="enfant_id" value="<?= $e['id'] ?>">
            <button type="submit" class="btn-switch <?= $e['is_active']?'actif':'inactif' ?>">
              <?= $e['is_active'] ? 'Actif' : 'Archivé' ?>
            </button>
          </form>

          <button class="btn-action" @click="setupEdit(<?= htmlspecialchars(json_encode($e)) ?>)">
            Modifier
          </button>

          <form method="POST" onsubmit="return confirm('Supprimer définitivement ce profil ?')">
            <input type="hidden" name="action" value="supprimer">
            <input type="hidden" name="enfant_id" value="<?= $e['id'] ?>">
            <button type="submit" class="btn-action danger">
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
            </button>
          </form>
        </div>
      </div>
      <?php endforeach; ?>
    </div>
    <?php endif; ?>
  </div>
</div>

<!-- ════════════════ MODAL AJOUTER ════════════════ -->
<div class="modal-overlay" x-show="modalAjouter" x-cloak>
  <div class="modal" @click.away="modalAjouter = false">
    <div class="modal-header">
      <div>
        <div class="modal-title">Ajouter un enfant</div>
        <div class="modal-sub">Identifiant et PIN générés automatiquement</div>
      </div>
      <button class="modal-close" @click="modalAjouter = false">✕</button>
    </div>

    <form method="POST">
      <input type="hidden" name="action" value="ajouter">
      <div class="modal-body">
        <div class="avatar-preview">
          <div class="preview-circle" :style="'background:' + colorInput" x-text="getInitials()"></div>
          <div>
            <div class="preview-name" x-text="(prenomInput + ' ' + nomInput).trim() || 'Prénom Nom'"></div>
            <div class="preview-text">Aperçu de l'avatar</div>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label>Prénom *</label>
            <input type="text" name="prenom" x-model="prenomInput" required>
          </div>
          <div class="form-group">
            <label>Nom *</label>
            <input type="text" name="nom" x-model="nomInput" required>
          </div>
          <div class="form-group">
            <label>Date de naissance *</label>
            <input type="date" name="naissance" required max="<?= date('Y-m-d') ?>">
          </div>
          <div class="form-group">
            <label>Niveau scolaire *</label>
            <select name="niveau" required>
              <option value="">— Choisir —</option>
              <?php foreach ($niveaux as $n): ?>
              <option value="<?= $n ?>"><?= $n ?></option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="form-group full">
            <label>Couleur de l'avatar</label>
            <div class="color-row">
              <?php foreach ($palette as $c): ?>
              <div class="c-swatch" :class="colorInput === '<?= $c ?>' ? 'sel' : ''"
                   style="background:<?= $c ?>"
                   @click="colorInput = '<?= $c ?>'">✓</div>
              <?php endforeach; ?>
            </div>
            <input type="hidden" name="avatar_color" :value="colorInput">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn-secondary" @click="modalAjouter = false">Annuler</button>
        <button type="submit" class="btn-primary">Créer le profil</button>
      </div>
    </form>
  </div>
</div>

<!-- ════════════════ MODAL ÉDITER ════════════════ -->
<div class="modal-overlay" x-show="modalEditer" x-cloak>
  <div class="modal" @click.away="modalEditer = false">
    <div class="modal-header">
      <div>
        <div class="modal-title">Modifier le profil</div>
        <div class="modal-sub">Mise à jour immédiate</div>
      </div>
      <button class="modal-close" @click="modalEditer = false">✕</button>
    </div>
    <form method="POST">
      <input type="hidden" name="action" value="modifier">
      <input type="hidden" name="enfant_id" :value="editingEnfant.id">
      <div class="modal-body">
        <div class="form-grid">
          <div class="form-group">
            <label>Prénom</label>
            <input type="text" name="prenom" :value="editingEnfant.first_name">
          </div>
          <div class="form-group">
            <label>Nom</label>
            <input type="text" name="nom" :value="editingEnfant.last_name">
          </div>
          <div class="form-group">
            <label>Date de naissance</label>
            <input type="date" name="naissance" :value="editingEnfant.birth_date">
          </div>
          <div class="form-group">
            <label>Niveau scolaire</label>
            <select name="niveau" :value="editingEnfant.grade_level">
              <?php foreach ($niveaux as $n): ?>
              <option value="<?= $n ?>"><?= $n ?></option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="form-group full">
            <label>Couleur avatar</label>
            <div class="color-row">
              <?php foreach ($palette as $c): ?>
              <div class="c-swatch" :class="editingEnfant.avatar_color === '<?= $c ?>' ? 'sel' : ''"
                   style="background:<?= $c ?>"
                   @click="editingEnfant.avatar_color = '<?= $c ?>'">✓</div>
              <?php endforeach; ?>
            </div>
            <input type="hidden" name="avatar_color" :value="editingEnfant.avatar_color">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn-secondary" @click="modalEditer = false">Annuler</button>
        <button type="submit" class="btn-primary">Enregistrer</button>
      </div>
    </form>
  </div>
</div>

</body>
</html>
