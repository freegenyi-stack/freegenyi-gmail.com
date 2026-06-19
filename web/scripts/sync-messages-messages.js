/**
 * Génère Messages + AdminMessages en anglais dans en.json depuis fr.json,
 * puis synchronise les autres locales.
 * Usage: npm run i18n:sync:messages
 */
const fs = require("fs");
const path = require("path");

const messagesDir = path.join(__dirname, "..", "messages");
const fr = JSON.parse(fs.readFileSync(path.join(messagesDir, "fr.json"), "utf8").replace(/^\uFEFF/, ""));
const enPath = path.join(messagesDir, "en.json");
const en = JSON.parse(fs.readFileSync(enPath, "utf8").replace(/^\uFEFF/, ""));

/** Traduction par valeur FR → EN pour les clés non listées dans EN_KEYS */
const FR_TO_EN = {
  "Mon espace enseignant": "My teacher space",
  "Mon espace parent": "My parent space",
  "Mon espace école": "My school space",
  "Mon espace ONG": "My NGO space",
  "Messagerie": "Messaging",
  "Échangez avec l'école et les enseignants de vos enfants.": "Chat with your children's school and teachers.",
  "Communiquez avec vos collègues, vos classes et l'administration.": "Communicate with colleagues, classes and administration.",
  "Diffusez des annonces et gérez la communication de l'établissement.": "Broadcast announcements and manage school communication.",
  "Coordonnez votre équipe et vos bénéficiaires.": "Coordinate your team and beneficiaries.",
  "Usage professionnel uniquement. Pas de messages hors horaires scolaires. Les fichiers sont modérés par l'établissement.":
    "Professional use only. No messages outside school hours. Files are moderated by the school.",
  "Rechercher un salon…": "Search a channel…",
  "Écrivez votre message…": "Write your message…",
  "Joindre": "Attach",
  "Image": "Image",
  "Fichier": "File",
  "Vidéo": "Video",
  "Son": "Audio",
  "Message vocal": "Voice message",
  "Arrêter et envoyer": "Stop and send",
  "Enregistrement… {sec}s": "Recording… {sec}s",
  "Autorisez le micro pour envoyer un vocal.": "Allow the microphone to send a voice message.",
  "Appel vidéo": "Video call",
  "Les appels vidéo arrivent bientôt dans FreeGeny. En attendant, utilisez la messagerie texte, vocale et les pièces jointes.":
    "Video calls are coming soon to FreeGeny. Meanwhile, use text, voice and attachments.",
  "🎬 Vidéo": "🎬 Video",
  "🎤 Vocal": "🎤 Voice",
  "🔊 Audio": "🔊 Audio",
  "Hier": "Yesterday",
  "Émojis": "Emojis",
  "Enregistrer une vidéo": "Record a video",
  "Autorisez la caméra pour enregistrer une vidéo.": "Allow the camera to record a video.",
  "Pièce jointe": "Attachment",
  "Aucun message": "No messages yet",
  "Salon FreeGeny": "FreeGeny channel",
  "Vos messages FreeGeny": "Your FreeGeny messages",
  "Échangez en privé avec vos contacts, rejoignez les salons de votre école ou découvrez des suggestions de personnes à contacter — choisissez un fil pour commencer.":
    "Chat privately with contacts, join school channels or discover people to contact — pick a thread to start.",
  "La messagerie sera disponible après vérification de votre identité.":
    "Messaging will be available after identity verification.",
  "Sur ce message": "On this message",
  "Impossible de charger la messagerie.": "Could not load messaging.",
  "Envoi impossible.": "Could not send.",
  "Envoi du fichier impossible.": "Could not upload file.",
  "Trop de requêtes — patientez quelques secondes puis réessayez.": "Too many requests — wait a few seconds and try again.",
  "Annonces": "Announcements",
  "Collègues": "Colleagues",
  "Enseignants": "Teachers",
  "Ma classe": "My class",
  "Documents": "Documents",
  "Direction": "Administration",
  "Parents": "Parents",
  "École & parents": "School & parents",
  "Communauté parents": "Parents community",
  "Partenaires externes": "External partners",
  "Personnel": "Staff",
  "Équipe": "Team",
  "Projets": "Projects",
  "Message privé": "Private message",
  "École": "School",
  "Classes": "Classes",
  "Communauté": "Community",
  "Équipes": "Teams",
  "Externe": "External",
  "Privé": "Private",
  "Salons": "Channels",
  "Activer les notifications": "Enable notifications",
  "Nouveau message": "New message",
  "Rechercher…": "Search…",
  "Privé": "Private",
  "Suggestions": "Suggestions",
  "Infos officielles de l'établissement": "Official school announcements",
  "Échanges avec la direction": "Exchanges with administration",
  "Votre classe · parents & pédagogie": "Your class · parents & pedagogy",
  "Équipe enseignante de l'école": "School teaching team",
  "Documents et ressources partagés": "Shared documents and resources",
  "Communication école ↔ parents": "School ↔ parents communication",
  "Entraide entre parents": "Parent mutual support",
  "Partenaires et institutions": "Partners and institutions",
  "Personnel administratif": "Administrative staff",
  "Collègues enseignants": "Teacher colleagues",
  "Équipe interne de votre association": "Your organization's internal team",
  "Suivi et échanges sur vos projets": "Project follow-up and discussions",
  "Classe": "Class",
  "Docs": "Docs",
  "Salon prêt — envoyez le premier message": "Channel ready — send the first message",
  "Nom, @pseudo ou email": "Name, @username or email",
  "Aucun utilisateur trouvé": "No users found",
  "Démarrer la conversation": "Start conversation",
  "Personnes à contacter": "People to contact",
  "Conversations": "Conversations",
  "Salons de l'école": "School channels",
  "Salon de groupe": "Group channel",
  "{name} écrit…": "{name} is typing…",
  "{a} et {b} écrivent…": "{a} and {b} are typing…",
  "Plusieurs personnes écrivent…": "Several people are typing…",
  "Activer les sons": "Enable sounds",
  "Couper les sons": "Mute sounds",
  "Masquer cette suggestion": "Dismiss this suggestion",
  "Je connais — écrire": "I know them — message",
  "Voir le profil": "View profile",
  "Voir la carte complète": "View full card",
  "Profil FreeGeny": "FreeGeny profile",
  "Cette personne possède un compte FreeGeny vérifié. Vous pouvez consulter son profil avant de décider de lui écrire.":
    "This person has a verified FreeGeny account. View their profile before deciding to message them.",
  "Fermer": "Close",
  "Envoyer une invitation": "Send invitation",
  "Invitation envoyée.": "Invitation sent.",
  "Retrouver un parent ou un enseignant": "Find a parent or teacher",
  "Aucune suggestion pour le moment.": "No suggestions for now.",
  "Enseignant(e)": "Teacher",
  "Parent": "Parent",
  "École": "School",
  "ONG": "NGO",
  "Membre FreeGeny": "FreeGeny member",
  "Partager": "Share",
  "Imprimer": "Print",
  "Envoyer par e-mail": "Send by email",
  "Aperçu non disponible pour ce format — téléchargez le fichier.": "Preview unavailable — download the file.",
  "Lien copié dans le presse-papiers.": "Link copied to clipboard.",
  "Ouvrir avec…": "Open with…",
  "Nommer ou commenter": "Name or comment",
  "Ajoutez un titre ou un commentaire (optionnel).": "Add a title or comment (optional).",
  "Sans saisie, le fichier sera nommé « {label} ».": "If empty, the file will be named « {label} ».",
  "Envoyer": "Send",
  "Réagir ou agir sur ce fichier": "React or act on this file",
  "Réagir": "React",
  "Répondre": "Reply",
  "Réponse à {name}": "Reply to {name}",
  "Actions sur ce message": "Actions on this message",
  "Rechercher dans la conversation…": "Search in conversation…",
  "Aucun message trouvé": "No messages found",
  "Épingler": "Pin",
  "Désépingler": "Unpin",
  "Messages épinglés": "Pinned messages",
  "Activez les notifications pour ne manquer aucun message.": "Enable notifications so you don't miss any message.",
  "Activer": "Enable",
  "Ouvrir": "Open",
  "Transférer": "Forward",
  "Message transféré.": "Message forwarded.",
  "En direct": "Live",
  "Reconnexion…": "Reconnecting…",
  "Aucun message dans ce salon. Envoyez le premier !": "No messages in this channel. Send the first one!",
  "Aucun salon disponible pour le moment.": "No channels available yet.",
  "📷 Image": "📷 Image",
  "📎 Fichier": "📎 File",
  "Vous": "You",
  "Ce salon est en lecture seule pour votre profil.": "This channel is read-only for your profile.",
  "Annonce officielle (notification à toute l'école)": "Official announcement (notify whole school)",
  "Retirer la pièce jointe": "Remove attachment",
  "Guide des salons": "Channel guide",
  "Chaque salon a un rôle précis. Voici qui peut lire et qui peut écrire.":
    "Each channel has a specific role. Here is who can read and who can post.",
  "Tout le monde lit. Seule la direction école publie. Coche « Annonce officielle » pour alerter toute l'école.":
    "Everyone reads. Only school admin posts. Check « Official announcement » to alert the whole school.",
  "École & parents / Direction": "School & parents / Administration",
  "Communication officielle entre l'établissement et les familles ou l'équipe.":
    "Official communication between the school and families or staff.",
  "Parents, enseignant de la classe et direction — échanges liés au niveau de votre enfant.":
    "Parents, class teacher and administration — exchanges about your child's level.",
  "Entre parents de la même école uniquement.": "Between parents of the same school only.",
  "Enseignants / Personnel": "Teachers / Staff",
  "Équipe pédagogique et personnel administratif de l'établissement.":
    "Teaching team and administrative staff of the school.",
  "Messages privés": "Private messages",
  "Conversation entre deux personnes autorisées (même école, enseignant d'un enfant, etc.).":
    "Conversation between two authorized people (same school, child's teacher, etc.).",
  "Couper les notifications": "Mute notifications",
  "Réactiver les notifications": "Unmute notifications",
  "Notifications coupées": "Notifications muted",
  "Modifier": "Edit",
  "Supprimer": "Delete",
  "Supprimer ce message ?": "Delete this message?",
  "modifié": "edited",
  "Annuler": "Cancel",
  "Enregistrer": "Save",
  "Charger les messages précédents": "Load older messages",
  "Modération des fichiers": "File moderation",
  "Aucun fichier récent à modérer.": "No recent files to moderate.",
  "Bloquer ce fichier": "Block this file",
  "Réautoriser": "Unblock",
  "Fichier retiré par l'établissement": "File removed by the school",
  "Lecture impossible sur cet appareil": "Cannot play on this device",
  "Télécharger": "Download",
  "Lire": "Play",
  "Pause": "Pause",
  "Signaler": "Report",
  "Signalement enregistré": "Report submitted",
  "Message masqué par modération": "Message hidden by moderation",
  "Modération": "Moderation",
  "Commentaires signalés, pièces jointes et messages — recherche et pagination intégrées":
    "Reported comments, attachments and messages — search and pagination built in",
  "Signalements": "Reports",
  "Pièces jointes": "Attachments",
  "Messages": "Messages",
  "Messages signalés": "Reported messages",
  "Utilisateur": "User",
  "Commentaire": "Comment",
  "Statut": "Status",
  "Action": "Action",
  "Expéditeur": "Sender",
  "Date": "Date",
  "Masqué": "Hidden",
  "Visible": "Visible",
  "Masquer": "Hide",
  "Réafficher": "Show",
  "Bloquer": "Block",
  "Débloquer": "Unblock",
  "Aucun commentaire signalé.": "No reported comments.",
  "Aucune pièce jointe récente.": "No recent attachments.",
  "Aucun message.": "No messages.",
  "Aucun message signalé.": "No reported messages.",
  "Commentaire masqué": "Comment hidden",
  "Commentaire réaffiché": "Comment shown",
  "Média bloqué": "Media blocked",
  "Média débloqué": "Media unblocked",
  "Message masqué": "Message hidden",
  "Message réaffiché": "Message shown",
  "Ouvrir le fichier": "Open file",
};

const ERRORS_EN = {
  unauthorized: "Unauthorized",
  access_denied: "Access denied",
  invalid_id: "Invalid ID",
  invalid_user: "Invalid user",
  user_not_found: "User not found",
  cannot_contact: "You cannot contact this person",
  empty_message: "Empty message",
  message_too_long: "Message too long",
  invalid_message_type: "Invalid message type",
  rate_limited: "Too many messages — please wait",
  file_not_allowed: "File not allowed",
  school_hours_blocked: "Messaging is only available during school hours (8am–5pm, Mon–Fri)",
  reply_not_found: "Quoted message not found",
  message_not_found: "Message not found",
  message_deleted: "Message deleted",
  cannot_edit_attachment: "Cannot edit a message with an attachment",
  edit_window_expired: "Edit window expired (15 min)",
  cannot_post_channel: "You cannot post in this channel",
  cannot_pin_channel: "Not allowed in this channel",
  invalid_reaction: "Invalid reaction",
  forward_text_only: "Nothing to forward",
  already_reported: "You already reported this message",
  cannot_report_own: "You cannot report your own message",
  file_not_found: "File not found",
  file_required: "File required",
  upload_failed: "Upload failed",
  already_can_contact: "You can already contact this person",
  action_not_allowed: "Action not allowed",
};

function translateBlock(block) {
  if (!block || typeof block !== "object") return block;
  const out = {};
  for (const [key, value] of Object.entries(block)) {
    if (key === "errors" && typeof value === "object") {
      out.errors = { ...ERRORS_EN };
      continue;
    }
    out[key] = typeof value === "string" ? FR_TO_EN[value] ?? value : value;
  }
  return out;
}

en.Messages = translateBlock(fr.Messages);
if (fr.AdminMessages) en.AdminMessages = translateBlock(fr.AdminMessages);
fs.writeFileSync(enPath, `${JSON.stringify(en, null, 2)}\n`, "utf8");
console.log("OK — Messages + AdminMessages EN générés dans en.json");

const preserve = new Set(["fr.json", "ar.json", "en.json"]);
const files = fs.readdirSync(messagesDir).filter((f) => f.endsWith(".json"));
let updated = 0;
for (const file of files) {
  if (preserve.has(file)) continue;
  const filePath = path.join(messagesDir, file);
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const data = JSON.parse(raw);
  data.Messages = en.Messages;
  if (en.AdminMessages) data.AdminMessages = en.AdminMessages;
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  updated++;
}
console.log(`OK — Messages synchronisé dans ${updated} locale(s)`);
