<?php
/**
 * dashboard/history.php - Historique d'activité Premium
 */
require_once __DIR__ . '/../includes/header.php';

// Si pas connecté, redirection
if (!isset($_SESSION['logged_in'])) {
    header('Location: /auth/login');
    exit;
}

$history = Activity::getRecent(50);
$user_name = $_SESSION['user_name'];
?>

<div class="min-h-screen bg-slate-50 pt-20 pb-12">
    <div class="max-w-4xl mx-auto px-6">
        
        <!-- Header Section -->
        <div class="mb-10 flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-black text-slate-900 tracking-tight">Mon Historique 💎</h1>
                <p class="text-slate-500 mt-2 font-medium">Retrouvez toutes vos activités et celles de vos enfants sur FreeGeny.</p>
            </div>
            <div class="hidden md:block">
                <a href="/dashboard/parent" class="bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm flex items-center gap-2">
                    <i class="fa-solid fa-arrow-left"></i> Retour Dashboard
                </a>
            </div>
        </div>

        <!-- Stats Quick Look -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <?php 
            $counts = [
                'course' => 0,
                'exercise' => 0,
                'search' => 0,
                'auth' => 0
            ];
            foreach ($history as $log) {
                if (isset($counts[$log['category']])) $counts[$log['category']]++;
            }
            ?>
            <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <p class="text-[10px] font-black uppercase text-slate-400">Cours vus</p>
                <p class="text-2xl font-black text-slate-900"><?= $counts['course'] ?></p>
            </div>
            <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <p class="text-[10px] font-black uppercase text-slate-400">Exercices</p>
                <p class="text-2xl font-black text-slate-900"><?= $counts['exercise'] ?></p>
            </div>
            <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <p class="text-[10px] font-black uppercase text-slate-400">Recherches</p>
                <p class="text-2xl font-black text-slate-900"><?= $counts['search'] ?></p>
            </div>
            <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <p class="text-[10px] font-black uppercase text-slate-400">Connexions</p>
                <p class="text-2xl font-black text-slate-900"><?= $counts['auth'] ?></p>
            </div>
        </div>

        <!-- Timeline -->
        <div class="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            <div class="p-6 border-b border-slate-50 flex justify-between items-center">
                <h2 class="font-black text-slate-800 uppercase text-[11px] tracking-widest">Activités Récentes</h2>
                <span class="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-full font-bold">Mis à jour en direct</span>
            </div>

            <?php if (empty($history)): ?>
                <div class="p-20 text-center">
                    <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <i class="fa-solid fa-clock-rotate-left text-2xl"></i>
                    </div>
                    <p class="text-slate-400 font-bold">Aucune activité enregistrée pour le moment.</p>
                </div>
            <?php else: ?>
                <div class="divide-y divide-slate-50">
                    <?php foreach ($history as $log): 
                        $icon = 'fa-circle-info';
                        $color = 'text-slate-400';
                        $bg = 'bg-slate-50';
                        
                        switch($log['category']) {
                            case 'auth': $icon = 'fa-lock'; $color = 'text-blue-500'; $bg = 'bg-blue-50'; break;
                            case 'course': $icon = 'fa-book-open'; $color = 'text-orange-500'; $bg = 'bg-orange-50'; break;
                            case 'exercise': $icon = 'fa-pen-to-square'; $color = 'text-green-500'; $bg = 'bg-green-50'; break;
                            case 'search': $icon = 'fa-magnifying-glass'; $color = 'text-purple-500'; $bg = 'bg-purple-50'; break;
                        }
                    ?>
                    <div class="p-5 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                        <div class="w-10 h-10 <?= $bg ?> <?= $color ?> rounded-xl flex items-center justify-center shrink-0">
                            <i class="fa-solid <?= $icon ?>"></i>
                        </div>
                        <div class="flex-1">
                            <div class="flex justify-between items-start">
                                <h3 class="text-sm font-bold text-slate-800"><?= htmlspecialchars($log['action']) ?></h3>
                                <span class="text-[10px] text-slate-400 font-medium"><?= date('d M, H:i', strtotime($log['created_at'])) ?></span>
                            </div>
                            <?php if ($log['metadata']): 
                                $meta = json_decode($log['metadata'], true);
                                if ($meta):
                            ?>
                                <ul class="mt-2 flex flex-wrap gap-2">
                                    <?php foreach ($meta as $k => $v): ?>
                                        <li class="px-2 py-0.5 bg-slate-100 text-[10px] text-slate-500 rounded-md"><b><?= ucfirst($k) ?>:</b> <?= htmlspecialchars($v) ?></li>
                                    <?php endforeach; ?>
                                </ul>
                            <?php endif; endif; ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>

        <div class="mt-8 text-center">
            <p class="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Ceci est votre journal d'excellence professionnel</p>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
