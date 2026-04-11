<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';
initSession();

if (!isset($_SESSION['logged_in'])) { header('Location: /auth/login'); exit; }
$user = DB::fetchOne("SELECT * FROM users WHERE id = ?", [$_SESSION['user_id']]);
if (!$user) { header('Location: /auth/login'); exit; }

$initials = getInitials($user['full_name']);
$avatarColor = getAvatarColor($user['full_name']);
$currentAvatar = $user['profile_photo'] ?? '';

// Bibliothèque Élite Étendue
$avatarCategories = [
    'Tech & Pro' => [
        'micah' => ['Oliver', 'Caleb', 'Jack', 'Avery', 'Riley', 'Jordan'],
        'pixel-art' => ['Felix', 'Aneka', 'Sasha', 'Matti', 'Lukas', 'Klaus']
    ],
    'Illustrations' => [
        'lorelei' => ['Sasha', 'Matti', 'Lukas', 'Klaus', 'Hans', 'Greta'],
        'open-peeps' => ['Jules', 'Elsa', 'Hans', 'Greta', 'Ulrich', 'Inge']
    ],
    'Aventure' => [
        'adventurer' => ['Felix', 'Aneka', 'Sasha', 'Matti', 'Lukas', 'Klaus'],
        'big-smile' => ['Oliver', 'Caleb', 'Jack', 'Avery', 'Riley', 'Jordan']
    ],
    'Abstrait' => [
        'shapes' => ['Felix', 'Aneka', 'Sasha', 'Matti', 'Lukas', 'Klaus'],
        'initials' => ['Felix', 'Aneka', 'Sasha', 'Matti', 'Lukas', 'Klaus']
    ]
];
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Elite Dashboard - FreeGeny</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Outfit', sans-serif; background: #ffffff; }
        [x-cloak] { display: none !important; }
        .avatar-main { border: 8px solid #fff; box-shadow: 0 40px 80px -15px rgba(0, 0, 0, 0.2); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .cat-tab.active { background: #0f172a; color: white; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
    </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F1F5F9]" 
      x-data="{ 
          modalOpen: false, 
          loading: false, 
          currentCategory: 'Tech & Pro',
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

    <!-- AVATAR CENTRAL -->
    <div class="relative group cursor-pointer" @click="modalOpen = true">
        <div class="w-52 h-52 rounded-[3.5rem] flex items-center justify-center text-white font-black text-6xl avatar-main transition-all duration-700 overflow-hidden bg-white mb-2 group-hover:rotate-2">
            <?php if ($currentAvatar): ?>
                <img src="<?php echo $currentAvatar; ?>" class="w-full h-full object-cover">
            <?php else: ?>
                <span class="text-8xl" style="color: <?php echo $avatarColor; ?>;"><?php echo $initials; ?></span>
            <?php endif; ?>
        </div>
        <div class="absolute -bottom-2 -right-2 w-14 h-14 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🎭</div>
    </div>

    <div class="text-center mt-12 bg-white/50 backdrop-blur-md px-12 py-8 rounded-[3rem] border border-white shadow-xl">
        <h2 class="text-4xl font-black text-slate-900 tracking-tighter mb-2 italic"><?php echo $user['full_name']; ?></h2>
        <div class="flex items-center justify-center space-x-3">
            <span class="px-4 py-1.5 bg-slate-900 text-white text-[9px] font-black rounded-full uppercase italic tracking-widest">Membre Elite</span>
            <p class="text-[10px] font-bold text-slate-400 lowercase tracking-widest italic"><?php echo $user['email']; ?></p>
        </div>
    </div>

    <!-- MODALE "VOÛTE DES AVATARS" -->
    <template x-teleport="body">
        <div x-show="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-6" x-cloak>
            <div x-show="modalOpen" x-transition.opacity @click="modalOpen = false" class="absolute inset-0 bg-slate-900/95 backdrop-blur-xl"></div>
            
            <div x-show="modalOpen" 
                 x-transition:enter="transition ease-out duration-500 transform"
                 x-transition:enter-start="opacity-0 translate-y-24 scale-95"
                 class="relative bg-white w-full max-w-5xl rounded-[4rem] p-12 shadow-3xl overflow-hidden min-h-[70vh] flex flex-col">
                
                <div class="flex justify-between items-start mb-12">
                    <div>
                        <h3 class="text-5xl font-black text-slate-900 italic tracking-tighter leading-none">Voûte Élite</h3>
                        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-4 flex items-center">
                            <span class="w-8 h-px bg-slate-200 mr-4"></span> Identité Visuelle Universelle
                        </p>
                    </div>
                    <button @click="modalOpen = false" class="w-16 h-16 flex items-center justify-center bg-slate-50 text-slate-400 rounded-[2rem] hover:bg-red-50 hover:text-red-500 transition-all font-black text-xl">✕</button>
                </div>

                <!-- NAVIGATION PAR CATÉGORIE -->
                <div class="flex space-x-3 mb-10 overflow-x-auto pb-4 custom-scrollbar">
                    <?php foreach (array_keys($avatarCategories) as $cat): ?>
                        <button @click="currentCategory = '<?php echo $cat; ?>'" 
                                :class="currentCategory === '<?php echo $cat; ?>' ? 'active' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'"
                                class="cat-tab whitespace-nowrap px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300">
                            <?php echo $cat; ?>
                        </button>
                    <?php endforeach; ?>
                </div>

                <!-- GRILLE DE LA CATÉGORIE ACTIVE -->
                <div class="flex-grow overflow-y-auto pr-6 custom-scrollbar">
                    
                    <!-- Option Upload Toujours visible en haut -->
                    <label class="mb-10 p-10 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all text-center cursor-pointer group flex flex-col items-center justify-center">
                        <div class="text-5xl mb-4 group-hover:-translate-y-2 transition-transform duration-500">📸</div>
                        <p class="font-black text-slate-800 italic uppercase text-xs tracking-widest">Ma Propre Image HD</p>
                        <input type="file" class="hidden" @change="uploadFile">
                    </label>

                    <?php foreach ($avatarCategories as $catName => $styles): ?>
                        <div x-show="currentCategory === '<?php echo $catName; ?>'" x-transition x-cloak>
                            <?php foreach ($styles as $style => $seeds): ?>
                                <h4 class="text-[10px] font-black text-slate-200 uppercase tracking-[0.5em] mb-8 italic flex items-center">
                                    <span class="mr-6"><?php echo strtoupper($style); ?> STYLE</span>
                                    <span class="flex-grow h-px bg-slate-50"></span>
                                </h4>
                                <div class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-6 mb-16">
                                    <?php foreach ($seeds as $seed): 
                                        $url = "https://api.dicebear.com/7.x/$style/svg?seed=$seed&backgroundColor=f1f5f9";
                                    ?>
                                    <button @click="selectAvatar('<?php echo $url; ?>')" 
                                            class="aspect-square bg-slate-50 rounded-[2rem] p-3 border-2 border-transparent transition-all duration-300 hover:border-slate-900 hover:scale-110 hover:shadow-2xl">
                                        <img src="<?php echo $url; ?>" class="w-full h-full rounded-[1.5rem]">
                                    </button>
                                    <?php endforeach; ?>
                                </div>
                            <?php foreach ($seeds as $seed): 
                                        $url = "https://api.dicebear.com/7.x/$style/svg?seed=$seed" . "Special&backgroundColor=f1f5f9";
                                    ?>
                                    <button @click="selectAvatar('<?php echo $url; ?>')" 
                                            class="aspect-square bg-slate-50 rounded-[2rem] p-3 border-2 border-transparent transition-all duration-300 hover:border-slate-900 hover:scale-110 hover:shadow-2xl">
                                        <img src="<?php echo $url; ?>" class="w-full h-full rounded-[1.5rem]">
                                    </button>
                                    <?php endforeach; ?>
                            <?php endforeach; ?>
                        </div>
                    <?php endforeach; ?>
                </div>

                <!-- LOADING OVERLAY -->
                <div x-show="loading" class="absolute inset-0 bg-white/95 flex flex-col items-center justify-center space-y-10 z-[60]">
                    <div class="h-1 w-48 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-slate-900 animate-[loading_1s_infinite] w-full origin-left"></div>
                    </div>
                    <p class="text-[11px] font-black uppercase tracking-[0.8em] animate-pulse italic">Voûte Élite — Synchronisation</p>
                </div>
            </div>
        </div>
    </template>

    <style>
        @keyframes loading {
            0% { transform: scaleX(0); }
            50% { transform: scaleX(1); }
            100% { transform: scaleX(0); transform-origin: right; }
        }
    </style>
</body>
</html>
