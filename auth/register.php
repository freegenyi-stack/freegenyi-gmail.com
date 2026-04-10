<?php
include_once __DIR__ . '/../includes/header.php';
?>
<main class="py-24 bg-slate-50 min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200 border border-slate-100 mx-4">
        <div class="text-center mb-10">
            <h1 class="text-4xl font-black text-slate-900 mb-4"><?php echo __('register'); ?></h1>
            <p class="text-slate-400 font-medium italic">Rejoignez la révolution de l'éducation mondiale !</p>
        </div>

        <form action="/api/auth/register.php" method="POST" class="space-y-6">
            <div>
                <label class="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Nom Complet</label>
                <input type="text" name="name" required
                       class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-bold">
            </div>
            <div>
                <label class="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Email</label>
                <input type="email" name="email" required
                       class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-bold">
            </div>
            <div>
                <label class="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Mot de passe</label>
                <input type="password" name="password" required
                       class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-bold">
            </div>
            <button type="submit" class="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-700 transition transform hover:-translate-y-1">
                CRÉER MON COMPTE
            </button>
        </form>

        <div class="mt-10 text-center">
            <p class="text-slate-400 text-sm">Déjà membre ? 
                <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="text-orange-600 font-black hover:underline uppercase tracking-widest ml-1">Se connecter</a>
            </p>
        </div>
    </div>
</main>
<?php include_once __DIR__ . '/../includes/footer.php'; ?>
