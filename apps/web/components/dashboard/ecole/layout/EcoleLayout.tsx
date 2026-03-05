// apps/web/components/dashboard/ecole/layout/EcoleLayout.tsx
import { ReactNode } from 'react'
import { EcoleSidebar } from './EcoleSidebar'

export function EcoleLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <EcoleSidebar />
            <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
    )
}
