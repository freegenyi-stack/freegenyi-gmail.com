<?php
include_once __DIR__ . '/../includes/header.php';
?>
<main class="min-h-screen relative flex items-center justify-center py-20 px-6 overflow-hidden bg-[#fafafa]">
    <!-- Background Animated Gradients -->
    <div class="absolute top-0 -right-4 w-96 h-96 bg-blue-400 opacity-20 blur-[120px] rounded-full animate-pulse"></div>
    <div class="absolute bottom-0 -left-4 w-96 h-96 bg-orange-400 opacity-10 blur-[120px] rounded-full animate-pulse" style="animation-delay: 2s"></div>

    <div class="w-full max-w-xl relative">
        <div class="bg-white/70 backdrop-blur-3xl p-10 md:p-14 rounded-[3.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] border border-white/50 relative z-10 box-border">
            
            <!-- Logo area -->
            <div class="text-center mb-10">
                <div class="inline-flex p-4 rounded-3xl bg-orange-600/5 mb-8">
                    <a href="/"><img src="<?php echo APP_URL; ?>/assets/img/logo.png" class="h-10 w-auto object-contain" alt="FreeGeny"></a>
                </div>
                <h1 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none mb-4"><?php echo __('join_us'); ?></h1>
                <p class="text-slate-500 font-medium italic"><?php echo __('register_subtitle'); ?></p>
            </div>

            <!-- Google Integration -->
            <div class="mb-8">
                <a href="/api/auth/social.php?provider=Google" class="flex items-center justify-center space-x-4 w-full py-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-slate-200 hover:shadow-xl transition-all duration-500 group">
                    <svg class="w-6 h-6 group-hover:scale-110 transition duration-500" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                    </svg>
                    <span class="text-xs font-black text-slate-700 uppercase tracking-[0.2em] italic">Inscription via Google</span>
                </a>
            </div>

            <!-- Separator -->
            <div class="relative flex items-center mb-10">
                <div class="flex-grow border-t border-slate-100"></div>
                <span class="flex-shrink mx-6 text-[10px] font-black text-slate-300 uppercase tracking-widest italic"><?php echo __('or_register_by_email'); ?></span>
                <div class="flex-grow border-t border-slate-100"></div>
            </div>

            <!-- Form with AlpineJS -->
            <form @submit.prevent="submit" x-data="{
                full_name: '',
                phone: '',
                email: '',
                password: '',
                confirm: '',
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
                            headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                            body: JSON.stringify({ 
                                full_name: this.full_name, 
                                phone: this.phone, 
                                email: this.email, 
                                password: this.password, 
                                confirm: this.confirm,
                                country: '<?php echo $country; ?>' 
                            })
                        });
                        const data = await res.json();
                        if (res.ok && data.success) {
                            window.location.href = data.redirect || '/dashboard';
                        } else {
                            this.error = data.error || 'Erreur lors de l\'inscription.';
                        }
                    } catch (e) {
                        this.error = 'Erreur serveur.';
                    } finally {
                        this.loading = false;
                    }
                }
            }" class="grid grid-cols-1 md:grid-cols-2 gap-6">

                <!-- Error Message -->
                <div x-show="error" x-transition class="col-span-1 md:col-span-2 p-5 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 italic" x-text="error"></div>

                <div class="group">
                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-4"><?php echo __('fullname_label'); ?></label>
                    <input type="text" x-model="full_name" required placeholder="Ex: Jean Dupont"
                           class="w-full px-7 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300">
                </div>

                <div class="group">
                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-4"><?php echo __('phone_label'); ?></label>
                    <input type="tel" x-model="phone" required placeholder="<?php echo __('phone_placeholder'); ?>"
                           class="w-full px-7 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300">
                </div>

                <div class="group col-span-1 md:col-span-2">
                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-4"><?php echo __('email_label'); ?></label>
                    <input type="email" x-model="email" required placeholder="nom@exemple.com"
                           class="w-full px-7 py-5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300">
                </div>

                <div class="group">
                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-4"><?php echo __('password_label'); ?></label>
                    <input type="password" x-model="password" required placeholder="••••••••"
                           class="w-full px-7 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300">
                </div>

                <div class="group">
                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-4"><?php echo __('confirm_password_label'); ?></label>
                    <input type="password" x-model="confirm" required placeholder="••••••••"
                           class="w-full px-7 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300">
                </div>

                <div class="pt-4 col-span-1 md:col-span-2">
                    <button type="submit" :disabled="loading" class="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-xl shadow-slate-200 hover:bg-orange-600 hover:shadow-orange-200 hover:-translate-y-1 transition-all active:scale-95 duration-300 disabled:opacity-50">
                        <span x-show="!loading"><?php echo __('register_button'); ?></span>
                        <span x-show="loading" x-cloak><?php echo __('register_loading'); ?></span>
                    </button>
                </div>
            </form>

            <!-- Footer area -->
            <div class="mt-12 text-center pt-8 border-t border-slate-50">
                <p class="text-slate-400 text-sm font-medium">
                    <?php echo __('already_member'); ?>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="text-orange-600 font-black hover:text-orange-700 underline underline-offset-8 transition-all duration-300 ml-1">
                        <?php echo __('login_link'); ?>
                    </a>
                </p>
            </div>

        </div>
    </div>
</main>
<?php include_once __DIR__ . '/../includes/footer.php'; ?>
