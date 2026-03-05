// Définition des rôles alignée sur Prisma
type Role = 'PARENT' | 'TEACHER' | 'NGO' | 'ORGANIZATION'

import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: Role
    }
  }

  interface User {
    role: Role
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role
  }
}
