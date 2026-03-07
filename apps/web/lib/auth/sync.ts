import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'

export async function syncUserToPrisma(user: {
    id: string
    email?: string
    user_metadata?: any
    app_metadata?: any
}) {
    console.log("🔄 Syncing user to Prisma:", user.email);
    
    // Some OAuth providers (like specific Facebook accounts) might not return an email.
    // Since our database requires a unique email, we generate a placeholder if missing.
    const effectiveEmail = user.email || `${user.id}@no-email.placeholder`;

    const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
    })

    if (existingUser) {
        console.log("✅ User already exists in Prisma:", existingUser.email);
        return existingUser
    }

    // Extract data from multiple metadata sources
    const metadata = user.user_metadata || {};
    const appMetadata = user.app_metadata || {};
    
    // Try multiple sources for name
    const name = metadata.full_name || 
                 metadata.name || 
                 metadata.userName ||
                 appMetadata.user_name ||
                 appMetadata.name ||
                 `${metadata.firstName || ''} ${metadata.lastName || ''}`.trim() ||
                 effectiveEmail.split('@')[0];
    
    // Try multiple sources for image
    const image = metadata.avatar_url || 
                  metadata.picture || 
                  metadata.image ||
                  appMetadata.avatar_url ||
                  null;
    
    // Try multiple sources for username
    const username = metadata.username || 
                     metadata.preferred_username ||
                     appMetadata.user_name ||
                     name.toLowerCase().replace(/\s+/g, '_');
    
    const role = (metadata.role as Role) || 
                 (appMetadata.role as Role) || 
                 Role.PARENT

    console.log("📝 Creating user with data:", {
        email: effectiveEmail,
        name,
        username,
        role,
        image
    });

    return await prisma.user.create({
        data: {
            id: user.id,
            email: effectiveEmail,
            username: username,
            name: name,
            role: role,
            image: image,
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
