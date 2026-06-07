"use client";

import { Link } from "@/i18n/routing";
import React, { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Printer, 
  BookOpen, 
  Sparkles, 
  Lock, 
  ArrowRight, 
  GraduationCap, 
  Download, 
  Compass, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { useLocale } from "next-intl";

// Mock available guest resources
const SAMPLE_WORKSHEETS = [
  {
    id: "math-1ap",
    subject: "Mathématiques",
    subjectAr: "الرياضيات",
    title: "Les Nombres de 1 à 10 & Additions Graphiques",
    titleAr: "الأعداد من 1 إلى 10 والجمع بالصور",
    level: "1AP",
    pages: 4,
    downloads: 1240,
    difficulty: "Basique",
    difficultyAr: "أساسي"
  },
  {
    id: "ar-1ap",
    subject: "Langue Arabe",
    subjectAr: "اللغة العربية",
    title: "Lettres de l'Alphabet & Vocabulaire Illustré",
    titleAr: "حروف الهجاء والكلمات المصورة الأولى",
    level: "1AP",
    pages: 6,
    downloads: 980,
    difficulty: "Basique",
    difficultyAr: "أساسي"
  },
  {
    id: "math-2ap",
    subject: "Mathématiques",
    subjectAr: "الرياضيات",
    title: "Géométrie Simple & Tables d'Addition",
    titleAr: "الأشكال الهندسية البسيطة وجداول الجمع",
    level: "2AP",
    pages: 5,
    downloads: 1560,
    difficulty: "Moyen",
    difficultyAr: "متوسط"
  },
  {
    id: "ar-2ap",
    subject: "Langue Arabe",
    subjectAr: "اللغة العربية",
    title: "Lecture Fluide & Dictée Préparée",
    titleAr: "القراءة السلسة والإملاء الموجه",
    level: "2AP",
    pages: 4,
    downloads: 1120,
    difficulty: "Moyen",
    difficultyAr: "متوسط"
  },
  {
    id: "singapore-3ap",
    subject: "Singapore Math",
    subjectAr: "رياضيات سنغافورة",
    title: "Méthode Singapour: Modélisation en Barres",
    titleAr: "طريقة سنغافورة: النمذجة بالأشرطة",
    level: "3AP",
    pages: 8,
    downloads: 2450,
    difficulty: "Avancé",
    difficultyAr: "متقدم"
  }
];

const LOCALIZED_LEVELS: Record<string, { fr: string; ar: string }> = {
  "1AP": { fr: "1ère Année Primaire", ar: "السنة الأولى ابتدائي" },
  "2AP": { fr: "2ème Année Primaire", ar: "السنة الثانية ابتدائي" },
  "3AP": { fr: "3ème Année Primaire", ar: "السنة الثالثة ابتدائي" },
  "4AP": { fr: "4ème Année Primaire", ar: "السنة الرابعة ابتدائي" },
  "5AP": { fr: "5ème Année Primaire", ar: "السنة الخامسة ابتدائي" }
};

export default function GuestDashboard() {
  const locale = useLocale();
  const isRTL = (locale === "ar" || locale.endsWith("-ar"));
  
  const [selectedLevel, setSelectedLevel] = useState<string>("1AP");
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [downloadedCount, setDownloadedCount] = useState<number>(0);
  const [showSignupModal, setShowSignupModal] = useState<boolean>(false);

  const handleDownload = (id: string) => {
    setIsGenerating(id);
    // Simulate high-end PDF rendering delay
    setTimeout(() => {
      setIsGenerating(null);
      setDownloadedCount(prev => prev + 1);
      
      // Simple mock download
      const link = document.createElement("a");
      link.href = "#";
      link.setAttribute("download", `freegeny_sample_${id}.pdf`);
      // Since it's a mock, we just trigger toast or popup modal on second download to convert
      if (downloadedCount >= 1) {
        setShowSignupModal(true);
      } else {
        alert(isRTL ? "تم توليد وتحميل دفتر التمارين بنجاح!" : "Votre cahier d'exercices a été généré et téléchargé avec succès !");
      }
    }, 2200);
  };

  const filteredWorksheets = SAMPLE_WORKSHEETS.filter(w => w.level === selectedLevel);

  return (
    <div className="min-h-full bg-slate-50/50 pb-24 font-dm-sans" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        
        {/* Ambient background glows */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-200/30 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-emerald-100/20 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Hero Guest Welcome Card */}
        <div className="bg-slate-900 rounded-[3rem] text-white p-8 md:p-12 mb-12 shadow-[0_50px_100px_rgba(15,23,42,0.15)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-600/30 via-slate-950/20 to-slate-950/90 -z-10" />
          
          <div className="max-w-2xl relative z-10">
            <div className={`inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Compass className="w-4 h-4 text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                {isRTL ? "مساحة الاستكشاف الحر" : "Espace Exploration Libre"}
              </span>
            </div>
            
            <h1 className={`text-3xl md:text-5xl font-black tracking-tight mb-4 uppercase font-jakarta leading-tight`}>
              {isRTL ? (
                <>حضّروا أوراق مراجعة <span className="text-orange-500">فائقة الدقة</span> لأطفالكم</>
              ) : (
                <>Générez des fiches de révision <span className="text-orange-500">sur-mesure</span></>
              )}
            </h1>
            
            <p className={`text-slate-300 text-sm md:text-base leading-relaxed font-light mb-8 max-w-xl`}>
              {isRTL ? (
                "اختر مستوى طفلك، استعرض نماذج التمارين التعليمية المنتقاة بعناية، وقم بتوليد دفاتر مراجعة PDF جاهزة للطباعة فوراً بدون أي التزام."
              ) : (
                "Choisissez le niveau de votre enfant, consultez nos modèles de fiches d'exercices d'excellence, et générez des cahiers PDF prêts à être imprimés instantanément et gratuitement."
              )}
            </p>

            <div className={`flex flex-wrap items-center gap-6 text-xs text-slate-300 font-bold border-t border-white/10 pt-6 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isRTL ? "منهج جزائري رسمي" : "Programme Officiel Algérien"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isRTL ? "رياضيات سنغافورة الفائقة" : "Singapour Math Excellence"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isRTL ? "طباعة فورية عالية الجودة" : "PDFs Haute Résolution"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Level Selection Switcher */}
        <div className="mb-12">
          <p className={`text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ${isRTL ? "text-right" : "text-left"}`}>
            {isRTL ? "اختر المستوى الدراسي للطفل" : "Sélectionnez le niveau d'apprentissage"}
          </p>
          <div className={`flex flex-wrap gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            {Object.keys(LOCALIZED_LEVELS).map((lvl) => {
              const info = LOCALIZED_LEVELS[lvl];
              const isActive = selectedLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-wider transition-all duration-300 flex items-center gap-2 shadow-sm ${
                    isActive 
                      ? "bg-slate-900 text-white shadow-xl scale-102" 
                      : "bg-white border border-slate-100 text-slate-500 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  <GraduationCap className={`w-4 h-4 ${isActive ? "text-orange-500" : "text-slate-400"}`} />
                  <span>{isRTL ? info.ar : info.fr}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Worksheets Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {filteredWorksheets.length > 0 ? (
            filteredWorksheets.map((sheet) => {
              const isDownloading = isGenerating === sheet.id;
              return (
                <div 
                  key={sheet.id}
                  className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 hover:shadow-xl transition-all duration-500 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle hover gradient decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                  <div>
                    <div className={`flex justify-between items-center mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <span className="bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl">
                        {isRTL ? sheet.subjectAr : sheet.subject}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        📄 {sheet.pages} {isRTL ? "صفحات" : "Pages"}
                      </span>
                    </div>

                    <h3 className={`text-xl font-black text-slate-900 mb-2 leading-tight ${isRTL ? "text-right" : "text-left"}`}>
                      {isRTL ? sheet.titleAr : sheet.title}
                    </h3>
                    
                    <p className={`text-xs text-slate-400 mb-6 ${isRTL ? "text-right" : "text-left"}`}>
                      {isRTL 
                        ? `مستوى: ${LOCALIZED_LEVELS[sheet.level].ar} · الصعوبة: ${sheet.difficultyAr}` 
                        : `Niveau: ${LOCALIZED_LEVELS[sheet.level].fr} · Difficulté: ${sheet.difficulty}`
                      }
                    </p>
                  </div>

                  <div className={`flex items-center justify-between border-t border-slate-50 pt-6 mt-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                      📥 {sheet.downloads} {isRTL ? "تحميل" : "téléchargements"}
                    </span>
                    
                    <button
                      onClick={() => handleDownload(sheet.id)}
                      disabled={isGenerating !== null}
                      className="bg-slate-950 hover:bg-orange-600 text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 group-hover:shadow-lg disabled:opacity-50"
                    >
                      {isDownloading ? (
                        <>
                          <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                          <span>{isRTL ? "جاري التوليد..." : "Génération..."}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>{isRTL ? "تحميل فوري" : "Imprimer"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 bg-white rounded-[2rem] border border-slate-100 p-12 text-center">
              <span className="text-4xl mb-4 block">📚</span>
              <h4 className="text-lg font-black text-slate-800 mb-2">
                {isRTL ? "جاري إعداد تمارين إضافية" : "Fiches en cours de préparation"}
              </h4>
              <p className="text-xs text-slate-400">
                {isRTL 
                  ? "نقوم حالياً برفع تمارين متطورة ومطابقة لهذا المستوى. يرجى مراجعة المستوى الأول والثاني!"
                  : "Nos enseignants rédigent actuellement de superbes fiches adaptées à ce niveau. Explorez le niveau 1 et 2 !"
                }
              </p>
            </div>
          )}
        </div>

        {/* Lock Banner / Call-to-action */}
        <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-8 md:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-inner">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-800 shadow-sm shrink-0">
              <Lock className="w-8 h-8 text-orange-600" />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase font-jakarta tracking-tight">
                {isRTL ? "افتحوا 100% من قدرات طفلكم" : "Débloquez 100% du potentiel"}
              </h3>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-xl">
                {isRTL ? (
                  "الحساب المجاني يتيح لكم: تتبع ذكي لنقاط القوة والضعف، إرسال رسائل تشجيعية بصوتكم للطفل، تخصيص مسارات ذكاء اصطناعي فورية، وتوليد مطبوعات غير محدودة."
                ) : (
                  "Créez un compte gratuit pour suivre la progression de votre enfant, lui envoyer des boosts vocaux encourageants, laisser notre IA réajuster le niveau en temps réel, et générer des dossiers imprimés illimités !"
                )}
              </p>
            </div>
          </div>
          <Link href="/auth/register" className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl hover:shadow-orange-200 shrink-0 flex items-center gap-2 group">
            {isRTL ? "احصل على حساب مجاني" : "Créer mon cockpit gratuit"}
            <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isRTL ? "rotate-180" : ""}`} />
          </Link>
        </div>

      </div>

      {/* Conversion modal when downloaded >= 2 resources */}
      <AnimatePresence>
        {showSignupModal && (
          <div className="fixed inset-0 bg-slate-950/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-lg w-full shadow-2xl relative border border-slate-100"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mx-auto mb-6">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-3 uppercase font-jakarta tracking-tight">
                  {isRTL ? "أكمل التسجيل للاستمرار" : "Complétez votre inscription"}
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  {isRTL ? (
                    "لقد استعملت رصيدك من التحميلات المجانية كزائر! أنشئ حسابك المجاني في 10 ثوانٍ فقط للاستمرار في تحميل وطباعة تمارين دقيقة وغير محدودة."
                  ) : (
                    "Vous avez utilisé votre quota d'impressions gratuites en mode découverte ! Créez votre compte en 10 secondes chrono pour débloquer le téléchargement illimité."
                  )}
                </p>

                <div className="flex flex-col gap-3">
                  <Link href="/auth/register" className="bg-slate-900 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2 group">
                    {isRTL ? "إنشاء حساب مجاني" : "Créer un compte gratuit"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </Link>
                  <button 
                    onClick={() => setShowSignupModal(false)}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-500 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all"
                  >
                    {isRTL ? "العودة للنافذة السابقة" : "Revenir plus tard"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
