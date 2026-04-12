<?php
/**
 * dashboard/add_child.php - Elite Add Child Version
 */
require_once __DIR__ . '/../includes/header.php';
?>
<main class="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-6" x-data="{ step: 1, interest: '' }" style="font-family: 'DM Sans', sans-serif;">
    
    <div class="w-full max-w-2xl bg-white rounded-[3rem] p-8 md:p-16 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden">
        
        <!-- Progress Bar (Elite Style) -->
        <div class="absolute top-0 left-0 right-0 h-1.5 bg-slate-50">
            <div class="h-full bg-orange-600 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)" :style="'width: ' + (step * 33.33) + '%'"></div>
        </div>

        <!-- Step 1: Identity -->
        <div x-show="step === 1" x-cloak x-transition:enter="transition duration-500 transform" x-transition:enter-start="opacity-0 translate-y-4">
            <h1 class="text-4xl font-black text-slate-900 mb-4 tracking-tight" style="font-family: 'Plus Jakarta Sans', sans-serif;">Qui est votre petit génie ?</h1>
            <p class="text-slate-500 font-light mb-12">Commençons par les bases de son profil d'élite.</p>
            
            <form @submit.prevent="step = 2" class="space-y-8">
                <div>
                    <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">Prénom de l'enfant</label>
                    <input type="text" name="child_name" required placeholder="Ex: Amine" 
                           class="w-full bg-slate-50/50 border border-slate-100 focus:border-orange-600 focus:bg-white px-8 py-5 rounded-2xl outline-none transition-all text-sm font-medium">
                </div>
                <div>
                    <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">Niveau Scolaire</label>
                    <div class="relative">
                        <select name="grade" class="w-full bg-slate-50/50 border border-slate-100 focus:border-orange-600 focus:bg-white px-8 py-5 rounded-2xl outline-none transition-all text-sm font-medium appearance-none">
                            <option value="1AP">1ère Année Primaire (1AP)</option>
                            <option value="2AP">2ème Année Primaire (2AP)</option>
                            <option value="3AP">3ème Année Primaire (3AP)</option>
                        </select>
                        <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2.5"/></svg>
                        </div>
                    </div>
                </div>
                <button type="submit" class="w-full bg-slate-950 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-200">
                    Continuer
                </button>
            </form>
        </div>

        <!-- Step 2: Interests -->
        <div x-show="step === 2" x-cloak x-transition:enter="transition duration-500 transform" x-transition:enter-start="opacity-0 translate-y-4">
            <h1 class="text-4xl font-black text-slate-900 mb-4 tracking-tight" style="font-family: 'Plus Jakarta Sans', sans-serif;">Ses Passions.</h1>
            <p class="text-slate-500 font-light mb-12">FreeGeny adaptera l'univers selon ses centres d'intérêt.</p>
            
            <div class="grid grid-cols-2 gap-6 mb-12">
                <button @click="interest = 'space'" :class="interest === 'space' ? 'ring-4 ring-orange-600/10 border-orange-600 bg-orange-50' : 'border-slate-100 bg-slate-50/30'" class="border-2 p-10 rounded-[2.5rem] transition-all flex flex-col items-center group">
                    <span class="text-4xl mb-4 group-hover:scale-110 transition-transform">🚀</span>
                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-900">Espace</span>
                </button>
                <button @click="interest = 'dino'" :class="interest === 'dino' ? 'ring-4 ring-orange-600/10 border-orange-600 bg-orange-50' : 'border-slate-100 bg-slate-50/30'" class="border-2 p-10 rounded-[2.5rem] transition-all flex flex-col items-center group">
                    <span class="text-4xl mb-4 group-hover:scale-110 transition-transform">🦖</span>
                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-900">Dinosaures</span>
                </button>
                <button @click="interest = 'nature'" :class="interest === 'nature' ? 'ring-4 ring-orange-600/10 border-orange-600 bg-orange-50' : 'border-slate-100 bg-slate-50/30'" class="border-2 p-10 rounded-[2.5rem] transition-all flex flex-col items-center group">
                    <span class="text-4xl mb-4 group-hover:scale-110 transition-transform">🌿</span>
                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-900">Nature</span>
                </button>
                <button @click="interest = 'sport'" :class="interest === 'sport' ? 'ring-4 ring-orange-600/10 border-orange-600 bg-orange-50' : 'border-slate-100 bg-slate-50/30'" class="border-2 p-10 rounded-[2.5rem] transition-all flex flex-col items-center group">
                    <span class="text-4xl mb-4 group-hover:scale-110 transition-transform">⚽</span>
                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-900">Sport</span>
                </button>
            </div>

            <div class="flex gap-4">
                <button @click="step = 1" class="flex-1 py-6 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all">Retour</button>
                <button @click="step = 3" :disabled="!interest" class="flex-1 py-6 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-700 transition-all disabled:opacity-50 shadow-xl hover:shadow-orange-200">Finaliser</button>
            </div>
        </div>

        <!-- Step 3: Success -->
        <div x-show="step === 3" x-cloak x-transition:enter="transition duration-500 transform" x-transition:enter-start="opacity-0 scale-95" class="text-center">
            <div class="w-32 h-32 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-10 text-5xl animate-bounce shadow-2xl shadow-orange-200">
                ✨
            </div>
            <h1 class="text-4xl font-black text-slate-900 mb-6 tracking-tight font-title">C'est prêt.</h1>
            <p class="text-slate-500 text-lg font-light mb-12">L'aventure FreeGeny commence maintenant pour votre enfant.</p>
            
            <a href="/dashboard/parent.php" class="inline-block px-12 py-6 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl hover:bg-orange-600 transition-all hover:-translate-y-1">
                Aller au tableau de bord
            </a>
        </div>

    </div>

</main>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
