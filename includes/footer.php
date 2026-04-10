<?php
/**
 * footer.php - Version Premium Minimaliste
 */
?>
    <footer class="bg-slate-50 border-t border-slate-100 pt-20 pb-10">
        <div class="container mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <!-- Branding -->
                <div class="col-span-1 md:col-span-2">
                    <img src="<?php echo APP_URL; ?>/assets/img/logo.png" class="h-10 mb-8" alt="FreeGeny">
                    <p class="text-slate-500 max-w-sm leading-relaxed mb-8">
                        <?php echo __('hero_desc'); ?>
                    </p>
                    <div class="flex space-x-4 <?php echo $is_rtl ? 'space-x-reverse' : ''; ?>">
                        <a href="#" class="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:text-orange-600 transition">fb</a>
                        <a href="#" class="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:text-orange-600 transition">in</a>
                    </div>
                </div>

                <!-- Liens Rappides -->
                <div>
                    <h4 class="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs"><?php echo __('about'); ?></h4>
                    <ul class="space-y-4">
                        <li><a href="/<?php echo $country; ?>-<?php echo $lang; ?>/about" class="text-slate-500 hover:text-orange-600 transition"><?php echo __('about'); ?></a></li>
                        <li><a href="/<?php echo $country; ?>-<?php echo $lang; ?>/goals" class="text-slate-500 hover:text-orange-600 transition"><?php echo __('goals'); ?></a></li>
                        <li><a href="/<?php echo $country; ?>-<?php echo $lang; ?>/shop" class="text-slate-500 hover:text-orange-600 transition"><?php echo __('shop'); ?></a></li>
                    </ul>
                </div>

                <!-- Support -->
                <div>
                    <h4 class="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Support</h4>
                    <ul class="space-y-4">
                        <li><a href="#" class="text-slate-500 hover:text-orange-600 transition">FAQ</a></li>
                        <li><a href="#" class="text-slate-500 hover:text-orange-600 transition">Contact</a></li>
                        <li><a href="#" class="text-slate-500 hover:text-orange-600 transition">Privacy</a></li>
                    </ul>
                </div>
            </div>

            <div class="pt-10 border-t border-slate-200/60 flex flex-col md:flex-row justify-between items-center">
                <p class="text-slate-400 text-sm mb-4 md:mb-0">
                    &copy; <?php echo date('Y'); ?> FreeGeny Global. All rights reserved.
                </p>
                <div class="flex items-center space-x-6 text-sm <?php echo $is_rtl ? 'space-x-reverse' : ''; ?>">
                    <span class="text-slate-900 font-bold"><?php echo $country; ?></span>
                    <span class="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                    <span class="text-slate-900 font-bold uppercase"><?php echo $lang; ?></span>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>
