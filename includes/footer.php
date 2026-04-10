<?php
/**
 * footer.php - Pied de page Premium V2
 */
?>
<footer class="bg-gray-900 text-gray-400 py-12 lg:py-24">
    <div class="container mx-auto px-4">
        <div class="flex flex-wrap -mx-4">
            <div class="w-full lg:w-1/3 px-4 mb-12 lg:mb-0">
                <a href="<?php echo APP_URL; ?>" class="inline-block text-2xl font-black text-white mb-6">
                    FreeGeny
                </a>
                <p class="max-w-sm text-sm leading-relaxed">
                    Plateforme leader de soutien scolaire numérique. Nous accompagnons vos enfants vers la réussite grâce à une technologie interactive et pédagogique.
                </p>
                <div class="mt-8 flex space-x-4">
                    <!-- Réseaux sociaux -->
                    <a href="#" class="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-lg hover:bg-orange-600 hover:text-white transition group">
                        <img src="https://www.svgrepo.com/show/512120/facebook-176.svg" class="w-5 h-5 opacity-60 group-hover:opacity-100" alt="Facebook">
                    </a>
                    <a href="#" class="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-lg hover:bg-orange-600 hover:text-white transition group">
                        <img src="https://www.svgrepo.com/show/512399/instagram-167.svg" class="w-5 h-5 opacity-60 group-hover:opacity-100" alt="Instagram">
                    </a>
                </div>
            </div>
            
            <div class="w-1/2 lg:w-1/6 px-4 mb-8 lg:mb-0">
                <h4 class="text-white font-bold mb-6">Plateforme</h4>
                <ul class="text-sm space-y-4">
                    <li><a href="<?php echo APP_URL; ?>/algeria/1ap/arabe" class="hover:text-white transition">Arabe 1AP</a></li>
                    <li><a href="<?php echo APP_URL; ?>/algeria/1ap/mathematiques" class="hover:text-white transition">Maths 1AP</a></li>
                    <li><a href="#" class="hover:text-white transition">Jeux éducatifs</a></li>
                    <li><a href="#" class="hover:text-white transition">Boutique</a></li>
                </ul>
            </div>

            <div class="w-1/2 lg:w-1/6 px-4 mb-8 lg:mb-0">
                <h4 class="text-white font-bold mb-6">Légal</h4>
                <ul class="text-sm space-y-4">
                    <li><a href="#" class="hover:text-white transition">Conditions</a></li>
                    <li><a href="#" class="hover:text-white transition">Confidentialité</a></li>
                    <li><a href="#" class="hover:text-white transition">Cookies</a></li>
                    <li><a href="#" class="hover:text-white transition">Mentions</a></li>
                </ul>
            </div>

            <div class="w-full lg:w-1/3 px-4">
                <h4 class="text-white font-bold mb-6">Newsletter</h4>
                <p class="text-sm mb-6 italic">Recevez des conseils pédagogiques gratuits chaque semaine.</p>
                <form action="#" class="flex">
                    <input type="email" placeholder="Votre email" class="w-full bg-gray-800 border border-gray-700 rounded-l-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-600">
                    <button type="submit" class="bg-orange-600 text-white px-6 py-3 rounded-r-xl font-bold hover:bg-orange-700 transition">OK</button>
                </form>
            </div>
        </div>

        <div class="mt-20 pt-8 border-t border-gray-800 text-center">
            <p class="text-xs">
                &copy; <?php echo date('Y'); ?> FreeGeny - Tous droits réservés. <br>
                Fait avec ❤️ pour les enfants d'Algérie.
            </p>
        </div>
    </div>
</footer>
</body>
</html>
