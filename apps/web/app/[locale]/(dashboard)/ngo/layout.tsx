import { ProtectedRoute } from '@/components/auth/protected-route'

// Role aligné sur Prisma
type Role = 'PARENT' | 'TEACHER' | 'NGO' | 'ORGANIZATION'

export default function NgoDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requiredRole={'NGO' as Role}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-semibold text-gray-900">
                Dashboard ONG
              </h1>
              <nav className="flex space-x-4">
                <a href="/fr/ngo" className="text-gray-600 hover:text-gray-900">
                  Accueil
                </a>
                <a href="/fr/ngo/impact" className="text-gray-600 hover:text-gray-900">
                  Impact
                </a>
                <a href="/fr/ngo/beneficiaries" className="text-gray-600 hover:text-gray-900">
                  Bénéficiaires
                </a>
                <a href="/fr/ngo/reports" className="text-gray-600 hover:text-gray-900">
                  Rapports
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
