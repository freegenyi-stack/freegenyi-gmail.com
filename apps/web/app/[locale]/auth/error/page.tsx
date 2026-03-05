'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    default: 'Une erreur s\'est produite lors de l\'authentification.',
    configuration: 'Problème de configuration du serveur d\'authentification.',
    accessdenied: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.',
    verification: 'La vérification du token a échoué.',
    signin: 'Erreur lors de la connexion. Vérifiez vos identifiants.',
    callback: 'Erreur lors du retour depuis le fournisseur d\'authentification.',
    oauthaccountnotlinked: 'Cet email est déjà associé à un autre compte.',
    sessionrequired: 'Vous devez être connecté pour accéder à cette page.',
  }

  const message = error ? errorMessages[error] || errorMessages.default : errorMessages.default

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Erreur d\'authentification</CardTitle>
          <CardDescription className="text-center">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Link href="/auth/signin" className="w-full">
            <Button className="w-full">
              Réessayer la connexion
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              Retour à l\'accueil
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}
