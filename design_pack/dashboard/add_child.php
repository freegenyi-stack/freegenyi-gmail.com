<?php
require_once __DIR__ . '/../includes/header.php';
?>
<main class="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-6" x-data="{ step: 1, interest: '' }">
    
    <div class="w-full max-w-2xl bg-white rounded-[4rem] p-12 md:p-20 shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-white relative overflow-hidden">
        
        <!-- Progress Bar -->
        <div class="absolute top-0 left-0 right-0 h-2 bg-slate-50">
            <div class="h-full bg-orange-600 transition-all duration-700" :style="'width: ' + (step * 33.33) + '%'"></div>
        </div>

        <!-- Step 1: Identity -->
        <div x-show="step === 1" x-cloak x-transition:enter="transition ease-out duration-500 delay-300" x-transition:enter-start="opacity-0 translate-y-8">
            <h1 class="text-4xl font-black text-slate-900 mb-4 tracking-tight">Qui est votre petit génie ?</h1>
            <p class="text-slate-400 text-sm font-medium mb-12">Commençons par les bases de son profil.</p>
            
            <form @submit.prevent="step = 2" class="space-y-8">
                <div>
                    <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-4">Prénom de l'enfant</label>
                    <input type="text" name="child_name" required placeholder="Ex: Amine" 
                           class="w-full bg-slate-50 border border-transparent focus:border-orange-600 focus:bg-white px-8 py-5 rounded-3xl outline-none transition-all text-sm font-medium">
                </div>
                <div>
                    <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-4">Niveau Scolaire</label>
                    <select name="grade" class="w-full bg-slate-50 border border-transparent focus:border-orange-600 focus:bg-white px-8 py-5 rounded-3xl outline-none transition-all text-sm font-medium appearance-none">
                        <option value="1AP">1ère Année Primaire (1AP)</option>
                        <option value="2AP">2ème Année Primaire (2AP)</option>
                        <option value="3AP">3ème Année Primaire (3AP)</option>
                    </select>
                </div>
                <button type="submit" class="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-widest text-[11px] hover:bg-black transition-all shadow-xl">
                    Continuer
                </button>
            </form>
        </div>

        <!-- Step 2: Interests (The Elite Touch) -->
        <div x-show="step === 2" x-cloak x-transition:enter="transition ease-out duration-500 delay-300" x-transition:enter-start="opacity-0 translate-y-8">
            <h1 class="text-4xl font-black text-slate-900 mb-2 tracking-tight">Ses Passions</h1>
            <p class="text-slate-400 text-sm font-medium mb-12 uppercase tracking-widest">FreeGeny adaptera son univers</p>
            
            <div class="grid grid-cols-2 gap-4 mb-12">
                <button @click="interest = 'space'" :class="interest === 'space' ? 'border-orange-600 bg-orange-50' : 'border-slate-100'" class="border-2 p-8 rounded-[2.5rem] transition-all flex flex-col items-center group">
                    <span class="text-4xl mb-4 group-hover:scale-110 transition-transform">🚀</span>
                    <span class="text-[10px] font-black uppercase tracking-widest">Espace</span>
                </button>
                <button @click="interest = 'dino'" :class="interest === 'dino' ? 'border-orange-600 bg-orange-50' : 'border-slate-100'" class="border-2 p-8 rounded-[2.5rem] transition-all flex flex-col items-center group">
                    <span class="text-4xl mb-4 group-hover:scale-110 transition-transform">🦖</span>
                    <span class="text-[10px] font-black uppercase tracking-widest">Dinosaures</span>
                </button>
                <button @click="interest = 'nature'" :class="interest === 'nature' ? 'border-orange-600 bg-orange-50' : 'border-slate-100'" class="border-2 p-8 rounded-[2.5rem] transition-all flex flex-col items-center group">
                    <span class="text-4xl mb-4 group-hover:scale-110 transition-transform">🌿</span>
                    <span class="text-[10px] font-black uppercase tracking-widest">Nature</span>
                </cm-button>
                <button @click="interest = 'sport'" :class="interest === 'sport' ? 'border-orange-600 bg-orange-50' : 'border-slate-100'" class="border-2 p-8 rounded-[2.5rem] transition-all flex flex-col items-center group">
                    <span class="text-4xl mb-4 group-hover:scale-110 transition-transform">⚽</span>
                    <span class="text-[10px] font-black uppercase tracking-widest">Sport</span>
                </button>
            </div>

            <div class="flex gap-4">
                <button @click="step = 1" class="flex-1 py-6 border border-slate-100 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all">Retour</button>
                <button @click="step = 3" :disabled="!interest" class="flex-1 py-6 bg-orange-600 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-700 transition-all disabled:opacity-50">Valider</button>
            </div>
        </div>

        <!-- Step 3: Success -->
        <div x-show="step === 3" x-cloak class="text-center">
            <div class="w-32 h-32 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-10 text-5xl animate-bounce">
                ✨
            </div>
            <h1 class="text-4xl font-black text-slate-900 mb-6 tracking-tight">C'est prêt !</h1>
            <p class="text-slate-400 text-lg font-medium mb-12 italic">L'aventure FreeGeny commence maintenant pour votre enfant.</p>
            
            <a href="/dashboard/parent.php" class="inline-block px-12 py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-2xl hover:scale-105 transition-all">
                Aller au tableau de bord
            </a>
        </div>

    </div>

</main>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
