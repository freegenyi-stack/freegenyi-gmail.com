<?php
/**
 * index.php - Page d'accueil Premium V2
 * Intègre les Points 2 (SEO) et 3 (Reconnaissance Pays)
 */
$page_title = "FreeGeny - L'Excellence Scolaire Numérique pour vos Enfants";
$page_description = "Découvrez la méthode FreeGeny : Soutien scolaire interactif en Arabe et Mathématiques. Programme Algérien 1AP et plus encore.";
include_once __DIR__ . '/includes/header.php';
?>

<!-- Section HERO : La première impression -->
<section class="relative bg-white pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
    <div class="container mx-auto px-4 relative z-10">
        <div class="flex flex-wrap items-center -mx-4">
            <div class="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
                <span class="inline-block py-1 px-3 mb-4 text-xs font-bold bg-orange-100 text-orange-600 rounded-full uppercase tracking-widest">
                    🚀 Apprendre en s'amusant
                </span>
                <h1 class="text-5xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
                    L'avenir de votre enfant commence <span class="text-orange-600">ici.</span>
                </h1>
                <p class="text-xl text-gray-600 mb-10 leading-relaxed">
                    Une plateforme interactive conçue par des experts pédagogiques pour maîtriser l'Arabe et les Mathématiques selon le programme officiel.
                </p>
                <div class="flex flex-wrap -mx-2">
                    <div class="w-full sm:w-auto px-2 mb-4">
                        <a href="<?php echo APP_URL; ?>/auth/register" class="inline-block w-full py-4 px-8 text-lg font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-2xl shadow-lg transition duration-200 text-center">
                            Commencer Gratuitement
                        </a>
                    </div>
                    <div class="w-full sm:w-auto px-2 mb-4">
                        <a href="#subjects" class="inline-block w-full py-4 px-8 text-lg font-bold text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-2xl transition duration-200 text-center">
                            Voir le programme
                        </a>
                    </div>
                </div>
            </div>
            <div class="w-full lg:w-1/2 px-4 text-center">
                <!-- Image illustrative (Peut être remplacée par un visuel 3D ou Lottie) -->
                <div class="relative inline-block">
                    <img class="relative z-10 w-full max-w-lg mx-auto transform hover:scale-105 transition duration-500" src="https://img.freepik.com/free-vector/children-learning-online-concept_23-2148524458.jpg" alt="Enfants apprenant en ligne">
                    <div class="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-orange-200 rounded-full blur-2xl opacity-50"></div>
                    <div class="absolute bottom-0 left-0 -ml-4 -mb-4 w-32 h-32 bg-blue-200 rounded-full blur-2xl opacity-50"></div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Section MATIÈRES (Subjects) -->
<section id="subjects" class="py-20 bg-white border-t border-gray-50">
    <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center mb-16">
            <h2 class="text-4xl font-black text-gray-900 mb-4">Le programme officiel Algérien <span class="text-orange-600">1AP</span></h2>
            <p class="text-lg text-gray-600">Des centaines d'exercices interactifs, d'audios et de jeux pour chaque matière.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <!-- Carte ARABE -->
            <div class="group relative bg-white p-8 rounded-3xl shadow-xl border border-transparent hover:border-orange-200 hover:shadow-orange-100 transition-all duration-300">
                <div class="w-16 h-16 mb-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-2xl text-3xl">
                    <span>أ</span>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">Langue Arabe</h3>
                <p class="text-gray-600 mb-6 line-clamp-2">Alphabet, lecture, écriture et compréhension orale à travers des histoires passionnantes.</p>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-bold text-orange-600">115 Leçons</span>
                    <a href="<?php echo APP_URL; ?>/algeria/1ap/arabe" class="p-4 bg-gray-50 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                        Explorer →
                    </a>
                </div>
            </div>

            <!-- Carte MATHS -->
            <div class="group relative bg-white p-8 rounded-3xl shadow-xl border border-transparent hover:border-blue-200 hover:shadow-blue-100 transition-all duration-300">
                <div class="w-16 h-16 mb-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-2xl text-3xl">
                    <span>+</span>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">Mathématiques</h3>
                <p class="text-gray-600 mb-6 line-clamp-2">Nombres, calcul, géométrie et logique. Une méthode visuelle pour tout comprendre.</p>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-bold text-blue-600">95 Leçons</span>
                    <a href="<?php echo APP_URL; ?>/algeria/1ap/mathematiques" class="p-4 bg-gray-50 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        Explorer →
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Section STATS : Social Proof -->
<section class="py-16 bg-white border-t border-gray-50 text-gray-900 overflow-hidden relative">
    <div class="container mx-auto px-4 relative z-10">
        <div class="flex flex-wrap -mx-4 text-center">
            <div class="w-1/2 lg:w-1/4 px-4 mb-8 lg:mb-0">
                <h3 class="text-4xl font-black text-orange-600 mb-2">115+</h3>
                <p class="text-gray-500 font-bold">Leçons interactives</p>
            </div>
            <div class="w-1/2 lg:w-1/4 px-4 mb-8 lg:mb-0">
                <h3 class="text-4xl font-black text-orange-600 mb-2">333+</h3>
                <p class="text-gray-500 font-bold">Jeux éducatifs</p>
            </div>
            <div class="w-1/2 lg:w-1/4 px-4 mb-8 lg:mb-0">
                <h3 class="text-4xl font-black text-orange-600 mb-2">10k+</h3>
                <p class="text-gray-500 font-bold">Enfants satisfaits</p>
            </div>
            <div class="w-1/2 lg:w-1/4 px-4 mb-8 lg:mb-0">
                <h3 class="text-4xl font-black text-orange-600 mb-2">4.9/5</h3>
                <p class="text-gray-500 font-bold">Note moyenne</p>
            </div>
        </div>
    </div>
    <!-- Décorations d'arrière-plan -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-blue-800 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
    <div class="absolute bottom-0 left-0 w-64 h-64 bg-orange-600 rounded-full -ml-32 -mb-32 blur-3xl opacity-20"></div>
</section>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
