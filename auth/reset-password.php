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
    
    <!-- LOTTIE LOCAL -->
    <script src="/assets/js/lottie.min.js"></script>

    <style>
        body { font-family: 'DM Sans', sans-serif; background: #f8fafc; }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass-card { background: rgba(255,255,255,0.98); }
        #lottie-box { width: 450px; height: 450px; margin: 0 auto; }
        
        /* Password Strength Styles */
        .req-item { transition: all 0.3s ease; }
        .req-met { color: #16a34a !important; font-weight: 700; }
        .req-met span { background: #dcfce7; color: #16a34a; }
        .strength-bar { height: 4px; border-radius: 4px; transition: all 0.4s ease; width: 0%; background: transparent; }
    </style>
</head>
<body class="min-h-[100dvh] w-full flex items-center justify-center p-4 sm:p-6 relative overflow-x-hidden overflow-y-auto">

    <div class="fixed inset-0 pointer-events-none opacity-50">
        <div class="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-100 rounded-full blur-[120px]"></div>
        <div class="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-orange-100 rounded-full blur-[120px]"></div>
    </div>

    <div class="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-20 relative z-10">

        <!-- Left : Animation Lottie locale -->
        <div class="hidden lg:block flex-1 text-center">
            <div id="lottie-box"></div>
            <h2 class="text-4xl font-black text-slate-900 font-title tracking-tight mb-2 -mt-4 uppercase">Sécurité.</h2>
            <p class="text-slate-500 text-xl font-light">Renforcez les défenses de votre compte.</p>
        </div>

        <!-- Right : Formulaire -->
        <div class="w-full max-w-md mt-6 lg:mt-0">
            <div class="glass-card rounded-[2.5rem] sm:rounded-[3.5rem] shadow-[0_45px_100px_rgba(0,0,0,0.07)] border border-white p-6 pt-10 sm:p-10 sm:pt-14 relative">
                
                <a href="/<?php echo ($country ?? 'DZ') . '-' . ($lang ?? 'fr'); ?>/" class="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 bg-white px-6 sm:px-8 py-2 sm:py-3 rounded-2xl shadow-lg border border-slate-50 flex items-center gap-2 sm:gap-3 whitespace-nowrap hover:shadow-xl hover:text-orange-600 transition-all z-[100] cursor-pointer">
                    <img src="/assets/img/logo.png" alt="FreeGeny" class="h-6 sm:h-8 w-auto">
                    <span class="text-base sm:text-lg font-black text-slate-900 uppercase font-title tracking-tighter">Free<span class="text-orange-600">Geny</span></span>
                </a>

                <div class="mb-6 sm:mb-8 text-center">
                    <h1 class="text-2xl sm:text-3xl font-black text-slate-950 font-title tracking-tight mb-0.5 sm:mb-1">Nouveau mot de passe</h1>
                    <p class="text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">Étape finale de sécurité</p>
                </div>

                <?php if ($error): ?>
                    <div class="mb-5 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs sm:text-sm animate-pulse">
                        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2"></path></svg>
                        <p><strong>Erreur :</strong> <?php echo htmlspecialchars($error); ?></p>
                    </div>
                <?php endif; ?>

                <form action="/api/auth/reset-password.php" method="POST" class="space-y-4">
                    <?php CSRF::insertInput(); ?>
                    <input type="hidden" name="token" value="<?php echo htmlspecialchars($token); ?>">
                    
                    <div>
                        <label for="password" class="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1 px-1">Nouveau mot de passe</label>
                        <input type="password" name="password" id="password" required minlength="8"
                            class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl outline-none transition-all font-semibold text-slate-950"
                            placeholder="••••••••">
                    </div>

                    <!-- Visualiseur de force (Ultra Pro) -->
                    <div class="px-1 py-1">
                        <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                            <div id="strength-bar" class="strength-bar"></div>
                        </div>
                        <div class="grid grid-cols-2 gap-y-2 gap-x-1 text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                            <div id="req-length" class="req-item flex items-center gap-1.5">
                                <span class="w-3.5 h-3.5 flex items-center justify-center rounded bg-slate-200 text-slate-400 transition-colors">✓</span> 8 Caractères
                            </div>
                            <div id="req-upper" class="req-item flex items-center gap-1.5">
                                <span class="w-3.5 h-3.5 flex items-center justify-center rounded bg-slate-200 text-slate-400 transition-colors">✓</span> 1 Majuscule
                            </div>
                            <div id="req-number" class="req-item flex items-center gap-1.5">
                                <span class="w-3.5 h-3.5 flex items-center justify-center rounded bg-slate-200 text-slate-400 transition-colors">✓</span> 1 Chiffre
                            </div>
                            <div id="req-special" class="req-item flex items-center gap-1.5">
                                <span class="w-3.5 h-3.5 flex items-center justify-center rounded bg-slate-200 text-slate-400 transition-colors">✓</span> 1 Spécial (@,#,$,!)
                            </div>
                        </div>
                    </div>

                    <div>
                        <label for="confirm_password" class="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1 px-1">Confirmer mot de passe</label>
                        <input type="password" name="confirm_password" id="confirm_password" required minlength="8"
                            class="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 focus:bg-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl outline-none transition-all font-semibold text-slate-950"
                            placeholder="••••••••">
                        <p id="confirm-msg" class="text-[10px] font-bold mt-1 px-1 opacity-0 transition-opacity text-green-600">✓ Les mots de passe correspondent</p>
                    </div>

                    <div class="pt-2">
                        <button type="submit" id="submit-btn" disabled class="w-full bg-slate-400 cursor-not-allowed text-white py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-[11px] hover:bg-orange-600 hover:shadow-xl transition-all duration-300">
                            Sauvegarder et Accéder
                        </button>
                    </div>
                </form>
                
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            // Lottie
            if (typeof lottie !== 'undefined') {
                lottie.loadAnimation({
                    container: document.getElementById('lottie-box'),
                    renderer:  'svg',
                    loop:      true,
                    autoplay:  true,
                    path:      '/assets/animations/connexion.json' // Animation temporaire jusqu'à securite.json
                });
            }

            // Real-time password validation
            const pwInput = document.getElementById('password');
            const confirmInput = document.getElementById('confirm_password');
            const btn = document.getElementById('submit-btn');
            const confirmMsg = document.getElementById('confirm-msg');
            const bar = document.getElementById('strength-bar');

            const reqs = {
                length: { regex: /.{8,}/, el: document.getElementById('req-length') },
                upper: { regex: /[A-Z]/, el: document.getElementById('req-upper') },
                number: { regex: /[0-9]/, el: document.getElementById('req-number') },
                special: { regex: /[^A-Za-z0-9]/, el: document.getElementById('req-special') }
            };

            function checkStrength() {
                const val = pwInput.value;
                let validCount = 0;

                for (let key in reqs) {
                    if (reqs[key].regex.test(val)) {
                        reqs[key].el.classList.add('req-met');
                        validCount++;
                    } else {
                        reqs[key].el.classList.remove('req-met');
                    }
                }

                // Update Bar
                const p = (validCount / 4) * 100;
                bar.style.width = p + '%';
                
                if (p <= 25) bar.style.backgroundColor = '#ef4444'; // Red
                else if (p <= 50) bar.style.backgroundColor = '#f97316'; // Orange
                else if (p <= 75) bar.style.backgroundColor = '#eab308'; // Yellow
                else bar.style.backgroundColor = '#22c55e'; // Green

                checkMatch(validCount === 4);
            }

            function checkMatch(isStrong) {
                const isMatch = pwInput.value === confirmInput.value && pwInput.value !== '';
                
                if (isMatch) {
                    confirmMsg.classList.remove('opacity-0');
                    confirmMsg.classList.remove('text-red-500');
                    confirmMsg.classList.add('text-green-600');
                    confirmMsg.textContent = '✓ Les mots de passe correspondent';
                } else if (confirmInput.value !== '') {
                    confirmMsg.classList.remove('opacity-0');
                    confirmMsg.classList.remove('text-green-600');
                    confirmMsg.classList.add('text-red-500');
                    confirmMsg.textContent = '✗ Les mots de passe sont différents';
                } else {
                    confirmMsg.classList.add('opacity-0');
                }

                if (isStrong && isMatch) {
                    btn.removeAttribute('disabled');
                    btn.classList.remove('bg-slate-400', 'cursor-not-allowed');
                    btn.classList.add('bg-slate-950');
                } else {
                    btn.setAttribute('disabled', 'true');
                    btn.classList.add('bg-slate-400', 'cursor-not-allowed');
                    btn.classList.remove('bg-slate-950');
                }
            }

            pwInput.addEventListener('input', checkStrength);
            confirmInput.addEventListener('input', () => checkStrength());
        });
    </script>
</body>
</html>
