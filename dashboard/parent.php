<?php
/**
 * dashboard/parent.php - Elite Dashboard Version
 */
require_once __DIR__ . '/../includes/header.php';

// Données fictives (Elite Focus)
$children = [
    [
        'id' => 1,
        'name' => 'Amine',
        'grade' => '1AP',
        'avatar' => null,
        'xp' => 1250,
        'progress' => 65,
        'interest' => 'Astronomie',
        'subjects' => [
            ['name' => 'Arabe', 'score' => 85, 'color' => 'orange'],
            ['name' => 'Maths', 'score' => 92, 'color' => 'blue'],
            ['name' => 'Science', 'score' => 78, 'color' => 'teal']
        ]
    ]
];
?>

<div class="bg-slate-50 min-h-screen" style="font-family: 'DM Sans', sans-serif;">
    <div class="max-w-7xl mx-auto px-6 md:px-12 py-12">
        
        <!-- Header du Dashboard -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
            <div>
                <h1 class="text-4xl font-black text-slate-900 tracking-tight" style="font-family: 'Plus Jakarta Sans', sans-serif;">Cockpit Parent</h1>
                <p class="text-slate-500 font-light mt-1">Gérez et suivez l'évolution de vos petits génies.</p>
            </div>
            <div class="flex gap-4 w-full md:w-auto">
                <a href="/dashboard/add_child.php" class="flex-1 md:flex-none text-center bg-white border border-slate-200 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:shadow-xl transition-all">
                    + Ajouter un enfant
                </a>
            </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-12">
            
            <!-- Colonne Principale : Enfants -->
            <div class="lg:col-span-2 space-y-12">
                <?php foreach($children as $child): ?>
                <div class="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden group">
                    <!-- Background Decor -->
                    <div class="absolute -top-24 -right-24 w-64 h-64 bg-orange-50 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div class="relative z-10">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                            <div class="flex items-center gap-6">
                                <div class="w-24 h-24 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl flex items-center justify-center text-white text-3xl shadow-2xl relative">
                                    🦊
                                    <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-600 rounded-full border-4 border-white flex items-center justify-center">
                                        <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                                    </div>
                                </div>
                                <div>
                                    <h2 class="text-3xl font-black text-slate-900 tracking-tight" style="font-family: 'Plus Jakarta Sans', sans-serif;"><?php echo $child['name']; ?></h2>
                                    <div class="flex items-center gap-2 mt-1">
                                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Niveau : <?php echo $child['grade']; ?></span>
                                        <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
                                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">Premium Plus</span>
                                    </div>
                                </div>
                            </div>
                            <a href="/dashboard/child_lobby.php?id=<?php echo $child['id']; ?>" class="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-200 text-center">
                                Mode Apprenant
                            </a>
                        </div>

                        <!-- Stats Grid -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                            <div class="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50">
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Points XP</p>
                                <p class="text-2xl font-black text-slate-900" style="font-family: 'Plus Jakarta Sans', sans-serif;"><?php echo number_format($child['xp']); ?></p>
                            </div>
                            <div class="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50">
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Progression</p>
                                <p class="text-2xl font-black text-slate-900" style="font-family: 'Plus Jakarta Sans', sans-serif;"><?php echo $child['progress']; ?>%</p>
                            </div>
                            <div class="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50">
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Intérêt</p>
                                <p class="text-2xl font-black text-slate-900" style="font-family: 'Plus Jakarta Sans', sans-serif;"><?php echo $child['interest']; ?></p>
                            </div>
                            <div class="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50">
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Rang</p>
                                <p class="text-2xl font-black text-orange-600" style="font-family: 'Plus Jakarta Sans', sans-serif;">Élite</p>
                            </div>
                        </div>

                        <!-- Emotional Boost (Call to action) -->
                        <div class="bg-gradient-to-r from-orange-50 to-amber-50 p-8 rounded-[2.5rem] border border-orange-100/50 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div class="flex items-center gap-5">
                                <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-orange-600">
                                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.027.313A11.21 11.21 0 0121 12c0 2.478-.8 4.77-2.158 6.623a.75.75 0 11-1.214-.882A9.71 9.71 0 0019.5 12c0-1.933-.56-3.734-1.53-5.267a.75.75 0 01.314-1.027zM15.8 8.51a.75.75 0 011.019.34c.453.908.711 1.929.711 3.01 0 1.082-.258 2.103-.711 3.01a.75.75 0 11-1.339-.676c.33-.66.52-1.397.52-2.184 0-.787-.19-1.524-.52-2.184a.75.75 0 01.34-1.02z"/></svg>
                                </div>
                                <div class="text-center md:text-left">
                                    <h4 class="text-sm font-black text-orange-950 uppercase tracking-tight">Boost émotionnel</h4>
                                    <p class="text-xs text-orange-600 font-medium">Récompensez Amine avec votre propre voix.</p>
                                </div>
                            </div>
                            <button class="bg-white text-orange-600 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-xl transition-all">Enregistrer</button>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>

            <!-- Colonne Latérale : Outils -->
            <div class="space-y-12">
                <!-- Printable Factory Card -->
                <div class="bg-white rounded-[2.5rem] p-10 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-white">
                    <div class="flex items-center gap-4 mb-8">
                        <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 14h.01M16 10h.01M16 6h.01M2 17h20a2 2 0 002-2V7a2 2 0 00-2-2H2a2 2 0 00-2 2v8a2 2 0 002 2zm16-12v11l-5-5-5 5V5h10z"/></svg>
                        </div>
                        <h3 class="text-xl font-black text-slate-900 leading-tight">Printable Factory</h3>
                    </div>
                    <p class="text-sm text-slate-500 font-light leading-relaxed mb-8">Générez ses cahiers de révision personnalisés basés sur ses points faibles.</p>
                    <button class="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl">Générer le dossier</button>
                    <div class="flex justify-center gap-4 mt-6">
                        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">PDF</span>
                        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">PNG</span>
                        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">HTML</span>
                    </div>
                </div>

                <!-- The Bridge Suggestion -->
                <div class="bg-slate-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                    <div class="absolute -top-10 -right-10 w-40 h-40 bg-orange-600 blur-[80px] opacity-20"></div>
                    <div class="relative z-10">
                        <span class="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-6 block">Le Pont suggère</span>
                        <p class="text-xl font-bold leading-relaxed mb-10" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                            "Amine a excellé en Maths. Offrez-lui une partie de foot au parc ce samedi ?"
                        </p>
                        <div class="flex gap-4">
                            <button class="flex-1 bg-orange-600 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all">Valider</button>
                            <button class="flex-1 bg-white/10 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">Ignorer</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
