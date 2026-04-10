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

// Générer une liste de styles DiceBear "Elite"
$avatarStyles = [
    'micah' => ['Oliver', 'Caleb', 'Jack', 'Avery', 'Riley', 'Jordan', 'Max', 'Sam', 'Alex', 'Bailey', 'Casey', 'Robin'],
    'avataaars' => ['Robert', 'Kimberly', 'Matthew', 'Susan', 'James', 'Linda', 'Thomas', 'Barbara', 'Christopher', 'Elizabeth', 'Richard', 'Jennifer'],
    'personas' => ['Felix', 'Aneka', 'Sasha', 'Matti', 'Lukas', 'Klaus', 'Jules', 'Elsa', 'Hans', 'Greta', 'Ulrich', 'Inge']
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
        .avatar-main { border: 8px solid #fff; box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.15); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .dicebear-card:hover { border-color: #EA580C; transform: scale(1.05); }
    </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F8FAFC]" 
      x-data="{ 
          modalOpen: false, 
          loading: false, 
          error: '',
          currentAvatar: '<?php echo $currentAvatar; ?>',
          async uploadFile(e) {
              const file = e.target.files[0];
              if (!file) return;
              this.loading = true;
              const formData = new FormData();
              formData.append('avatar_file', file);
              const res = await fetch('/api/user/upload_avatar.php', { method: 'POST', body: formData });
              const data = await res.json();
              if (data.success) { window.location.reload(); } else { this.error = data.error; this.loading = false; }
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
        <div class="w-48 h-48 rounded-[3rem] flex items-center justify-center text-white font-black text-6xl avatar-main transition-all duration-700 overflow-hidden bg-slate-200 group-hover:rotate-2">
            <?php if ($currentAvatar): ?>
                <img src="<?php echo $currentAvatar; ?>" class="w-full h-full object-cover">
            <?php else: ?>
                <span class="text-7xl" style="color: <?php echo $avatarColor; ?>;"><?php echo $initials; ?></span>
            <?php endif; ?>
        </div>
        <div class="absolute inset-0 bg-slate-900/40 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
            <span class="text-white font-black text-[11px] uppercase tracking-[0.4em] bg-white/10 px-6 py-3 rounded-full border border-white/20 italic shadow-2xl">Elite ID</span>
        </div>
        <div class="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl">📸</div>
    </div>

    <div class="text-center mt-12">
        <h2 class="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3 italic"><?php echo $user['full_name']; ?></h2>
        <div class="flex items-center justify-center space-x-3">
            <span class="px-3 py-1 bg-green-100 text-green-700 text-[9px] font-black rounded-full uppercase italic">Compte Actif</span>
            <p class="text-[10px] font-bold text-slate-400 lowercase tracking-widest"><?php echo $user['email']; ?></p>
        </div>
    </div>

    <!-- MODALE ELITE (DiceBear) -->
    <template x-teleport="body">
        <div x-show="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-6" x-cloak>
            <div x-show="modalOpen" x-transition.opacity @click="modalOpen = false" class="absolute inset-0 bg-slate-900/90 backdrop-blur-xl"></div>
            
            <div x-show="modalOpen" 
                 x-transition:enter="transition ease-out duration-500 transform"
                 x-transition:enter-start="opacity-0 translate-y-24 scale-95"
                 class="relative bg-white w-full max-w-4xl rounded-[4rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
                
                <div class="flex justify-between items-center mb-10">
                    <div>
                        <h3 class="text-4xl font-black text-slate-900 italic tracking-tighter leading-none">Galerie Élite</h3>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">Powered by DiceBear & FreeGeny</p>
                    </div>
                    <button @click="modalOpen = false" class="w-14 h-14 flex items-center justify-center bg-slate-50 text-slate-400 rounded-3xl hover:bg-red-50 hover:text-red-500 transition-all font-black">✕</button>
                </div>

                <!-- ACTIONS RAPIDES (Upload) -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <label class="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all text-center cursor-pointer group col-span-1">
                        <div class="text-4xl mb-4">📸</div>
                        <p class="font-black text-slate-800 text-xs italic">Ma Photo Locale</p>
                        <input type="file" class="hidden" @change="uploadFile">
                    </label>
                    <div class="p-8 bg-slate-900 rounded-[2.5rem] flex flex-col items-center justify-center text-center text-white col-span-2">
                        <p class="text-[9px] font-black uppercase tracking-widest opacity-40 mb-3 italic">Identification</p>
                        <p class="font-black italic text-lg tracking-tight">Personnalisez votre présence sur la plateforme</p>
                    </div>
                </div>

                <!-- LA GRANDE GALERIE (36 Avatars Elite) -->
                <div class="max-h-[45vh] overflow-y-auto pr-4 custom-scrollbar">
                    <?php foreach ($avatarStyles as $style => $seeds): ?>
                        <h4 class="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-6 mt-10 italic border-b border-slate-50 pb-4">— <?php echo strtoupper($style); ?> STYLE —</h4>
                        <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
                            <?php foreach ($seeds as $seed): 
                                $url = "https://api.dicebear.com/7.x/$style/svg?seed=$seed&backgroundColor=f8fafc";
                            ?>
                            <button @click="selectAvatar('<?php echo $url; ?>')" 
                                    class="dicebear-card aspect-square bg-slate-50 rounded-[2rem] p-2 border-2 border-transparent transition-all duration-300">
                                <img src="<?php echo $url; ?>" class="w-full h-full rounded-[1.5rem]">
                            </button>
                            <?php endforeach; ?>
                        </div>
                    <?php endforeach; ?>
                </div>

                <!-- LOADING OVERLAY -->
                <div x-show="loading" class="absolute inset-0 bg-white/95 flex flex-col items-center justify-center space-y-8 z-[60]">
                    <div class="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-orange-600 animate-[progress_1s_ease-in-out_infinite] w-1/3"></div>
                    </div>
                    <p class="text-[11px] font-black uppercase tracking-[0.5em] animate-pulse italic">Synchronisation Elite Identity...</p>
                </div>
            </div>
        </div>
    </template>

    <style>
        @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
        }
    </style>
</body>
</html>
