<?php
session_start();
if (isset($_SESSION['site_unlocked'])) {
    header('Location: /');
    exit;
}

$error = false;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (($_POST['password'] ?? '') === 'Yousr4568520&') {
        $_SESSION['site_unlocked'] = true;
        header('Location: /');
        exit;
    } else {
        $error = true;
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FreeGeny | Construction</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 h-screen flex items-center justify-center">
    <div class="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center">
        <img src="/assets/img/logo.png" class="h-12 mx-auto mb-6" alt="Logo">
        <h1 class="text-2xl font-black mb-2">Site en Construction</h1>
        <p class="text-gray-500 mb-8 italic">Entrez le code d'accès pour continuer.</p>
        
        <form method="POST" class="space-y-4">
            <input type="password" name="password" placeholder="Mot de passe" required
                   class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none text-center font-bold">
            <?php if ($error): ?>
                <p class="text-red-500 text-sm font-bold">Code incorrect, réessayez.</p>
            <?php endif; ?>
            <button type="submit" class="w-full bg-orange-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-orange-700 transition">
                DÉVERROUILLER 🚀
            </button>
        </form>
    </div>
</body>
</html>
