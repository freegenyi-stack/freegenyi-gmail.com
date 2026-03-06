import { PrismaClient } from '@prisma/client'

const createMockPrisma = (): PrismaClient => {
    return new Proxy({} as PrismaClient, {
        get: (target, prop) => {
            if (typeof prop === 'string' && !prop.startsWith('_') && !prop.startsWith('$')) {
                return {
                    findUnique: async ({ where }: any) => {
                        const email = where?.email;
                        if (email === 'parent@demo.com') return { id: 'parent-1', email, password: 'hashed_password123', role: 'PARENT', name: 'Parent Démo' };
                        if (email === 'teacher@demo.com') return { id: 'teacher-1', email, password: 'hashed_password123', role: 'TEACHER', name: 'Enseignant Démo' };
                        if (email === 'ngo@demo.com') return { id: 'ngo-1', email, password: 'hashed_password123', role: 'NGO', name: 'ONG Démo' };
                        if (email === 'admin@demo.com') return { id: 'admin-1', email, password: 'hashed_password123', role: 'ORGANIZATION', name: 'Administrateur' };
                        return null;
                    },
                    findFirst: async () => null,
                    findMany: async () => [],
                    create: async (args: any) => args?.data || {},
                    update: async (args: any) => args?.data || {},
                    delete: async () => ({}),
                    count: async () => 0,
                }
            }
            if (prop === '$connect') return async () => { }
            if (prop === '$disconnect') return async () => { }
            if (prop === '$transaction') return async (fn: any) => fn ? fn({}) : []
            if (prop === '$queryRaw') return async () => []
            if (prop === '$executeRaw') return async () => 0
            return () => { }
        }
    }) as PrismaClient
}

const prisma = createMockPrisma()

export default prisma
