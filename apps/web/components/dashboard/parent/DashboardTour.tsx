"use client"

import React, { useEffect, useRef } from 'react'
import { driver } from "driver.js"
import "driver.js/dist/driver.css"
import { Button } from '@/components/ui/button'
import { HelpCircle } from 'lucide-react'

interface DashboardTourProps {
    isArabic: boolean
}

export function DashboardTour({ isArabic }: DashboardTourProps) {
    const driverRef = useRef<any>(null)

    useEffect(() => {
        driverRef.current = driver({
            showProgress: true,
            animate: true,
            allowClose: true,
            overlayColor: "rgba(0, 0, 0, 0.75)",
            nextBtnText: isArabic ? 'التالي' : 'Suivant',
            prevBtnText: isArabic ? 'السابق' : 'Précédent',
            doneBtnText: isArabic ? 'تم' : 'Terminer',
            steps: [
                {
                    element: '.tour-welcome-banner',
                    popover: {
                        title: isArabic ? 'مرحباً بك!' : 'Bienvenue !',
                        description: isArabic
                            ? 'هنا تجد ملخصاً سريعاً والتحصيل الدراسي الحالي لطفلك.'
                            : 'Ici vous trouvez un résumé rapide et les accomplissements actuels de votre enfant.',
                        side: "bottom",
                        align: 'start'
                    }
                },
                {
                    element: '.tour-learning-hubs',
                    popover: {
                        title: isArabic ? 'محاور التعلم' : 'Hubs d\'apprentissage',
                        description: isArabic
                            ? 'هذا هو قلب البرنامج. المواد منظمة في مجموعات ذكية لتسهيل المتابعة.'
                            : 'C\'est le cœur du programme. Les matières sont organisées en groupes intelligents.',
                        side: "top",
                        align: 'start'
                    }
                },
                {
                    element: '.tour-progress-details',
                    popover: {
                        title: isArabic ? 'تفاصيل التقدم' : 'Détails de progression',
                        description: isArabic
                            ? 'تابع مستوى طفلك في كل مادة بدقة متناهية.'
                            : 'Suivez le niveau de votre enfant dans chaque matière avec précision.',
                        side: "left",
                        align: 'start'
                    }
                },
                {
                    element: '.tour-tabs-list',
                    popover: {
                        title: isArabic ? 'التنقل' : 'Navigation',
                        description: isArabic
                            ? 'استخدم هذه التبويبات للتنقل بين الإحصائيات، المدرب الذكي، واكتشاف المناهج.'
                            : 'Utilisez ces onglets pour basculer entre les analyses, le coach IA et la découverte.',
                        side: "bottom",
                        align: 'start'
                    }
                },
                {
                    element: '.tour-ai-coach',
                    popover: {
                        title: isArabic ? 'المدرب الذكي' : 'Coach IA',
                        description: isArabic
                            ? 'احصل على نصائح تربوية مخصصة بناءً على أداء طفلك الحقيقي.'
                            : 'Obtenez des conseils pédagogiques personnalisés basés sur les performances de votre enfant.',
                        side: "top",
                        align: 'start'
                    }
                },
                {
                    element: '.tour-child-switcher',
                    popover: {
                        title: isArabic ? 'تبديل الحساب' : 'Changer d\'enfant',
                        description: isArabic
                            ? 'إذا كان لديك أكثر من طفل، يمكنك التبديل بينهم هنا بسهولة.'
                            : 'Si vous avez plusieurs enfants, vous pouvez basculer entre leurs profils ici.',
                        side: "bottom",
                        align: 'end'
                    }
                },
                {
                    element: '.tour-user-menu',
                    popover: {
                        title: isArabic ? 'إعدادات الحساب' : 'Menu utilisateur',
                        description: isArabic
                            ? 'من هنا يمكنك تعديل اشتراكك، إعداداتك، أو تسجيل الخروج.'
                            : 'Accédez à votre abonnement, vos paramètres ou déconnectez-vous d\'ici.',
                        side: "bottom",
                        align: 'end'
                    }
                }
            ]
        })
    }, [isArabic])

    const startTour = () => {
        if (driverRef.current) {
            driverRef.current.drive()
        }
    }

    return (
        <Button
            onClick={startTour}
            variant="outline"
            size="sm"
            className="fixed bottom-6 left-6 z-50 rounded-full w-12 h-12 shadow-2xl bg-white/90 backdrop-blur border-primary/20 hover:bg-primary hover:text-white transition-all group animate-bounce-subtle"
            title={isArabic ? "ابدأ الجولة التعليمية" : "Lancer la visite guidée"}
        >
            <HelpCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </Button>
    )
}
