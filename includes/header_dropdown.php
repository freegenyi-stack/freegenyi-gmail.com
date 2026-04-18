                            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/dashboard/parent" class="flex items-center gap-3 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-all border-t border-slate-50">
                                <i class="fa-solid fa-gauge-high w-4 opacity-50"></i> Tableau de bord
                            </a>

                            <a href="/<?php echo $country; ?>-<?php echo $lang; ?>/dashboard/settings" class="flex items-center gap-3 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-all">
                                <i class="fa-solid fa-sliders w-4 opacity-50"></i> Réglages
                            </a>

                            <!-- CERCLE FAMILIAL (DROPDOWN) -->
                            <?php 
                            $family_members = DB::fetchAll("SELECT full_name, role, is_online FROM users WHERE family_id = ? AND id != ?", [$family_id ?? 0, $_SESSION['user_id']]);
                            if ($family_members):
                            ?>
                                <div class="px-5 py-3 bg-slate-50/50">
                                    <p class="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-2">Cercle Familial</p>
                                    <div class="space-y-2">
                                        <?php foreach($family_members as $mem): ?>
                                            <div class="flex items-center justify-between">
                                                <div class="flex items-center gap-2">
                                                    <div class="w-1.5 h-1.5 rounded-full <?= $mem['is_online'] ? 'bg-green-500' : 'bg-slate-300' ?>"></div>
                                                    <span class="text-[10px] font-bold text-slate-600"><?= htmlspecialchars(explode(' ', $mem['full_name'])[0]) ?></span>
                                                </div>
                                            </div>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                            <?php endif; ?>

                            <div class="border-t border-slate-50 mt-1">
                                <a href="/auth/logout.php" class="flex items-center gap-3 px-5 py-3 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all">
                                    <i class="fa-solid fa-power-off w-4"></i> Déconnexion
                                </a>
                            </div>
