import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import authConfig from "./auth.config";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, or, ilike } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getImpersonationCookies } from "@/lib/admin/impersonate";
import { isAdminEmail } from "@/lib/admin/requireAdmin";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    // Provider Google avec sauvegarde automatique en base
    Google({}),
    // Provider Credentials (email + mot de passe)
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email or username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const loginId = (credentials.email as string).trim().toLowerCase();
        const password = credentials.password as string;

        const [user] = await db
          .select()
          .from(users)
          .where(
            loginId.includes("@")
              ? eq(users.email, loginId)
              : ilike(users.username, loginId)
          );

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
          return null;
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
            // 🔄 Compte existant — connexion Google (ne pas recréer)
            await db.update(users)
              .set({
                lastLoginAt: new Date(),
                ...(user.image && !existingUser.image ? { image: user.image } : {}),
                ...(existingUser.emailVerified ? {} : { emailVerified: new Date() }),
              })
              .where(eq(users.email, email));
            console.log("🔄 Utilisateur Google reconnecté:", email, "rôle:", existingUser.role);
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
      return `${baseUrl}/DZ-fr/auth/google-bridge`
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
      if (token.impersonating) {
        (session.user as any).impersonating = true;
        (session.user as any).realAdminId = token.realAdminId;
      }
      return session;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role || "parent";
        token.onboardingStep = (user as any).onboardingStep || 1;
      }

      const imp = await getImpersonationCookies();
      if (imp && token.sub === String(imp.adminUserId)) {
        const [target] = await db
          .select({ id: users.id, role: users.role, email: users.email, onboardingStep: users.onboardingStep })
          .from(users)
          .where(eq(users.id, imp.targetId))
          .limit(1);
        const [adminUser] = await db
          .select({ email: users.email })
          .from(users)
          .where(eq(users.id, imp.adminUserId))
          .limit(1);

        if (target && adminUser && isAdminEmail(adminUser.email)) {
          token.realAdminId = imp.adminUserId;
          token.sub = String(target.id);
          token.email = target.email;
          token.role = target.role;
          token.onboardingStep = target.onboardingStep;
          token.impersonating = true;
          return token;
        }
      }

      token.impersonating = false;
      delete token.realAdminId;
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
