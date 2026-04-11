<?php
include_once __DIR__ . '/../includes/header.php';
?>
<main class="min-h-screen relative flex items-center justify-center py-12 px-6 overflow-hidden bg-[#fafafa]"
      x-data="{ role: 'parent' }">
    
    <!-- Background Animated Gradients -->
    <div class="absolute top-0 -left-4 w-64 h-64 bg-orange-400 opacity-20 blur-[100px] rounded-full animate-pulse"></div>
    <div class="absolute bottom-0 -right-4 w-64 h-64 bg-blue-400 opacity-10 blur-[100px] rounded-full animate-pulse" style="animation-delay: 2s"></div>

    <div class="w-full max-w-lg relative">
        <div class="bg-white/80 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-white relative z-10">
            
            <!-- Type Selector -->
            <div class="flex p-1.5 bg-slate-100 rounded-3xl mb-10 overflow-hidden shadow-inner">
                <button @click="role = 'parent'" :class="role === 'parent' ? 'bg-white shadow-md text-orange-600' : 'text-slate-400 hover:text-slate-600'" 
                        class="flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 italic">
                    Parent
                </button>
                <button @click="role = 'school'" :class="role === 'school' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400 hover:text-slate-600'" 
                        class="flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 italic">
                    École
                </button>
                <button @click="role = 'ngo'" :class="role === 'ngo' ? 'bg-white shadow-md text-teal-600' : 'text-slate-400 hover:text-slate-600'" 
                        class="flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 italic">
                    ONG
                </button>
            </div>

            <!-- Title -->
            <div class="text-center mb-10">
                <h1 class="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-3 italic" x-text="role === 'parent' ? 'Bon retour !' : (role === 'school' ? 'Espace Scolaire' : 'Espace Partenaire')"></h1>
                <p class="text-slate-400 text-[11px] font-bold italic">Accédez à votre espace FreeGeny Elite</p>
            </div>

            <!-- Google Login -->
            <div class="mb-10">
                <a href="/api/auth/social.php?provider=Google" class="flex items-center justify-center space-x-4 w-full py-4.5 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50 hover:shadow-xl transition-all duration-500 group shadow-sm">
                    <svg class="w-6 h-6 group-hover:scale-110 transition duration-500" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2.1 1.5-4.6 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2c4-3.7 7-8.9 7-18.9 0-1.3-.1-2.7-.4-3.9z"/></svg>
                    <span class="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] italic">Connexion via Gmail</span>
                </a>
            </div>

            <!-- Separator -->
            <div class="relative flex items-center mb-10">
                <div class="flex-grow border-t border-slate-100"></div>
                <span class="flex-shrink mx-6 text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Authentification Mail</span>
                <div class="flex-grow border-t border-slate-100"></div>
            </div>

            <form @submit.prevent="submit" x-data="{
                email: '',
                password: '',
                loading: false,
                error: '',
                async submit() {
                    this.loading = true; this.error = '';
                    try {
                        const res = await fetch('/api/auth/login.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                            body: JSON.stringify({ email: this.email, password: this.password, role: this.$data.role })
                        });
                        const data = await res.json();
                        if (res.ok && data.success) { window.location.href = data.redirect || '/'; }
                        else { this.error = data.error || 'Identifiants incorrects.'; }
                    } catch (e) { this.error = 'Erreur serveur.'; }
                    finally { this.loading = false; }
                }
            }" class="space-y-6">
                
                <div x-show="error" x-transition class="p-5 bg-red-50 text-red-600 rounded-[2rem] text-[10px] font-bold border border-red-100 italic" x-text="error"></div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-6 italic">Adresse E-mail</label>
                        <input type="email" x-model="email" required placeholder="nom@exemple.com"
                               class="w-full px-8 py-4.5 bg-slate-50 border-none rounded-[2.5rem] focus:bg-white focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-black text-sm text-slate-700 shadow-inner">
                    </div>

                    <div>
                        <div class="flex items-center justify-between mb-2 ml-6 pr-4">
                            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Mot de passe</label>
                            <a href="#" class="text-[9px] font-black text-orange-600 uppercase tracking-widest hover:text-orange-700 italic">Oublié ?</a>
                        </div>
                        <input type="password" x-model="password" required placeholder="••••••••"
                               class="w-full px-8 py-4.5 bg-slate-50 border-none rounded-[2.5rem] focus:bg-white focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-black text-sm text-slate-700 shadow-inner">
                    </div>
                </div>

                <div class="pt-6">
                    <button type="submit" :disabled="loading" 
                            :class="role === 'parent' ? 'bg-orange-600 shadow-orange-100 uppercase' : (role === 'school' ? 'bg-blue-600 shadow-blue-100' : 'bg-teal-600 shadow-teal-100')"
                            class="w-full text-white py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.25em] shadow-2xl transition-all active:scale-95 duration-500 disabled:opacity-50 italic">
                        <span x-show="!loading" x-text="role === 'parent' ? 'Ouvrir mon tableau de bord' : 'Accéder à l\'espace Pro'"></span>
                        <span x-show="loading" x-cloak>Vérification...</span>
                    </button>
                </div>
            </form>

            <!-- Footer -->
            <div class="mt-12 text-center pt-10 border-t border-slate-50">
                <p class="text-slate-400 text-[13px] font-medium italic">
                    Pas encore de compte ? 
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="text-orange-600 font-black hover:text-orange-700 underline underline-offset-8 transition-all duration-300 ml-1">
                        Créer un accès gratuit
                    </a>
                </p>
            </div>

        </div>
    </div>
</main>
<?php include_once __DIR__ . '/../includes/footer.php'; ?>
