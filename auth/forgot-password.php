<?php
/**
 * auth/forgot-password.php - Mot de passe oublié
 */
require_once __DIR__ . '/../config/app.php';

$error = $_GET['error'] ?? null;
$success = $_GET['success'] ?? null;
?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mot de passe oublié | FreeGeny Elite</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'DM Sans', sans-serif; background: #f8fafc; }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass-card { background: rgba(255,255,255,0.98); }
    </style>
</head>
<body class="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Background -->
    <div class="fixed inset-0 pointer-events-none opacity-50">
        <div class="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-100 rounded-full blur-[120px]"></div>
        <div class="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-orange-100 rounded-full blur-[120px]"></div>
    </div>

    <div class="w-full max-w-md relative z-10">
        <div class="glass-card rounded-[3.5rem] shadow-[0_45px_100px_rgba(0,0,0,0.07)] border border-white p-10 pt-14 relative">
            <!-- Logo flottant -->
            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/" class="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-8 py-3 rounded-2xl shadow-lg border border-slate-50 flex items-center gap-3 whitespace-nowrap hover:shadow-xl transition-shadow">
                <img src="/assets/img/logo.png" alt="FreeGeny" class="h-8 w-auto">
                <span class="text-lg font-black text-slate-900 uppercase font-title tracking-tighter">Free<span class="text-orange-600">Geny</span></span>
            </a>

            <div class="mb-8 text-center">
                <h1 class="text-3xl font-black text-slate-950 font-title tracking-tight mb-1">Mot de passe oublié</h1>
                <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Récupération sécurisée</p>
            </div>

            <?php if ($error): ?>
                <div class="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm animate-pulse">
                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2"></path></svg>
                    <p><?php echo htmlspecialchars($error); ?></p>
                </div>
            <?php endif; ?>

            <?php if ($success): ?>
                <div class="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 text-sm">
                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"></path></svg>
                    <p><?php echo htmlspecialchars($success); ?></p>
                </div>
            <?php endif; ?>

            <form action="/api/auth/forgot-password.php" method="POST" class="space-y-6">
                <?php CSRF::insertInput(); ?>
                <div>
                    <label for="email" class="block text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2">Votre adresse email</label>
                    <input type="email" name="email" id="email" required
                        class="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500/10 focus:bg-white px-6 py-4 rounded-2xl text-slate-900 font-medium transition-all outline-none"
                        placeholder="nom@exemple.com">
                </div>

                <button type="submit" class="w-full bg-slate-950 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all duration-300 shadow-xl shadow-slate-950/20 active:scale-[0.98]">
                    Envoyer le lien de reset
                </button>

                <div class="text-center">
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="text-[11px] font-black uppercase text-slate-400 hover:text-orange-600 transition">
                        ← Retour à la connexion
                    </a>
                </div>
            </form>
            
        </div>
    </div>
</body>
</html>
