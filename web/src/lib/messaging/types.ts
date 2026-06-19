export type MessagingRole = "parent" | "coparent" | "enseignant" | "ecole" | "ong";



export type ChatUserPreview = {

  id: number;

  fullName: string | null;

  username: string | null;

  role: string | null;

  image: string | null;

  isOnline: boolean;

  lastSeenAt?: string | null;

};



export type ConversationPreview = {

  id: number;

  type: string;

  otherUser: ChatUserPreview | null;

  channelMeta?: {

    slug: string;

    key: string;

    section: string;

    labelKey: string;

  };

  lastMessage: {

    id: number;

    content: string;

    messageType?: string | null;

    mediaUrl?: string | null;

    senderId: number;

    senderName?: string | null;

    createdAt: string;

    isMine: boolean;

  } | null;

  unreadCount: number;

  muted?: boolean;

  updatedAt: string;

};



export type ChatMessageType = "text" | "image" | "file" | "video" | "audio" | "voice";



export type ReplyPreview = {

  id: number;

  senderName: string | null;

  content: string;

  messageType?: ChatMessageType;

  mediaUrl?: string | null;

  isDeleted?: boolean;

};



export type ChatMessageDto = {

  id: number;

  conversationId: number;

  senderId: number;

  senderName?: string | null;

  senderRole?: string | null;

  content: string;

  messageType?: ChatMessageType;

  mediaUrl?: string | null;

  mediaBlocked?: boolean;

  editedAt?: string | null;

  createdAt: string;

  isMine: boolean;

  isRead: boolean;
  isHidden?: boolean;

  reactions?: Record<string, number[]>;

  replyTo?: ReplyPreview | null;

  pinnedAt?: string | null;

};



export type SendMessageOptions = {

  mediaUrl?: string;

  messageType?: ChatMessageType;

  fileName?: string;

  broadcast?: boolean;

  locale?: string;

  replyToMessageId?: number;

};



export type MessageSuggestionDto = {

  id: number;

  targetUser: ChatUserPreview;

  reasonKey: string;

  reasonParams: Record<string, string>;

  reasonLabel: string;

};



export type SuggestionReasonKey =

  | "teacher_of_child"

  | "parent_at_school"

  | "colleague_teacher"

  | "family_ally";

