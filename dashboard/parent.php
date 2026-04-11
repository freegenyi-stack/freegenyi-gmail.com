<?php
require_once __DIR__ . '/../includes/header.php';
// Simulation de données pour le moment (Elite UI focus)
$children = [
    [
        'id' => 1,
        'name' => 'Amine',
        'grade' => '1AP',
        'avatar' => 'avatar1',
        'xp' => 1250,
        'progress' => 65,
        'interest' => 'Espace'
    ]
];
?>
<main class="min-h-screen bg-slate-50 flex" x-data="{ sidebarOpen: true }">
    
    <!-- Sidebar -->
    <aside :class="sidebarOpen ? 'w-80' : 'w-24'" class="bg-white border-r border-slate-100 transition-all duration-500 overflow-hidden flex flex-col sticky top-0 h-screen z-50">
        <div class="p-8 flex items-center justify-between">
            <span x-show="sidebarOpen" class="text-xs font-black uppercase tracking-widest text-slate-400">Menu Elite</span>
            <button @click="sidebarOpen = !sidebarOpen" class="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h7" stroke-width="2.5"/></svg>
            </button>
        </div>

        <nav class="flex-1 px-4 space-y-2">
            <a href="#" class="flex items-center space-x-4 px-6 py-4 bg-orange-600 text-white rounded-[1.5rem] shadow-xl shadow-orange-100 transition-all group">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" stroke-width="2.5"/></svg>
                <span x-show="sidebarOpen" class="font-black uppercase tracking-widest text-[11px]">Cockpit</span>
            </a>
            <a href="#" class="flex items-center space-x-4 px-6 py-4 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-[1.5rem] transition-all group">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2.5"/></svg>
                <span x-show="sidebarOpen" class="font-black uppercase tracking-widest text-[11px]">Planning</span>
            </a>
            <a href="#" class="flex items-center space-x-4 px-6 py-4 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-[1.5rem] transition-all group">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke-width="2.5"/></svg>
                <span x-show="sidebarOpen" class="font-black uppercase tracking-widest text-[11px]">Récompenses</span>
            </a>
            <a href="#" class="flex items-center space-x-4 px-6 py-4 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-[1.5rem] transition-all group">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4" stroke-width="2.5"/></svg>
                <span x-show="sidebarOpen" class="font-black uppercase tracking-widest text-[11px]">Atelier Print</span>
            </a>
        </nav>

        <div class="p-8 border-t border-slate-100">
            <a href="/api/auth/logout.php" class="flex items-center space-x-4 text-red-400 hover:text-red-600 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7" stroke-width="2.5"/></svg>
                <span x-show="sidebarOpen" class="font-black uppercase tracking-widest text-[11px]">Quitter</span>
            </a>
        </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-y-auto h-screen">
        
        <!-- Header -->
        <header class="p-12 flex justify-between items-center sticky top-0 bg-slate-50/80 backdrop-blur-md z-40">
            <div>
                <h1 class="text-3xl font-black text-slate-900 tracking-tight">Espace Parent</h1>
                <p class="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mt-2">Gérez l'avenir de vos petits génies</p>
            </div>
            <button class="bg-white border border-slate-200 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-xl transition-all">
                + Ajouter un enfant
            </button>
        </header>

        <section class="px-12 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <!-- Left Panel (Children Management) -->
            <div class="lg:col-span-2 space-y-12">
                
                <?php foreach($children as $child): ?>
                <div class="bg-white rounded-[3rem] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.03)] border border-white">
                    <div class="flex items-center justify-between mb-8">
                        <div class="flex items-center space-x-6">
                            <div class="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center">
                                <span class="text-3xl">🦊</span>
                            </div>
                            <div>
                                <h2 class="text-2xl font-black text-slate-900"><?php echo $child['name']; ?></h2>
                                <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Niveau : <?php echo $child['grade']; ?></span>
                            </div>
                        </div>
                        <a href="/dashboard/child_lobby.php?id=<?php echo $child['id']; ?>" class="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all">
                            Mode Apprenant
                        </a>
                    </div>

                    <!-- Progress Stats -->
                    <div class="grid grid-cols-3 gap-6 mb-10">
                        <div class="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <span class="block text-2xl font-black text-slate-900 mb-1"><?php echo $child['xp']; ?></span>
                            <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Points XP</span>
                        </div>
                        <div class="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <span class="block text-2xl font-black text-slate-900 mb-1">Cursus <?php echo $child['interest']; ?></span>
                            <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Adaptation</span>
                        </div>
                        <div class="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <span class="block text-2xl font-black text-slate-900 mb-1"><?php echo $child['progress']; ?>%</span>
                            <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Progression</span>
                        </div>
                    </div>

                    <!-- Emotional Boost Button -->
                    <div class="p-8 bg-orange-50 rounded-[2.5rem] border border-orange-100 flex items-center justify-between group cursor-pointer hover:bg-orange-100 transition-all">
                        <div class="flex items-center space-x-6">
                            <div class="w-14 h-14 bg-orange-600 text-white rounded-2xl flex items-center justify-center animate-pulse">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" stroke-width="2.5"/></svg>
                            </div>
                            <div>
                                <h3 class="text-sm font-black text-orange-950 uppercase tracking-tight">Boost ton petit génie</h3>
                                <p class="text-[11px] text-orange-600 font-bold">Enregistrez un message vocal de motivation</p>
                            </div>
                        </div>
                        <svg class="w-6 h-6 text-orange-300 group-hover:text-orange-600 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="3"/></svg>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>

            <!-- Right Panel (The Bridge & Support) -->
            <div class="space-y-12">
                
                <!-- The Bridge Suggestion -->
                <div class="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
                    <div class="absolute -top-10 -right-10 w-40 h-40 bg-orange-600 blur-[80px] opacity-30"></div>
                    <span class="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-6 block">Le Pont suggère</span>
                    <p class="text-xl font-bold mb-8 leading-relaxed italic">"Amine progresse vite en Mathématiques. Suggérons-lui une partie de foot au parc ?"</p>
                    <div class="flex gap-4">
                        <button class="flex-1 py-4 bg-orange-600 rounded-2xl font-black uppercase tracking-widest text-[9px]">Confirmer</button>
                        <button class="flex-1 py-4 bg-white/10 rounded-2xl font-black uppercase tracking-widest text-[9px]">Modifier</button>
                    </div>
                </div>

                <!-- Support Hub -->
                <div class="bg-white rounded-[3rem] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.03)] border border-white">
                    <h3 class="text-lg font-black text-slate-900 mb-8 tracking-tight">Hub Experts</h3>
                    <div class="space-y-6">
                        <div class="flex items-center space-x-4">
                            <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke-width="2.5"/></svg></div>
                            <span class="text-sm font-bold text-slate-700">Vidéo : Accompagner sans stress</span>
                        </div>
                        <div class="flex items-center space-x-4">
                            <div class="w-10 h-10 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" stroke-width="2.5"/></svg></div>
                            <span class="text-sm font-bold text-slate-700">Contacter le clinicien (Gratuit)</span>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    </div>

</main>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
