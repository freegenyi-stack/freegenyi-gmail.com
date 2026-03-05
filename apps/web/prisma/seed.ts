import { PrismaClient } from '@prisma/client'
import type { Role, ExerciseType, DifficultyLevel } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding...')

  // Créer les utilisateurs de test pour chaque rôle
  const users = await Promise.all([
    // Parent
    prisma.user.upsert({
      where: { email: 'parent@demo.com' },
      update: {},
      create: {
        email: 'parent@demo.com',
        name: 'Parent Démo',
        password: await bcrypt.hash('password123', 10),
        role: 'PARENT' as Role,
        parentProfile: {
          create: {
            preferences: { theme: 'light', notifications: true }
          }
        }
      }
    }),
    // Teacher
    prisma.user.upsert({
      where: { email: 'teacher@demo.com' },
      update: {},
      create: {
        email: 'teacher@demo.com',
        name: 'Enseignant Démo',
        password: await bcrypt.hash('password123', 10),
        role: 'TEACHER' as Role,
        teacherProfile: {
          create: {}
        }
      }
    }),
    // ONG
    prisma.user.upsert({
      where: { email: 'ngo@demo.com' },
      update: {},
      create: {
        email: 'ngo@demo.com',
        name: 'ONG Démo',
        password: await bcrypt.hash('password123', 10),
        role: 'NGO' as Role,
        ngoProfile: {
          create: {
            organizationName: 'Education pour Tous',
            description: 'ONG dédiée à l\'éducation',
            regions: ['Dakar', 'Thiès', 'Saint-Louis']
          }
        }
      }
    }),
    // Admin
    prisma.user.upsert({
      where: { email: 'admin@demo.com' },
      update: {},
      create: {
        email: 'admin@demo.com',
        name: 'Administrateur',
        password: await bcrypt.hash('password123', 10),
        role: 'ORGANIZATION' as Role,
        orgProfile: {
          create: {
            department: 'Direction Nationale',
            permissions: { canManageUsers: true, canViewReports: true }
          }
        }
      }
    })
  ])

  console.log('✅ Utilisateurs créés:', users.length)

  // Créer des exercices pour le teacher
  const teacher = users.find(u => u.role === 'TEACHER')
  if (teacher) {
    const exercises = await Promise.all([
      prisma.exercise.create({
        data: {
          title: 'Addition et Soustraction',
          description: 'Exercices de base sur les opérations arithmétiques',
          type: 'MATH' as ExerciseType,
          difficulty: 'EASY' as DifficultyLevel,
          content: { questions: [{ q: '5 + 3 = ?', a: '8' }] },
          solution: { answers: ['8', '10', '12'] },
          maxScore: 20,
          teacherId: teacher.id,
          isPublic: true,
          tags: ['math', 'arithmétique', 'ce1']
        }
      }),
      prisma.exercise.create({
        data: {
          title: 'Conjugaison du verbe être',
          description: 'Conjugaison au présent de l\'indicatif',
          type: 'FRENCH' as ExerciseType,
          difficulty: 'MEDIUM' as DifficultyLevel,
          content: { questions: [{ q: 'Je ___ content', a: 'suis' }] },
          maxScore: 20,
          teacherId: teacher.id,
          isPublic: true,
          tags: ['français', 'conjugaison', 'ce2']
        }
      })
    ])
    console.log('✅ Exercices créés:', exercises.length)
  }

  // Créer des données pour l'ONG
  const ngoUser = users.find(u => u.role === 'NGO')
  if (ngoUser && ngoUser.ngoProfile) {
    const impactKPIs = await Promise.all([
      prisma.impactKPI.create({
        data: {
          ngoId: ngoUser.id,
          title: 'Élèves formés',
          value: 3842,
          target: 5000,
          unit: 'students',
          region: 'Dakar'
        }
      }),
      prisma.impactKPI.create({
        data: {
          ngoId: ngoUser.id,
          title: 'Écoles équipées',
          value: 47,
          target: 60,
          unit: 'schools',
          region: 'National'
        }
      })
    ])
    console.log('✅ KPIs d\'impact créés:', impactKPIs.length)
  }

  console.log('✅ Seeding terminé avec succès!')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
