"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Mail, Send } from "lucide-react"

interface EmailReportFormProps {
    onSend: (email: string, subject: string, message: string, attachPDF: boolean) => void
    defaultEmail?: string
}

export function EmailReportForm({ onSend, defaultEmail = "" }: EmailReportFormProps) {
    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState(defaultEmail)
    const [subject, setSubject] = useState("Rapport de progression FreeGeny")
    const [message, setMessage] = useState(
        "Bonjour,\n\nVeuillez trouver ci-joint le rapport de progression de votre enfant.\n\nCordialement,\nFreeGeny"
    )
    const [attachPDF, setAttachPDF] = useState(true)

    const handleSend = () => {
        onSend(email, subject, message, attachPDF)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Envoyer par email
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="font-heading">Envoyer le rapport par email</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="email">Adresse email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="parent@exemple.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subject">Objet</Label>
                        <Input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="attach-pdf"
                            checked={attachPDF}
                            onCheckedChange={(checked) => setAttachPDF(checked as boolean)}
                        />
                        <Label htmlFor="attach-pdf" className="text-sm cursor-pointer">
                            Joindre le rapport au format PDF
                        </Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Annuler
                    </Button>
                    <Button variant="premium" onClick={handleSend} disabled={!email || !subject}>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
