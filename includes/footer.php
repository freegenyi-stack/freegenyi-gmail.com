<?php
/**
 * footer.php - Version EdTech Pro Mondiale
 */
?>
    <footer class="bg-slate-50 border-t border-slate-100 pt-32 pb-16">
        <div class="max-w-7xl mx-auto px-12">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
                
                <!-- BRANDING & VISION -->
                <div class="lg:col-span-2">
                    <a href="/"><img src="<?php echo APP_URL; ?>/assets/img/logo.png" class="h-10 mb-8" alt="FreeGeny"></a>
                    <p class="text-slate-500 max-w-sm leading-relaxed mb-10 text-lg">
                        L'EdTech qui révolutionne la réussite scolaire prématurée à travers le monde. 100% gratuit, 100% universel.
                    </p>
                    <div class="flex space-x-6 <?php echo $is_rtl ? 'space-x-reverse' : ''; ?>">
                        <a href="#" class="text-slate-400 hover:text-orange-600 transition-all transform hover:-translate-y-1">
                            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                        <a href="#" class="text-slate-400 hover:text-orange-600 transition-all transform hover:-translate-y-1">
                            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z"/><path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z"/><path d="M18.406 4.155a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg>
                        </a>
                        <a href="#" class="text-slate-400 hover:text-orange-600 transition-all transform hover:-translate-y-1">
                            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                        </a>
                    </div>
                </div>

                <!-- MENU 1 : PLATEFORME -->
                <div>
                    <h4 class="font-black text-slate-900 mb-8 uppercase tracking-[0.2em] text-[10px]">Plateforme</h4>
                    <ul class="space-y-5">
                        <li><a href="/<?php echo $country; ?>-<?php echo $lang; ?>/about" class="text-slate-500 hover:text-orange-600 transition font-bold"><?php echo __('about'); ?></a></li>
                        <li><a href="/<?php echo $country; ?>-<?php echo $lang; ?>/goals" class="text-slate-500 hover:text-orange-600 transition font-bold"><?php echo __('goals'); ?></a></li>
                        <li><a href="/<?php echo $country; ?>-<?php echo $lang; ?>/shop" class="text-slate-500 hover:text-orange-600 transition font-bold"><?php echo __('shop'); ?></a></li>
                        <li><a href="/dashboard" class="text-slate-500 hover:text-orange-600 transition font-bold"><?php echo __('dashboard'); ?></a></li>
                    </ul>
                </div>

                <!-- MENU 2 : LÉGAL -->
                <div>
                    <h4 class="font-black text-slate-900 mb-8 uppercase tracking-[0.2em] text-[10px]">Légal</h4>
                    <ul class="space-y-5">
                        <li><a href="/privacy.html" class="text-slate-500 hover:text-orange-600 transition font-bold"><?php echo __('privacy'); ?></a></li>
                        <li><a href="/terms.html" class="text-slate-500 hover:text-orange-600 transition font-bold"><?php echo __('terms'); ?></a></li>
                    </ul>
                </div>

                <!-- MENU 3 : SUPPORT -->
                <div>
                    <h4 class="font-black text-slate-900 mb-8 uppercase tracking-[0.2em] text-[10px]">Support</h4>
                    <ul class="space-y-5">
                        <li><a href="/faq" class="text-slate-500 hover:text-orange-600 transition font-bold"><?php echo __('faq'); ?></a></li>
                        <li><a href="/contact" class="text-slate-500 hover:text-orange-600 transition font-bold"><?php echo __('contact'); ?></a></li>
                    </ul>
                </div>
            </div>

            <div class="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-sm">
                <p class="text-slate-400 font-medium mb-6 md:mb-0">
                    &copy; <?php echo date('Y'); ?> FreeGeny EdTech. Made for Global Education.
                </p>
                <div class="flex items-center space-x-8 <?php echo $is_rtl ? 'space-x-reverse' : ''; ?>">
                    <span class="px-3 py-1 bg-slate-100 rounded-lg text-slate-600 font-black text-[10px] uppercase"><?php echo $country; ?></span>
                    <span class="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg font-black text-[10px] uppercase"><?php echo $lang; ?></span>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>
