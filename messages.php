<?php
/**
 * messages.php - Cockpit de Communication Élite avec Geny Expert 🤖
 */
require_once __DIR__ . '/config/app.php';
require_once __DIR__ . '/api/auth/auth_helpers.php';

initSession();

if (empty($_SESSION['logged_in'])) {
    header("Location: /" . ($country ?? 'DZ') . "-" . ($lang ?? 'fr') . "/auth/login");
    exit;
}

include_once __DIR__ . '/includes/header.php';
?>

<div class="bg-slate-50 min-h-[90vh] pb-10" style="font-family: 'DM Sans', sans-serif;">
    <div class="max-w-7xl mx-auto px-4 md:px-12 py-10 h-[800px]">
        
        <div class="flex h-full bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-white overflow-hidden">
            
            <!-- Barre Latérale (Conversations) -->
            <div class="w-full md:w-[350px] border-r border-slate-100 flex flex-col bg-slate-50/30">
                <div class="p-8 pb-5">
                    <h2 class="text-2xl font-black text-slate-900 tracking-tight" style="font-family: 'Plus Jakarta Sans', sans-serif;">Messages</h2>
                    <div class="mt-6">
                        <input type="text" placeholder="Rechercher..." class="w-full bg-white border border-slate-100 px-5 py-3 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-orange-600/20">
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto custom-scroll p-4 space-y-2" id="conversations-list">
                    <!-- Les salons seront chargés via JS -->
                    <div class="animate-pulse flex flex-col gap-4 p-4">
                        <div class="h-16 bg-slate-200 rounded-2xl w-full"></div>
                        <div class="h-16 bg-slate-200 rounded-2xl w-full"></div>
                    </div>
                </div>
            </div>

            <!-- Fenêtre de Chat Principale -->
            <div class="flex-1 flex flex-col relative" id="chat-window">
                
                <!-- Chat Header -->
                <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white" id="active-conv-avatar">
                            <i class="fa-solid fa-robot text-xl"></i>
                        </div>
                        <div>
                            <h3 class="font-black text-slate-900 text-lg leading-none" id="active-conv-name">Geny Expert</h3>
                            <p class="text-[10px] font-black uppercase text-green-500 tracking-widest mt-1" id="active-conv-status">🤖 Toujours là pour vous</p>
                        </div>
                    </div>
                </div>

                <!-- Messages -->
                <div class="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/20 custom-scroll" id="messages-container">
                    <!-- Messages chargés dynamiquement -->
                </div>

                <!-- Input Area (Premium) -->
                <div class="p-8 pt-0">
                    <div class="bg-white border border-slate-200 rounded-[2.5rem] p-4 flex items-center gap-4 shadow-xl shadow-slate-100">
                        <button class="w-10 h-10 rounded-full hover:bg-slate-50 text-slate-400">
                            <i class="fa-solid fa-plus text-lg"></i>
                        </button>
                        <input type="text" id="chat-input" placeholder="Écrivez votre message..." class="flex-1 outline-none text-sm font-medium text-slate-700">
                        <button class="w-12 h-12 bg-slate-900 text-white rounded-2xl shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center" id="send-btn">
                            <i class="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                    <p class="text-[9px] text-center text-slate-400 mt-4 uppercase font-black tracking-widest">Geny Expert peut faire des erreurs. Vérifiez les informations importantes.</p>
                </div>
            </div>

        </div>

    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    let activeConvId = null;

    // Charger les conversations
    function loadConversations() {
        console.log("Loading conversations...");
        fetch('/api/chat/get_conversations.php')
            .then(r => r.json())
            .then(data => {
                const list = document.getElementById('conversations-list');
                list.innerHTML = '';
                
                data.forEach((conv, idx) => {
                    const el = document.createElement('div');
                    el.className = `p-4 rounded-3xl flex items-center gap-4 cursor-pointer transition-all hover:bg-white hover:shadow-lg ${activeConvId === conv.id ? 'bg-white shadow-lg border-2 border-orange-500/20' : ''}`;
                    el.onclick = () => selectConversation(conv);
                    
                    const avatarClass = conv.type === 'ai' ? 'bg-slate-900' : 'bg-blue-600';
                    const icon = conv.type === 'ai' ? 'fa-robot' : 'fa-users';
                    
                    el.innerHTML = `
                        <div class="w-14 h-14 rounded-2xl ${avatarClass} flex items-center justify-center text-white shrink-0">
                            <i class="fa-solid ${icon} text-lg"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="font-black text-slate-900 truncate">${conv.name}</h4>
                            <p class="text-xs text-slate-500 truncate">${conv.last_message || 'Démarrer une conversation'}</p>
                        </div>
                    `;
                    list.appendChild(el);
                    
                    // Sélectionner la première par défaut
                    if (idx === 0 && !activeConvId) selectConversation(conv);
                });
            });
    }

    function selectConversation(conv) {
        activeConvId = conv.id;
        document.getElementById('active-conv-name').innerText = conv.name;
        document.getElementById('active-conv-status').innerText = conv.type === 'ai' ? '🤖 Toujours là pour vous' : 'En famille';
        loadMessages(conv.id);
        loadConversations(); // Update visual state
    }

    function loadMessages(convId) {
        fetch(`/api/chat/get_messages.php?conversation_id=${convId}`)
            .then(r => r.json())
            .then(messages => {
                const container = document.getElementById('messages-container');
                container.innerHTML = '';
                
                messages.forEach(msg => {
                    const isMe = msg.user_id == <?= $_SESSION['user_id'] ?>;
                    const msgEl = document.createElement('div');
                    msgEl.className = `flex ${isMe ? 'justify-end' : 'justify-start'}`;
                    
                    msgEl.innerHTML = `
                        <div class="max-w-[80%] rounded-3xl p-5 ${isMe ? 'bg-slate-950 text-white rounded-tr-none shadow-xl' : 'bg-white text-slate-900 border border-slate-100 rounded-tl-none'}">
                            <p class="text-sm font-medium leading-relaxed">${msg.message}</p>
                            <span class="text-[9px] ${isMe ? 'text-slate-500' : 'text-slate-400'} uppercase font-black tracking-widest mt-3 block">${new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                    `;
                    container.appendChild(msgEl);
                });
                container.scrollTop = container.scrollHeight;
            });
    }

    function sendMessage() {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text || !activeConvId) return;

        const formData = new FormData();
        formData.append('conversation_id', activeConvId);
        formData.append('message', text);

        input.value = '';

        fetch('/api/chat/send_message.php', {
            method: 'POST',
            body: formData
        }).then(() => {
            loadMessages(activeConvId);
            // Si c'est l'IA, on attend la réponse
            setTimeout(() => loadMessages(activeConvId), 2000);
        });
    }

    document.getElementById('send-btn').onclick = sendMessage;
    document.getElementById('chat-input').onkeypress = (e) => { if(e.key === 'Enter') sendMessage(); };

    loadConversations();
    setInterval(() => activeConvId && loadMessages(activeConvId), 5000);
});
</script>

<style>
.custom-scroll::-webkit-scrollbar { width: 5px; }
.custom-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
