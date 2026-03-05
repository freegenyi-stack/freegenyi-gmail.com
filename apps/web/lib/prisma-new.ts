import { PrismaClient } from '@prisma/client'

const createMockPrisma = (): PrismaClient => {
    return new Proxy({} as PrismaClient, {
        get: (target, prop) => {
            if (typeof prop === 'string' && !prop.startsWith('_') && !prop.startsWith('$')) {
                return {
                    findUnique: async () => null,
                    findFirst: async () => null,
                    findMany: async () => [],
                    create: async (args: any) => args?.data || {},
                    update: async (args: any) => args?.data || {},
                    delete: async () => ({}),
                    count: async () => 0,
                }
            }
            if (prop === '$connect') return async () => {}
            if (prop === '$disconnect') return async () => {}
            if (prop === '$transaction') return async (fn: any) => fn ? fn({}) : []
            if (prop === '$queryRaw') return async () => []
            if (prop === '$executeRaw') return async () => 0
            return () => {}
        }
    }) as PrismaClient
}

const prisma = createMockPrisma()

export { prisma }
export default prisma
