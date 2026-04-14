<?php
/**
 * contact.php - Elite Contact Center
 */
include_once __DIR__ . '/includes/header.php';
?>

<main class="min-h-screen bg-white">
    <!-- Hero Contact -->
    <section class="py-16 md:py-32 bg-slate-100 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
            <h1 class="text-4xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 font-title">Parlons d'Avenir.</h1>
            <p class="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                Besoin d'aide, envie de collaborer ou simple suggestion ? Notre équipe d'experts vous répond sous 24h.
            </p>
        </div>
    </section>

    <!-- Contact Grid -->
    <section class="py-20 md:py-32">
        <div class="max-w-7xl mx-auto px-6 md:px-12">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20">
                <!-- Info -->
                <div class="text-center lg:text-left">
                    <h2 class="text-3xl md:text-5xl font-black text-slate-900 mb-8 font-title tracking-tight">Discutons ensemble.</h2>
                    <p class="text-slate-500 text-lg leading-relaxed mb-12 font-light">
                        Nous croyons en un support de proximité. Que vous soyez parent, enseignant ou donateur, votre voix compte.
                    </p>
                    <div class="space-y-8 inline-block lg:block text-left">
                        <div class="flex items-center gap-6">
                            <div class="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center text-xl shadow-sm"><i class="fas fa-envelope"></i></div>
                            <div>
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                                <p class="text-lg font-bold text-slate-900 font-title">hello@freegeny.com</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-6">
                            <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-sm"><i class="fas fa-map-marker-alt"></i></div>
                            <div>
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Siège Global</p>
                                <p class="text-lg font-bold text-slate-900 font-title">Silicon Valley & Paris</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Form -->
                <div class="bg-slate-50 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
                    <form action="#" class="space-y-6">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-2">Nom</label>
                                <input type="text" placeholder="John" class="w-full bg-white px-6 py-4 rounded-xl border border-slate-200 focus:border-orange-600 outline-none transition-all text-sm font-semibold">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-2">Email</label>
                                <input type="email" placeholder="john@domain.com" class="w-full bg-white px-6 py-4 rounded-xl border border-slate-200 focus:border-orange-600 outline-none transition-all text-sm font-semibold">
                            </div>
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-2">Message</label>
                            <textarea rows="5" placeholder="Comment pouvons-nous vous aider ?" class="w-full bg-white px-6 py-4 rounded-xl border border-slate-200 focus:border-orange-600 outline-none transition-all text-sm font-semibold"></textarea>
                        </div>
                        <button class="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-xl">
                            Envoyer le message →
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
