<?php
// ============================================================
// Page — Lecteur de Cours / Exercices
// Route : /cours/[id-lecon]
// ============================================================
require_once __DIR__ . '/../config/app.php';
initSession();

// Récupérer l'ID de la leçon depuis l'URL (via .htaccess)
$lessonId = $_GET['id'] ?? '';

if (!$lessonId) {
    redirect(APP_URL . '/');
}

// Vérifier l'authentification (Les exercices nécessitent un compte)
requireLogin(APP_URL . "/cours/$lessonId");

$user = currentUser();
$lang = detectLang();
$translations = loadLang($lang);

// Récupérer l'enfant actif
$childId = $_SESSION['active_child_id'] ?? null;
if (!$childId) {
    // Si pas d'enfant sélectionné, rediriger vers le dashboard pour en créer un ou en choisir un
    redirect(APP_URL . '/dashboard/parent?error=select_child');
}

// Déterminer la matière depuis le début de l'ID (ex: arabe_dz_...)
$subject = str_contains($lessonId, 'maths') ? 'mathematiques' : 'arabe';
$jsonFile = "exercices_{$subject}_1ap_latest.json";
$dataPath = DATA_PATH . "/algeria/1ap/{$subject}/{$jsonFile}";

// Charger les exercices du JSON
$exercises = [];
if (file_exists($dataPath)) {
    $allExercises = json_decode(file_get_contents($dataPath), true);
    // Filtrer pour ne garder que ceux de cette leçon
    $exercises = array_values(array_filter($allExercises, function($ex) use ($lessonId) {
        return ($ex['lesson_id'] ?? '') === $lessonId;
    }));
}

// Si aucun exercice trouvé, essayer de charger le contenu depuis le curriculum_map pour avoir au moins le titre
$curriculumFile = "curriculum_map_{$subject}_1ap_latest.json";
$curriculumPath = DATA_PATH . "/algeria/1ap/{$subject}/{$curriculumFile}";
$lessonMeta = ['titre_fr' => 'Leçon', 'titre_ar' => 'درس'];

if (file_exists($curriculumPath)) {
    $map = json_decode(file_get_contents($curriculumPath), true);
    foreach ($map['lecons'] ?? [] as $l) {
        if ($l['id'] === $lessonId) {
            $lessonMeta = $l;
            break;
        }
    }
}

$pageTitle = ($lang === 'ar' ? $lessonMeta['titre_ar'] : $lessonMeta['titre_fr']) . ' — FreeGeny';

require_once INCLUDES_PATH . '/header.php';
?>

<main class="section" style="min-height:80vh;display:flex;align-items:center;">
    <div class="container">
        
        <!-- Le lecteur d'exercices (Alpine.js) -->
        <div x-data="exercisePlayer({
            exercises: <?= e(json_encode($exercises)) ?>,
            childId: <?= (int)$childId ?>,
            lessonId: '<?= e($lessonId) ?>',
            subject: '<?= e($subject) ?>',
            baseUrl: '<?= APP_URL ?>'
        })" x-init="init()" class="exercise-player">

            <!-- Écran de chargement / Pas d'exercices -->
            <template x-if="exercises.length === 0">
                <div class="text-center p-6 card-glass">
                    <div style="font-size:3rem;margin-bottom:1rem;">🏗️</div>
                    <h3><?= $lang === 'ar' ? 'تمارين قيد التحضير' : 'Exercices en cours de préparation' ?></h3>
                    <p><?= $lang === 'ar' ? 'هذا الدرس سيكون متاحاً قريباً جداً.' : 'Cette leçon sera disponible très prochainement.' ?></p>
                    <a href="<?= APP_URL ?>/algeria/1ap/<?= $subject ?>" class="btn btn-primary mt-6"><?= $lang === 'ar' ? 'العودة' : 'Retour' ?></a>
                </div>
            </template>

            <!-- Interface Exercice -->
            <template x-if="exercises.length > 0 && !finished">
                <div>
                    <!-- Header -->
                    <div class="exercise-header">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
                            <a href="<?= APP_URL ?>/algeria/1ap/<?= $subject ?>" class="btn btn-ghost btn-sm">✕</a>
                            <div style="flex:1;margin:0 1.5rem;">
                                <div class="progress-bar-container">
                                    <div class="progress-bar-fill" :style="'width:' + progress + '%'"></div>
                                </div>
                            </div>
                            <div class="badge badge-accent" x-text="(current + 1) + ' / ' + exercises.length"></div>
                        </div>
                        <h2 class="exercise-question" x-text="<?= $lang === 'ar' ? 'exercise.question_ar' : 'exercise.question_fr' ?>"></h2>
                    </div>

                    <!-- Media (Image/Audio/Video si présent) -->
                    <div style="margin-bottom:2rem;" class="flex-center">
                        <template x-if="exercise.type === 'audio'">
                            <button @click="playAudio()" class="btn btn-secondary btn-lg" style="height:80px;width:80px;border-radius:50%;">
                                <svg x-show="!audioPlaying" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                                <svg x-show="audioPlaying" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                            </button>
                        </template>
                        <template x-if="exercise.image_url">
                            <img :src="exercise.image_url" class="rounded-lg shadow-md" style="max-height:250px;object-fit:contain;">
                        </template>
                    </div>

                    <!-- Options (QCM / Vrai Faux) -->
                    <div class="exercise-options">
                        <template x-for="option in exercise.options" :key="option">
                            <button 
                                @click="selectOption(option)"
                                class="exercise-option"
                                :class="{
                                    'selected': selected === option,
                                    'correct': answered && option === exercise.answer,
                                    'wrong': answered && selected === option && option !== exercise.answer
                                }"
                                :disabled="answered"
                                x-text="option"
                            ></button>
                        </template>
                    </div>

                    <!-- Feedback & Navigation -->
                    <div class="flex-center flex-col gap-4">
                        <template x-if="!answered">
                            <button @click="validate()" class="btn btn-primary btn-lg w-full" :disabled="!selected">
                                <?= $lang === 'ar' ? 'تأكيد الاجابة' : 'Vérifier la réponse' ?>
                            </button>
                        </template>

                        <template x-if="answered">
                            <div class="w-full text-center">
                                <div class="exercise-feedback mb-4" :class="feedback === 'correct' ? 'success' : 'error'">
                                    <span x-text="feedback === 'correct' ? '<?= $lang === 'ar' ? 'إجابة رائعة! 🎉' : 'Bravo ! 🎉' ?>' : '<?= $lang === 'ar' ? 'حاول مرة أخرى' : 'Oups, réessaie !' ?>'"></span>
                                </div>
                                <button @click="next()" class="btn btn-primary btn-lg w-full">
                                    <?= $lang === 'ar' ? 'التالي' : 'Suivant' ?>
                                </button>
                            </div>
                        </template>
                    </div>
                </div>
            </template>

            <!-- Écran de fin -->
            <template x-if="finished">
                <div class="text-center animate-fade-in">
                    <div style="font-size:5rem;margin-bottom:1.5rem;">🏆</div>
                    <h2 style="margin-bottom:.5rem;"><?= $lang === 'ar' ? 'انتهى الدرس!' : 'Leçon terminée !' ?></h2>
                    <p class="text-muted mb-8"><?= $lang === 'ar' ? 'أحسنت صنعاً! لقد حصلت على:' : 'Excellent travail ! Tu as gagné :' ?></p>
                    
                    <div style="display:flex;gap:2rem;justify-content:center;margin-bottom:2.5rem;">
                        <div class="stat-card" style="min-width:120px;">
                            <div class="stat-card-value" x-text="xpEarned"></div>
                            <div class="stat-card-label">XP ⭐</div>
                        </div>
                        <div class="stat-card" style="min-width:120px;">
                            <div class="stat-card-value" x-text="finalScore + '/10'"></div>
                            <div class="stat-card-label"><?= $lang === 'ar' ? 'النقاط' : 'Score' ?></div>
                        </div>
                    </div>

                    <div style="display:flex;gap:1rem;justify-content:center;">
                        <a href="<?= APP_URL ?>/algeria/1ap/<?= $subject ?>" class="btn btn-primary btn-lg">
                            <?= $lang === 'ar' ? 'قائمة الدروس' : 'Liste des leçons' ?>
                        </a>
                        <button @click="restart()" class="btn btn-ghost btn-lg">
                            <?= $lang === 'ar' ? 'إعادة المحاولة' : 'Recommencer' ?>
                        </button>
                    </div>
                </div>
            </template>

        </div>
    </div>
</main>

<!-- Inclusions JS spécifiques au joueur -->
<script src="<?= APP_URL ?>/assets/js/exercise-player.js"></script>

<?php require_once INCLUDES_PATH . '/footer.php'; ?>
