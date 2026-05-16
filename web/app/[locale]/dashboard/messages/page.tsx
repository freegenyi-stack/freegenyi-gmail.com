"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Image as ImageIcon, Mic, Paperclip, Smile, Send, Check, CheckCheck } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useChat } from "@/context/ChatContext";

export default function MessagesPage() {
  const { conversations, activeConvId, setActiveConvId, messages, sendMessage } = useChat();
  const [text, setText] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [mediaMenuOpen, setMediaMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const activeConv = conversations.find(c => c.id === activeConvId);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() || !activeConvId) return;
    await sendMessage(text, "text");
    setText("");
    setEmojiOpen(false);
  };

  return (
    <div className="bg-slate-50 h-[calc(100vh-72px)] flex overflow-hidden font-dm-sans selection:bg-orange-600 selection:text-white">
      {/* Sidebar */}
      <div className="w-96 bg-white border-r border-slate-100 flex flex-col shrink-0 relative z-10 shadow-sm">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <h1 className="text-2xl font-black text-slate-900 font-jakarta mb-4">Messagerie</h1>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une discussion..."
              className="w-full bg-white border-2 border-slate-100 rounded-2xl py-2.5 pl-10 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-orange-500 transition-all shadow-sm"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {conversations.map(c => (
            <div
              key={c.id}
              onClick={() => setActiveConvId(c.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border-2 ${activeConvId === c.id ? "border-orange-500 bg-orange-50/50 shadow-md" : "border-transparent hover:bg-slate-50"}`}
            >
              <div className="w-12 h-12 rounded-full bg-slate-200 relative shrink-0 overflow-hidden shadow-sm">
                {c.partnerImage ? <img src={c.partnerImage} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-xl">{c.name?.substring(0,1)}</div>}
                {c.isOnline && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-[2.5px] border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <p className="font-black text-slate-900 truncate">{c.name}</p>
                  {c.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-black flex items-center justify-center shadow-sm">
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

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#f8fafc] relative">
        {activeConvId ? (
          <>
            {/* Header */}
            <div className="h-[88px] bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-200 relative shrink-0 overflow-hidden shadow-sm">
                  {activeConv?.partnerImage ? <img src={activeConv.partnerImage} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-2xl">{activeConv?.name?.substring(0,1)}</div>}
                  {activeConv?.isOnline && <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white" />}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">{activeConv?.name}</h2>
                  <p className="text-xs font-bold text-slate-400">{activeConv?.isOnline ? "En ligne" : "Hors ligne"}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6" ref={scrollRef} style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
              {messages.map((m, i) => {
                const isMe = true; // Replace with proper check against session ID
                return (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] rounded-3xl p-5 shadow-sm ${isMe ? "bg-slate-900 text-white rounded-tr-sm" : "bg-white text-slate-900 border border-slate-100 rounded-tl-sm"}`}>
                      <p className="text-[15px] font-medium leading-relaxed">{m.content}</p>
                      <div className={`flex items-center gap-1.5 justify-end mt-2 text-[10px] font-bold ${isMe ? "text-slate-400" : "text-slate-400"}`}>
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        {isMe && (m.isRead ? <CheckCheck className="w-3.5 h-3.5 text-orange-500" /> : <Check className="w-3.5 h-3.5" />)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-slate-100 shrink-0">
              {emojiOpen && (
                <div className="absolute bottom-28 left-6 z-50 shadow-2xl rounded-2xl overflow-hidden border border-slate-100">
                  <Picker data={data} onEmojiSelect={(emoji: any) => setText(t => t + emoji.native)} theme="light" locale="fr" />
                </div>
              )}
              
              <form onSubmit={handleSend} className="flex items-center gap-4">
                <div className="relative">
                  <button type="button" onClick={() => setMediaMenuOpen(!mediaMenuOpen)} className="w-12 h-12 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100 transition-all border border-slate-200">
                    <Plus className="w-6 h-6" />
                  </button>
                  {mediaMenuOpen && (
                    <div className="absolute bottom-16 left-0 bg-white border border-slate-100 shadow-2xl rounded-3xl p-3 flex flex-col gap-2 w-48 z-50">
                      <button type="button" className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 transition-colors"><ImageIcon className="w-5 h-5 text-blue-500" /> Envoyer une photo</button>
                      <button type="button" className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 transition-colors"><Paperclip className="w-5 h-5 text-orange-500" /> Envoyer un fichier</button>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 bg-slate-50 rounded-[2rem] flex items-center px-4 py-2 border-2 border-slate-100 focus-within:border-orange-500 transition-all">
                  <button type="button" onClick={() => setEmojiOpen(!emojiOpen)} className="p-2 text-slate-400 hover:text-orange-500 transition-colors">
                    <Smile className="w-6 h-6" />
                  </button>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1 bg-transparent py-3 px-3 text-[15px] font-bold outline-none text-slate-700"
                  />
                </div>

                {text ? (
                  <button type="submit" className="w-14 h-14 rounded-full bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 shadow-xl hover:shadow-orange-600/30 transition-all transform hover:scale-105">
                    <Send className="w-6 h-6 ml-1" />
                  </button>
                ) : (
                  <button type="button" className="w-14 h-14 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-all shadow-sm">
                    <Mic className="w-6 h-6" />
                  </button>
                )}
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#f8fafc]">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 font-jakarta mb-2">Vos Messages</h2>
            <p className="text-sm font-bold text-slate-500">Sélectionnez une conversation pour commencer à discuter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
