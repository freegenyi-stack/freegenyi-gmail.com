<?php
include_once __DIR__ . '/../includes/header.php';
?>
<main class="min-h-screen relative flex items-center justify-center py-20 px-6 overflow-hidden bg-[#fafafa]"
      x-data="{ role: 'parent' }">
    
    <div class="w-full max-w-lg relative">
        <div class="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-slate-200/40 border border-slate-100 relative z-10">
            
            <!-- Type Selector (Modern & Colorful) -->
            <div class="flex p-1.5 bg-slate-100/50 rounded-[2rem] mb-12 border border-slate-100/50">
                <button @click="role = 'parent'" :class="role === 'parent' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'" 
                        class="flex-1 py-4 text-xs font-medium rounded-[1.5rem] transition-all duration-300 flex flex-col items-center gap-2">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="4" fill="url(#gradParent2)"/>
                        <path d="M20 21C20 18.2386 15.5228 16 10 16C4.47715 16 0 18.2386 0 21" stroke="url(#gradParent2)" stroke-width="2" stroke-linecap="round"/>
                        <defs><linearGradient id="gradParent2" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stop-color="#ff9a9e"/><stop offset="100%" stop-color="#fad0c4"/></linearGradient></defs>
                    </svg>
                    <span>parent</span>
                </button>
                <button @click="role = 'school'" :class="role === 'school' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'" 
                        class="flex-1 py-4 text-xs font-medium rounded-[1.5rem] transition-all duration-300 flex flex-col items-center gap-2">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 21V11L12 5L21 11V21H14V14H10V21H3Z" fill="url(#gradSchool2)"/>
                        <defs><linearGradient id="gradSchool2" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stop-color="#a1c4fd"/><stop offset="100%" stop-color="#c2e9fb"/></linearGradient></defs>
                    </svg>
                    <span>école</span>
                </button>
                <button @click="role = 'ngo'" :class="role === 'ngo' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'" 
                        class="flex-1 py-4 text-xs font-medium rounded-[1.5rem] transition-all duration-300 flex flex-col items-center gap-2">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" fill="url(#gradNGO2)"/>
                        <defs><linearGradient id="gradNGO2" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stop-color="#84fab0"/><stop offset="100%" stop-color="#8fd3f4"/></linearGradient></defs>
                    </svg>
                    <span>ong</span>
                </button>
            </div>

            <div class="text-left mb-10">
                <h1 class="text-3xl font-medium text-slate-900 tracking-tight mb-3">bon retour</h1>
                <p class="text-slate-400 text-sm leading-relaxed" x-text="role === 'parent' ? 'connectez-vous à votre espace parent.' : 'accès réservé aux espaces professionnels.'"></p>
            </div>

            <!-- Google Login -->
            <div class="mb-10">
                <a href="/api/auth/social.php?provider=Google" class="flex items-center justify-center space-x-3 w-full py-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all duration-300 shadow-sm">
                    <svg class="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2.1 1.5-4.6 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2c4-3.7 7-8.9 7-18.9 0-1.3-.1-2.7-.4-3.9z"/></svg>
                    <span class="text-xs text-slate-600">continuer avec google</span>
                </a>
            </div>

            <!-- Separator -->
            <div class="relative flex items-center mb-10">
                <div class="flex-grow border-t border-slate-100"></div>
                <span class="flex-shrink mx-6 text-xs text-slate-300">accès e-mail</span>
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
                        else { this.error = data.error || 'identifiants incorrects.'; }
                    } catch (e) { this.error = 'erreur serveur.'; }
                    finally { this.loading = false; }
                }
            }" @submit.prevent="submit" class="space-y-6">
                
                <div x-show="error" x-transition class="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-medium border border-red-100" x-text="error"></div>

                <div class="space-y-6">
                    <div>
                        <label class="block text-xs text-slate-400 mb-2 ml-4">e-mail</label>
                        <input type="email" x-model="email" required placeholder="nom@exemple.com"
                               class="w-full px-7 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none transition-all text-sm text-slate-800">
                    </div>

                    <div>
                        <div class="flex items-center justify-between mb-2 ml-4 pr-2">
                            <label class="block text-xs text-slate-400">mot de passe</label>
                            <a href="#" class="text-[10px] text-slate-400 hover:text-slate-900 transition-colors">oublié ?</a>
                        </div>
                        <input type="password" x-model="password" required placeholder="••••••••"
                               class="w-full px-7 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none transition-all text-sm text-slate-800">
                    </div>
                </div>

                <div class="pt-6">
                    <button type="submit" :disabled="loading" 
                            class="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] text-sm font-medium shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50">
                        <span x-show="!loading">se connecter</span>
                        <span x-show="loading" x-cloak>vérification...</span>
                    </button>
                </div>
            </form>

            <div class="mt-12 text-center pt-8 border-t border-slate-50">
                <p class="text-slate-400 text-sm">pas encore de compte ? <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="text-slate-900 font-medium hover:underline ml-1">s'inscrire</a></p>
            </div>

        </div>
    </div>
</main>
<?php include_once __DIR__ . '/../includes/footer.php'; ?>
