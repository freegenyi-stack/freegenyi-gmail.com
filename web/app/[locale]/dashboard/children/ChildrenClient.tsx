"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ShieldCheck, Calendar, GraduationCap, X } from "lucide-react";
import { addChildAction, deleteChildAction } from "@/lib/actions/children";
import { toast } from "sonner"; // Assuming sonner is available, if not we'll use a fallback

interface Child {
  id: number;
  fullName: string;
  birthDate: string | null;
  educationLevel: string | null;
  createdAt: Date;
}

export default function ChildrenClient({ 
  initialChildren, 
  locale,
  userName 
}: { 
  initialChildren: Child[], 
  locale: string,
  userName: string 
}) {
  const [children, setChildren] = useState(initialChildren);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const levels = ['Maternelle','CP','CE1','CE2','CM1','CM2','6ème','5ème','4ème','3ème'];

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce profil ?")) return;
    
    const result = await deleteChildAction(id);
    if (result.success) {
      setChildren(children.filter(c => c.id !== id));
      toast.success("Profil supprimé");
    } else {
      toast.error(result.error || "Erreur");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const result = await addChildAction(formData);
    if (result.success) {
      setIsModalOpen(false);
      window.location.reload(); // Re-fetch from server
    } else {
      toast.error(result.error || "Erreur");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-jakarta">
            Mes Petits Génies
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-lg">
            Gérez les profils d'apprentissage de vos enfants.
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all duration-300 shadow-xl hover:shadow-orange-600/20 z-10"
        >
          <Plus className="w-4 h-4" />
          Ajouter un enfant
        </button>
      </div>

      {/* Children Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        <AnimatePresence mode="popLayout">
          {children.map((child, index) => (
            <motion.div
              layout
              key={child.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-slate-50 relative group hover:shadow-[0_40px_100px_rgba(0,0,0,0.06)] transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDelete(child.id)}
                  className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl flex items-center justify-center text-2xl shadow-xl">
                  🦊
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {child.fullName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Profil Actif
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 text-slate-500">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-wider">Niveau</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{child.educationLevel || "Non défini"}</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-wider">Naissance</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">
                    {child.birthDate ? new Date(child.birthDate).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }) : "Non définie"}
                  </span>
                </div>
              </div>

              <button className="w-full bg-white border-2 border-slate-100 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 hover:border-slate-900 transition-all">
                Voir les statistiques
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {children.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold italic">Aucun enfant enregistré pour le moment.</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 md:p-12">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nouvel Enfant</h2>
                    <p className="text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest italic">Créer un profil d'apprentissage</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Prénom</label>
                      <input 
                        name="prenom"
                        type="text" 
                        required
                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-slate-900 transition-all outline-none text-sm font-bold"
                        placeholder="Ex: Lucas"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Nom</label>
                      <input 
                        name="nom"
                        type="text" 
                        required
                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-slate-900 transition-all outline-none text-sm font-bold"
                        placeholder="Ex: Dupont"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Date de naissance</label>
                      <input 
                        name="naissance"
                        type="date" 
                        required
                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-slate-900 transition-all outline-none text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Niveau scolaire</label>
                      <select 
                        name="niveau"
                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-slate-900 transition-all outline-none text-sm font-bold appearance-none cursor-pointer"
                      >
                        {levels.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-slate-950 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all duration-300 shadow-xl hover:shadow-orange-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Création en cours..." : "Créer le profil"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
