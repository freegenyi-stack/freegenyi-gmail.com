<?php
/**
 * auth/reset-password.php - Réinitialisation du mot de passe (Interface)
 */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../api/auth/auth_helpers.php';

$token = $_GET['token'] ?? '';
$error = $_GET['error'] ?? null;

// Vérifier si le token est valide avant d'afficher le formulaire
$tokenData = null;
if (!empty($token)) {
    $tokenData = DB::fetchOne("
        SELECT * FROM password_reset_tokens 
        WHERE token = ? 
        LIMIT 1
    ", [$token]);
}

if (!$tokenData || strtotime($tokenData['expires_at']) < time()) {
    // Si le token est invalide ou expiré, rediriger avec une erreur
    header("Location: /{$country}-{$lang}/auth/forgot-password?error=" . urlencode('Le lien de réinitialisation est invalide ou a expiré. Merci de refaire une demande.'));
    exit;
}
?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau mot de passe | FreeGeny Elite</title>
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
                <h1 class="text-3xl font-black text-slate-950 font-title tracking-tight mb-1">Nouveau mot de passe</h1>
                <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Étape finale de sécurité</p>
            </div>

            <?php if ($error): ?>
                <div class="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm animate-pulse">
                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2"></path></svg>
                    <p><?php echo htmlspecialchars($error); ?></p>
                </div>
            <?php endif; ?>

            <form action="/api/auth/reset-password.php" method="POST" class="space-y-6">
                <input type="hidden" name="token" value="<?php echo htmlspecialchars($token); ?>">
                
                <div>
                    <label for="password" class="block text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2">Nouveau mot de passe</label>
                    <input type="password" name="password" id="password" required minlength="8"
                        class="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500/10 focus:bg-white px-6 py-4 rounded-2xl text-slate-900 font-medium transition-all outline-none"
                        placeholder="••••••••">
                </div>

                <div>
                    <label for="confirm_password" class="block text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2">Confirmer le mot de passe</label>
                    <input type="password" name="confirm_password" id="confirm_password" required minlength="8"
                        class="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500/10 focus:bg-white px-6 py-4 rounded-2xl text-slate-900 font-medium transition-all outline-none"
                        placeholder="••••••••">
                </div>

                <button type="submit" class="w-full bg-slate-950 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all duration-300 shadow-xl shadow-slate-950/20 active:scale-[0.98]">
                    Mettre à jour mon accès
                </button>
            </form>
            
        </div>
    </div>
</body>
</html>
