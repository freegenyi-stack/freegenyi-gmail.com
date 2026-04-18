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
                    <div class="flex items-center justify-between">
                        <h2 class="text-2xl font-black text-slate-900 tracking-tight" style="font-family: 'Plus Jakarta Sans', sans-serif;">Messages</h2>
                        <button onclick="document.dispatchEvent(new CustomEvent('open-chat'))" class="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-orange-600 transition-all shadow-lg md:hidden">
                            <i class="fa-solid fa-plus text-sm"></i>
                        </button>
                    </div>
                    <div class="mt-6 flex flex-col gap-3">
                        <div class="relative">
                            <i class="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input type="text" placeholder="Rechercher..." class="w-full bg-white border border-slate-100 pl-11 pr-5 py-3 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-orange-600/20 shadow-sm">
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <button onclick="startAIChat()" class="py-2.5 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-orange-100 hover:scale-105 transition-transform">
                                <i class="fa-solid fa-robot"></i> Expert IA
                            </button>
                            <a href="/dashboard/invite" class="py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-transform text-center">
                                <i class="fa-solid fa-user-plus"></i> Inviter
                            </a>
                        </div>
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto custom-scroll p-4 space-y-2" id="conversations-list">
                    <div class="animate-pulse flex flex-col gap-4 p-4">
                        <div class="h-16 bg-slate-200 rounded-2xl w-full"></div>
                        <div class="h-16 bg-slate-200 rounded-2xl w-full"></div>
                    </div>
                </div>
            </div>

            <!-- Fenêtre de Chat Principale -->
            <div class="flex-1 flex flex-col relative bg-white" id="chat-window">
                
                <!-- Chat Header -->
                <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
                    <div id="no-chat-selected-header" class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                            <i class="fa-solid fa-comments text-xl"></i>
                        </div>
                        <div>
                            <h3 class="font-black text-slate-900 text-lg leading-none">Sélectionnez une discussion</h3>
                            <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Commencez à échanger avec votre famille</p>
                        </div>
                    </div>
                    <div id="active-chat-header" class="hidden flex items-center justify-between w-full">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white relative shadow-lg shadow-orange-100" id="active-conv-avatar">
                                <i class="fa-solid fa-robot text-xl"></i>
                            </div>
                            <div>
                                <h3 class="font-black text-slate-900 text-lg leading-none" id="active-conv-name">Geny Expert</h3>
                                <p class="text-[10px] font-black uppercase text-green-500 tracking-widest mt-1 flex items-center gap-1.5" id="active-conv-status">
                                    <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    En ligne
                                </p>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button class="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-orange-600 transition-colors flex items-center justify-center">
                                <i class="fa-solid fa-phone-flip text-sm"></i>
                            </button>
                            <button class="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-orange-600 transition-colors flex items-center justify-center">
                                <i class="fa-solid fa-video text-sm"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Messages -->
                <div class="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/20 custom-scroll flex flex-col" id="messages-container">
                    <div class="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-30">
                        <img src="/assets/img/logo.png" class="h-20 grayscale mb-6">
                        <p class="text-sm font-bold text-slate-900 uppercase tracking-widest">Vos échanges sont sécurisés</p>
                    </div>
                </div>

                <!-- Input Area (Premium) -->
                <div class="p-8 pt-0 relative" id="input-container">
                    <!-- Media Tooltip -->
                    <div id="media-tooltip" class="hidden absolute bottom-24 left-8 bg-white shadow-2xl rounded-2xl p-2 flex gap-2 border border-slate-100 animate-in fade-in slide-in-from-bottom-2">
                        <button onclick="pickFile('image')" class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex flex-col items-center justify-center hover:bg-blue-100 transition-colors">
                            <i class="fa-solid fa-image"></i>
                        </button>
                        <button onmousedown="startVocal()" onmouseup="stopVocal()" onmouseleave="stopVocal()" id="vocal-btn" class="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex flex-col items-center justify-center hover:bg-orange-100 transition-all">
                            <i class="fa-solid fa-microphone"></i>
                        </button>
                        <button onclick="pickFile('file')" class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex flex-col items-center justify-center hover:bg-emerald-100 transition-colors">
                            <i class="fa-solid fa-folder"></i>
                        </button>
                    </div>

                    <!-- Emoji Picker Tooltip -->
                    <div id="emoji-tooltip" class="hidden absolute bottom-24 right-20 bg-white shadow-2xl rounded-2xl p-4 grid grid-cols-5 gap-2 border border-slate-100 z-50 w-64">
                    </div>

                    <div class="bg-white border border-slate-200 rounded-[2.5rem] p-4 flex items-center gap-4 shadow-xl shadow-slate-100 relative z-10">
                        <button onclick="toggleMediaMenu()" class="w-10 h-10 rounded-full hover:bg-slate-50 text-slate-400 transition-colors flex items-center justify-center">
                            <i class="fa-solid fa-plus text-lg plus-icon transition-transform"></i>
                        </button>
                        <input type="text" id="chat-input" placeholder="Écrivez votre message..." class="flex-1 outline-none text-sm font-medium text-slate-700 bg-transparent">
                        <button onclick="toggleEmojiMenu()" class="text-slate-400 hover:text-orange-600 transition-colors mr-2">
                            <i class="fa-regular fa-face-smile text-xl"></i>
                        </button>
                        <button class="w-12 h-12 bg-slate-900 text-white rounded-2xl shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center" id="send-btn">
                            <i class="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>

        </div>

    </div>
</div>

<script>
let activeConvId = null;
let currentConvType = 'direct';
let mediaRecorder = null;
let audioChunks = [];

document.addEventListener('DOMContentLoaded', () => {
    loadConversations();
    initEmojiMenu();
    
    document.getElementById('send-btn').onclick = sendMessage;
    document.getElementById('chat-input').onkeypress = (e) => { if(e.key === 'Enter') sendMessage(); };
    
    setInterval(() => {
        if (activeConvId) loadMessages(activeConvId, true);
    }, 5000);
});

function loadConversations() {
    fetch('/api/chat/get_conversations.php')
        .then(r => r.json())
        .then(data => {
            const list = document.getElementById('conversations-list');
            list.innerHTML = '';
            
            data.forEach((conv) => {
                const el = document.createElement('div');
                el.className = `p-4 rounded-3xl flex items-center gap-4 cursor-pointer transition-all hover:bg-white hover:shadow-lg ${activeConvId === conv.id ? 'bg-white shadow-lg border-2 border-orange-500/10' : ''}`;
                el.onclick = () => selectConversation(conv);
                
                const avatarClass = conv.type === 'ai' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400';
                const icon = conv.type === 'ai' ? 'fa-robot' : 'fa-user';
                
                el.innerHTML = `
                    <div class="w-14 h-14 rounded-2xl ${avatarClass} flex items-center justify-center relative shrink-0">
                        <i class="fa-solid ${icon} text-lg"></i>
                        ${conv.is_online == 1 || conv.type === 'ai' ? '<span class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>' : ''}
                        ${conv.unread_count > 0 ? `<span class="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">${conv.unread_count}</span>` : ''}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start mb-0.5">
                            <h4 class="font-black text-slate-900 truncate text-sm">${conv.name}</h4>
                            <span class="text-[9px] text-slate-400 font-bold">${conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}</span>
                        </div>
                        <p class="text-xs text-slate-500 truncate">${conv.last_message || "Démarrer une conversation"}</p>
                    </div>
                `;
                list.appendChild(el);
            });
        });
}

function selectConversation(conv) {
    activeConvId = conv.id;
    currentConvType = conv.type;
    
    document.getElementById('no-chat-selected-header').classList.add('hidden');
    document.getElementById('active-chat-header').classList.remove('hidden');
    
    document.getElementById('active-conv-name').innerText = conv.name;
    const avatar = document.getElementById('active-conv-avatar');
    avatar.className = `w-12 h-12 rounded-2xl flex items-center justify-center text-white relative shadow-lg ${conv.type === 'ai' ? 'bg-orange-600 shadow-orange-100' : 'bg-slate-900 shadow-slate-100'}`;
    avatar.innerHTML = `<i class="fa-solid ${conv.type === 'ai' ? 'fa-robot' : 'fa-user'} text-xl"></i>`;
    
    document.getElementById('active-conv-status').innerText = conv.type === 'ai' ? 'Toujours là pour vous' : 'Famille active';
    
    loadMessages(conv.id);
    loadConversations();
}

function loadMessages(convId, isAutoLoad = false) {
    fetch(`/api/chat/get_messages.php?conversation_id=${convId}`)
        .then(r => r.json())
        .then(data => {
            const messages = data.messages || [];
            const container = document.getElementById('messages-container');
            const shouldScroll = container.scrollTop + container.clientHeight >= container.scrollHeight - 50;
            
            if (!isAutoLoad) container.innerHTML = '';
            
            // Si c'est un reload, on ne veut ajouter que les nouveaux
            const existingCount = container.querySelectorAll('.message-bubble').length;
            const newMessages = messages.slice(existingCount);

            newMessages.forEach(msg => {
                const isMe = msg.sender_id == <?= $_SESSION['user_id'] ?>;
                const msgEl = document.createElement('div');
                msgEl.className = `flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-${isMe ? 'right' : 'left'}-4 message-bubble`;
                
                let content = '';
                if (msg.message_type === 'text') {
                    content = `<p class="text-sm font-medium leading-relaxed">${msg.message}</p>`;
                } else if (msg.message_type === 'image') {
                    content = `<img src="${msg.media_path}" class="rounded-xl max-h-60 w-full object-cover cursor-pointer" onclick="window.open('${msg.media_path}')">`;
                } else if (msg.message_type === 'audio') {
                    content = `<audio controls class="max-w-full"><source src="${msg.media_path}"></audio>`;
                } else {
                    content = `<a href="${msg.media_path}" target="_blank" class="flex items-center gap-2 underline text-xs"><i class="fa-solid fa-file"></i> Fichier joint</a>`;
                }

                msgEl.innerHTML = `
                    <div class="max-w-[70%] rounded-[2rem] p-5 shadow-sm ${isMe ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-900 border border-slate-100 rounded-tl-none'}">
                        ${content}
                        <span class="text-[8px] ${isMe ? 'text-slate-400' : 'text-slate-400'} uppercase font-black tracking-widest mt-2 block">${new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                `;
                container.appendChild(msgEl);
            });
            
            if (!isAutoLoad || shouldScroll) {
                container.scrollTop = container.scrollHeight;
            }
        });
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text || !activeConvId) return;

    input.value = '';
    
    fetch('/api/chat/send_message.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: activeConvId, message: text })
    }).then(() => {
        loadMessages(activeConvId);
    });
}

// MULTIMEDIA FUNCTIONS
function toggleMediaMenu() {
    const tooltip = document.getElementById('media-tooltip');
    tooltip.classList.toggle('hidden');
    document.querySelector('.plus-icon').classList.toggle('rotate-45');
}

function pickFile(type) {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = type === 'image' ? 'image/*' : '*/*';
    inp.onchange = e => uploadFile(e.target.files[0], type);
    inp.click();
    toggleMediaMenu();
}

async function uploadFile(file, type) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversation_id', activeConvId);
    formData.append('type', type);
    
    const res = await fetch('/api/chat/upload.php', { method: 'POST', body: formData });
    if (res.ok) loadMessages(activeConvId);
}

// VOCAL LOGIC
async function startVocal() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
        mediaRecorder.onstop = () => {
            const blob = new Blob(audioChunks, { type: 'audio/webm' });
            uploadFile(blob, 'audio');
            document.getElementById('vocal-btn').classList.remove('bg-red-500', 'text-white', 'animate-pulse');
        };
        mediaRecorder.start();
        document.getElementById('vocal-btn').classList.add('bg-red-500', 'text-white', 'animate-pulse');
    } catch(err) { alert("Micro non autorisé"); }
}

function stopVocal() {
    if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop();
}

// EMOJI LOGIC
const emojis = ['😊','😂','❤️','😍','👍','🙌','✨','🔥','🤔','👏','🌟','🎉','🙏','🚀','💡','📚','🎓','🧒','👧','🏠'];
function initEmojiMenu() {
    const container = document.getElementById('emoji-tooltip');
    emojis.forEach(e => {
        const btn = document.createElement('button');
        btn.innerText = e;
        btn.className = "text-xl hover:scale-125 transition-transform p-1";
        btn.onclick = () => {
            document.getElementById('chat-input').value += e;
            toggleEmojiMenu();
        };
        container.appendChild(btn);
    });
}
function toggleEmojiMenu() {
    document.getElementById('emoji-tooltip').classList.toggle('hidden');
}

function startAIChat() {
    fetch('/api/chat/get_conversations.php')
        .then(r => r.json())
        .then(data => {
            const ai = data.find(c => c.type === 'ai');
            if (ai) selectConversation(ai);
        });
}
</script>

<style>
.custom-scroll::-webkit-scrollbar { width: 5px; }
.custom-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
#messages-container { scroll-behavior: smooth; }
.animate-in { animation-duration: 0.3s; animation-fill-mode: both; }
.fade-in { animation-name: fadeIn; }
.slide-in-from-right-4 { animation-name: slideInRight; }
.slide-in-from-left-4 { animation-name: slideInLeft; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideInRight { from { transform: translateX(1rem); } to { transform: translateX(0); } }
@keyframes slideInLeft { from { transform: translateX(-1rem); } to { transform: translateX(0); } }
</style>

<?php include_once __DIR__ . '/includes/footer.php'; ?>
