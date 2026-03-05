// apps/web/components/dashboard/ecole/layout/EcoleSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Users, BookOpen, GraduationCap, ClipboardList, MessageSquare, Settings, BarChart3, Calendar } from 'lucide-react'

const navItems = [
    { href: '/ecole/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/ecole/eleves', label: 'Élèves', icon: Users },
    { href: '/ecole/devoirs', label: 'Devoirs', icon: BookOpen },
    { href: '/ecole/notes', label: 'Notes', icon: GraduationCap },
    { href: '/ecole/presences', label: 'Présences', icon: Calendar },
    { href: '/ecole/communication', label: 'Communication', icon: MessageSquare },
    { href: '/ecole/programmes', label: 'Programmes', icon: ClipboardList },
    { href: '/ecole/analytics', label: 'Analyses', icon: BarChart3 },
    { href: '/ecole/parametres', label: 'Paramètres', icon: Settings },
]

export function EcoleSidebar() {
    const pathname = usePathname()
    return (
        <aside className="w-64 border-r bg-card p-4">
            <div className="mb-6">
                <h1 className="font-heading text-xl font-bold text-primary">FreeGeny École</h1>
            </div>
            <nav className="space-y-1">
                {navItems.map(item => {
                    const Icon = item.icon
                    const active = pathname === item.href || pathname.startsWith(item.href + '/')
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200',
                                active ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
