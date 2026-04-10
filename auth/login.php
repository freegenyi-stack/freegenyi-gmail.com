<?php
include_once __DIR__ . '/../includes/header.php';
?>
<main class="py-20 bg-slate-50 min-h-screen flex items-center justify-center relative overflow-hidden">
    <!-- Décorations de fond -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-orange-100/50 blur-[120px] rounded-full -mr-20 -mt-20"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/30 blur-[120px] rounded-full -ml-20 -mb-20"></div>

    <div class="max-w-xl w-full bg-white/80 backdrop-blur-xl p-12 rounded-[4rem] shadow-2xl shadow-slate-200 border border-white mx-4 relative z-10">
        
        <!-- HEADER : LOGO & TITRE -->
        <div class="text-center mb-12">
            <a href="/"><img src="<?php echo APP_URL; ?>/assets/img/logo.png?v=4.0" class="h-14 mx-auto mb-8 transform hover:scale-110 transition duration-500" alt="Logo"></a>
            <h1 class="text-4xl font-black text-slate-900 mb-3 tracking-tight">Ravi de vous revoir !</h1>
            <p class="text-slate-400 font-medium italic">Accédez à votre espace <?php echo strtoupper($country); ?> pour continuer.</p>
        </div>

        <!-- SOCIAL LOGIN : GOOGLE / FB / MS -->
        <div class="grid grid-cols-3 gap-4 mb-10">
            <a href="/api/auth/social.php?provider=Google" class="flex items-center justify-center p-4 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50 hover:shadow-lg transition-all duration-300 group">
                <img src="https://www.svgrepo.com/show/355037/google-icon.svg" class="w-6 h-6 transform group-hover:scale-110 transition">
            </a>
            <a href="/api/auth/social.php?provider=Facebook" class="flex items-center justify-center p-4 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50 hover:shadow-lg transition-all duration-300 group">
                <img src="https://www.svgrepo.com/show/303114/facebook-3.svg" class="w-6 h-6 transform group-hover:scale-110 transition">
            </a>
            <a href="/api/auth/social.php?provider=Microsoft" class="flex items-center justify-center p-4 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50 hover:shadow-lg transition-all duration-300 group">
                <img src="https://www.svgrepo.com/show/354067/microsoft-icon.svg" class="w-6 h-6 transform group-hover:scale-110 transition">
            </a>
        </div>

        <!-- DIVIDER -->
        <div class="relative flex items-center mb-10">
            <div class="flex-grow border-t border-slate-100"></div>
            <span class="flex-shrink mx-4 text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Ou par email</span>
            <div class="flex-grow border-t border-slate-100"></div>
        </div>

        <!-- FORMULAIRE CLASSIQUE (AJAX/JSON) -->
        <form @submit.prevent="submit" x-data="{
            email: '',
            password: '',
            loading: false,
            error: '',
            async submit() {
                this.loading = true;
                this.error = '';
                try {
                    const res = await fetch('/api/auth/login.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        body: JSON.stringify({ email: this.email, password: this.password })
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                        window.location.href = data.redirect || '/dashboard';
                    } else {
                        this.error = data.error || 'Erreur de connexion.';
                    }
                } catch (e) {
                    this.error = 'Erreur de communication avec le serveur.';
                } finally {
                    this.loading = false;
                }
            }
        }" class="space-y-6">
            
            <template x-if="error">
                <div class="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold text-center" x-text="error"></div>
            </template>

            <div class="relative group">
                <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">Email professionnel ou personnel</label>
                <input type="email" x-model="email" required placeholder="nom@exemple.com"
                       class="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-bold placeholder:text-slate-300">
            </div>
            
            <div class="relative group">
                <div class="flex justify-between items-center mb-2 px-4">
                    <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400">Mot de passe</label>
                    <a href="/auth/forgot" class="text-[10px] font-black text-orange-600 hover:underline uppercase tracking-widest font-bold">Oublié ?</a>
                </div>
                <input type="password" x-model="password" required placeholder="••••••••"
                       class="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-bold placeholder:text-slate-300">
            </div>

            <div class="pt-4">
                <button type="submit" :disabled="loading" class="relative w-full bg-orange-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-orange-200 hover:bg-orange-700 hover:shadow-orange-300 hover:-translate-y-1 transition transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span x-show="!loading">Se Connecter maintenant</span>
                    <span x-show="loading" x-cloak>Connexion en cours...</span>
                </button>
            </div>
        </form>

        <!-- FOOTER : S'INSCRIRE -->
        <div class="mt-12 text-center pt-8 border-t border-slate-50">
            <p class="text-slate-400 text-sm font-medium">Nouveau sur FreeGeny ? 
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="text-orange-600 font-black hover:text-orange-700 underline underline-offset-8 transition ml-2">Créer un compte gratuit</a>
            </p>
        </div>
    </div>
</main>
<?php include_once __DIR__ . '/../includes/footer.php'; ?>
