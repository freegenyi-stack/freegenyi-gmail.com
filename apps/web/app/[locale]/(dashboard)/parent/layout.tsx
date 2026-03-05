import { ProtectedRoute } from '@/components/auth/protected-route'
import { Role } from '@prisma/client'

export default function ParentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requiredRole={Role.PARENT}>
      {children}
    </ProtectedRoute>
  )
}
