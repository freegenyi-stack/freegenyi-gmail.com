<?php
/**
 * dashboard/invite.php - Inviter un membre de la famille (Post-Onboarding)
 */
require_once __DIR__ . '/../includes/header.php';
require_once __DIR__ . '/../includes/MailManager.php';

// Protection : Membre connecté uniquement
if (!isset($_SESSION['logged_in'])) {
    header('Location: /auth/login');
    exit;
}

$status_msg = "";
$status_type = "";

// ─── TRAITEMENT DE L'INVITATION ───────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['invite_member'])) {
    $email = strtolower(trim($_POST['email'] ?? ''));
    $role = $_POST['role'] ?? 'maman';
    $parent_id = $_SESSION['user_id'];
    $parent_name = $_SESSION['user_name'];

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $status_msg = "Veuillez entrer un email valide.";
        $status_type = "error";
    } else {
        try {
            // 1. Enregistrer en base
            DB::execute("INSERT INTO invitations (parent_id, invited_email, role, status) VALUES (?, ?, ?, 'pending')", [$parent_id, $email, $role]);

            // 2. Préparer le lien
            $invite_link = APP_URL . "/{$country}-{$lang}/auth/register?invite=" . urlencode($email) . "&role=" . urlencode($role) . "&ref=" . $parent_id;

            // 3. Envoyer le mail
            $subject = "Invitation FreeGeny : Rejoignez la famille de $parent_name";
            $messageArr = [
                'fr' => "Bonjour,\n\n$parent_name vous invite à rejoindre son espace FreeGeny en tant que " . ucfirst($role) . " pour suivre ensemble l'excellence éducative de vos enfants.\n\nCliquez ici pour rejoindre : $invite_link",
                'ar' => "مرحباً،\n\nيدعوك $parent_name للانضمام إلى مساحة FreeGeny الخاصة به بصفتك " . ($role == 'maman' ? 'أماً' : 'أباً/وصياً') . " لمتابعة التميز التعليمي لأطفالكم معاً.\n\nانقر هنا للانضمام: $invite_link"
            ];

            $mail = new MailManager();
            if ($mail->send($email, $subject, $messageArr[$lang] ?? $messageArr['fr'])) {
                $status_msg = "L'invitation a été envoyée avec succès à $email !";
                $status_type = "success";
                Activity::log('invite', 'Invitation envoyée', ['target' => $email, 'role' => $role]);
            } else {
                $status_msg = "Erreur lors de l'envoi du mail. Veuillez réessayer.";
                $status_type = "error";
            }
        } catch (Exception $e) {
            $status_msg = "Une erreur est survenue : " . $e->getMessage();
            $status_type = "error";
        }
    }
}
?>

<div class="min-h-screen bg-slate-50 pt-24 pb-12">
    <div class="max-w-xl mx-auto px-6">
        
        <!-- Header -->
        <div class="mb-10 text-center">
            <div class="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <i class="fa-solid fa-user-plus text-2xl"></i>
            </div>
            <h1 class="text-3xl font-black text-slate-900 tracking-tight">Agrandir la Famille 💎</h1>
            <p class="text-slate-500 mt-2 font-medium">Invitez votre conjoint ou un tuteur à rejoindre votre cockpit FreeGeny.</p>
        </div>

        <!-- Alert messages -->
        <?php if ($status_msg): ?>
            <div class="mb-6 p-4 rounded-2xl <?= $status_type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100' ?> flex items-center gap-3 animate-bounce">
                <i class="fa-solid <?= $status_type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle' ?>"></i>
                <p class="text-xs font-bold"><?= $status_msg ?></p>
            </div>
        <?php endif; ?>

        <!-- Form Card -->
        <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl">
            <form action="" method="POST" class="space-y-6">
                
                <div>
                    <label class="block text-[11px] font-black uppercase text-slate-400 tracking-widest mb-2">Email du membre</label>
                    <input type="email" name="email" required placeholder="exemple@mail.com" 
                           class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all font-bold text-slate-900">
                </div>

                <div>
                    <label class="block text-[11px] font-black uppercase text-slate-400 tracking-widest mb-2">Son Rôle dans la famille</label>
                    <select name="role" class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-orange-500 transition-all font-bold text-slate-900 appearance-none">
                        <option value="maman">Maman</option>
                        <option value="papa">Papa</option>
                        <option value="tuteur">Tuteur / Accompagnateur</option>
                        <option value="teacher">Enseignant Particulier</option>
                    </select>
                </div>

                <div class="pt-4">
                    <button type="submit" name="invite_member" 
                            class="w-full py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-orange-600 transition-all transform hover:scale-[1.02] shadow-2xl flex items-center justify-center gap-3">
                        <i class="fa-solid fa-paper-plane"></i> Envoyer l'Invitation
                    </button>
                </div>

            </form>
        </div>

        <div class="mt-10 text-center">
            <a href="/<?= $country ?>-<?= $lang ?>/dashboard/parent" class="text-xs font-bold text-slate-400 hover:text-slate-900 transition flex items-center justify-center gap-2">
                <i class="fa-solid fa-arrow-left"></i> Retour au Tableau de bord
            </a>
        </div>

    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
