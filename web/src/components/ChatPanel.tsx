"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Plus, Image as ImageIcon, Mic, Paperclip, Smile, Send, Check, CheckCheck } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useChat } from "@/context/ChatContext";
import { useSession } from "next-auth/react";

export default function ChatPanel() {
  const { data: session } = useSession();
  const { isPanelOpen, setIsPanelOpen, conversations, activeConvId, setActiveConvId, messages, sendMessage } = useChat();
  const [text, setText] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [mediaMenuOpen, setMediaMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isPanelOpen) return null;

  const activeConv = conversations.find(c => c.id === activeConvId);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() || !activeConvId) return;
    await sendMessage(text, "text");
    setText("");
    setEmojiOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[500]"
        onClick={() => setIsPanelOpen(false)}
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white shadow-2xl z-[501] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            {activeConvId && (
              <button onClick={() => setActiveConvId(null)} className="text-slate-400 hover:text-slate-900 mr-2">
                &larr;
              </button>
            )}
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {activeConvId ? activeConv?.name : "Messagerie"}
            </h2>
          </div>
          <button onClick={() => setIsPanelOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {!activeConvId ? (
            // Conversation List
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>
              <div className="px-2">
                {conversations.map(c => (
                  <div
                    key={c.id}
                    onClick={() => setActiveConvId(c.id)}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-200 relative shrink-0 overflow-hidden">
                      {c.partnerImage && <img src={c.partnerImage} alt="" className="w-full h-full object-cover" />}
                      {c.isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="font-black text-slate-900 truncate">{c.name}</p>
                        {c.unreadCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-black flex items-center justify-center">
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-slate-500 truncate">{c.lastMessage || "Nouvelle conversation"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Active Conversation
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map(m => {
                  // VERY basic session mapping
                  const isMe = true; // Replace with proper check against session ID
                  return (
                    <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl p-3 ${isMe ? "bg-orange-600 text-white rounded-tr-sm" : "bg-slate-100 text-slate-900 rounded-tl-sm"}`}>
                        <p className="text-sm font-medium">{m.content}</p>
                        <div className={`flex items-center gap-1 justify-end mt-1 text-[10px] ${isMe ? "text-orange-200" : "text-slate-400"}`}>
                          <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          {isMe && (m.isRead ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-slate-100 bg-white">
                {emojiOpen && (
                  <div className="absolute bottom-20 right-4 z-50 shadow-2xl rounded-xl overflow-hidden border border-slate-100">
                    <Picker data={data} onEmojiSelect={(emoji: any) => setText(t => t + emoji.native)} theme="light" locale="fr" />
                  </div>
                )}
                
                <form onSubmit={handleSend} className="flex items-end gap-2">
                  <div className="relative">
                    <button type="button" onClick={() => setMediaMenuOpen(!mediaMenuOpen)} className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100 transition-all">
                      <Plus className="w-5 h-5" />
                    </button>
                    {mediaMenuOpen && (
                      <div className="absolute bottom-12 left-0 bg-white border border-slate-100 shadow-xl rounded-2xl p-2 flex flex-col gap-1 w-40 z-50">
                        <button type="button" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700"><ImageIcon className="w-4 h-4 text-blue-500" /> Photo</button>
                        <button type="button" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700"><Paperclip className="w-4 h-4 text-orange-500" /> Fichier</button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 bg-slate-50 rounded-2xl flex items-center px-2 py-1 border border-slate-200 focus-within:border-orange-500 transition-all">
                    <button type="button" onClick={() => setEmojiOpen(!emojiOpen)} className="p-2 text-slate-400 hover:text-orange-500">
                      <Smile className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Votre message..."
                      className="flex-1 bg-transparent py-2 px-1 text-sm font-bold outline-none text-slate-700"
                    />
                    {text ? (
                      <button type="submit" className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 shadow-md">
                        <Send className="w-4 h-4 ml-0.5" />
                      </button>
                    ) : (
                      <button type="button" className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-all">
                        <Mic className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}
