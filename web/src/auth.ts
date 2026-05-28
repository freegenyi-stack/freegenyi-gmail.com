import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import authConfig from "./auth.config";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    // Provider Google avec sauvegarde automatique en base
    Google({}),
    // Provider Credentials (email + mot de passe)
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase();
        const password = credentials.password as string;

        const [user] = await db.select().from(users).where(eq(users.email, email));

        if (!user || !user.passwordHash) {
          throw new Error("Identifiants incorrects.");
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          throw new Error("Identifiants incorrects.");
        }

        if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
          throw new Error("Compte temporairement verrouillé.");
        }

        // Mise à jour de la dernière connexion
        await db.update(users)
          .set({ loginAttempts: 0, lastLoginAt: new Date(), lockedUntil: null })
          .where(eq(users.id, user.id));

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.fullName,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    // ✅ Callback clé : sauvegarde les utilisateurs Google en base de données
    async signIn({ user, account }) {
      // Seulement pour Google (les Credentials sont déjà gérés dans authorize)
      if (account?.provider === "google") {
        try {
          const email = user.email?.toLowerCase();
          if (!email) return false;

          // Vérifier si l'utilisateur existe déjà
          const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

          if (!existingUser) {
            // 🆕 Créer le nouvel utilisateur Google
            await db.insert(users).values({
              email,
              fullName: user.name || email.split("@")[0],
              image: user.image || null,
              emailVerified: new Date(), // Google vérifie déjà l'email
              role: "parent",
              passwordHash: null, // Pas de mot de passe pour OAuth
            });
            console.log("✅ Nouvel utilisateur Google créé:", email);
          } else {
            // 🔄 Mettre à jour la dernière connexion
            await db.update(users)
              .set({ lastLoginAt: new Date() })
              .where(eq(users.email, email));
            console.log("🔄 Utilisateur Google reconnecté:", email);
          }
          return true;
        } catch (error: any) {
          console.error("❌ Erreur sauvegarde utilisateur Google:", error);
          require("fs").writeFileSync(
            require("path").join(process.cwd(), "google_login_error.txt"), 
            "Error: " + error?.message + "\nStack: " + error?.stack
          );
          return false;
        }
      }
      return true;
    },

    // Rediriger vers le dashboard par défaut (le middleware fera le reste)
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/fr/dashboard/parent`
    },

    // Session enrichie avec le rôle et l'ID
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        (session.user as any).role = token.role;
      }
      if (token.onboardingStep && session.user) {
        (session.user as any).onboardingStep = token.onboardingStep;
      }
      return session;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role || "parent";
        token.onboardingStep = (user as any).onboardingStep || 1;
      }
      // Pour les utilisateurs Google ou rafraîchissement
      if (token.email) {
        try {
          const [dbUser] = await db
            .select({ role: users.role, id: users.id, onboardingStep: users.onboardingStep })
            .from(users)
            .where(eq(users.email, token.email));
          if (dbUser) {
            token.role = dbUser.role;
            token.sub = dbUser.id.toString();
            token.onboardingStep = dbUser.onboardingStep;
          }
        } catch (error: any) {
          require("fs").writeFileSync(
            require("path").join(process.cwd(), "google_jwt_error.txt"), 
            "Error: " + error?.message + "\nStack: " + error?.stack
          );
        }
      }
      return token;
    },
  },
});
