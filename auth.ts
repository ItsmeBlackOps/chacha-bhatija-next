import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    {
      ...authConfig.providers[0],
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const user = await prisma.user.findUnique({
          where: { email },
          include: { staff: true },
        })

        if (!user) return null

        const isValid = await compare(password, user.passwordHash)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          badge: user.staff?.badge ?? null,
        }
      },
    },
  ],
})
