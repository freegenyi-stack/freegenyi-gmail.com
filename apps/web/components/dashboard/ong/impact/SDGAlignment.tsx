
import { Badge } from '@/components/ui/badge'

const sdgColors: Record<string, string> = {
    SDG1: 'bg-red-100 text-red-800',
    SDG2: 'bg-orange-100 text-orange-800',
    SDG3: 'bg-green-100 text-green-800',
    SDG4: 'bg-blue-100 text-blue-800',
    SDG5: 'bg-pink-100 text-pink-800',
    SDG6: 'bg-cyan-100 text-cyan-800',
    SDG7: 'bg-yellow-100 text-yellow-800',
    SDG8: 'bg-purple-100 text-purple-800',
}

export function SDGAlignment({ sdgs }: { sdgs: string[] }) {
    return (
        <div className="flex flex-wrap gap-2">
            {sdgs.map(sdg => (
                <Badge key={sdg} className={sdgColors[sdg] || 'bg-gray-100'}>
                    {sdg}
                </Badge>
            ))}
        </div>
    )
}
