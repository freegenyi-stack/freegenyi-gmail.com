
import { Button } from '@/components/ui/button'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export function ExportReports() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" /> Exporter
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" /> Rapport d'impact (PDF)
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <FileSpreadsheet className="h-4 w-4 mr-2" /> Données financières (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <FileSpreadsheet className="h-4 w-4 mr-2" /> Liste bénéficiaires (Excel)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
