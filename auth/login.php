<?php
include_once __DIR__ . '/../includes/header.php';
?>
<main class="min-h-screen relative flex items-center justify-center py-20 px-6 overflow-hidden bg-[#fafafa]"
      x-data="{ role: 'parent' }">
    
    <!-- Background Accents (Home Style) -->
    <div class="absolute top-0 -left-10 w-80 h-80 bg-orange-500/10 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-0 -right-10 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full"></div>

    <div class="w-full max-w-lg relative">
        <div class="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative z-10">
            
            <!-- Selector (Stylisé Home) -->
            <div class="flex p-1.5 bg-slate-50 rounded-3xl mb-12">
                <button @click="role = 'parent'" :class="role === 'parent' ? 'bg-white shadow-md text-orange-600' : 'text-slate-400 hover:text-slate-600'" 
                        class="flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300">
                    Parent
                </button>
                <button @click="role = 'school'" :class="role === 'school' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400 hover:text-slate-600'" 
                        class="flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300">
                    École
                </button>
                <button @click="role = 'ngo'" :class="role === 'ngo' ? 'bg-white shadow-md text-teal-600' : 'text-slate-400 hover:text-slate-600'" 
                        class="flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300">
                    ONG
                </button>
            </div>

            <div class="text-center mb-10">
                <h1 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4 italic" x-text="role === 'parent' ? 'Bienvenue chez vous' : 'Espace professionnel'"></h1>
                <p class="text-slate-400 font-medium leading-relaxed italic">Accédez à vos descriptifs de cursus, vos cours détaillés et vos exercices spécifiques.</p>
            </div>

            <!-- Login Google -->
            <div class="mb-10">
                <a href="/api/auth/social.php?provider=Google" class="flex items-center justify-center space-x-4 w-full py-4.5 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 hover:shadow-xl transition-all duration-500 group">
                    <svg class="w-6 h-6 group-hover:scale-110 transition duration-500" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2.1 1.5-4.6 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2c4-3.7 7-8.9 7-18.9 0-1.3-.1-2.7-.4-3.9z"/></svg>
                    <span class="text-[10px] font-black text-slate-700 uppercase tracking-widest italic">Continuer avec Google</span>
                </a>
            </div>

            <div class="relative flex items-center mb-10">
                <div class="flex-grow border-t border-slate-100"></div>
                <span class="flex-shrink mx-6 text-[9px] font-black text-slate-300 uppercase tracking-widest italic tracking-[0.2em]">Identification e-mail</span>
                <div class="flex-grow border-t border-slate-100"></div>
            </div>

            <form x-data="{
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
                        else { this.error = data.error || 'Identifiants incorects.'; }
                    } catch (e) { this.error = 'Erreur serveur.'; }
                    finally { this.loading = false; }
                }
            }" @submit.prevent="submit" class="space-y-6">
                
                <div x-show="error" x-transition class="p-5 bg-red-50 text-red-600 rounded-3xl text-[10px] font-bold border border-red-100 italic" x-text="error"></div>

                <div class="space-y-5">
                    <div>
                        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-6 italic">Adresse e-mail</label>
                        <input type="email" x-model="email" required placeholder="nom@exemple.com"
                               class="w-full px-8 py-4.5 bg-slate-50 border-none rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-black text-sm text-slate-700 shadow-inner">
                    </div>

                    <div>
                        <div class="flex items-center justify-between mb-2 ml-6 pr-4">
                            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Mot de passe</label>
                            <a href="#" class="text-[9px] font-black text-orange-600 uppercase tracking-widest hover:text-orange-700 italic">Oublié ?</a>
                        </div>
                        <input type="password" x-model="password" required placeholder="••••••••"
                               class="w-full px-8 py-4.5 bg-slate-50 border-none rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-black text-sm text-slate-700 shadow-inner">
                    </div>
                </div>

                <div class="pt-6">
                    <button type="submit" :disabled="loading" 
                            class="w-full bg-slate-900 text-white py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.25em] shadow-xl shadow-slate-200 hover:bg-orange-600 hover:shadow-orange-200 hover:-translate-y-1 transition-all active:scale-95 duration-500 disabled:opacity-50 italic">
                        <span x-show="!loading" x-text="role === 'parent' ? 'Ouvrir mon dashboard' : 'Accéder à l\'espace Pro'"></span>
                        <span x-show="loading" x-cloak>Synchronisation...</span>
                    </button>
                </div>
            </form>

            <div class="mt-12 text-center pt-8 border-t border-slate-50">
                <p class="text-slate-400 text-sm font-medium italic">
                    Pas encore de compte ? 
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="text-slate-900 font-black hover:text-orange-600 underline underline-offset-8 transition-all duration-300 ml-1">
                        S'inscrire ici
                    </a>
                </p>
            </div>

        </div>
    </div>
</main>
<?php include_once __DIR__ . '/../includes/footer.php'; ?>
