import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'

export async function syncUserToPrisma(user: {
    id: string
    email?: string
    user_metadata?: any
}) {
    // Some OAuth providers (like specific Facebook accounts) might not return an email.
    // Since our database requires a unique email, we generate a placeholder if missing.
    const effectiveEmail = user.email || `${user.id}@no-email.placeholder`;

    const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
    })

    if (existingUser) return existingUser

    // Metadata can contain username, firstName, lastName, role etc.
    const username = user.user_metadata?.username
    const name = user.user_metadata?.full_name || `${user.user_metadata?.firstName || ''} ${user.user_metadata?.lastName || ''}`.trim()
    const role = (user.user_metadata?.role as Role) || Role.PARENT

    return await prisma.user.create({
        data: {
            id: user.id,
            email: effectiveEmail,
            username: username,
            name: name || effectiveEmail.split('@')[0],
            role: role,
            image: user.user_metadata?.avatar_url,
            // Create initial profile
            ...(role === 'PARENT' && {
                parentProfile: { create: {} }
            }),
            ...(role === 'TEACHER' && {
                teacherProfile: { create: {} }
            }),
            ...((role === 'NGO') && {
                ngoProfile: { create: { organizationName: name || 'Nouvelle ONG' } }
            })
        },
    })
}
