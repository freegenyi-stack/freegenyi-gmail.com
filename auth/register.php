<?php
include_once __DIR__ . '/../includes/header.php';
?>
<main class="min-h-screen relative flex items-center justify-center py-12 px-6 overflow-hidden bg-[#fafafa]" 
      x-data="{ 
        role: 'parent', 
        full_name: '', 
        entity_name: '',
        director_name: '',
        phone: '', 
        email: '', 
        password: '', 
        confirm: '', 
        loading: false, 
        error: '',
        async submit() {
            if (this.password !== this.confirm) { this.error = 'Les mots de passe ne correspondent pas.'; return; }
            this.loading = true; this.error = '';
            try {
                const res = await fetch('/api/auth/register.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                    body: JSON.stringify({ 
                        role: this.role,
                        full_name: this.role === 'parent' ? this.full_name : this.director_name, 
                        entity_name: this.entity_name,
                        phone: this.phone, 
                        email: this.email, 
                        password: this.password, 
                        confirm: this.confirm,
                        country: '<?php echo $country; ?>' 
                    })
                });
                const data = await res.json();
                if (res.ok && data.success) { window.location.href = data.redirect || '/dashboard'; }
                else { this.error = data.error || 'Erreur lors de l\'inscription.'; }
            } catch (e) { this.error = 'Erreur serveur.'; }
            finally { this.loading = false; }
        }
      }">
    
    <!-- Background Animated Gradients -->
    <div class="absolute top-0 -right-4 w-64 h-64 bg-blue-400 opacity-20 blur-[100px] rounded-full animate-pulse"></div>
    <div class="absolute bottom-0 -left-4 w-64 h-64 bg-orange-400 opacity-10 blur-[100px] rounded-full animate-pulse" style="animation-delay: 2s"></div>

    <div class="w-full max-w-xl relative">
        <div class="bg-white/80 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-white relative z-10">
            
            <!-- Type Selector -->
            <div class="flex p-1.5 bg-slate-100 rounded-3xl mb-10 overflow-hidden shadow-inner">
                <button @click="role = 'parent'" :class="role === 'parent' ? 'bg-white shadow-md text-orange-600' : 'text-slate-400 hover:text-slate-600'" 
                        class="flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 italic">
                    👨‍👩‍👦 Parent
                </button>
                <button @click="role = 'school'" :class="role === 'school' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400 hover:text-slate-600'" 
                        class="flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 italic">
                    🏫 École
                </button>
                <button @click="role = 'ngo'" :class="role === 'ngo' ? 'bg-white shadow-md text-teal-600' : 'text-slate-400 hover:text-slate-600'" 
                        class="flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 italic">
                    🤝 ONG
                </button>
            </div>

            <!-- Title -->
            <div class="text-center mb-10">
                <h1 class="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-3 italic transition-all" x-text="role === 'parent' ? 'Rejoignez FreeGeny' : (role === 'school' ? 'Espace Établissement' : 'Espace Organisation')"></h1>
                <p class="text-slate-400 text-[11px] font-bold italic" x-text="role === 'parent' ? 'Le meilleur pour la réussite de vos enfants' : (role === 'school' ? 'Digitalisez le suivi de vos élèves' : 'Impactez l\'éducation avec nous')"></p>
            </div>

            <!-- Google Login (Common) -->
            <div class="mb-10">
                <a href="/api/auth/social.php?provider=Google" 
                   @click="document.cookie = 'pending_role=' + role + '; path=/; max-age=600'"
                   class="flex items-center justify-center space-x-4 w-full py-4.5 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50 hover:shadow-xl transition-all duration-500 group">
                    <svg class="w-6 h-6 group-hover:scale-110 transition duration-500" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2.1 1.5-4.6 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2c4-3.7 7-8.9 7-18.9 0-1.3-.1-2.7-.4-3.9z"/></svg>
                    <span class="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] italic">Continuer avec Gmail</span>
                </a>
            </div>

            <!-- Separator -->
            <div class="relative flex items-center mb-10">
                <div class="flex-grow border-t border-slate-100"></div>
                <span class="flex-shrink mx-6 text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Ou par adresse mail</span>
                <div class="flex-grow border-t border-slate-100"></div>
            </div>

            <form @submit.prevent="submit" class="space-y-5">
                <!-- Error -->
                <div x-show="error" x-transition class="p-5 bg-red-50 text-red-600 rounded-[2rem] text-[10px] font-bold border border-red-100 italic" x-text="error"></div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    <!-- Dynamic Identity Fields -->
                    <template x-if="role === 'parent'">
                        <div class="col-span-2">
                            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-6 italic">Nom Complet du Parent</label>
                            <input type="text" x-model="full_name" required placeholder="Ex: Amira Bensalem"
                                   class="w-full px-8 py-4.5 bg-slate-50 border-none rounded-[2.5rem] focus:bg-white focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-black text-sm text-slate-700">
                        </div>
                    </template>

                    <template x-if="role !== 'parent'">
                        <div class="col-span-2 space-y-5">
                            <div>
                                <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-6 italic" x-text="role === 'school' ? 'Nom de l\'Établissement' : 'Nom de l\'Organisation'"></label>
                                <input type="text" x-model="entity_name" required :placeholder="role === 'school' ? 'Ex: École Al-Kindi' : 'Ex: Vision Éducative'"
                                       class="w-full px-8 py-4.5 bg-slate-50 border-none rounded-[2.5rem] focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-black text-sm text-slate-700">
                            </div>
                            <div>
                                <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-6 italic" x-text="role === 'school' ? 'Nom du Directeur' : 'Nom du Responsable'"></label>
                                <input type="text" x-model="director_name" required placeholder="Prénom et Nom"
                                       class="w-full px-8 py-4.5 bg-slate-50 border-none rounded-[2.5rem] focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-black text-sm text-slate-700">
                            </div>
                        </div>
                    </template>

                    <!-- Contact -->
                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-6 italic">Téléphone</label>
                        <input type="tel" x-model="phone" required placeholder="+213..."
                               class="w-full px-8 py-4.5 bg-slate-50 border-none rounded-[2.5rem] focus:bg-white focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-black text-sm text-slate-700">
                    </div>

                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-6 italic">E-mail</label>
                        <input type="email" x-model="email" required placeholder="contact@domaine.com"
                               class="w-full px-8 py-4.5 bg-slate-50 border-none rounded-[2.5rem] focus:bg-white focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-black text-sm text-slate-700">
                    </div>

                    <!-- Password -->
                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-6 italic">Mot de passe</label>
                        <input type="password" x-model="password" required placeholder="••••••••"
                               class="w-full px-8 py-4.5 bg-slate-50 border-none rounded-[2.5rem] focus:bg-white focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-black text-sm text-slate-700">
                    </div>

                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-6 italic">Confirmation</label>
                        <input type="password" x-model="confirm" required placeholder="••••••••"
                               class="w-full px-8 py-4.5 bg-slate-50 border-none rounded-[2.5rem] focus:bg-white focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-black text-sm text-slate-700">
                    </div>

                    <div class="pt-6 col-span-2">
                        <button type="submit" :disabled="loading" 
                                :class="role === 'parent' ? 'bg-orange-600 shadow-orange-100 hover:shadow-orange-200' : (role === 'school' ? 'bg-blue-600 shadow-blue-100 hover:shadow-blue-200' : 'bg-teal-600 shadow-teal-100 hover:shadow-teal-200')"
                                class="w-full text-white py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.25em] shadow-2xl transition-all active:scale-95 duration-500 disabled:opacity-50 italic">
                            <span x-show="!loading" x-text="role === 'parent' ? 'Créer mon accès parent' : 'Initialiser mon espace pro'"></span>
                            <span x-show="loading" x-cloak>Synchronisation en cours...</span>
                        </button>
                    </div>
                </div>
            </form>

            <!-- Footer -->
            <div class="mt-12 text-center pt-10 border-t border-slate-50">
                <p class="text-slate-400 text-[13px] font-medium italic">
                    Déjà membre ? 
                    <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="text-orange-600 font-black hover:text-orange-700 underline underline-offset-8 transition-all duration-300 ml-1">
                        Se connecter ici
                    </a>
                </p>
            </div>

        </div>
    </div>
</main>
<?php include_once __DIR__ . '/../includes/footer.php'; ?>
