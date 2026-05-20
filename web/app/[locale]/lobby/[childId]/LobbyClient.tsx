"use client";

import { Link } from "@/i18n/routing";
import React from "react";

import { motion } from "framer-motion";
import { Globe, BookOpen, Zap, ArrowRight, Home } from "lucide-react";

interface Child {
  id: number;
  fullName: string;
}

interface Stats {
  xp: number;
  level: number;
  progress: number;
}

export default function LobbyClient({ 
  child, 
  locale, 
  stats 
}: { 
  child: Child, 
  locale: string, 
  stats: Stats 
}) {
  const childFirstName = child.fullName.split(" ")[0];

  const portals = [
    {
      title: "Mon École",
      description: "Révise tes leçons de classe en t’amusant.",
      icon: <BookOpen className="w-16 h-16" />,
      color: "bg-blue-600",
      textColor: "text-blue-400",
      descColor: "text-blue-300/60",
      shadow: "shadow-[0_20px_50px_rgba(37,99,235,0.3)]",
      gradient: "from-blue-600/10",
      href: "/portal/local",
      hoverRotate: "group-hover:rotate-6"
    },
    {
      title: "Le Monde",
      description: "Explore Singapour, Oxford et relève des défis mondiaux !",
      icon: <Globe className="w-20 h-20" />,
      color: "bg-orange-600",
      textColor: "text-orange-500",
      descColor: "text-orange-200/60",
      shadow: "shadow-[0_25px_60px_rgba(234,88,12,0.4)]",
      gradient: "from-orange-600/10",
      href: "/portal/world",
      scale: "md:scale-110",
      isFeatured: true,
      hoverRotate: "group-hover:-rotate-6"
    },
    {
      title: "L’Arène",
      description: "Jeux de logique et compétitions magiques.",
      icon: <Zap className="w-16 h-16" />,
      color: "bg-teal-600",
      textColor: "text-teal-400",
      descColor: "text-teal-300/60",
      shadow: "shadow-[0_20px_50px_rgba(13,148,136,0.3)]",
      gradient: "from-teal-600/10",
      href: "/portal/magic",
      hoverRotate: "group-hover:rotate-12"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative selection:bg-orange-600 selection:text-white">
      
      {/* Nebula Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-30 overflow-hidden">
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full"
        />
        <motion.div 
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-orange-600/20 blur-[150px] rounded-full"
        />
      </div>

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 p-8 flex justify-between items-center z-50">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <div className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 flex items-center justify-center shadow-2xl">
            <span className="text-3xl">🦊</span>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight font-jakarta">Salut, {childFirstName} !</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                {stats.xp.toLocaleString()} XP
              </span>
              <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-orange-600 shadow-[0_0_10px_#ea580c]"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link 
            href="/dashboard/parent"
            className="bg-white/5 backdrop-blur-xl px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-3"
          >
            <Home className="w-4 h-4" />
            Dashboard Parent
          </Link>
        </motion.div>
      </header>

      {/* Portal Grid */}
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10 py-24">
        {portals.map((portal, index) => (
          <motion.div
            key={portal.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Link 
              href={portal.href}
              className={`group relative block h-full bg-white/5 backdrop-blur-2xl border ${portal.isFeatured ? 'border-white/20' : 'border-white/10'} rounded-[4rem] p-12 text-center overflow-hidden transition-all duration-500 hover:-translate-y-4 hover:scale-[1.02] ${portal.scale || ''} ${portal.isFeatured ? 'shadow-3xl' : 'shadow-2xl'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${portal.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className={`w-32 h-32 md:w-auto md:h-auto md:aspect-square flex items-center justify-center mx-auto mb-10 transition-all duration-700 ${portal.color} ${portal.isFeatured ? 'rounded-[3rem] p-10' : 'rounded-[2.5rem] p-8'} ${portal.shadow} ${portal.hoverRotate}`}>
                {portal.icon}
              </div>

              <h2 className={`text-3xl font-black mb-4 tracking-tighter font-jakarta ${portal.isFeatured ? 'text-4xl text-orange-400' : ''}`}>
                {portal.title}
              </h2>
              
              <p className={`${portal.descColor} font-light text-sm leading-relaxed mb-8 max-w-[200px] mx-auto`}>
                {portal.description}
              </p>

              <div className={`inline-flex items-center gap-2 ${portal.textColor} font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all`}>
                <span>{index === 2 ? "Prêt à jouer ?" : index === 1 ? "Découvrir" : "Partir à l'aventure"}</span>
                <ArrowRight className="w-4 h-4 stroke-[3px]" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Mascot Message Box */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-10 max-w-2xl bg-white/5 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 flex items-center gap-8 shadow-3xl mx-4"
      >
        <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
          <span className="text-4xl">🦊</span>
        </div>
        <div>
          <p className="text-slate-300 font-light leading-relaxed italic">
            "Alors <span className="text-orange-600 font-black">{childFirstName}</span>, prêt pour une nouvelle aventure ? N’oublie pas de vérifier ton <span className="bg-orange-600/20 px-2 py-1 rounded text-orange-500 font-bold not-italic">Boost vocal</span> envoyé par tes parents !"
          </p>
        </div>
      </motion.div>
    </div>
  );
}
