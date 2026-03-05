"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Globe,
    Search,
    ArrowRight,
    Sparkles,
    Plus,
    Check,
    Info,
    ChevronRight,
    Star
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger
} from "@/components/ui/dialog"

const OTHER_PROGRAMS = [
    {
        id: "fr-cp",
        country: "فرنسا",
        flag: "🇫🇷",
        name: "المنهاج الوطني الفرنسي",
        level: "CP (6-7 سنوات)",
        subjects: ["القراءة المعبرة", "رياضيات سنغافورة", "العلوم", "لغة إنجليزية مبكرة"],
        strength: "تركيز قوي على القراءة والرياضيات الملموسة.",
        rating: 4.8
    },
    {
        id: "qc-1",
        country: "كندا",
        flag: "🇨🇦",
        name: "منهاج كيبك",
        level: "السنة الأولى المشتركة",
        subjects: ["لغة فرنسية", "العالم الاجتماعي", "الفنون البصرية", "الإدراك المكاني"],
        strength: "مقاربة مبنية على المشاريع والكفاءات العرضية.",
        rating: 4.9
    },
    {
        id: "ib-pyp",
        country: "دولي",
        flag: "🌐",
        name: "برنامج السنوات الابتدائية IB",
        level: "3-12 سنة",
        subjects: ["التعلم القائم على الاستقصاء", "الكفاءات العابرة للتخصصات", "نظرة عالمية"],
        strength: "تطوير التفكير النقدي والفضول الفكري العالمي.",
        rating: 5.0
    }
]

export function CurriculumDiscovery() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedProgram, setSelectedProgram] = useState<typeof OTHER_PROGRAMS[0] | null>(null)

    const filteredPrograms = OTHER_PROGRAMS.filter(p =>
        p.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <section className="mt-12 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                        <Globe className="w-6 h-6 text-primary" />
                        World Curriculum Explorer
                    </h2>
                    <p className="text-slate-500 text-xs font-medium">
                        زود طفلك بأفضل المعايير التعليمية عالمياً.
                    </p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <Input
                        placeholder="ابحث عن بلد أو برنامج..."
                        className="pl-9 h-9 text-xs rounded-xl border-slate-200 focus:ring-primary/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence>
                    {filteredPrograms.map((program, idx) => (
                        <motion.div
                            key={program.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group relative bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="text-3xl">{program.flag}</div>
                                <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 rounded-full">
                                    <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-[9px] font-bold">{program.rating}</span>
                                </div>
                            </div>

                            <div className="space-y-1 mb-5">
                                <h4 className="text-[9px] font-bold tracking-widest text-primary uppercase">{program.country}</h4>
                                <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">{program.name}</h3>
                                <p className="text-[10px] text-slate-400 font-medium">{program.level}</p>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mb-6">
                                {program.subjects.slice(0, 3).map(s => (
                                    <Badge key={s} variant="secondary" className="bg-slate-50 text-[9px] px-2 py-0 rounded-md border-0 text-slate-500">
                                        {s}
                                    </Badge>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-[10px] font-bold gap-1.5 text-slate-500 hover:text-primary"
                                        >
                                            <Info className="w-3.5 h-3.5" /> التفاصيل
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="rounded-[2rem] sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2 text-xl font-bold mt-2">
                                                <span>{program.flag}</span>
                                                {program.name}
                                            </DialogTitle>
                                            <DialogDescription className="text-slate-500 text-xs font-medium pt-1">
                                                {program.strength}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4 space-y-5">
                                            <div className="space-y-2">
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">الكفاءات الأساسية</h4>
                                                <div className="grid grid-cols-1 gap-1.5">
                                                    {program.subjects.map(s => (
                                                        <div key={s} className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl group hover:bg-primary/5 transition-colors">
                                                            <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                                                                <Check className="w-3 h-3 text-emerald-500" />
                                                            </div>
                                                            <span className="text-xs font-bold text-slate-700">{s}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-br from-primary to-indigo-600 p-5 rounded-2xl text-white space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-yellow-300" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">ميزة FreeGeny</span>
                                                </div>
                                                <p className="text-[11px] font-medium leading-relaxed opacity-90">
                                                    بتفعيل هذه الوحدة، سنقدم لطفلك أنشطة مبنية على معايير {program.country} لإثراء مساره الحالي ({program.level}).
                                                </p>
                                                <Button className="w-full h-9 bg-white text-primary hover:bg-slate-50 text-xs font-bold rounded-xl">
                                                    تفعيل المسار المشترك
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <Button
                                    size="sm"
                                    className="h-8 rounded-lg px-3 text-[10px] font-bold bg-slate-900 hover:bg-primary transition-all"
                                >
                                    استكشف <ChevronRight className="w-3 h-3 ml-0.5" />
                                </Button>
                            </div>

                            {/* Hover highlight line */}
                            <div className="absolute bottom-0 left-12 right-12 h-1 bg-primary rounded-t-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-8 text-center group cursor-pointer hover:border-primary/40 transition-colors">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-slate-100 text-slate-300 mb-3 group-hover:border-primary/20 group-hover:text-primary transition-all">
                    <Plus className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">هل البرنامج غير مدرج؟</h3>
                <p className="text-[11px] text-slate-400 font-medium max-w-[240px] mx-auto mt-1">
                    نضيف مناهج جديدة أسبوعياً. اطلب برنامجاً معيناً.
                </p>
            </div>
        </section>
    )
}
