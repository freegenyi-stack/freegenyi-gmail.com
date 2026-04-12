<?php
/**
 * super_reset.php - ELITE DATABASE CLEANER
 * Use with caution. This wipes all dynamic data.
 */
require_once 'config/db.php';
global $pdo;

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Elite Reset | FreeGeny</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'DM Sans', sans-serif; }
        .font-title { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="bg-slate-50 min-h-screen flex items-center justify-center p-6">

    <div class="w-full max-w-xl bg-white rounded-[3rem] p-12 shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-white relative overflow-hidden text-center">
        
        <?php
        try {
            // 1. Désactivation des contraintes pour le vidage
            $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
            
            $tables = [
                'users', 'children', 'child_progress', 'exercise_attempts', 
                'achievements', 'user_sessions', 'child_rewards', 
                'academic_calendar', 'communication_hub', 'login_attempts', 
                'country_conflicts'
            ];

            foreach ($tables as $table) {
                $pdo->exec("TRUNCATE `$table`;");
            }
            
            $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");
            
            echo '<div class="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl">✨</div>';
            echo '<h1 class="text-3xl font-black text-slate-900 mb-4 font-title leading-tight">Base Purifiée.</h1>';
            echo '<p class="text-slate-500 font-light mb-10 leading-relaxed">Toutes les tables ont été vidées avec succès. FreeGeny est prêt pour un nouveau cycle de tests d\'élite.</p>';
            
            echo '<div class="grid grid-cols-2 gap-4 mb-10">';
            foreach ($tables as $table) {
                echo '<div class="bg-slate-50 rounded-xl p-3 border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">'.$table.'</div>';
            }
            echo '</div>';

        } catch (Exception $e) {
            echo '<div class="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl">❌</div>';
            echo '<h1 class="text-3xl font-black text-red-900 mb-4 font-title">Erreur Critique.</h1>';
            echo '<pre class="bg-red-50 p-6 rounded-2xl text-left text-xs text-red-700 overflow-x-auto mb-10">' . $e->getMessage() . '</pre>';
        }
        ?>

        <div class="flex flex-col gap-4">
            <a href="/DZ-fr/auth/register" class="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-100">
                Tester l'Inscription
            </a>
            <a href="/" class="w-full bg-slate-100 text-slate-400 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-200 transition-all">
                Retour à l'accueil
            </a>
        </div>

    </div>

</body>
</html>
