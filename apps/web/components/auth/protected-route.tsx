'use client'

import { useAuthStore, type UserRole } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { useLocale } from 'next-intl'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole: UserRole
  fallbackPath?: string
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallbackPath
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const locale = useLocale()

  const defaultFallback = `/${locale}/auth/signin`
  const actualFallback = fallbackPath || defaultFallback

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(actualFallback)
      return
    }

    if (user && !user.roles.includes(requiredRole)) {
      // Rediriger vers le dashboard approprié selon le rôle
      const rolePaths: Record<UserRole, string> = {
        PARENT: `/${locale}/parent`,
        TEACHER: `/${locale}/teacher`,
        NGO: `/${locale}/ngo`,
        ORGANIZATION: `/${locale}/admin`
      }
      const userRole = user.roles[0]
      router.push(rolePaths[userRole] || actualFallback)
    }
  }, [user, isAuthenticated, router, requiredRole, actualFallback, locale])

  if (!isAuthenticated || (user && !user.roles.includes(requiredRole))) {
    return null
  }

  return <>{children}</>
}
