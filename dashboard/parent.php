<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';

initSession();

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
$currentAvatar = $user['profile_photo'] ?? '';
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
        body { font-family: 'Outfit', sans-serif; background: #ffffff; }
        [x-cloak] { display: none !important; }
        .avatar-glow { box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
        .avatar-glow:hover { box-shadow: 0 30px 60px rgba(234, 88, 12, 0.2); }
    </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-6" x-data="{ modalOpen: false, loading: false }">

    <!-- AVATAR ROND CENTRAL -->
    <div class="relative group cursor-pointer" @click="modalOpen = true">
        <div class="w-40 h-40 rounded-full flex items-center justify-center text-white font-black text-5xl avatar-glow transition-all duration-500 group-hover:scale-105 border-8 border-white overflow-hidden bg-slate-100"
             style="background: <?php echo $avatarColor; ?>;">
            <?php if ($currentAvatar && strpos($currentAvatar, 'http') === 0): ?>
                <img src="<?php echo $currentAvatar; ?>" class="w-full h-full object-cover">
            <?php elseif ($currentAvatar): ?>
                <span class="text-6xl"><?php echo $currentAvatar; ?></span>
            <?php else: ?>
                <?php echo $initials; ?>
            <?php endif; ?>
        </div>
        
        <!-- Hover Overlay -->
        <div class="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <span class="text-white font-black text-xs uppercase tracking-widest italic">Modifier</span>
        </div>

        <!-- Camera Icon Badge -->
        <div class="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-xl">📸</div>
    </div>

    <!-- NOM & INFOS -->
    <div class="text-center mt-8">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight"><?php echo $user['full_name']; ?></h2>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 italic"><?php echo strtolower($user['email']); ?></p>
    </div>

    <!-- MODALE DE CHOIX (Upload ou Bibliothèque) -->
    <template x-teleport="body">
        <div x-show="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-6" x-cloak>
            <div x-show="modalOpen" x-transition.opacity @click="modalOpen = false" class="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>
            
            <div x-show="modalOpen" 
                 x-transition:enter="transition ease-out duration-500 transform"
                 x-transition:enter-start="opacity-0 scale-90 translate-y-10"
                 x-transition:enter-end="opacity-100 scale-100 translate-y-0"
                 class="relative bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl overflow-hidden">
                
                <div class="flex justify-between items-center mb-10">
                    <h3 class="text-2xl font-black text-slate-900 italic">Modifier mon profil</h3>
                    <button @click="modalOpen = false" class="text-slate-300 hover:text-red-500 font-black">✕</button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    <!-- OPTION 1: UPLOAD (Point 1.a) -->
                    <div class="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all text-center cursor-pointer relative group">
                        <div class="text-4xl mb-4 group-hover:scale-125 transition-transform">📤</div>
                        <p class="font-black text-slate-800 text-sm italic">Uploader une image</p>
                        <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2">JPG, PNG (Max 2Mo)</p>
                        <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" @change="loading = true; setTimeout(() => { modalOpen = false; loading = false; }, 1500)">
                    </div>

                    <!-- OPTION 2: BIBLIOTHÈQUE (Point 1.b) -->
                    <div class="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-transparent hover:border-blue-500 hover:bg-blue-50 transition-all text-center cursor-pointer group">
                        <div class="text-4xl mb-4 group-hover:rotate-12 transition-transform">🎭</div>
                        <p class="font-black text-slate-800 text-sm italic">Choisir un avatar</p>
                        <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2">Bibliothèque Élite</p>
                    </div>

                </div>

                <!-- GRILLE D'AVATARS (Grande Liste) -->
                <div class="mt-12">
                    <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center italic">— Bibliothèque d'Avatars —</h4>
                    <div class="grid grid-cols-5 gap-4">
                        <?php 
                        $icons = ['🦁','🐼','🦊','🐯','🐱','🐶','🤖','👾','👽','🦸','🥷','🤴','👸','🦄','🦖']; 
                        foreach ($icons as $icon): 
                        ?>
                            <button class="aspect-square bg-slate-50 rounded-2xl flex items-center justify-center text-3xl hover:bg-white hover:scale-110 hover:shadow-xl transition-all active:scale-95 border border-transparent hover:border-slate-100">
                                <?php echo $icon; ?>
                            </button>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- Loading State Overlay -->
                <div x-show="loading" class="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                    <div class="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                    <p class="text-xs font-black uppercase tracking-widest animate-pulse">Synchronisation...</p>
                </div>

                <div class="mt-10 pt-4 border-t border-slate-50 text-center">
                    <a href="/api/auth/logout.php" class="text-[9px] font-black text-red-300 hover:text-red-500 uppercase tracking-[0.2em] transition-colors italic">Fermer la session</a>
                </div>
            </div>
        </div>
    </template>

</body>
</html>
