import { Button } from "@/components/ui/button"
import { FileText, Loader2 } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ExportPDFButtonProps {
    onClick?: () => void
    className?: string
    children?: React.ReactNode
    data?: any // donnes  exporter
    title?: string
    filename?: string
}

export function ExportPDFButton({
    onClick,
    className,
    children,
    data,
    title = "Rapport FreeGeny",
    filename
}: ExportPDFButtonProps) {
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = async () => {
        setIsExporting(true)
        try {
            // Import dynamique pour viter les soucis de SSR
            const jsPDFModule = await import("jspdf")
            const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default
            const { default: autoTable } = await import("jspdf-autotable")

            // Exemple de gnration PDF avec jsPDF
            const doc = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            })

            // En-tte avec couleurs FreeGeny
            doc.setFillColor(42, 133, 120) // Teal primary
            doc.rect(0, 0, 210, 20, "F")
            doc.setTextColor(255, 255, 255)
            doc.setFontSize(12)
            doc.text("FreeGeny", 14, 12)

            // Titre
            doc.setTextColor(42, 133, 120)
            doc.setFontSize(16)
            doc.setFont("helvetica", "bold")
            doc.text(title, 14, 30)

            // Date
            doc.setTextColor(100, 100, 100)
            doc.setFontSize(10)
            doc.setFont("helvetica", "normal")
            const dateStr = format(new Date(), "dd MMMM yyyy", { locale: fr })
            doc.text(`Gnr le ${dateStr}`, 14, 38)

            // Exemple de tableau (si data est fournie)
            if (data && Array.isArray(data)) {
                autoTable(doc, {
                    startY: 45,
                    head: [["Matire", "Progression", "Dernier exercice"]],
                    body: data.map(item => [item.subject, `${item.progress}%`, item.lastActivity]),
                    theme: "striped",
                    headStyles: {
                        fillColor: [42, 133, 120],
                        textColor: 255,
                        fontStyle: "bold"
                    },
                    alternateRowStyles: {
                        fillColor: [245, 245, 245]
                    }
                })
            }

            // Sauvegarde
            const fileName = filename || `FreeGeny_${format(new Date(), "yyyy-MM-dd")}.pdf`
            doc.save(fileName)

            onClick?.()
        } catch (error) {
            console.error("Erreur export PDF:", error)
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className={className}
        >
            {isExporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
                <FileText className="h-4 w-4 mr-2" />
            )}
            {children || "Exporter en PDF"}
        </Button>
    )
}
