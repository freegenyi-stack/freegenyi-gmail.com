<?php
include_once __DIR__ . '/../includes/header.php';
?>
<main class="min-h-screen relative flex items-center justify-center py-20 px-6 overflow-hidden bg-[#fafafa]" 
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
    
    <div class="w-full max-w-xl relative">
        <div class="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-slate-200/40 border border-slate-100 relative z-10 transition-all duration-500">
            
            <!-- Type Selector (Modern & Colorful) -->
            <div class="flex p-1.5 bg-slate-50 rounded-[2rem] mb-12 border border-slate-100/50">
                <button @click="role = 'parent'" :class="role === 'parent' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'" 
                        class="flex-1 py-4 text-xs font-medium rounded-[1.5rem] transition-all duration-300 flex flex-col items-center gap-2">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="4" fill="url(#gradParent)"/>
                        <path d="M20 21C20 18.2386 15.5228 16 10 16C4.47715 16 0 18.2386 0 21" stroke="url(#gradParent)" stroke-width="2" stroke-linecap="round"/>
                        <defs><linearGradient id="gradParent" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stop-color="#ff9a9e"/><stop offset="100%" stop-color="#fad0c4"/></linearGradient></defs>
                    </svg>
                    <span>parent</span>
                </button>
                <button @click="role = 'school'" :class="role === 'school' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'" 
                        class="flex-1 py-4 text-xs font-medium rounded-[1.5rem] transition-all duration-300 flex flex-col items-center gap-2">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 21V11L12 5L21 11V21H14V14H10V21H3Z" fill="url(#gradSchool)"/>
                        <defs><linearGradient id="gradSchool" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stop-color="#a1c4fd"/><stop offset="100%" stop-color="#c2e9fb"/></linearGradient></defs>
                    </svg>
                    <span>école</span>
                </button>
                <button @click="role = 'ngo'" :class="role === 'ngo' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'" 
                        class="flex-1 py-4 text-xs font-medium rounded-[1.5rem] transition-all duration-300 flex flex-col items-center gap-2">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" fill="url(#gradNGO)"/>
                        <defs><linearGradient id="gradNGO" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stop-color="#84fab0"/><stop offset="100%" stop-color="#8fd3f4"/></linearGradient></defs>
                    </svg>
                    <span>ong</span>
                </button>
            </div>

            <!-- Title & Sub -->
            <div class="text-left mb-10">
                <h1 class="text-3xl font-medium text-slate-900 tracking-tight mb-3" x-text="role === 'parent' ? 'rejoignez freegeny' : 'espace professionnel'"></h1>
                <p class="text-slate-400 text-sm leading-relaxed">découvrez nos descriptifs de cursus, nos cours détaillés et nos exercices spécifiques pour chacun des pays supportés.</p>
            </div>

            <!-- Google Integration -->
            <div class="mb-10">
                <a href="/api/auth/social.php?provider=Google" 
                   class="flex items-center justify-center space-x-3 w-full py-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all duration-300 shadow-sm">
                    <svg class="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2.1 1.5-4.6 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2c4-3.7 7-8.9 7-18.9 0-1.3-.1-2.7-.4-3.9z"/></svg>
                    <span class="text-xs text-slate-600">continuer avec google</span>
                </a>
            </div>

            <!-- Separator -->
            <div class="relative flex items-center mb-10">
                <div class="flex-grow border-t border-slate-100"></div>
                <span class="flex-shrink mx-6 text-xs text-slate-300">accès e-mail</span>
                <div class="flex-grow border-t border-slate-100"></div>
            </div>

            <form @submit.prevent="submit" class="space-y-6">
                <!-- Error -->
                <div x-show="error" x-transition class="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-medium border border-red-100" x-text="error"></div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <template x-if="role === 'parent'">
                        <div class="col-span-2">
                            <label class="block text-xs text-slate-400 mb-2 ml-4">votre nom complet</label>
                            <input type="text" x-model="full_name" required placeholder="amira bensalem"
                                   class="w-full px-7 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none transition-all text-sm text-slate-800">
                        </div>
                    </template>
                    <template x-if="role !== 'parent'">
                        <div class="col-span-2 space-y-6">
                            <div>
                                <label class="block text-xs text-slate-400 mb-2 ml-4" x-text="role === 'school' ? 'nom de l\'établissement' : 'nom de l\'organisation'"></label>
                                <input type="text" x-model="entity_name" required :placeholder="role === 'school' ? 'école al-kindi' : 'fondation espoir'"
                                       class="w-full px-7 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition-all text-sm text-slate-800">
                            </div>
                            <div>
                                <label class="block text-xs text-slate-400 mb-2 ml-4">nom du responsable</label>
                                <input type="text" x-model="director_name" required placeholder="prénom et nom"
                                       class="w-full px-7 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition-all text-sm text-slate-800">
                            </div>
                        </div>
                    </template>
                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-xs text-slate-400 mb-2 ml-4">téléphone</label>
                        <input type="tel" x-model="phone" required placeholder="+213..."
                               class="w-full px-7 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition-all text-sm text-slate-800">
                    </div>
                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-xs text-slate-400 mb-2 ml-4">e-mail</label>
                        <input type="email" x-model="email" required placeholder="nom@exemple.com"
                               class="w-full px-7 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition-all text-sm text-slate-800">
                    </div>
                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-xs text-slate-400 mb-2 ml-4">mot de passe</label>
                        <input type="password" x-model="password" required placeholder="••••••••"
                               class="w-full px-7 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition-all text-sm text-slate-800">
                    </div>
                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-xs text-slate-400 mb-2 ml-4">confirmation</label>
                        <input type="password" x-model="confirm" required placeholder="••••••••"
                               class="w-full px-7 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-slate-100 outline-none transition-all text-sm text-slate-800">
                    </div>
                    <div class="pt-6 col-span-2">
                        <button type="submit" :disabled="loading" 
                                class="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] text-sm font-medium shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50">
                            <span x-show="!loading">créer mon compte</span>
                            <span x-show="loading" x-cloak>synchronisation...</span>
                        </button>
                    </div>
                </div>
            </form>

            <!-- Footer -->
            <div class="mt-12 text-center pt-8 border-t border-slate-50">
                <p class="text-slate-400 text-sm">déjà membre ? <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/auth/login" class="text-slate-900 font-medium hover:underline ml-1">se connecter</a></p>
            </div>
        </div>
    </div>
</main>
<?php include_once __DIR__ . '/../includes/footer.php'; ?>
