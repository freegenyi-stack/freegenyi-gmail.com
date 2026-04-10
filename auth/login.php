<?php
include_once __DIR__ . '/../includes/header.php';
?>
<main class="min-h-screen relative flex items-center justify-center py-10 px-6 overflow-hidden bg-[#fafafa]">
    <!-- Background Animated Gradients -->
    <div class="absolute top-0 -left-4 w-64 h-64 bg-orange-400 opacity-20 blur-[100px] rounded-full animate-pulse"></div>
    <div class="absolute bottom-0 -right-4 w-64 h-64 bg-blue-400 opacity-10 blur-[100px] rounded-full animate-pulse" style="animation-delay: 2s"></div>

    <div class="w-full max-w-lg relative">
        <div class="bg-white/70 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)] border border-white/50 relative z-10 box-border">
            
            <!-- Logo area -->
            <div class="text-center mb-6">
                <div class="mb-6 transform hover:rotate-3 transition-transform duration-500">
                    <svg class="h-24 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="100" cy="100" r="80" fill="#F0FDFA"/>
                        <circle cx="100" cy="100" r="60" fill="#CCFBF1"/>
                        <path d="M80 70C80 64.4772 84.4772 60 90 60H110C115.523 60 120 64.4772 120 70V130C120 135.523 115.523 140 110 140H90C84.4772 140 80 135.523 80 130V70Z" fill="#0D9488"/>
                        <rect x="70" y="85" width="60" height="15" rx="7.5" fill="#14B8A6"/>
                        <rect x="70" y="110" width="60" height="15" rx="7.5" fill="#5EEAD4"/>
                    </svg>
                </div>
                <h1 class="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2"><?php echo __('welcome_back'); ?></h1>
                <p class="text-slate-500 text-xs font-bold"><?php echo __('login_subtitle'); ?></p>
            </div>

            <!-- Google Integration -->
            <div class="mb-6">
                <a href="/api/auth/social.php?provider=Google" class="flex items-center justify-center space-x-4 w-full py-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300 hover:shadow-xl transition-all duration-500 group shadow-sm">
                    <svg class="w-6 h-6 group-hover:scale-110 transition duration-500" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                    </svg>
                    <span class="text-xs font-black text-slate-700 uppercase tracking-[0.2em] italic">Continuer avec Google</span>
                </a>
            </div>

            <!-- Separator -->
            <div class="relative flex items-center mb-6">
                <div class="flex-grow border-t border-slate-200"></div>
                <span class="flex-shrink mx-6 text-[10px] font-black text-slate-400 uppercase tracking-widest"><?php echo __('or_by_email'); ?></span>
                <div class="flex-grow border-t border-slate-200"></div>
            </div>

            <!-- Inputs Area -->
            <form action="/api/auth/login.php" method="POST" class="space-y-4">
                <div class="group">
                    <label class="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 ml-4"><?php echo __('email_label'); ?></label>
                    <input type="email" name="email" required placeholder="nom@exemple.com"
                           class="w-full px-7 py-3 bg-white border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-bold text-sm text-slate-700 placeholder:text-slate-300 shadow-sm">
                </div>

                <div class="group relative">
                    <div class="flex items-center justify-between mb-2 ml-4">
                        <label class="block text-[10px] font-black text-slate-600 uppercase tracking-widest"><?php echo __('password_label'); ?></label>
                        <a href="#" class="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:text-orange-700"><?php echo __('forgot_password'); ?></a>
                    </div>
                    <input type="password" name="password" required placeholder="••••••••"
                           class="w-full px-7 py-3 bg-white border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-bold text-sm text-slate-700 placeholder:text-slate-300 shadow-sm">
                </div>

                <div class="pt-4">
                    <button type="submit" class="w-full bg-orange-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-xl shadow-orange-100 hover:bg-orange-700 hover:shadow-orange-200 hover:-translate-y-1 transition-all active:scale-95 duration-300">
                        <?php echo __('login_button'); ?>
                    </button>
                </div>
            </form>

            <!-- Footer area -->
            <div class="mt-6 text-center pt-6 border-t border-slate-50">
                <p class="text-slate-400 text-sm font-medium">
                    <?php echo __('new_user'); ?>
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/register" class="text-orange-600 font-black hover:text-orange-700 underline underline-offset-8 transition-all duration-300 ml-1">
                        <?php echo __('create_account_free'); ?>
                    </a>
                </p>
            </div>

        </div>
    </div>
</main>
<?php include_once __DIR__ . '/../includes/footer.php'; ?>
