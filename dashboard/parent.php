<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';

ini_set('display_errors', 1);
error_reporting(E_ALL);

initSession();

try {
    if (!isset($_SESSION['logged_in'])) { 
        header('Location: /auth/login'); 
        exit; 
    }

    $userId = $_SESSION['user_id'] ?? 0;
    $user = DB::fetchOne("SELECT * FROM users WHERE id = ?", [$userId]);
    
    if (!$user) {
        session_destroy();
        header('Location: /auth/login');
        exit;
    }

    $initials = getInitials($user['full_name']);
    $avatarColor = getAvatarColor($user['full_name']);
} catch (Exception $e) {
    die("Erreur : " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Profil - FreeGeny</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Outfit', sans-serif; background: #fafafa; }
        .glass { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.5); }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center bg-slate-50 p-6">

    <div class="w-full max-w-md bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-10 text-center" x-data="{ open: false }">
        
        <!-- IDENTITY VISUAL (Point 1) -->
        <div class="relative inline-block mb-6">
            <div class="w-32 h-32 rounded-[2.5rem] mx-auto flex items-center justify-center text-white font-black text-4xl shadow-2xl transition-transform hover:rotate-6 cursor-pointer" 
                 @click="open = !open"
                 style="background: <?php echo $avatarColor; ?>;">
                <?php echo $initials; ?>
            </div>
            <!-- Status Indicator -->
            <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full shadow-lg"></div>
        </div>

        <h2 class="text-3xl font-black tracking-tight text-slate-900 mb-2"><?php echo $user['full_name']; ?></h2>
        <div class="inline-flex items-center space-x-2 px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full mb-8">
            <span class="text-[10px] font-black uppercase tracking-widest italic">⭐ Parent Elite</span>
        </div>

        <div class="space-y-4 text-left border-t border-slate-50 pt-8">
            <div class="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
                <span class="text-xl">📧</span>
                <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                    <p class="font-bold text-sm text-slate-700"><?php echo strtolower($user['email']); ?></p>
                </div>
            </div>
            <div class="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
                <span class="text-xl">📞</span>
                <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Téléphone</p>
                    <p class="font-bold text-sm text-slate-700"><?php echo $user['phone'] ?: 'Non renseigné'; ?></p>
                </div>
            </div>
        </div>

        <div class="mt-10">
            <a href="/api/auth/logout.php" class="inline-block text-xs font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors">Déconnexion</a>
        </div>

    </div>

</body>
</html>
