import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, BookOpen, Zap, ArrowLeft } from "lucide-react";
import PortalClient from "./PortalClient";

export default async function PortalPage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale, type } = await params;

  const portalData: Record<string, any> = {
    local: {
      title: "Mon École",
      description: "Révise tes leçons de classe en t’amusant. Tes devoirs deviennent des aventures !",
      icon: <BookOpen className="w-16 h-16" />,
      color: "bg-blue-600",
      themeColor: "#2563eb",
      glowColor: "rgba(37,99,235,0.3)",
      buttonLabel: "Accéder à mes cours"
    },
    world: {
      title: "Le Monde",
      description: "Singapour, Oxford et bien d'autres défis internationaux t'attendent pour devenir un citoyen du monde.",
      icon: <Globe className="w-16 h-16" />,
      color: "bg-orange-600",
      themeColor: "#ea580c",
      glowColor: "rgba(234,88,12,0.3)",
      buttonLabel: "Découvrir le monde"
    },
    magic: {
      title: "L’Arène",
      description: "Jeux de logique, calcul mental ultra-rapide et compétitions magiques contre d'autres génies.",
      icon: <Zap className="w-16 h-16" />,
      color: "bg-teal-600",
      themeColor: "#0d9488",
      glowColor: "rgba(13,148,136,0.3)",
      buttonLabel: "Entrer dans l'arène"
    }
  };

  const portal = portalData[type] || portalData.world;

  return (
    <div className="min-h-screen flex items-center justify-center p-8 text-white relative overflow-hidden bg-[#020617] font-dm-sans">
      <PortalClient portal={portal} locale={locale} />
    </div>
  );
}
