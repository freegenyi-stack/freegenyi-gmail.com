import { ProtectedRoute } from '@/components/auth/protected-route'

// Role aligné sur Prisma
type Role = 'PARENT' | 'TEACHER' | 'NGO' | 'ORGANIZATION'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requiredRole={'ORGANIZATION' as Role}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-semibold text-gray-900">
                Dashboard Administration
              </h1>
              <nav className="flex space-x-4">
                <a href="/fr/admin" className="text-gray-600 hover:text-gray-900">
                  Accueil
                </a>
                <a href="/fr/admin/users" className="text-gray-600 hover:text-gray-900">
                  Utilisateurs
                </a>
                <a href="/fr/admin/analytics" className="text-gray-600 hover:text-gray-900">
                  Analytics
                </a>
                <a href="/fr/admin/settings" className="text-gray-600 hover:text-gray-900">
                  Paramètres
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
