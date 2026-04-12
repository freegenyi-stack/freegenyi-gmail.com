<?php
/**
 * auth/forgot-password.php - Mot de passe oublié
 */
require_once __DIR__ . '/../config/app.php';
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
                <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Dépannage en cours de développement...</p>
            </div>

            <div class="space-y-4 text-center">
                <p class="text-slate-600 text-sm font-medium">Bientôt, vous pourrez entrer votre adresse email ici pour recevoir un lien de réinitialisation sécurisé.</p>
                
                <div class="pt-6">
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="inline-block w-full bg-slate-950 text-white py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all duration-300 shadow-xl">
                        ← Retour à la connexion
                    </a>
                </div>
            </div>
            
        </div>
    </div>
</body>
</html>
