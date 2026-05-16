"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import * as Ably from "ably";

// Types
export interface Message {
  id: number;
  senderId: number;
  messageType: "text" | "image" | "audio" | "file";
  content: string | null;
  mediaUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: number;
  type: "direct" | "group" | "ai";
  name: string | null;
  isOnline?: boolean;
  lastLoginAt?: string | null;
  unreadCount: number;
  lastMessage: string | null;
  partnerId?: number;
  partnerImage?: string | null;
  partnerName?: string | null;
}

interface ChatContextProps {
  isPanelOpen: boolean;
  setIsPanelOpen: (isOpen: boolean) => void;
  openChat: (convId?: number, userId?: number) => void;
  conversations: Conversation[];
  activeConvId: number | null;
  setActiveConvId: (id: number | null) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sendMessage: (content: string, type?: "text"|"image"|"audio"|"file", mediaUrl?: string) => Promise<void>;
  ablyClient: Ably.Realtime | null;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [ablyClient, setAblyClient] = useState<Ably.Realtime | null>(null);

  // Initialize Ably
  useEffect(() => {
    if (!session?.user?.email) return;

    // We fetch a token from our API
    const client = new Ably.Realtime({ authUrl: "/api/chat/ably-auth" });
    setAblyClient(client);

    return () => {
      try {
        if (client.connection.state !== "closed" && client.connection.state !== "closing" && client.connection.state !== "failed") {
          client.close();
        }
      } catch (e) {
        console.warn("Ably close error:", e);
      }
    };
  }, [session]);

  // Fetch initial conversations
  const fetchConversations = async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/chat/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchConversations();
  }, [session]);

  // Subscribe to user's private channel for incoming messages
  useEffect(() => {
    if (!ablyClient || !session?.user) return;
    
    // Assuming user email is used as an identifier, or we can use ID if we had it in session.
    // Let's assume we can subscribe to a generic "user-[email]" channel
    const channelName = `user-${session.user.email?.replace(/[^a-zA-Z0-9]/g, "_")}`;
    const channel = ablyClient.channels.get(channelName);

    channel.subscribe("new_message", (msg) => {
      const newMsg = msg.data as Message;
      // If the message belongs to the active conversation, add it
      if (activeConvId === msg.data.conversationId) {
        setMessages((prev) => [...prev, newMsg]);
        // Also mark as read
      }
      
      // Update conversations list (last message, unread count if not active)
      setConversations((prev) => prev.map(c => {
        if (c.id === msg.data.conversationId) {
          return {
            ...c,
            lastMessage: newMsg.messageType === "text" ? newMsg.content : `[${newMsg.messageType}]`,
            unreadCount: activeConvId === c.id ? c.unreadCount : c.unreadCount + 1
          };
        }
        return c;
      }));
    });

    return () => {
      channel.unsubscribe();
    };
  }, [ablyClient, session, activeConvId]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages?convId=${activeConvId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
          // Clear unread count for this conv
          setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, unreadCount: 0 } : c));
        }
      } catch (e) {}
    };
    fetchMessages();
  }, [activeConvId]);

  // Listen to open-chat custom events from anywhere (e.g. Header)
  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      setIsPanelOpen(true);
      const detail = (e as CustomEvent).detail;
      if (detail?.convId) {
        setActiveConvId(detail.convId);
      } else if (detail?.userId || detail?.type) {
        openChat(undefined, detail.userId, detail.type, detail.name);
      }
    };
    window.addEventListener("open-chat", handleOpenChat);
    return () => window.removeEventListener("open-chat", handleOpenChat);
  }, []);

  const openChat = async (convId?: number, userId?: number, type: "direct"|"group"|"ai" = "direct", name?: string) => {
    setIsPanelOpen(true);
    if (convId) {
      setActiveConvId(convId);
    } else if (userId || type === "ai") {
      // Create or get direct conversation
      try {
        const res = await fetch("/api/chat/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ partnerId: userId, type, name })
        });
        if (res.ok) {
          const data = await res.json();
          fetchConversations();
          setActiveConvId(data.conversationId);
        }
      } catch (e) {}
    }
  };

  const sendMessage = async (content: string, type: "text"|"image"|"audio"|"file" = "text", mediaUrl?: string) => {
    if (!activeConvId) return;
    
    // Optimistic UI could be added here
    
    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeConvId, content, messageType: type, mediaUrl })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data.message]);
        setConversations((prev) => prev.map(c => c.id === activeConvId ? { ...c, lastMessage: type === "text" ? content : `[${type}]` } : c));
      }
    } catch (e) {}
  };

  return (
    <ChatContext.Provider value={{
      isPanelOpen, setIsPanelOpen, openChat, conversations, activeConvId, setActiveConvId, messages, setMessages, sendMessage, ablyClient
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
