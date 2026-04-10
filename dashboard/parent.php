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
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Profil Elite - FreeGeny</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Outfit', sans-serif; background: #ffffff; }
        [x-cloak] { display: none !important; }
        .avatar-frame { border: 8px solid #fff; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); }
    </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAFBFF]" 
      x-data="{ 
          modalOpen: false, 
          loading: false, 
          error: '',
          currentAvatar: '<?php echo $currentAvatar; ?>',
          async uploadFile(e) {
              const file = e.target.files[0];
              if (!file) return;
              this.loading = true;
              this.error = '';

              const formData = new FormData();
              formData.append('avatar_file', file);

              try {
                  const res = await fetch('/api/user/upload_avatar.php', { method: 'POST', body: formData });
                  const data = await res.json();
                  if (data.success) {
                      this.currentAvatar = data.photo_url;
                      window.location.reload();
                  } else {
                      this.error = data.error;
                  }
              } catch (err) {
                  this.error = 'Erreur serveur.';
              } finally {
                  this.loading = false;
              }
          },
          async selectAvatar(choice) {
              this.loading = true;
              try {
                  const res = await fetch('/api/user/upload_avatar.php', { 
                      method: 'POST', 
                      body: JSON.stringify({ avatar_choice: choice }),
                      headers: { 'Content-Type': 'application/json' }
                  });
                  if (res.ok) {
                      this.currentAvatar = choice;
                      window.location.reload();
                  }
              } finally {
                  this.loading = false;
              }
          }
      }">

    <!-- AVATAR CENTRAL SÉRIEUX -->
    <div class="relative group cursor-pointer" @click="modalOpen = true">
        <div class="w-44 h-44 rounded-full flex items-center justify-center text-white font-black text-6xl avatar-frame transition-all duration-500 overflow-hidden bg-slate-200"
             :style="'background: ' + (currentAvatar && !currentAvatar.includes('/') ? '#0f172a' : '<?php echo $avatarColor; ?>')">
            
            <template x-if="currentAvatar && currentAvatar.includes('/')">
                <img :src="currentAvatar" class="w-full h-full object-cover">
            </template>
            <template x-if="currentAvatar && !currentAvatar.includes('/')">
                <span class="text-7xl" x-text="currentAvatar"></span>
            </template>
            <template x-if="!currentAvatar">
                <span><?php echo $initials; ?></span>
            </template>
        </div>
        
        <div class="absolute inset-0 bg-slate-900/40 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
            <span class="text-white font-black text-[10px] uppercase tracking-[0.3em] bg-white/10 px-4 py-2 rounded-full border border-white/20 italic">Éditer Profil</span>
        </div>
    </div>

    <div class="text-center mt-10">
        <h2 class="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2"><?php echo $user['full_name']; ?></h2>
        <div class="flex items-center justify-center space-x-2">
            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest italic"><?php echo strtolower($user['email']); ?></p>
        </div>
    </div>

    <!-- MODALE ELITE -->
    <template x-teleport="body">
        <div x-show="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-6" x-cloak>
            <div x-show="modalOpen" x-transition.opacity @click="modalOpen = false" class="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"></div>
            
            <div x-show="modalOpen" 
                 x-transition:enter="transition ease-out duration-500 transform"
                 x-transition:enter-start="opacity-0 translate-y-24 scale-95"
                 class="relative bg-white w-full max-w-2xl rounded-[3.5rem] p-12 shadow-2xl overflow-hidden">
                
                <div class="flex justify-between items-center mb-12">
                    <div>
                        <h3 class="text-3xl font-black text-slate-900 italic tracking-tighter">Personnalisation Elite</h3>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Identité visuelle FreeGeny</p>
                    </div>
                    <button @click="modalOpen = false" class="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">✕</button>
                </div>

                <!-- Error Message -->
                <div x-show="error" class="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-bold border border-red-100 italic" x-text="error"></div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <!-- UPLOAD (Point 1.a) -->
                    <label class="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all text-center cursor-pointer group">
                        <div class="text-5xl mb-4 group-hover:-translate-y-2 transition-transform">📸</div>
                        <p class="font-black text-slate-800 text-sm">Uploader une photo</p>
                        <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2 italic">Qualité HD supportée</p>
                        <input type="file" class="hidden" @change="uploadFile">
                    </label>

                    <!-- INFO PLACEHOLDER -->
                    <div class="p-8 bg-slate-900 rounded-[2.5rem] flex flex-col items-center justify-center text-center text-white">
                        <p class="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 italic leading-none">Statut Compte</p>
                        <p class="font-black italic text-xl">Parent Premium</p>
                        <p class="text-[9px] font-bold text-orange-400 mt-2 uppercase tracking-widest">Membre depuis <?php echo date('Y', strtotime($user['created_at'])); ?></p>
                    </div>
                </div>

                <!-- SÉRIEUSE BIBLIOTHÈQUE (Point 1.b) -->
                <div>
                    <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 text-center italic">— Avatars Professionnels —</h4>
                    <div class="grid grid-cols-4 md:grid-cols-6 gap-5">
                         <?php 
                         $seriousAvatars = ['👨‍💼','👩‍💼','👨‍💻','👩‍💻','🦸‍♂️','🦸‍♀️','🕵️‍♂️','🕵️‍♀️','🧑‍⚖️','🧑‍🏫','🧑‍⚕️','🧑‍🎨']; 
                         foreach ($seriousAvatars as $icon): 
                         ?>
                            <button @click="selectAvatar('<?php echo $icon; ?>')" 
                                    class="aspect-square bg-slate-50 rounded-[1.8rem] flex items-center justify-center text-4xl hover:bg-white hover:scale-110 hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
                                <?php echo $icon; ?>
                            </button>
                         <?php endforeach; ?>
                    </div>
                </div>

                <!-- LOADING OVERLAY -->
                <div x-show="loading" class="absolute inset-0 bg-white/95 flex flex-col items-center justify-center space-y-6 z-[60]">
                    <div class="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-orange-600 animate-[progress_1.5s_ease-in-out_infinite] w-1/3"></div>
                    </div>
                    <p class="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Synchronisation Elite...</p>
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
