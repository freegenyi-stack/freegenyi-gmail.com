"use client";

import React, { useState, useEffect } from "react";
import { Bell, Check, X, Award, MessageCircle, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Notification {
  id: number;
  type: "message" | "achievement" | "system" | "alert";
  title: string;
  content: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Simulated notifications for MVP
  useEffect(() => {
    // In a real app, fetch from /api/notifications
    setNotifications([
      {
        id: 1,
        type: "achievement",
        title: "Nouveau Badge !",
        content: "Adam a obtenu le badge 'Explorateur de l'Espace'.",
        link: "/dashboard/children",
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        type: "system",
        title: "Rapport Hebdomadaire",
        content: "Le rapport d'activité de la semaine est disponible.",
        link: "/dashboard/history",
        isRead: false,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]);
  }, []);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.isRead).length);
  }, [notifications]);

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    // Here we would call API to update status in DB
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "message": return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "achievement": return <Award className="w-5 h-5 text-orange-500" />;
      case "alert": return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-all"
      >
        <span className="flex items-center gap-3">
          <Bell className="w-4 h-4 opacity-50" /> Notifications
        </span>
        {unreadCount > 0 && (
          <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded-full font-bold">{unreadCount}</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-0 right-full mr-2 w-80 bg-white shadow-2xl rounded-2xl border border-slate-100 overflow-hidden z-[300]"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-50 bg-slate-50/50">
              <h3 className="font-black text-slate-900 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-[10px] font-bold text-orange-600 hover:text-orange-700">
                  Tout marquer comme lu
                </button>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <div key={n.id} className={`p-4 border-b border-slate-50 transition-colors ${!n.isRead ? "bg-orange-50/30" : "bg-white hover:bg-slate-50"}`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getIcon(n.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-black truncate ${!n.isRead ? "text-slate-900" : "text-slate-700"}`}>{n.title}</p>
                        {n.content && <p className="text-[11px] font-medium text-slate-500 mt-0.5 leading-snug">{n.content}</p>}
                        <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-wider">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!n.isRead && (
                        <button onClick={() => markAsRead(n.id)} className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center hover:bg-green-100 hover:text-green-600 text-slate-400 transition-colors">
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold">Aucune notification</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
