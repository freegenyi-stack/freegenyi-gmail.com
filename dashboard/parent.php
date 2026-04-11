<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';
initSession();

if (!isset($_SESSION['logged_in'])) { header('Location: /auth/login'); exit; }

$userId = $_SESSION['user_id'];

// 1. Traitement de la mise à jour du profil
$success_msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $prenom  = htmlspecialchars(trim($_POST['prenom'] ?? ''));
    $nom     = htmlspecialchars(trim($_POST['nom'] ?? ''));
    $phone   = htmlspecialchars(trim($_POST['telephone'] ?? ''));
    $color   = $_POST['couleur'] ?? '#2563eb';
    $fullName = trim($prenom . ' ' . $nom);

    DB::execute(
        "UPDATE users SET full_name = ?, phone = ?, preferred_color = ? WHERE id = ?",
        [$fullName, $phone, $color, $userId]
    );
    $_SESSION['user_name'] = $fullName; // Update session
    $success_msg = 'Profil mis à jour avec succès.';
}

// 2. Récupération des données réelles
$user = DB::fetchOne("SELECT * FROM users WHERE id = ?", [$userId]);
$childrenCount = DB::fetchOne("SELECT COUNT(*) as total FROM children WHERE parent_id = ?", [$userId])['total'];
$initials = getInitials($user['full_name']);

// Séparer le nom et le prénom pour le formulaire
$nameParts = explode(' ', $user['full_name'], 2);
$prenom = $nameParts[0] ?? '';
$nom = $nameParts[1] ?? '';

$currentAvatar = $user['profile_photo'] ?? '';
$accentColor = $user['preferred_color'] ?? '#2563eb';

// Bibliothèque d'avatars DiceBear
$avatarStyles = [
    'micah' => ['Oliver', 'Caleb', 'Jack', 'Avery', 'Riley', 'Jordan'],
    'avataaars' => ['Robert', 'Kimberly', 'Matthew', 'Susan', 'James', 'Linda'],
    'personas' => ['Felix', 'Aneka', 'Sasha', 'Matti', 'Lukas', 'Klaus']
];
?>
<!DOCTYPE html>
<html lang="fr" x-data="{ 
    sidebarOpen: false, 
    modalOpen: false, 
    loading: false, 
    error: '',
    selectedColor: '<?= $accentColor ?>'
}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Profil — EduKids</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
/* ── Reset & Variables ─────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
    --accent:       <?= $accentColor ?>;
    --accent-light: <?= $accentColor ?>18;
    --accent-mid:   <?= $accentColor ?>35;
    --bg:           #fafaf9;
    --surface:      #ffffff;
    --border:       #e8e6e1;
    --border-soft:  #f0ede8;
    --text-1:       #1a1917;
    --text-2:       #6b6860;
    --text-3:       #a8a49e;
    --sidebar-w:    260px;
    --radius:       14px;
    --radius-sm:    8px;
    --shadow-sm:    0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
    --shadow-md:    0 4px 16px rgba(0,0,0,.08);
    --transition:   .2s cubic-bezier(.4,0,.2,1);
}

html { font-size: 16px; }
body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text-1);
    min-height: 100vh;
    display: flex;
    -webkit-font-smoothing: antialiased;
}

[x-cloak] { display: none !important; }

/* ── Sidebar ───────────────────────────────────────────────── */
.sidebar {
    width: var(--sidebar-w);
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
    transition: transform var(--transition);
}

.sidebar-logo {
    padding: 28px 24px 20px;
    border-bottom: 1px solid var(--border-soft);
    display: flex; align-items: center; gap: 10px;
}
.logo-mark {
    width: 32px; height: 32px; border-radius: 9px;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Serif Display', serif;
    color: #fff; font-size: 16px; letter-spacing: -0.5px;
}
.logo-text { font-size: 17px; font-weight: 600; letter-spacing: -0.3px; }
.logo-sub  { font-size: 11px; color: var(--text-3); margin-top: 1px; }

.sidebar-user {
    padding: 20px 24px;
    display: flex; align-items: center; gap: 12px;
    border-bottom: 1px solid var(--border-soft);
}
.avatar {
    width: 42px; height: 42px; border-radius: 50%;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 600; color: #fff;
    letter-spacing: 0.5px; flex-shrink: 0;
    position: relative;
    overflow: hidden;
}
.avatar img { width: 100%; height: 100%; object-cover: cover; }
.avatar-online {
    width: 10px; height: 10px; border-radius: 50%;
    background: #22c55e;
    border: 2px solid var(--surface);
    position: absolute; bottom: 1px; right: 1px;
}
.user-name  { font-size: 14px; font-weight: 500; line-height: 1.3; }
.user-role  { font-size: 12px; color: var(--text-3); margin-top: 2px; }

.sidebar-nav { padding: 12px 12px; flex: 1; overflow-y: auto; }

.nav-section-label {
    font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--text-3);
    padding: 8px 12px 6px;
}

.nav-item {
    display: flex; align-items: center; gap: 11px;
    padding: 10px 12px; border-radius: var(--radius-sm);
    font-size: 14px; font-weight: 400; color: var(--text-2);
    cursor: pointer; text-decoration: none;
    transition: all var(--transition);
    margin-bottom: 2px;
}
.nav-item:hover { background: var(--bg); color: var(--text-1); }
.nav-item.active {
    background: var(--accent-light);
    color: var(--accent);
    font-weight: 500;
}
.nav-item svg { width: 17px; height: 17px; opacity: .75; flex-shrink: 0; }
.nav-item.active svg { opacity: 1; }

.nav-badge {
    margin-left: auto; font-size: 11px; font-weight: 500;
    background: var(--accent); color: #fff;
    padding: 2px 7px; border-radius: 20px;
}

.sidebar-footer {
    padding: 16px 12px;
    border-top: 1px solid var(--border-soft);
}
.btn-logout {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: var(--radius-sm);
    font-size: 14px; color: var(--text-2);
    cursor: pointer; width: 100%;
    background: none; border: none; font-family: inherit;
    transition: all var(--transition);
}
.btn-logout:hover { background: #fff1f0; color: #dc2626; }
.btn-logout svg { width: 17px; height: 17px; }

/* ── Main ──────────────────────────────────────────────────── */
.main-content {
    margin-left: var(--sidebar-w);
    flex: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* ── Top bar ───────────────────────────────────────────────── */
.topbar {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 40px;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
}
.topbar-left { display: flex; align-items: center; gap: 8px; }
.breadcrumb  { font-size: 13px; color: var(--text-3); }
.breadcrumb span { color: var(--text-1); font-weight: 500; }
.burger-btn {
    display: none; background: none; border: none;
    cursor: pointer; padding: 6px; border-radius: var(--radius-sm);
    color: var(--text-2);
}
.topbar-right { display: flex; align-items: center; gap: 10px; }
.topbar-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 600; color: #fff;
    cursor: pointer;
    overflow: hidden;
}
.topbar-avatar img { width: 100%; height: 100%; object-fit: cover; }
.notif-btn {
    width: 34px; height: 34px; border-radius: var(--radius-sm);
    background: none; border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; position: relative; color: var(--text-2);
    transition: all var(--transition);
}
.notif-btn:hover { background: var(--bg); }
.notif-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #ef4444; border: 1.5px solid var(--surface);
    position: absolute; top: 6px; right: 6px;
}

/* ── Content ───────────────────────────────────────────────── */
.content {
    padding: 40px;
    flex: 1;
    max-width: 860px;
}

.page-header { margin-bottom: 36px; }
.page-title {
    font-family: 'DM Serif Display', serif;
    font-size: 30px; font-weight: 400;
    letter-spacing: -0.5px; color: var(--text-1);
    margin-bottom: 6px;
}
.page-subtitle { font-size: 14px; color: var(--text-3); font-weight: 300; }

/* ── Success toast ─────────────────────────────────────────── */
.toast {
    display: flex; align-items: center; gap: 10px;
    background: #f0fdf4; border: 1px solid #bbf7d0;
    color: #15803d; border-radius: var(--radius-sm);
    padding: 12px 16px; margin-bottom: 28px;
    font-size: 14px; animation: slideIn .3s ease;
}
@keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }

/* ── Cards ─────────────────────────────────────────────────── */
.card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 28px 32px;
    margin-bottom: 20px;
    box-shadow: var(--shadow-sm);
}
.card-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px;
}
.card-title {
    font-size: 15px; font-weight: 600;
    letter-spacing: -0.2px; color: var(--text-1);
}
.card-sub { font-size: 13px; color: var(--text-3); margin-top: 3px; }

/* ── Avatar section ────────────────────────────────────────── */
.avatar-section {
    display: flex; align-items: center; gap: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border-soft);
    margin-bottom: 28px;
}
.avatar-big {
    width: 80px; height: 80px; border-radius: 50%;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; font-weight: 500; color: #fff;
    letter-spacing: 1px; flex-shrink: 0;
    box-shadow: 0 0 0 4px var(--accent-mid);
    transition: box-shadow var(--transition);
    overflow: hidden;
}
.avatar-big img { width: 100%; height: 100%; object-fit: cover; }
.avatar-big:hover { box-shadow: 0 0 0 6px var(--accent-mid); }
.avatar-info h3 { font-size: 17px; font-weight: 500; margin-bottom: 4px; }
.avatar-info p  { font-size: 13px; color: var(--text-3); margin-bottom: 12px; }
.btn-upload {
    font-size: 13px; padding: 7px 14px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: var(--surface); color: var(--text-1);
    cursor: pointer; font-family: inherit; font-weight: 500;
    transition: all var(--transition);
}
.btn-upload:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-light); }

/* ── Form ──────────────────────────────────────────────────── */
.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
}
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.full { grid-column: 1 / -1; }

label {
    font-size: 12px; font-weight: 500;
    letter-spacing: 0.04em; text-transform: uppercase;
    color: var(--text-3);
}
input[type="text"],
input[type="email"],
input[type="tel"],
input[type="password"] {
    height: 44px; padding: 0 14px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 14px; font-family: inherit; color: var(--text-1);
    background: var(--bg);
    outline: none;
    transition: all var(--transition);
    width: 100%;
}
input:focus {
    border-color: var(--accent);
    background: var(--surface);
    box-shadow: 0 0 0 3px var(--accent-light);
}
input[readonly] {
    color: var(--text-3);
    cursor: default;
}

/* ── Couleur picker ────────────────────────────────────────── */
.color-picker-section { display: flex; flex-direction: column; gap: 10px; }
.color-swatches { display: flex; gap: 10px; flex-wrap: wrap; }
.swatch {
    width: 32px; height: 32px; border-radius: 50%;
    cursor: pointer; border: 2px solid transparent;
    transition: all var(--transition);
    position: relative;
}
.swatch:hover { transform: scale(1.15); }
.swatch.selected { border-color: var(--text-1); box-shadow: 0 0 0 2px var(--surface) inset; }
.swatch-check {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 14px; opacity: 0;
    transition: opacity var(--transition);
}
.swatch.selected .swatch-check { opacity: 1; }

/* ── Form actions ──────────────────────────────────────────── */
.form-actions {
    display: flex; gap: 10px; justify-content: flex-end;
    margin-top: 28px; padding-top: 24px;
    border-top: 1px solid var(--border-soft);
}
.btn-primary {
    height: 42px; padding: 0 22px;
    background: var(--accent); color: #fff;
    border: none; border-radius: var(--radius-sm);
    font-size: 14px; font-weight: 500; font-family: inherit;
    cursor: pointer; transition: all var(--transition);
    display: flex; align-items: center; gap: 7px;
}
.btn-primary:hover { opacity: .88; transform: translateY(-1px); box-shadow: 0 4px 12px var(--accent-mid); }
.btn-primary:active { transform: translateY(0); }
.btn-secondary {
    height: 42px; padding: 0 20px;
    background: var(--bg); color: var(--text-2);
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    font-size: 14px; font-family: inherit;
    cursor: pointer; transition: all var(--transition);
}
.btn-secondary:hover { border-color: var(--text-2); color: var(--text-1); }

/* ── Stats row ─────────────────────────────────────────────── */
.stats-row {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
    margin-bottom: 20px;
}
.stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 20px 22px;
    box-shadow: var(--shadow-sm);
}
.stat-label { font-size: 12px; color: var(--text-3); font-weight: 500; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 8px; }
.stat-value { font-size: 26px; font-weight: 600; color: var(--text-1); line-height: 1; }
.stat-sub   { font-size: 12px; color: var(--text-3); margin-top: 4px; }

/* ── Security card ─────────────────────────────────────────── */
.security-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid var(--border-soft);
}
.security-item:last-child { border-bottom: none; padding-bottom: 0; }
.sec-left { display: flex; align-items: center; gap: 12px; }
.sec-icon {
    width: 36px; height: 36px; border-radius: var(--radius-sm);
    background: var(--bg); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--text-2);
}
.sec-icon svg { width: 16px; height: 16px; }
.sec-title { font-size: 14px; font-weight: 500; }
.sec-desc  { font-size: 12px; color: var(--text-3); margin-top: 2px; }
.badge-ok {
    font-size: 11px; font-weight: 500; padding: 3px 9px;
    border-radius: 20px; background: #f0fdf4; color: #15803d;
    border: 1px solid #bbf7d0;
}
.badge-warn {
    font-size: 11px; font-weight: 500; padding: 3px 9px;
    border-radius: 20px; background: #fffbeb; color: #92400e;
    border: 1px solid #fde68a;
}

/* ── Toggle switch ─────────────────────────────────────────── */
.toggle {
    width: 40px; height: 22px; border-radius: 20px;
    background: var(--border); cursor: pointer;
    position: relative; transition: background var(--transition);
    border: none; flex-shrink: 0;
}
.toggle.on { background: var(--accent); }
.toggle::after {
    content: ''; position: absolute;
    top: 3px; left: 3px;
    width: 16px; height: 16px; border-radius: 50%;
    background: #fff;
    transition: transform var(--transition);
    box-shadow: 0 1px 3px rgba(0,0,0,.2);
}
.toggle.on::after { transform: translateX(18px); }

/* ── Responsive ────────────────────────────────────────────── */
@media (max-width: 1024px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar.open { transform: translateX(0); }
    .main-content { margin-left: 0; }
    .topbar { padding: 0 20px; }
    .burger-btn { display: flex; align-items: center; justify-content: center; }
    .content { padding: 24px 20px; }
    .form-grid { grid-template-columns: 1fr; }
    .stats-row { grid-template-columns: 1fr; }
}

/* ── Overlay mobile ────────────────────────────────────────── */
.overlay {
    display: none; position: fixed; inset: 0;
    background: rgba(0,0,0,.4); z-index: 99;
}
.overlay.show { display: block; }

/* ── Avatar Modal Styles ── */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>
</head>
<body x-data="{
    async uploadFile(e) {
        const file = e.target.files[0];
        if (!file) return;
        this.loading = true;
        const formData = new FormData();
        formData.append('avatar_file', file);
        const res = await fetch('/api/user/upload_avatar.php', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) { window.location.reload(); } else { alert(data.error); this.loading = false; }
    },
    async selectAvatar(url) {
        this.loading = true;
        await fetch('/api/user/upload_avatar.php', { 
            method: 'POST', 
            body: JSON.stringify({ avatar_choice: url }),
            headers: { 'Content-Type': 'application/json' }
        });
        window.location.reload();
    }
}">

<!-- Overlay mobile -->
<div class="overlay" :class="sidebarOpen ? 'show' : ''" @click="sidebarOpen = false"></div>

<!-- ═══════════════════════════════ SIDEBAR ═══════════════════════════════ -->
<aside class="sidebar" :class="sidebarOpen ? 'open' : ''">

    <div class="sidebar-logo">
        <div class="logo-mark">F</div>
        <div>
            <div class="logo-text">FreeGeny</div>
            <div class="logo-sub">Espace parent</div>
        </div>
    </div>

    <div class="sidebar-user">
        <div class="avatar">
             <?php if ($currentAvatar): ?>
                <img src="<?= $currentAvatar ?>">
            <?php else: ?>
                <?= $initials ?>
            <?php endif; ?>
            <span class="avatar-online"></span>
        </div>
        <div>
            <div class="user-name"><?= $user['full_name'] ?></div>
            <div class="user-role">Parent · <?= $childrenCount ?> enfant<?= $childrenCount > 1 ? 's' : '' ?></div>
        </div>
    </div>

    <nav class="sidebar-nav">
        <div class="nav-section-label">Principal</div>

        <a href="#" class="nav-item">
            <svg fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
            Tableau de bord
        </a>
        <a href="#" class="nav-item">
            <svg fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Mes enfants
            <span class="nav-badge"><?= $childrenCount ?></span>
        </a>

        <div class="nav-section-label" style="margin-top:10px;">Compte</div>

        <a href="#" class="nav-item active">
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
        <a href="#" class="nav-item">
            <svg fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            Apparence
        </a>

        <div class="nav-section-label" style="margin-top:10px;">Contrôle</div>

        <a href="#" class="nav-item">
            <svg fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Contrôle parental
        </a>
        <a href="#" class="nav-item">
            <svg fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            Historique
        </a>
    </nav>

    <div class="sidebar-footer">
        <a href="/api/auth/logout.php" class="btn-logout" style="text-decoration:none;">
            <svg fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Se déconnecter
        </a>
    </div>
</aside>

<!-- ═══════════════════════════════ MAIN ══════════════════════════════════ -->
<div class="main-content">

    <!-- Topbar -->
    <header class="topbar">
        <div class="topbar-left">
            <button class="burger-btn" @click="sidebarOpen = true">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <span class="breadcrumb">FreeGeny &rsaquo; <span>Mon profil</span></span>
        </div>
        <div class="topbar-right">
            <button class="notif-btn">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span class="notif-dot"></span>
            </button>
            <div class="topbar-avatar" @click="modalOpen = true">
                 <?php if ($currentAvatar): ?>
                    <img src="<?= $currentAvatar ?>">
                <?php else: ?>
                    <?= $initials ?>
                <?php endif; ?>
            </div>
        </div>
    </header>

    <!-- Content -->
    <div class="content">

        <div class="page-header">
            <h1 class="page-title">Mon profil</h1>
            <p class="page-subtitle">Gérez vos informations personnelles et préférences</p>
        </div>

        <?php if ($success_msg): ?>
        <div class="toast">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <?= $success_msg ?>
        </div>
        <?php endif; ?>

        <!-- Stats rapides -->
        <div class="stats-row">
            <div class="stat-card">
                <div class="stat-label">Enfants inscrits</div>
                <div class="stat-value"><?= $childrenCount ?></div>
                <div class="stat-sub">Profils actifs</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Membre depuis</div>
                <div class="stat-value" style="font-size:17px;padding-top:4px;"><?= date('F Y', strtotime($user['created_at'])) ?></div>
                <div class="stat-sub">Compte vérifié</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Activité</div>
                <div class="stat-value" style="font-size:17px;padding-top:4px;">Aujourd'hui</div>
                <div class="stat-sub">Dernière connexion</div>
            </div>
        </div>

        <!-- ── Carte : Informations personnelles ── -->
        <form method="POST" action="">
        <div class="card">
            <div class="card-header">
                <div>
                    <div class="card-title">Informations personnelles</div>
                    <div class="card-sub">Votre nom sera affiché sur votre avatar et dans vos rapports</div>
                </div>
            </div>

            <!-- Avatar -->
            <div class="avatar-section">
                <div class="avatar-big" id="avatarBig" @click="modalOpen = true" style="cursor:pointer;">
                     <?php if ($currentAvatar): ?>
                        <img src="<?= $currentAvatar ?>">
                    <?php else: ?>
                        <?= $initials ?>
                    <?php endif; ?>
                </div>
                <div class="avatar-info">
                    <h3><?= $user['full_name'] ?></h3>
                    <p>Votre avatar est généré automatiquement ou personnalisé</p>
                    <button type="button" class="btn-upload" @click="modalOpen = true">Choisir une photo</button>
                </div>
            </div>

            <!-- Champs -->
            <div class="form-grid">
                <div class="form-group">
                    <label for="prenom">Prénom</label>
                    <input type="text" id="prenom" name="prenom" value="<?= $prenom ?>" placeholder="Votre prénom" oninput="updateAvatarJs()">
                </div>
                <div class="form-group">
                    <label for="nom">Nom</label>
                    <input type="text" id="nom" name="nom" value="<?= $nom ?>" placeholder="Votre nom" oninput="updateAvatarJs()">
                </div>
                <div class="form-group full">
                    <label for="email">Adresse e-mail</label>
                    <input type="email" id="email" value="<?= $user['email'] ?>" readonly>
                </div>
                <div class="form-group full">
                    <label for="telephone">Numéro de téléphone</label>
                    <input type="tel" id="telephone" name="telephone" value="<?= $user['phone'] ?>" placeholder="+213 xxx xx xx xx">
                </div>
            </div>

            <!-- Couleur d'accent -->
            <div style="margin-top: 24px;">
                <label style="display:block;margin-bottom:10px;">Couleur principale</label>
                <div class="color-swatches" id="swatches">
                    <?php
                    $colors = [
                        '#2563eb' => 'Bleu',
                        '#7c3aed' => 'Violet',
                        '#059669' => 'Vert',
                        '#dc2626' => 'Rouge',
                        '#ea580c' => 'Orange',
                        '#0891b2' => 'Cyan',
                        '#be185d' => 'Rose',
                        '#374151' => 'Ardoise',
                    ];
                    foreach ($colors as $hex => $name):
                    ?>
                    <div class="swatch" :class="selectedColor === '<?= $hex ?>' ? 'selected' : ''" 
                         style="background:<?= $hex ?>;"
                         title="<?= $name ?>"
                         @click="selectedColor = '<?= $hex ?>'; document.getElementById('couleur_input').value = '<?= $hex ?>'; applyColor('<?= $hex ?>')">
                        <span class="swatch-check">✓</span>
                    </div>
                    <?php endforeach; ?>
                </div>
                <input type="hidden" name="couleur" id="couleur_input" value="<?= $accentColor ?>">
            </div>

            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="window.location.reload()">Annuler</button>
                <button type="submit" class="btn-primary">
                    <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Enregistrer les modifications
                </button>
            </div>
        </div>
        </form>

        <!-- SECURITY & OTHER CARDS (Keep User's Design) -->
        <div class="card">
            <div class="card-header">
                <div>
                    <div class="card-title">Sécurité du compte</div>
                    <div class="card-sub">Protégez votre compte et celui de vos enfants</div>
                </div>
            </div>
            <div class="security-item">
                <div class="sec-left">
                    <div class="sec-icon"><svg fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                    <div>
                        <div class="sec-title">Mot de passe</div>
                        <div class="sec-desc">Sécurisez l'accès à votre espace</div>
                    </div>
                </div>
                <button type="button" class="btn-upload" onclick="togglePasswordModal()">Modifier</button>
            </div>
             <div class="security-item">
                <div class="sec-left">
                    <div class="sec-icon"><svg fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                    <div>
                        <div class="sec-title">Double authentification (OTP)</div>
                        <div class="sec-desc">Recevez un code de validation</div>
                    </div>
                </div>
                <button class="toggle" onclick="this.classList.toggle('on')"></button>
            </div>
        </div>

    </div><!-- /content -->
</div><!-- /main -->

<!-- ═══════════════════════════════ ELITE AVATAR VAULT (Integrated Modal) ══════════════════════════════════ -->
<template x-teleport="body">
    <div x-show="modalOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-6" x-cloak>
        <div x-show="modalOpen" x-transition.opacity @click="modalOpen = false" class="absolute inset-0 bg-slate-900/90 backdrop-blur-xl"></div>
        
        <div x-show="modalOpen" 
             x-transition:enter="transition ease-out duration-500 transform"
             x-transition:enter-start="opacity-0 translate-y-24 scale-95"
             class="relative bg-white w-full max-w-4xl rounded-[4rem] p-12 shadow-2xl overflow-hidden">
            
            <div class="flex justify-between items-center mb-10">
                <div>
                    <h3 class="text-4xl font-black text-slate-900 italic tracking-tighter leading-none">Galerie Élite</h3>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">Choisissez un avatar DiceBear</p>
                </div>
                <button @click="modalOpen = false" class="w-14 h-14 flex items-center justify-center bg-slate-50 text-slate-400 rounded-3xl hover:bg-red-50 hover:text-red-500 transition-all font-black">✕</button>
            </div>

            <!-- Upload Option -->
            <label class="mb-10 p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all text-center cursor-pointer group flex flex-col items-center">
                <div class="text-4xl mb-2">📸</div>
                <p class="font-black text-slate-800 text-xs italic">Uploader ma photo perso</p>
                <input type="file" class="hidden" @change="uploadFile">
            </label>

            <!-- DiceBear Gallery -->
            <div class="max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
                <?php foreach ($avatarStyles as $style => $seeds): ?>
                    <h4 class="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-6 mt-6 italic border-b border-slate-50 pb-2">— <?= strtoupper($style) ?> STYLE —</h4>
                    <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
                        <?php foreach ($seeds as $seed): 
                            $url = "https://api.dicebear.com/7.x/$style/svg?seed=$seed&backgroundColor=f8fafc";
                        ?>
                        <button @click="selectAvatar('<?= $url ?>')" 
                                class="aspect-square bg-slate-50 rounded-[2rem] p-2 border-2 border-transparent hover:border-orange-500 transition-all transform hover:scale-105">
                            <img src="<?= $url ?>" class="w-full h-full rounded-[1.5rem]">
                        </button>
                        <?php endforeach; ?>
                    </div>
                <?php endforeach; ?>
            </div>

            <!-- Loading State -->
            <div x-show="loading" class="absolute inset-0 bg-white/95 flex flex-col items-center justify-center space-y-4 z-[210]">
                <div class="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-orange-600 animate-[progress_1s_infinite] w-1/3"></div>
                </div>
                <p class="text-[10px] font-black uppercase tracking-widest animate-pulse italic">Synchronisation...</p>
            </div>
        </div>
    </div>
</template>

<script>
function updateAvatarJs() {
    const p = document.getElementById('prenom').value;
    const n = document.getElementById('nom').value;
    const initials = ((p[0] || '') + (n[0] || '')).toUpperCase();
    const avatarBig = document.getElementById('avatarBig');
    if (avatarBig && !avatarBig.querySelector('img')) {
        avatarBig.textContent = initials || '?';
    }
}

function applyColor(hex) {
    document.documentElement.style.setProperty('--accent', hex);
    document.documentElement.style.setProperty('--accent-light', hex + '18');
    document.documentElement.style.setProperty('--accent-mid', hex + '35');
}

function togglePasswordModal() {
    // Logic for password modal if needed
    alert('Fonctionnalité de changement de mot de passe en cours de branchement...');
}
</script>

<style>
@keyframes progress {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
}
</style>

</body>
</html>
