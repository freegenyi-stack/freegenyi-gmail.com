<?php
include_once __DIR__ . '/../includes/header.php';
?>
<!-- Style spécifique Geist et Noir Profond pour cette page uniquement -->
<style>
    @import url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/style.css');
    .geist-login { font-family: 'Geist Sans', sans-serif; letter-spacing: -0.02em; }
    .text-black-deep { color: #000000 !important; }
    .border-subtle { border-color: rgba(0,0,0,0.08); }
</style>

<main class="min-h-screen flex items-center justify-center py-20 px-6 bg-white geist-login" x-data="{ role: 'parent' }">
    <div class="w-full max-w-lg">
        <div class="bg-white p-8 md:p-14 lg:border lg:border-slate-100 lg:rounded-3xl lg:shadow-[0_24px_64px_rgba(0,0,0,0.04)]">
            
            <!-- Type Selector Minimal -->
            <div class="flex p-1 bg-slate-50 rounded-xl mb-12 border border-slate-100">
                <button @click="role = 'parent'" :class="role === 'parent' ? 'bg-white shadow-sm text-black-deep font-semibold' : 'text-slate-400'" 
                        class="flex-1 py-3 text-sm rounded-lg transition-all duration-200">
                    parent
                </button>
                <button @click="role = 'school'" :class="role === 'school' ? 'bg-white shadow-sm text-black-deep font-semibold' : 'text-slate-400'" 
                        class="flex-1 py-3 text-sm rounded-lg transition-all duration-200">
                    école
                </button>
                <button @click="role = 'ngo'" :class="role === 'ngo' ? 'bg-white shadow-sm text-black-deep font-semibold' : 'text-slate-400'" 
                        class="flex-1 py-3 text-sm rounded-lg transition-all duration-200">
                    ong
                </button>
            </div>

            <div class="text-left mb-10">
                <h1 class="text-4xl font-bold text-black-deep tracking-tight mb-3">bon retour</h1>
                <p class="text-slate-500 text-base" x-text="role === 'parent' ? 'connectez-vous à votre espace parent.' : (role === 'school' ? 'accès réservé aux établissements.' : 'accès réservé aux organisations.')"></p>
            </div>

            <!-- Login Google -->
            <div class="mb-10">
                <a href="/api/auth/social.php?provider=Google" class="flex items-center justify-center space-x-3 w-full py-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                    <svg class="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2.1 1.5-4.6 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2c4-3.7 7-8.9 7-18.9 0-1.3-.1-2.7-.4-3.9z"/></svg>
                    <span class="text-sm font-medium text-slate-800">continuer avec google</span>
                </a>
            </div>

            <div class="relative flex items-center mb-10">
                <div class="flex-grow border-t border-slate-100"></div>
                <span class="flex-shrink mx-6 text-xs text-slate-300 font-medium">ou avec votre e-mail</span>
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
                
                <div x-show="error" x-transition class="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100" x-text="error"></div>

                <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-black-deep mb-2">e-mail</label>
                        <input type="email" x-model="email" required placeholder="nom@exemple.com"
                               class="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:border-black-deep outline-none transition-all text-sm text-black-deep">
                    </div>

                    <div>
                        <div class="flex items-center justify-between mb-2 pr-2">
                            <label class="block text-sm font-medium text-black-deep">mot de passe</label>
                            <a href="#" class="text-xs font-medium text-slate-400 hover:text-black-deep transition-colors">oublié ?</a>
                        </div>
                        <input type="password" x-model="password" required placeholder="••••••••"
                               class="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:border-black-deep outline-none transition-all text-sm text-black-deep">
                    </div>
                </div>

                <div class="pt-6">
                    <button type="submit" :disabled="loading" 
                            class="w-full bg-slate-950 text-white py-5 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] duration-200 disabled:opacity-50">
                        <span x-show="!loading">se connecter</span>
                        <span x-show="loading" x-cloak>vérification...</span>
                    </button>
                </div>
            </form>

            <div class="mt-12 text-center pt-8 border-t border-slate-100">
                <p class="text-slate-500 text-sm">
                    pas encore de compte ? 
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="text-black-deep font-bold hover:underline underline-offset-4 ml-1">
                        s'inscrire gratuitement
                    </a>
                </p>
            </div>

        </div>
    </div>
</main>
<?php include_once __DIR__ . '/../includes/footer.php'; ?>
