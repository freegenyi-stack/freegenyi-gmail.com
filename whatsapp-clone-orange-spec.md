# 🟠 EdTech Messenger — WhatsApp Clone (Orange Theme)
### Spécification complète pour Cursor · Next.js + PostgreSQL + Tailwind

---

## 🎯 Vision

Clone pixel-perfect de WhatsApp Web avec un thème orange premium. Interface temps réel, animations fluides, effets "wow" sur chaque interaction. Stack : **Next.js 14 App Router · PostgreSQL · Tailwind CSS · Prisma · Socket.io · Stream Chat SDK**.

---

## 🗂️ Architecture des fichiers

```
/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (chat)/
│   │   ├── layout.tsx               ← Shell principal (sidebar + contenu)
│   │   ├── page.tsx                 ← Écran d'accueil vide
│   │   └── [conversationId]/
│   │       └── page.tsx             ← Fenêtre de chat
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── conversations/
│       │   ├── route.ts             ← GET list, POST create
│       │   └── [id]/
│       │       ├── route.ts         ← GET, DELETE
│       │       └── messages/route.ts ← GET messages, POST send
│       ├── users/
│       │   ├── route.ts             ← GET search users
│       │   └── [id]/route.ts
│       ├── stream/token/route.ts    ← Token Stream Chat
│       └── upload/route.ts          ← Upload media
├── components/
│   ├── sidebar/
│   │   ├── Sidebar.tsx
│   │   ├── ConversationList.tsx
│   │   ├── ConversationItem.tsx
│   │   ├── SearchBar.tsx
│   │   └── NewChatButton.tsx
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   ├── ChatHeader.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageInput.tsx
│   │   ├── EmojiPicker.tsx
│   │   ├── AttachmentMenu.tsx
│   │   ├── VoiceRecorder.tsx
│   │   └── TypingIndicator.tsx
│   ├── modals/
│   │   ├── NewChatModal.tsx
│   │   ├── UserProfileModal.tsx
│   │   ├── ImageViewerModal.tsx
│   │   └── GroupCreateModal.tsx
│   └── ui/
│       ├── Avatar.tsx
│       ├── Badge.tsx
│       ├── OnlineIndicator.tsx
│       └── AudioPlayer.tsx
├── lib/
│   ├── prisma.ts
│   ├── stream.ts
│   ├── auth.ts
│   └── utils.ts
├── hooks/
│   ├── useConversations.ts
│   ├── useMessages.ts
│   ├── useStreamChat.ts
│   └── useOnlineStatus.ts
├── prisma/
│   └── schema.prisma
└── store/
    └── chatStore.ts                 ← Zustand store
```

---

## 🎨 Design System — Thème Orange

### Palette de couleurs

```css
/* globals.css */
:root {
  /* === ORANGES PRINCIPAUX === */
  --orange-50:  #fff7ed;
  --orange-100: #ffedd5;
  --orange-200: #fed7aa;
  --orange-300: #fdba74;
  --orange-400: #fb923c;
  --orange-500: #f97316;   /* PRIMARY — boutons, accents */
  --orange-600: #ea580c;   /* HOVER */
  --orange-700: #c2410c;   /* ACTIVE / PRESSED */
  --orange-800: #9a3412;
  --orange-900: #7c2d12;

  /* === BACKGROUNDS === */
  --bg-sidebar:        #1a1a1a;    /* sidebar sombre */
  --bg-sidebar-hover:  #2a2a2a;
  --bg-sidebar-active: #ff6b0020;  /* orange transparent */
  --bg-chat:           #0d0d0d;    /* zone chat ultra sombre */
  --bg-chat-pattern:   url('/chat-bg-pattern.svg'); /* grille subtile */
  --bg-input:          #1e1e1e;
  --bg-bubble-me:      #f97316;    /* bulles envoyées = orange vif */
  --bg-bubble-them:    #262626;    /* bulles reçues = gris sombre */
  --bg-header:         #111111;

  /* === TEXTE === */
  --text-primary:   #f5f5f5;
  --text-secondary: #a3a3a3;
  --text-muted:     #525252;
  --text-bubble-me: #ffffff;
  --text-bubble-them: #e5e5e5;

  /* === STATUS === */
  --online:  #22c55e;
  --offline: #6b7280;
  --seen:    #60a5fa;  /* ticks bleus */

  /* === EFFETS === */
  --glow-orange: 0 0 20px rgba(249, 115, 22, 0.4);
  --glow-subtle: 0 0 10px rgba(249, 115, 22, 0.15);
  --shadow-card: 0 4px 24px rgba(0,0,0,0.4);
}
```

### tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: {
          primary: '#f97316',
          hover:   '#ea580c',
          active:  '#c2410c',
          glow:    'rgba(249,115,22,0.4)',
        },
        sidebar: {
          bg:     '#1a1a1a',
          hover:  '#2a2a2a',
          border: '#2a2a2a',
        },
        chat: {
          bg:    '#0d0d0d',
          input: '#1e1e1e',
        },
        bubble: {
          me:   '#f97316',
          them: '#262626',
        },
      },
      keyframes: {
        /* Apparition bulle envoyée */
        bubbleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.8) translateY(8px)' },
          '60%':  { transform: 'scale(1.03) translateY(-2px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        /* Apparition bulle reçue */
        bubbleInLeft: {
          '0%':   { opacity: '0', transform: 'scale(0.8) translateX(-12px)' },
          '60%':  { transform: 'scale(1.02) translateX(2px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateX(0)' },
        },
        /* Pulse indicateur online */
        onlinePulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34,197,94,0.4)' },
          '50%':      { boxShadow: '0 0 0 6px rgba(34,197,94,0)' },
        },
        /* Typing dots */
        typingDot: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%':            { transform: 'translateY(-6px)' },
        },
        /* Slide-in sidebar item */
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        /* Tick seen animation */
        tickAppear: {
          '0%':   { opacity: '0', transform: 'scale(0)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        /* Glow pulse for orange elements */
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(249,115,22,0.3)' },
          '50%':      { boxShadow: '0 0 25px rgba(249,115,22,0.7)' },
        },
        /* Shake pour erreur */
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':      { transform: 'translateX(-8px)' },
          '40%':      { transform: 'translateX(8px)' },
          '60%':      { transform: 'translateX(-4px)' },
          '80%':      { transform: 'translateX(4px)' },
        },
        /* Emoji bounce */
        emojiBounce: {
          '0%':   { transform: 'scale(0) rotate(-20deg)' },
          '70%':  { transform: 'scale(1.3) rotate(10deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        /* Notification badge pop */
        badgePop: {
          '0%':   { transform: 'scale(0)' },
          '70%':  { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'bubble-in':       'bubbleIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        'bubble-in-left':  'bubbleInLeft 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        'online-pulse':    'onlinePulse 2s ease-in-out infinite',
        'typing-dot':      'typingDot 1.2s ease-in-out infinite',
        'slide-in-left':   'slideInLeft 0.3s ease-out',
        'tick-appear':     'tickAppear 0.2s ease-out',
        'glow-pulse':      'glowPulse 2s ease-in-out infinite',
        'shake':           'shake 0.5s ease-in-out',
        'emoji-bounce':    'emojiBounce 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        'badge-pop':       'badgePop 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      },
      backgroundImage: {
        'chat-pattern': "url('/chat-bg-pattern.svg')",
        'orange-gradient': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      },
    },
  },
  plugins: [],
}
export default config
```

---

## 🗄️ Base de données — Schema Prisma

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(cuid())
  name          String
  email         String   @unique
  password      String
  avatar        String?
  bio           String?
  phone         String?  @unique
  isOnline      Boolean  @default(false)
  lastSeen      DateTime @default(now())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  conversationMembers ConversationMember[]
  sentMessages        Message[]            @relation("SentMessages")
  readReceipts        ReadReceipt[]

  @@index([email])
}

model Conversation {
  id          String   @id @default(cuid())
  name        String?  // null pour les DM
  isGroup     Boolean  @default(false)
  groupAvatar String?
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  members     ConversationMember[]
  messages    Message[]

  @@index([updatedAt])
}

model ConversationMember {
  id             String   @id @default(cuid())
  conversationId String
  userId         String
  role           Role     @default(MEMBER)
  joinedAt       DateTime @default(now())
  lastReadAt     DateTime @default(now())

  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([conversationId, userId])
  @@index([userId])
}

enum Role {
  ADMIN
  MEMBER
}

model Message {
  id             String      @id @default(cuid())
  conversationId String
  senderId       String
  content        String?
  type           MessageType @default(TEXT)
  mediaUrl       String?
  mediaMimeType  String?
  mediaSize      Int?
  replyToId      String?
  isDeleted      Boolean     @default(false)
  editedAt       DateTime?
  createdAt      DateTime    @default(now())

  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender       User         @relation("SentMessages", fields: [senderId], references: [id])
  replyTo      Message?     @relation("Replies", fields: [replyToId], references: [id])
  replies      Message[]    @relation("Replies")
  reactions    Reaction[]
  readReceipts ReadReceipt[]

  @@index([conversationId, createdAt])
  @@index([senderId])
}

enum MessageType {
  TEXT
  IMAGE
  VIDEO
  AUDIO
  DOCUMENT
  VOICE_NOTE
  EMOJI_ONLY
}

model Reaction {
  id        String   @id @default(cuid())
  messageId String
  userId    String
  emoji     String
  createdAt DateTime @default(now())

  message Message @relation(fields: [messageId], references: [id], onDelete: Cascade)

  @@unique([messageId, userId])
}

model ReadReceipt {
  id        String   @id @default(cuid())
  messageId String
  userId    String
  readAt    DateTime @default(now())

  message Message @relation(fields: [messageId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([messageId, userId])
}
```

---

## 🔧 Configuration & Librairies

### package.json (dépendances clés)

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "prisma": "^5.14.0",
    "@prisma/client": "^5.14.0",
    "next-auth": "^4.24.0",
    "bcryptjs": "^2.4.3",
    "@types/bcryptjs": "^2.4.6",
    "stream-chat": "^8.20.0",
    "stream-chat-react": "^11.0.0",
    "zustand": "^4.5.0",
    "socket.io": "^4.7.0",
    "socket.io-client": "^4.7.0",
    "emoji-picker-react": "^4.9.0",
    "react-dropzone": "^14.2.0",
    "react-audio-player": "^0.17.0",
    "date-fns": "^3.6.0",
    "clsx": "^2.1.0",
    "framer-motion": "^11.2.0",
    "react-virtuoso": "^4.7.0",
    "uploadthing": "^6.12.0",
    "@uploadthing/react": "^6.6.0",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.383.0",
    "swr": "^2.2.5"
  }
}
```

### Variables d'environnement (.env.local)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/edtech_messenger"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Stream Chat
NEXT_PUBLIC_STREAM_API_KEY="your-stream-api-key"
STREAM_API_SECRET="your-stream-api-secret"

# UploadThing (pour les médias)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-app-id"
```

---

## 🏗️ Composants — Implémentation détaillée

### 1. Layout principal — `app/(chat)/layout.tsx`

```typescript
// Layout en 3 colonnes comme WhatsApp Web
// Sidebar fixe (380px) + zone chat qui prend le reste
// Background sombre avec pattern subtil sur la zone chat

export default function ChatLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#0d0d0d] overflow-hidden">
      {/* Sidebar */}
      <div className="w-[380px] min-w-[380px] border-r border-[#2a2a2a] flex flex-col bg-[#1a1a1a]">
        <Sidebar />
      </div>
      
      {/* Zone chat */}
      <div className="flex-1 flex flex-col relative">
        {/* Background pattern façon WhatsApp */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "url('/chat-bg.svg')", backgroundSize: '400px' }}
        />
        {children}
      </div>
    </div>
  )
}
```

### 2. Sidebar — `components/sidebar/Sidebar.tsx`

```typescript
// Structure :
// [Header avec avatar + icônes (24px)]
// [SearchBar animée]
// [Tabs : Tous / Non lus / Groupes]
// [Liste des conversations scrollable]
// [Bouton nouveau chat flottant orange avec glow]

// HEADER :
// - Avatar utilisateur connecté (cliquable → profil)
// - Icônes : Statut, Nouvelles communautés, Nouveau chat
// - Fond : bg-[#111111] avec border-b border-[#2a2a2a]

// SEARCHBAR :
// - Input avec icône loupe, fond #262626, border transparent
// - Focus : border-orange-500 + glow orange subtil
// - Animation : expand width au focus (framer-motion layout)
// - Placeholder "Rechercher ou démarrer une discussion"

// TABS :
// - "Tous" | "Non lus" | "Groupes" | "Favoris"
// - Active : texte orange + border-bottom orange + bg orange transparent
// - Transition smooth 200ms

// BOUTON NOUVEAU CHAT :
// - Rond orange, position absolute bottom-6 right-6
// - Icône PenSquare ou MessageSquarePlus
// - Hover : scale(1.1) + glow-pulse animation
// - Click : ouvre NewChatModal avec slide-up animation
```

### 3. ConversationItem — `components/sidebar/ConversationItem.tsx`

```typescript
// Chaque item de conversation dans la liste
// LAYOUT :
// [Avatar avec OnlineIndicator] [Col: Nom + Aperçu message] [Col: Heure + Badge non lus]

// EFFETS :
// - Hover : bg-[#2a2a2a] + border-left 3px orange (slide in depuis gauche)
// - Active/Selected : bg-orange/10 + border-left orange vif
// - Apparition : animation slide-in-left avec stagger (index * 50ms delay)
// - Non lu : nom en bold, badge orange animé (badge-pop)

// PREVIEW MESSAGE :
// - Icône type (📷 Photo · 🎙️ Vocal · 📄 Document) + texte tronqué
// - Ticks (✓ envoyé / ✓✓ livré / ✓✓ vu en bleu)
// - "Vous : " en préfixe si c'est le dernier message de l'utilisateur

// HEURE :
// - Format : "Maintenant" / "14:32" / "Hier" / "Lun." / "12/03"
// - Non lu : heure en orange

// INDICATEUR ONLINE :
// - Petit cercle vert (10px) avec animation onlinePulse
// - Position : bottom-right de l'avatar
```

### 4. ChatHeader — `components/chat/ChatHeader.tsx`

```typescript
// Header de la fenêtre de chat
// LAYOUT :
// [Avatar + Nom + Status] -------- [Icônes: Recherche, Appel vidéo, Menu]

// EFFETS :
// - bg-[#111111] avec blur(10px) effet glassmorphism
// - Border-bottom orange subtil (1px, opacity 30%)
// - Avatar cliquable → UserProfileModal (slide depuis droite)
// - Status : "En ligne" en vert animé / "Vu à 14h30" en gris
// - Pour les groupes : "X participants, Y en ligne"

// ICÔNES :
// - SearchIcon : ouvre barre de recherche dans les messages
// - VideoIcon : (futur) appel vidéo
// - MoreVertical : menu contextuel (effacer, couper son, quitter groupe)
// - Hover sur icônes : bg rond orange/20 + scale(1.1)
```

### 5. MessageBubble — `components/chat/MessageBubble.tsx`

```typescript
// LE COMPOSANT LE PLUS IMPORTANT - Effet WOW maximum ici

// LAYOUT mes messages (droite) :
// [Espace] [Réactions] [Bulle orange arrondie] [Avatar si groupe]

// LAYOUT messages reçus (gauche) :
// [Avatar] [Bulle grise] [Réactions]

// FORMES DES BULLES :
// Mes messages :     border-radius: 18px 18px 4px 18px  (coin bas-droit pointu)
// Messages reçus :   border-radius: 18px 18px 18px 4px  (coin bas-gauche pointu)

// ANIMATIONS D'APPARITION :
// - Mes bulles    → animate-bubble-in      (pop depuis bas-droite)
// - Bulles reçues → animate-bubble-in-left (pop depuis bas-gauche)

// EFFETS VISUELS :
// Mes bulles :
//   background: linear-gradient(135deg, #f97316, #ea580c)
//   box-shadow: 0 2px 12px rgba(249,115,22,0.35)
//   Hover : box-shadow augmente → glow-pulse

// TYPES DE CONTENU :
// TEXT :
//   - Texte blanc, font-size 14px, line-height 1.5
//   - Emojis seuls (1-3) : taille 40px, sans bulle (type EMOJI_ONLY)
//   - Liens : underline orange clair, preview card si OG disponible

// IMAGE :
//   - Arrondie dans la bulle (border-radius hérite de la bulle)
//   - Overlay play si vidéo
//   - Click → ImageViewerModal (fullscreen avec zoom/pan)
//   - Blur loading placeholder pendant chargement

// AUDIO/VOICE NOTE :
//   - Waveform SVG animée (barres qui oscillent pendant lecture)
//   - Bouton play orange, durée en secondes
//   - Slider de progression orange

// DOCUMENT :
//   - Icône type fichier (PDF rouge, Word bleu, etc.)
//   - Nom + taille du fichier
//   - Bouton téléchargement

// REPLY :
//   - Bande orange sur le côté gauche de la citation
//   - Contenu du message original en aperçu (2 lignes max)
//   - Click → scroll smooth vers le message original + highlight 1s

// MÉTADONNÉES (toujours en bas à droite) :
//   - Heure : 14:32 (texte blanc/80%)
//   - Ticks pour mes messages :
//     ⏰ Envoi en cours → spinner orange
//     ✓  Envoyé       → tick gris (animate-tick-appear)
//     ✓✓ Livré        → deux ticks gris
//     ✓✓ Lu           → deux ticks bleus (animate-tick-appear avec délai)
//   - Édité : "(modifié)" en italique gris

// RÉACTIONS :
//   - Flottantes sous la bulle, fond sombre arrondi
//   - Hover sur la bulle → apparition bouton "+" pour ajouter
//   - Click emoji → bounce animation + +1 counter
//   - Mes réactions → bulle orange légère

// MENU CONTEXTUEL (long press ou clic droit) :
//   - Répondre | Réagir | Transférer | Copier | Supprimer
//   - Apparition : scale(0.95→1) + fade-in, centré sur le message
//   - Fond : bg-[#1e1e1e] avec blur, border orange subtle
```

### 6. MessageInput — `components/chat/MessageInput.tsx`

```typescript
// Zone de saisie en bas du chat

// LAYOUT :
// [IconeAttach] [Textarea auto-resize] [IconeEmoji] [BoutonEnvoyer/Micro]

// ÉTATS :
// Vide        : bouton micro orange (enregistrement vocal)
// Avec texte  : bouton envoyer orange avec glow + rotation 45° de l'avion

// EFFETS :
// - Container : bg-[#1e1e1e], border-top border-[#2a2a2a]
// - Focus textarea : border orange + glow subtil sur l'input
// - Bouton envoyer : animate-glow-pulse quand prêt
// - Hover bouton : scale(1.1) + shadow orange plus fort

// TEXTAREA :
// - Auto-resize jusqu'à 200px (5 lignes max) puis scroll
// - Placeholder : "Message..." en gris
// - Cmd/Ctrl+Enter pour envoyer (configurable)
// - Enter seul envoie (Shift+Enter = saut de ligne)

// ATTACHEMENTS :
// - Menu slide-up avec options :
//   📷 Photo/Vidéo (react-dropzone)
//   📄 Document
//   👤 Contact
//   📍 Localisation
// - Preview des fichiers avant envoi (thumbnails)
// - Barre de progression upload orange

// EMOJI PICKER :
// - Picker react (emoji-picker-react)
// - Thème dark avec accent orange
// - Apparition : slide-up + fade-in depuis l'icône emoji
// - Fermeture : click ailleurs

// ENREGISTREMENT VOCAL :
// - Click micro → mode enregistrement
// - Visualisation : waveform animée en orange en temps réel
// - Timer qui défile (00:00)
// - Swipe gauche pour annuler (avec animation)
// - Release → envoie le vocal

// REPLY MODE :
// - Bande au-dessus de l'input avec :
//   • Barre orange verticale
//   • Preview du message cité
//   • Bouton X pour annuler
//   • Légère animation slide-down

// TYPING INDICATOR :
// - Déclenche un événement socket à chaque frappe
// - Throttle à 3s (évite le spam réseau)
```

### 7. TypingIndicator — `components/chat/TypingIndicator.tsx`

```typescript
// Apparaît dans la liste de messages quand l'autre tape

// DESIGN :
// - Bulle grise identique aux messages reçus
// - 3 points qui rebondissent avec délais (0ms, 200ms, 400ms)
// - Apparition : animate-bubble-in-left
// - Disparaît avec fade-out après 5s sans événement

// CODE DES DOTS :
// [dot1: animation typingDot delay-0]
// [dot2: animation typingDot delay-200ms]
// [dot3: animation typingDot delay-400ms]
// Couleur des dots : orange-400
```

### 8. MessageList — `components/chat/MessageList.tsx`

```typescript
// Liste virtualisée (react-virtuoso pour les performances)

// FEATURES :
// - Scroll automatique vers le bas pour nouveaux messages
// - Bouton "↓" flottant orange si l'user a scrollé vers le haut
// - Regroupement par date : séparateurs "Aujourd'hui", "Hier", "12 mars 2024"
//   → Fond dark avec texte gris, centré, pill shape
// - Infinite scroll vers le haut pour charger les anciens messages
// - Spinner orange pendant le chargement

// SÉPARATEUR DE DATE :
// bg-[#1a1a1a] rounded-full px-4 py-1 text-xs text-gray-400
// mx-auto sticky top-2 (reste visible pendant le scroll)

// BOUTON SCROLL-TO-BOTTOM :
// - Position fixe bottom-24 right-6
// - Cercle orange avec flèche bas
// - Badge avec nombre de messages non lus
// - Apparition : scale(0→1) fade-in
// - Hover : glow-pulse orange
```

### 9. Avatar — `components/ui/Avatar.tsx`

```typescript
// Composant réutilisable pour tous les avatars

// Props : src, name, size, showOnline, isOnline

// DESIGN :
// - Image circulaire avec fallback initiales (bg orange gradient)
// - Fallback : initiales centrées, gradient orange-600 → orange-400
// - Hover : légère brightness augmentation + scale(1.05)
// - OnlineIndicator : cercle vert absolu bottom-right avec pulsation

// SIZES :
// sm : 32px  (liste messages)
// md : 40px  (sidebar conversations)
// lg : 48px  (header chat)
// xl : 80px  (profil)
```

### 10. NewChatModal — `components/modals/NewChatModal.tsx`

```typescript
// Modal pour créer une nouvelle conversation

// APPARITION :
// - Overlay sombre avec fade-in
// - Modal : slide-up depuis le bas avec spring physics (framer-motion)
// - Fermeture : slide-down + fade-out

// CONTENU :
// [Titre "Nouvelle discussion"]
// [SearchInput avec focus automatique]
// [Liste des utilisateurs filtrés en temps réel]
//   → Item : Avatar + Nom + Email
//   → Hover : bg orange subtle
//   → Click : crée conversation et ouvre le chat

// Pour les groupes :
// [Toggle "Créer un groupe"]
// [Input nom du groupe]
// [Sélection multiple avec checkboxes orange]
// [Bouton "Créer" orange]
```

---

## 🔌 API Routes — Implémentation

### `app/api/conversations/route.ts`

```typescript
// GET /api/conversations
// Retourne toutes les conversations de l'utilisateur connecté
// Inclut : dernierMessage, membres, unreadCount
// Trié par : updatedAt DESC

// POST /api/conversations
// Body : { userId } pour DM ou { name, memberIds } pour groupe
// Vérifie si la conversation DM existe déjà (évite les doublons)
// Retourne la conversation créée ou existante
```

### `app/api/conversations/[id]/messages/route.ts`

```typescript
// GET /api/conversations/[id]/messages
// Query params : cursor (pagination), limit=50
// Retourne messages + pagination cursor
// Marque les messages comme lus (ReadReceipt)

// POST /api/conversations/[id]/messages
// Body : { content, type, mediaUrl, replyToId }
// Crée le message + émet via Socket.io
// Met à jour conversation.updatedAt
```

### `app/api/stream/token/route.ts`

```typescript
import { StreamChat } from 'stream-chat'

// POST /api/stream/token
// Génère un token Stream Chat pour l'utilisateur connecté
// Utilisé pour l'initialisation du client Stream côté front

export async function POST(req) {
  const session = await getServerSession(authOptions)
  const client = StreamChat.getInstance(process.env.STREAM_API_SECRET!)
  const token = client.createToken(session.user.id)
  return Response.json({ token })
}
```

---

## 🔴 Temps Réel — Socket.io

### `lib/socket.ts` (serveur)

```typescript
// Events émis par le serveur :
// 'message:new'         → nouveau message (conversationId, message)
// 'message:updated'     → message modifié (messageId, content)
// 'message:deleted'     → message supprimé (messageId)
// 'message:reaction'    → réaction ajoutée/retirée
// 'message:read'        → messages lus (conversationId, userId, messageIds)
// 'user:typing'         → utilisateur qui tape (conversationId, userId, isTyping)
// 'user:online'         → statut en ligne (userId, isOnline, lastSeen)
// 'conversation:new'    → nouvelle conversation créée

// ROOMS :
// Chaque conversation = une room Socket.io : `conversation:${conversationId}`
// Chaque user = sa propre room : `user:${userId}`
```

### `hooks/useStreamChat.ts`

```typescript
// Initialise le client Stream Chat
// Connecte l'utilisateur au démarrage
// Gère la déconnexion propre
// Retourne : client, channel, loading, error
```

---

## 🎯 Fonctionnalités clés — Liste exhaustive

### Conversations
- [x] Messagerie 1-to-1 (DM)
- [x] Groupes (max 256 membres)
- [x] Recherche de conversations (fuzzy search)
- [x] Archiver une conversation
- [x] Épingler en haut (max 3)
- [x] Couper les notifications
- [x] Effacer l'historique
- [x] Quitter un groupe

### Messages
- [x] Texte riche (liens auto-détectés)
- [x] Emojis (picker + raccourcis :emoji:)
- [x] Images (JPG, PNG, GIF, WebP)
- [x] Vidéos (MP4, WebM)
- [x] Audio / Notes vocales
- [x] Documents (PDF, DOC, XLS...)
- [x] Répondre à un message (reply thread)
- [x] Transférer un message
- [x] Réactions emoji (6 emojis rapides + picker)
- [x] Modifier un message (dans les 15 minutes)
- [x] Supprimer (pour moi / pour tous)
- [x] Messages éphémères (option)
- [x] Coller depuis le presse-papier (images)

### Statuts
- [x] En ligne / Hors ligne
- [x] Dernier vu (avec option de masquer)
- [x] Typing indicator
- [x] Accusé de réception (✓ ✓✓ ✓✓bleu)
- [x] Statut personnalisé

### Recherche
- [x] Recherche dans les messages d'une conversation
- [x] Recherche globale (conversations + messages)
- [x] Recherche d'utilisateurs pour nouveau chat
- [x] Résultats avec highlight du terme recherché

### Médias & Fichiers
- [x] Galerie photo/vidéo par conversation
- [x] Viewer image fullscreen (zoom, pan, partage)
- [x] Lecteur audio intégré avec waveform
- [x] Taille max : 100MB par fichier
- [x] Compression auto des images avant envoi

### Groupes
- [x] Créer groupe avec photo et description
- [x] Ajouter / retirer des membres
- [x] Changer les admins
- [x] Modifier infos du groupe
- [x] Lien d'invitation

### Profil
- [x] Photo de profil (upload + crop)
- [x] Nom, bio, téléphone
- [x] Confidentialité (qui voit quoi)
- [x] Notifications par type

---

## 🌟 Effets "WOW" — Checklist des animations

```
□ Apparition des bulles : spring physics (elastique)
□ Hover conversations : border-left orange slide depuis gauche
□ Bouton envoyer : glow pulse quand actif
□ Emojis seuls : grand format sans bulle (40px)
□ Réactions : bounce animation au click
□ Nouveaux messages non lus : badge pop orange
□ Online indicator : pulse vert continu
□ Typing dots : bounce décalé en orange
□ Transition entre conversations : fade crossfade
□ Modal new chat : spring slide-up depuis bas
□ Scroll to bottom button : pop quand hors vue
□ Image loading : skeleton shimmer orange
□ Envoi message : tick appear animation
□ Ticks lus : changement couleur gris → bleu
□ Mode vocal : waveform temps réel orange
□ Search bar : expand au focus (layout animation)
□ Toast notifications : slide-in depuis la droite
□ Swipe sur mobile pour répondre
□ Sélection multiple messages : checkbox bounce
□ Suppression message : shrink + fade-out
```

---

## 🔐 Authentification — NextAuth

```typescript
// lib/auth.ts
// Provider : Credentials (email + password)
// Session : JWT (stocké côté client)
// Password : bcrypt hash (rounds: 12)

// Flux :
// 1. Login → vérifie email/password → crée session JWT
// 2. Chaque request API → vérifie session via getServerSession
// 3. Middleware protège /app/(chat)/* → redirect vers /login si non connecté
// 4. À la connexion → met isOnline=true + émet socket 'user:online'
// 5. À la déconnexion → met isOnline=false + lastSeen=now()
```

---

## 📱 Responsive (Mobile-first)

```typescript
// MOBILE (< 768px) :
// Sidebar = plein écran (liste conversations)
// Chat window = plein écran (avec bouton retour)
// Navigation : slide entre sidebar et chat
// Input : keyboard-aware (adjust-resize viewport)

// TABLET (768-1024px) :
// Sidebar : 300px
// Chat : reste de l'espace

// DESKTOP (> 1024px) :
// Sidebar : 380px fixe
// Chat : flexible
// Optionnel : panneau info/profil à droite (320px)
```

---

## 🚀 Ordre d'implémentation suggéré pour Cursor

1. **Setup** : Prisma schema + migrations + seed data
2. **Auth** : NextAuth login/register + middleware
3. **Layout** : Shell sidebar + chat (structure HTML/CSS uniquement)
4. **API** : Routes conversations + messages (CRUD basique)
5. **Sidebar** : ConversationList + ConversationItem + animations
6. **Chat basique** : MessageList + MessageBubble (texte simple)
7. **MessageInput** : Envoi texte + auto-resize
8. **Temps réel** : Socket.io server + hooks client
9. **Médias** : Upload (UploadThing) + preview + audio
10. **Effets WOW** : Toutes les animations Tailwind + framer-motion
11. **Stream Chat** : Intégration SDK pour l'infrastructure temps réel
12. **Polish** : Recherche + réactions + reply + profil
```

---

## 💡 Notes importantes pour Cursor

- **N'utilise jamais `use client` inutilement** — Server Components par défaut
- **React Virtuoso** est obligatoire pour MessageList (performances)
- **Framer Motion** pour les animations complexes (Modal, transitions)
- **Tailwind CSS seul** pour tout ce qui est statique (hover, focus, keyframes)
- **Socket.io** doit tourner dans un serveur custom Next.js (`server.ts`)
- **UploadThing** est le plus simple pour les uploads avec Next.js App Router
- **Zustand** pour le state global (conversation active, messages, online users)
- Le background du chat doit avoir un SVG pattern subtil (type grille ou points)
- Les bulles orange doivent avoir `box-shadow: 0 2px 12px rgba(249,115,22,0.35)`
- Toujours ajouter `will-change: transform` sur les éléments animés fréquemment
