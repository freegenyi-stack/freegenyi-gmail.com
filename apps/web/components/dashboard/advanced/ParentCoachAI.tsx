"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowRight, MessageCircle } from "lucide-react"

export function ParentCoachAI({ childName }: { childName: string }) {
    return (
        <Card className="shadow-lg border-primary/20 bg-gradient-premium/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-3 opacity-10">
                <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    المدرب الذكي للآباء
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-white/80 dark:bg-card/80 p-4 rounded-xl border border-primary/10 shadow-sm relative z-10">
                    <p className="text-sm leading-relaxed mb-3 italic">
                        "يتقدم {childName} بسرعة في الضرب، لكن يبدو أنه يواجه صعوبة أكبر في الهندسة. أقترح تقديم تمرين 'رسم الأشكال' لتقوية أساسياته."
                    </p>
                    <div className="flex gap-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">تركيز هندسة</Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 border-none">تعزيز</Badge>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Button variant="premium" className="w-full h-9 text-xs font-bold">
                        رؤية التمارين المقترحة <ArrowRight className="h-3.5 w-3.5 ml-2" />
                    </Button>
                    <Button variant="outline" className="w-full h-9 text-xs font-bold bg-white/50">
                        <MessageCircle className="h-3.5 w-3.5 mr-2" /> اسأل الذكاء الاصطناعي
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
