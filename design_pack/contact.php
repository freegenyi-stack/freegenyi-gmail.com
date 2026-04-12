<?php
include_once __DIR__ . '/includes/header.php';
?>
<main class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-12 relative z-10 text-center">
            <h1 class="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic">Contactez-nous</h1>
            <p class="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed italic">
                Une suggestion, un partenariat ou besoin d'aide ? Notre équipe est à votre écoute.
            </p>
        </div>
    </section>

    <!-- Contact Form -->
    <section class="py-32">
        <div class="max-w-7xl mx-auto px-12">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">
                <!-- Info -->
                <div>
                    <h2 class="text-4xl font-black text-slate-900 mb-10 italic">Discutons ensemble</h2>
                    <p class="text-slate-500 text-lg leading-relaxed mb-12 italic font-medium">
                        Nous croyons en un support de proximité. Que vous soyez parent, enseignant ou donateur, nous reviendrons vers vous sous 24h.
                    </p>
                    <div class="space-y-8">
                        <div class="flex items-center space-x-6">
                            <div class="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center text-xl shadow-sm italic"><i class="fas fa-envelope"></i></div>
                            <div>
                                <p class="text-xs font-black text-slate-400 uppercase tracking-widest italic">Email</p>
                                <p class="text-lg font-black text-slate-900 italic">hello@freegeny.com</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-6">
                            <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-sm italic"><i class="fas fa-map-marker-alt"></i></div>
                            <div>
                                <p class="text-xs font-black text-slate-400 uppercase tracking-widest italic">Siège Global</p>
                                <p class="text-lg font-black text-slate-900 italic">Silicon Valley & Paris</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Form -->
                <div class="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                    <form action="#" class="space-y-6">
                        <div class="grid grid-cols-2 gap-6">
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">Nom</label>
                                <input type="text" placeholder="John" class="w-full bg-white px-6 py-4 rounded-2xl border border-slate-200 focus:border-orange-600 outline-none transition-all italic text-sm">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">Email</label>
                                <input type="email" placeholder="john@domain.com" class="w-full bg-white px-6 py-4 rounded-2xl border border-slate-200 focus:border-orange-600 outline-none transition-all italic text-sm">
                            </div>
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">Sujet</label>
                            <select class="w-full bg-white px-6 py-4 rounded-2xl border border-slate-200 focus:border-orange-600 outline-none transition-all italic text-sm appearance-none">
                                <option>Support technique</option>
                                <option>Partenariat École/ONG</option>
                                <option>Presse</option>
                                <option>Autre</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">Message</label>
                            <textarea rows="5" placeholder="Comment pouvons-nous vous aider ?" class="w-full bg-white px-6 py-4 rounded-2xl border border-slate-200 focus:border-orange-600 outline-none transition-all italic text-sm"></textarea>
                        </div>
                        <button class="w-full bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 italic">
                            Envoyer le message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</main>
<?php include_once __DIR__ . '/includes/footer.php'; ?>
