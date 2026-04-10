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
            <h1 class="text-4xl font-black text-slate-900 mb-3 tracking-tight"><?php echo __('join_us'); ?></h1>
            <p class="text-slate-400 font-medium italic"><?php echo __('register_subtitle'); ?></p>
        </div>

        <!-- SOCIAL LOGIN : GOOGLE / FB / MS -->
        <div class="grid grid-cols-3 gap-4 mb-10">
            <a href="/api/auth/social.php?provider=Google" class="flex items-center justify-center p-4 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50 hover:shadow-lg transition-all duration-300 group">
                <svg class="w-6 h-6 transform group-hover:scale-110 transition" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
            </a>
            <a href="/api/auth/social.php?provider=Facebook" class="flex items-center justify-center p-4 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50 hover:shadow-lg transition-all duration-300 group">
                <svg class="w-6 h-6 transform group-hover:scale-110 transition" viewBox="0 0 48 48"><path fill="#039be5" d="M24 5a19 19 0 1 0 0 38 19 19 0 1 0 0-38z"/><path fill="#fff" d="M26.572 29.036h4.917l.772-4.995h-5.69v-2.73c0-2.075.678-3.915 2.619-3.915h3.119v-4.359c-.548-.074-1.707-.236-3.897-.236-4.573 0-7.254 2.415-7.254 7.917v3.323h-4.701v4.995h4.701v13.729c1.642.146 2.585.241 3.553.241.875 0 1.729-.08 2.572-.194v-13.73z"/></svg>
            </a>
            <a href="/api/auth/social.php?provider=Microsoft" class="flex items-center justify-center p-4 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50 hover:shadow-lg transition-all duration-300 group">
                <svg class="w-6 h-6 transform group-hover:scale-110 transition" viewBox="0 0 48 48"><path fill="#f35325" d="M22 6H6v16h16V6z"/><path fill="#81bc06" d="M42 6H26v16h16V6z"/><path fill="#05a6f0" d="M22 26H6v16h16V26z"/><path fill="#ffba08" d="M42 26H26v16h16V26z"/></svg>
            </a>
        </div>

        <!-- DIVIDER -->
        <div class="relative flex items-center mb-10">
            <div class="flex-grow border-t border-slate-100"></div>
            <span class="flex-shrink mx-4 text-xs font-black text-slate-300 uppercase tracking-[0.2em]"><?php echo __('or_register_by_email'); ?></span>
            <div class="flex-grow border-t border-slate-100"></div>
        </div>

        <!-- FORMULAIRE CLASSIQUE (AJAX/JSON) -->
        <form @submit.prevent="submit" x-data="{
            full_name: '',
            email: '',
            password: '',
            confirm: '',
            country: '<?php echo $country; ?>',
            loading: false,
            error: '',
            async submit() {
                if (this.password !== this.confirm) {
                    this.error = 'Les mots de passe ne correspondent pas.';
                    return;
                }
                this.loading = true;
                this.error = '';
                try {
                    const res = await fetch('/api/auth/register.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        body: JSON.stringify({ 
                            full_name: this.full_name, 
                            email: this.email, 
                            password: this.password, 
                            confirm: this.confirm,
                            country: this.country 
                        })
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                        window.location.href = data.redirect || '/dashboard';
                    } else {
                        this.error = data.error || 'Erreur lors de l\'inscription.';
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
                <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4"><?php echo __('fullname_label'); ?></label>
                <input type="text" x-model="full_name" required placeholder="Ex: Jean Dupont"
                       class="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-bold placeholder:text-slate-300">
            </div>

            <div class="relative group">
                <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4"><?php echo __('email_label'); ?></label>
                <input type="email" x-model="email" required placeholder="nom@exemple.com"
                       class="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-bold placeholder:text-slate-300">
            </div>
            
            <div class="relative group">
                <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4"><?php echo __('password_label'); ?></label>
                <input type="password" x-model="password" required placeholder="••••••••"
                       class="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-bold placeholder:text-slate-300">
            </div>

            <div class="relative group">
                <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4"><?php echo __('confirm_password_label'); ?></label>
                <input type="password" x-model="confirm" required placeholder="••••••••"
                       class="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-bold placeholder:text-slate-300">
            </div>

            <div class="pt-4">
                <button type="submit" :disabled="loading" class="relative w-full bg-orange-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-orange-200 hover:bg-orange-700 hover:shadow-orange-300 hover:-translate-y-1 transition transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span x-show="!loading"><?php echo __('register_button'); ?></span>
                    <span x-show="loading" x-cloak><?php echo __('register_loading'); ?></span>
                </button>
            </div>
        </form>

        <!-- FOOTER : SE CONNECTER -->
        <div class="mt-12 text-center pt-8 border-t border-slate-50">
            <p class="text-slate-400 text-sm font-medium"><?php echo __('already_member'); ?> 
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="text-orange-600 font-black hover:text-orange-700 underline underline-offset-8 transition ml-2"><?php echo __('login_link'); ?></a>
            </p>
        </div>
    </div>
</main>
<?php include_once __DIR__ . '/../includes/footer.php'; ?>
