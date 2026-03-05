"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Heart, Share2, Plus } from "lucide-react"

export function ParentCommunityBoard() {
    const POSTS = [
        { id: "1", user: "Nadia K.", text: "Quelqu'un a testé la nouvelle leçon sur les fractions ? Mes enfants adorent les graphismes.", likes: 12, comments: 4, avatar: "NK" },
        { id: "2", user: "Karim B.", text: "Bravo à l'équipe FreeGeny pour le mode hors-ligne, très utile pendant les vacances !", likes: 25, comments: 2, avatar: "KB" },
    ]

    return (
        <Card className="h-full shadow-md border-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Communauté Parents
                </CardTitle>
                <Button variant="premium" size="sm" className="h-8 rounded-full">
                    <Plus className="h-3 w-3 mr-1" /> Publier
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {POSTS.map((post) => (
                    <div key={post.id} className="p-4 rounded-xl border bg-muted/30 space-y-3">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-[10px] bg-primary text-white">{post.avatar}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-bold">{post.user}</span>
                        </div>
                        <p className="text-sm leading-relaxed">{post.text}</p>
                        <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-500 transition">
                                <Heart className="h-3.5 w-3.5" /> {post.likes}
                            </button>
                            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition">
                                <MessageSquare className="h-3.5 w-3.5" /> {post.comments}
                            </button>
                            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition ml-auto">
                                <Share2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
