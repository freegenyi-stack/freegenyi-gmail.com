<?php
/**
 * footer.php - Version EdTech Pro Mondiale (Inspirée Duolingo / Elite Design)
 */
?>
<footer class="bg-white border-t border-slate-50 pt-32 pb-16 mt-20">
    <div class="max-w-7xl mx-auto px-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-32">
            
            <!-- COL 1 : BRAND & SOCIAL -->
            <div class="lg:col-span-1">
                <div class="relative inline-block mb-8">
                    <img src="<?php echo APP_URL; ?>/assets/img/logo.png" class="h-10 w-auto" alt="FreeGeny">
                    <span class="absolute -bottom-4 right-0 text-sm font-bold text-orange-600 font-[Caveat] whitespace-nowrap rotate-2">
                        free the genius on your child
                    </span>
                </div>
                <p class="text-slate-400 text-sm leading-relaxed mb-8 mt-4 font-medium italic">
                    L'EdTech qui révolutionne l'éveil et la réussite scolaire à travers le monde.
                </p>
                <div class="flex space-x-5 <?php echo $is_rtl ? 'space-x-reverse' : ''; ?>">
                    <a href="#" class="text-slate-300 hover:text-orange-600 transition-all duration-300"><i class="fab fa-facebook-f text-lg"></i></a>
                    <a href="#" class="text-slate-300 hover:text-orange-600 transition-all duration-300"><i class="fab fa-instagram text-lg"></i></a>
                    <a href="#" class="text-slate-300 hover:text-orange-600 transition-all duration-300"><i class="fab fa-linkedin-in text-lg"></i></a>
                    <a href="#" class="text-slate-300 hover:text-orange-600 transition-all duration-300"><i class="fab fa-tiktok text-lg"></i></a>
                    <a href="#" class="text-slate-300 hover:text-orange-600 transition-all duration-300"><i class="fab fa-youtube text-lg"></i></a>
                </div>
            </div>

            <!-- COL 2 : L'ENTREPRISE -->
            <div>
                <h4 class="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 italic">Découvrir</h4>
                <ul class="space-y-4">
                    <li><a href="#" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors italic">À propos</a></li>
                    <li><a href="#" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors italic">Mission</a></li>
                    <li><a href="#" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors italic">Notre Approche</a></li>
                    <li><a href="#" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors italic">Science & Efficacité</a></li>
                </ul>
            </div>

            <!-- COL 3 : ÉCOSYSTÈME -->
            <div>
                <h4 class="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 italic">Solutions</h4>
                <ul class="space-y-4">
                    <li><a href="#" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors italic">Espace Parents</a></li>
                    <li><a href="#" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors italic">FreeGeny Écoles</a></li>
                    <li><a href="#" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors italic">FreeGeny ONG</a></li>
                    <li><a href="#" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors italic">Magasin / Boutique</a></li>
                    <li><a href="#" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors italic">Investisseurs</a></li>
                </ul>
            </div>

            <!-- COL 4 : AIDE & SUPPORT -->
            <div>
                <h4 class="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 italic">Ressources</h4>
                <ul class="space-y-4">
                    <li><a href="#" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors italic">Centre d'aide / FAQ</a></li>
                    <li><a href="#" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors italic">Blog Éducatif</a></li>
                    <li><a href="#" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors italic">Presse</a></li>
                    <li><a href="#" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors italic">Statut du site</a></li>
                    <li><a href="#" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors italic">Contactez-nous</a></li>
                </ul>
            </div>

            <!-- COL 5 : LÉGAL -->
            <div>
                <h4 class="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 italic">Légal</h4>
                <ul class="space-y-4">
                    <li><a href="#" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors italic">Confidentialité</a></li>
                    <li><a href="#" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors italic">Conditions d'utilisation</a></li>
                    <li><a href="#" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors italic">Politique de Cookies</a></li>
                    <li><a href="#" class="text-sm font-medium text-slate-400 hover:text-orange-600 transition-colors italic">Mentions Légales</a></li>
                    <li><a href="#" class="text-[10px] font-black text-slate-300 hover:text-red-500 transition-colors italic">Do not sell my personal info</a></li>
                </ul>
            </div>
        </div>

        <!-- BOTTOM FOOTER : APPS & COPYRIGHT -->
        <div class="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
            <div class="flex items-center space-x-10">
                <p class="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] italic">© <?php echo date('Y'); ?> FreeGeny Inc. Tous droits réservés.</p>
            </div>
            
            <div class="flex items-center space-x-6">
                <!-- App Badges Placeholder (Vercel Style) -->
                <div class="flex items-center bg-slate-900 text-white px-4 py-2 rounded-xl scale-75 md:scale-90 opacity-40 hover:opacity-100 transition-opacity cursor-not-allowed">
                    <i class="fab fa-apple text-2xl mr-3"></i>
                    <div class="text-left">
                        <p class="text-[8px] uppercase font-black tracking-widest leading-none">Bientôt sur</p>
                        <p class="text-xs font-bold font-next leading-none mt-0.5">App Store</p>
                    </div>
                </div>
                <div class="flex items-center bg-slate-900 text-white px-4 py-2 rounded-xl scale-75 md:scale-90 opacity-40 hover:opacity-100 transition-opacity cursor-not-allowed">
                    <i class="fab fa-google-play text-xl mr-3"></i>
                    <div class="text-left">
                        <p class="text-[8px] uppercase font-black tracking-widest leading-none">Bientôt sur</p>
                        <p class="text-xs font-bold font-next leading-none mt-0.5">Google Play</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>

<!-- Cookie Consent Banner (Elite Style) -->
<div x-data="{ show: !localStorage.getItem('freegeny_cookies_accepted') }"
     x-show="show"
     x-cloak
     x-transition:enter="transition ease-out duration-500"
     x-transition:enter-start="opacity-0 translate-y-10"
     x-transition:enter-end="opacity-100 translate-y-0"
     class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-2xl">
    
    <div class="bg-slate-900/95 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-start space-x-5">
            <div class="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-600/20">
                <i class="fas fa-cookie-bite text-xl text-white"></i>
            </div>
            <div class="text-left">
                <h4 class="text-sm font-black text-white uppercase tracking-widest italic mb-1">Poliitique de Cookies</h4>
                <p class="text-slate-400 text-xs font-medium leading-relaxed">
                    FreeGeny utilise des cookies pour améliorer votre expérience éducative. En continuant, vous acceptez notre usage des données.
                </p>
            </div>
        </div>
        <div class="flex items-center space-x-4 shrink-0">
            <button @click="localStorage.setItem('freegeny_cookies_accepted', 'true'); show = false" 
                    class="bg-white text-slate-900 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all duration-300 italic shadow-xl">
                Accepter
            </button>
            <button @click="show = false" class="text-slate-500 hover:text-white transition-colors text-xs font-medium italic underline underline-offset-4">
                Refuser
            </button>
        </div>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
</body>
</html>
