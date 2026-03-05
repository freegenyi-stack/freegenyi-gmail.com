"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mail, Search, Archive, Trash2 } from "lucide-react"

interface Message {
    id: string
    from: string
    subject: string
    preview: string
    time: string
    unread: boolean
}

export function MessageInbox({ messages = [] }: { messages?: Message[] }) {
    const MOCK_MESSAGES: Message[] = [
        { id: "1", from: "Prof. Martin", subject: "Progrès de Sarah", preview: "Bonjour, j'ai remarqué une nette amélioration...", time: "10:30", unread: true },
        { id: "2", from: "Support FreeGeny", subject: "Bienvenue !", preview: "Merci d'avoir rejoint notre communauté...", time: "Hier", unread: false },
    ]

    const displayMessages = messages.length > 0 ? messages : MOCK_MESSAGES

    return (
        <Card className="h-full shadow-md border-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Messages
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Search className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                    <div className="divide-y">
                        {displayMessages.map((m) => (
                            <div key={m.id} className={`p-4 hover:bg-accent/50 transition cursor-pointer ${m.unread ? "bg-primary/5" : ""}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm font-bold">{m.from}</span>
                                    <span className="text-[10px] text-muted-foreground">{m.time}</span>
                                </div>
                                <p className="text-xs font-semibold truncate mb-1">{m.subject}</p>
                                <p className="text-[11px] text-muted-foreground line-clamp-1">{m.preview}</p>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="p-3 border-t bg-muted/20 flex gap-2">
                    <Button variant="outline" className="flex-1 h-9 text-xs"><Archive className="h-3.5 w-3.5 mr-2" /> Archivage</Button>
                    <Button variant="outline" className="flex-1 h-9 text-xs text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5 mr-2" /> Supprimer</Button>
                </div>
            </CardContent>
        </Card>
    )
}
