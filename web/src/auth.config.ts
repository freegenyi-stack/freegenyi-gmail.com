import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

// Configuration de base (compatible Edge Runtime pour le middleware)
export default {
  providers: [
    Google({}),
    Credentials({}),
  ],
  pages: {
    signIn: "/fr/auth/login",
    error: "/fr/auth/register",
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
