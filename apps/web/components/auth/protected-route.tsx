'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { useLocale } from 'next-intl'

// Définition des rôles alignée sur Prisma schema.prisma
type Role = 'PARENT' | 'TEACHER' | 'NGO' | 'ORGANIZATION'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole: Role
  fallbackPath?: string
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallbackPath
}: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const locale = useLocale()

  const defaultFallback = `/${locale}/auth/signin`
  const actualFallback = fallbackPath || defaultFallback

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      router.push(actualFallback)
      return
    }

    if (session.user.role !== requiredRole) {
      // Rediriger vers le dashboard approprié selon le rôle
      const rolePaths: Record<Role, string> = {
        PARENT: `/${locale}/parent`,
        TEACHER: `/${locale}/teacher`,
        NGO: `/${locale}/ngo`,
        ORGANIZATION: `/${locale}/admin`
      }
      const userRole = session.user.role as Role
      router.push(rolePaths[userRole] || actualFallback)
      return
    }
  }, [session, status, router, requiredRole, actualFallback, locale])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session || session.user.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}
