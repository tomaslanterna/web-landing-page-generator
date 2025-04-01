import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import MicrosoftProvider from "next-auth/providers/azure-ad"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { authService } from "./auth-service"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/auth/error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    MicrosoftProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      tenantId: process.env.MICROSOFT_TENANT_ID,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Buscar usuario por email en nuestro servicio simulado
        const user = await authService.getUserByEmail(credentials.email)

        if (!user || !user.password) {
          return null
        }

        // Verificar contraseña
        const passwordMatch = await bcrypt.compare(credentials.password, user.password)

        if (!passwordMatch) {
          return null
        }

        // Devolver usuario sin la contraseña
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }

      return session
    },
    async jwt({ token, user, account }) {
      // Si es un inicio de sesión inicial
      if (user) {
        token.id = user.id

        // Si es un proveedor OAuth, crear o actualizar el usuario
        if (account && (account.provider === "google" || account.provider === "azure-ad")) {
          // Buscar si el usuario ya existe
          let existingUser = await authService.getUserByEmail(user.email as string)

          // Si no existe, crearlo
          if (!existingUser) {
            existingUser = await authService.createUser({
              name: user.name,
              email: user.email as string,
              image: user.image,
            })
          }

          token.id = existingUser.id
        }
      }

      return token
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      // Si es un proveedor OAuth, vincular la cuenta
      if (account && (account.provider === "google" || account.provider === "azure-ad")) {
        await authService.linkAccount({
          userId: user.id,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          type: account.type,
        })
      }
    },
  },
}

