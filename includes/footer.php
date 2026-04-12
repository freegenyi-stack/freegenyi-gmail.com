<?php
/**
 * footer.php - Version Elite Design System
 */
?>
<footer class="bg-white border-t border-slate-50 pt-32 pb-16 mt-20">
    <div class="max-w-7xl mx-auto px-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
            
            <!-- Branding -->
            <div class="lg:col-span-1">
                <div class="relative inline-block mb-8">
                    <span class="text-2xl font-black text-slate-900 tracking-tighter uppercase font-title leading-none" style="font-family: 'Plus Jakarta Sans', sans-serif;">FreeGeny</span>
                    <span class="block text-lg font-bold text-orange-600 font-caveat mt-1">
                        free the genius on your child
                    </span>
                </div>
                <p class="text-slate-500 text-sm leading-relaxed mb-8 font-light" style="font-family: 'DM Sans', sans-serif;">
                    L'EdTech qui révolutionne l'éveil et la réussite scolaire à travers le monde. Excellence et impact.
                </p>
                <div class="flex space-x-5">
                    <a href="#" class="text-slate-300 hover:text-orange-600 transition-all"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" class="text-slate-300 hover:text-orange-600 transition-all"><i class="fab fa-instagram"></i></a>
                    <a href="#" class="text-slate-300 hover:text-orange-600 transition-all"><i class="fab fa-linkedin-in"></i></a>
                    <a href="#" class="text-slate-300 hover:text-orange-600 transition-all"><i class="fab fa-tiktok"></i></a>
                </div>
            </div>

            <!-- Liens -->
            <div>
                <h4 class="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-8" style="font-family: 'Plus Jakarta Sans', sans-serif;">Découvrir</h4>
                <ul class="space-y-4">
                    <li><a href="/about" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">À propos</a></li>
                    <li><a href="/approach" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">Notre Approche</a></li>
                    <li><a href="/science" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">Science</a></li>
                </ul>
            </div>

            <div>
                <h4 class="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-8" style="font-family: 'Plus Jakarta Sans', sans-serif;">Solutions</h4>
                <ul class="space-y-4">
                    <li><a href="/parents" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">Parents</a></li>
                    <li><a href="/schools" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">Écoles</a></li>
                    <li><a href="/ngos" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">ONG</a></li>
                </ul>
            </div>

            <div>
                <h4 class="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-8" style="font-family: 'Plus Jakarta Sans', sans-serif;">Ressources</h4>
                <ul class="space-y-4">
                    <li><a href="/faq" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">FAQ</a></li>
                    <li><a href="/blog" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">Blog</a></li>
                    <li><a href="/contact" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">Contact</a></li>
                </ul>
            </div>

            <div>
                <h4 class="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-8" style="font-family: 'Plus Jakarta Sans', sans-serif;">Légal</h4>
                <ul class="space-y-4">
                    <li><a href="/privacy" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">Confidentialité</a></li>
                    <li><a href="/terms" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors">Conditions</a></li>
                </ul>
            </div>
        </div>

        <div class="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <p class="text-[11px] font-black text-slate-300 uppercase tracking-widest">© <?php echo date('Y'); ?> FreeGeny Inc. Tous droits réservés.</p>
            <div class="flex items-center space-x-4">
                <div class="bg-slate-900 text-white px-5 py-2 rounded-xl flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-not-allowed">
                    <i class="fab fa-apple text-xl"></i>
                    <div class="text-left">
                        <p class="text-[7px] uppercase font-black leading-none">Soon on</p>
                        <p class="text-[10px] font-bold leading-none mt-0.5">App Store</p>
                    </div>
                </div>
                <div class="bg-slate-900 text-white px-5 py-2 rounded-xl flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-not-allowed">
                    <i class="fab fa-google-play text-lg"></i>
                    <div class="text-left">
                        <p class="text-[7px] uppercase font-black leading-none">Soon on</p>
                        <p class="text-[10px] font-bold leading-none mt-0.5">Google Play</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>

<!-- Cookie Consent (Elite Style) -->
<div x-data="{ show: !localStorage.getItem('freegeny_cookies_accepted') }" x-show="show" x-cloak x-transition class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-xl">
    <div class="bg-white/80 backdrop-blur-2xl border border-slate-200 p-6 rounded-3xl shadow-2xl flex items-center justify-between gap-6">
        <div class="flex items-center gap-4 text-left leading-tight">
            <div class="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shrink-0"><i class="fas fa-cookie-bite text-lg"></i></div>
            <p class="text-[11px] font-medium text-slate-600" style="font-family: 'DM Sans', sans-serif;">Optimisez votre expérience. <br><span class="text-slate-900 font-bold">Nous utilisons des cookies.</span></p>
        </div>
        <button @click="localStorage.setItem('freegeny_cookies_accepted', 'true'); show = false" class="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl">Accepter</button>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
</body>
</html>
