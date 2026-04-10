<?php
$page_title = "Connexion - FreeGeny";
include_once __DIR__ . '/../../includes/header.php';
?>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
        <div>
            <h2 class="text-center text-3xl font-extrabold text-gray-900">
                Bienvenue sur FreeGeny
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
                L'excellence scolaire pour vos enfants
            </p>
        </div>

        <!-- Authentification Sociale (POINT 1) -->
        <div class="space-y-4">
            <a href="<?php echo APP_URL; ?>/api/auth/social.php?provider=google" 
               class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200">
                <img class="h-5 w-5 mr-3" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google">
                Continuer avec Google
            </a>

            <a href="<?php echo APP_URL; ?>/api/auth/social.php?provider=facebook" 
               class="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl shadow-sm bg-[#1877F2] text-sm font-medium text-white hover:bg-[#166fe5] transition-all duration-200">
                <img class="h-5 w-5 mr-3" src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook">
                Continuer avec Facebook
            </a>

            <div class="grid grid-cols-2 gap-4">
                <a href="<?php echo APP_URL; ?>/api/auth/social.php?provider=microsoft" 
                   class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <img class="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/452062/microsoft.svg" alt="Microsoft">
                    Microsoft
                </a>
                <a href="<?php echo APP_URL; ?>/api/auth/social.php?provider=instagram" 
                   class="flex items-center justify-center px-4 py-3 border border-transparent rounded-xl shadow-sm bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-sm font-medium text-white">
                    <img class="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/452229/instagram.svg" alt="Instagram">
                    Instagram
                </a>
            </div>
        </div>

        <div class="relative py-4">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
                <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500 italic">Ou par e-mail classique</span>
            </div>
        </div>

        <form class="space-y-6" action="<?php echo APP_URL; ?>/api/auth/login.php" method="POST">
            <div class="rounded-md shadow-sm space-y-4">
                <div>
                    <label for="email-address" class="block text-sm font-medium text-gray-700">Adresse e-mail</label>
                    <input id="email-address" name="email" type="email" required 
                           class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" 
                           placeholder="papa@maman.com">
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input id="password" name="password" type="password" required 
                           class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" 
                           placeholder="••••••••">
                </div>
            </div>

            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
                    <label for="remember-me" class="ml-2 block text-sm text-gray-900">Se souvenir de moi</label>
                </div>

                <div class="text-sm">
                    <a href="#" class="font-medium text-orange-600 hover:text-orange-500">Mot de passe oublié ?</a>
                </div>
            </div>

            <div>
                <button type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all">
                    Se connecter
                </button>
            </div>
        </form>
        
        <p class="text-center text-xs text-gray-400">
            En continuant, vous acceptez nos <a href="#" class="underline">Conditions d'Utilisation</a>.
        </p>
    </div>
</div>

<?php include_once __DIR__ . '/../../includes/footer.php'; ?>
