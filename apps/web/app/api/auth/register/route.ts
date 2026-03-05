import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, role } = body

    // Validation
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, mot de passe et rôle requis' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit faire au moins 8 caractères' },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 409 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        // Créer le profil correspondant au rôle
        ...(role === 'PARENT' && {
          parentProfile: { create: {} }
        }),
        ...(role === 'TEACHER' && {
          teacherProfile: { create: {} }
        }),
        ...((role === 'NGO' || role === 'NGO_ADMIN') && {
          ngoProfile: { create: { organizationName: name || 'Nouvelle ONG' } }
        }),
        ...((role === 'ORGANIZATION' || role === 'ORG_ADMIN' || role === 'SCHOOL_ADMIN') && {
          orgProfile: { create: {} }
        })
      }
    })

    return NextResponse.json(
      { message: 'Compte créé avec succès', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur inscription detaillee:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
