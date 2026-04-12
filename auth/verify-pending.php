<?php
include_once __DIR__ . '/../includes/header.php';
?>
<main class="min-h-screen relative flex items-center justify-center py-10 px-6 overflow-hidden bg-[#fafafa]">
    <!-- Background Animated Gradients -->
    <div class="absolute top-0 -left-4 w-64 h-64 bg-orange-400 opacity-20 blur-[100px] rounded-full animate-pulse"></div>
    <div class="absolute bottom-0 -right-4 w-64 h-64 bg-blue-400 opacity-10 blur-[100px] rounded-full animate-pulse" style="animation-delay: 2s"></div>

    <div class="w-full max-w-lg relative">
        <div class="bg-white/70 backdrop-blur-3xl p-10 md:p-14 rounded-[3rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)] border border-white/50 relative z-10 box-border text-center">
            
            <!-- Illustration Animée (SVG) -->
            <div class="mb-10 transform hover:scale-110 transition-transform duration-500">
                <svg class="h-32 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="80" fill="#F0F9FF"/>
                    <path d="M50 80C50 74.4772 54.4772 70 60 70H140C145.523 70 150 74.4772 150 80V130C150 135.523 145.523 140 140 140H60C54.4772 140 50 135.523 50 130V80Z" fill="#0EA5E9"/>
                    <path d="M50 80L100 110L150 80" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="150" cy="70" r="20" fill="#EA580C" class="animate-bounce"/>
                    <path d="M145 70L155 70M150 65L150 75" stroke="white" stroke-width="3" stroke-linecap="round"/>
                </svg>
            </div>

            <h1 class="text-3xl font-black text-slate-900 tracking-tight mb-6">Vérifiez votre boîte mail ! 📧</h1>
            
            <p class="text-slate-500 font-medium leading-relaxed mb-10">
                Un lien de confirmation vient d'être envoyé à votre adresse. Cliquez dessus pour activer votre compte FreeGeny et commencer l'aventure.
            </p>

            <div class="space-y-4">
                <a href="https://mail.google.com" target="_blank" class="block w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all active:scale-95">
                    Ouvrir Gmail
                </a>
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="block w-full text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-orange-600 transition">
                    Retour à la connexion
                </a>
            </div>

            <div class="mt-10 pt-8 border-t border-slate-50">
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Pas reçu ? Regardez dans vos indésirables (Spams).
                </p>
            </div>

        </div>
    </div>
</main>
<script>
    setInterval(() => {
        fetch('/api/auth/check_status.php')
            .then(r => r.json())
            .then(data => {
                if (data.verified) {
                    window.location.href = '/<?php echo $country; ?>-<?php echo $lang; ?>/?welcome=1';
                }
            })
            .catch(e => console.error(e));
    }, 2000); // Polling toutes les 2 secondes
</script>
<?php include_once __DIR__ . '/../includes/header.php'; ?>
