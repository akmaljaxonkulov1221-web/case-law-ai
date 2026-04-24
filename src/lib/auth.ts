import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import jwt, { JwtPayload } from "jsonwebtoken"
import { randomBytes } from "crypto"

// Define types
type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN'

// Extend Session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      xp: number
      level: number
      streak: number
      totalCases: number
      winRate: number
    }
    accessToken?: string
    refreshToken?: string
  }
}

// JWT Token rotation configuration
const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-secret-key"
const JWT_REFRESH_SECRET = process.env.NEXTAUTH_REFRESH_SECRET || "your-refresh-secret"
const TOKEN_EXPIRY = "15m" // Access token expiry
const REFRESH_TOKEN_EXPIRY = "7d" // Refresh token expiry

// Token rotation storage (in production, use Redis or database)
const tokenStore = new Map<string, { refreshToken: string; expires: number }>()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        // Check if user is active
        if (user.status !== "active") {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          xp: user.xp,
          level: user.level,
          streak: user.streak,
          totalCases: user.totalCases,
          winRate: user.winRate,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // 15 minutes for access token
  },
  jwt: {
    maxAge: 15 * 60, // 15 minutes
    secret: JWT_SECRET,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        // Initial sign in - generate both tokens
        const accessToken = jwt.sign(
          { 
            sub: user.id,
            email: user.email,
            role: user.role,
            type: "access"
          },
          JWT_SECRET,
          { expiresIn: TOKEN_EXPIRY }
        )

        const refreshToken = jwt.sign(
          { 
            sub: user.id,
            email: user.email,
            type: "refresh"
          },
          JWT_REFRESH_SECRET,
          { expiresIn: REFRESH_TOKEN_EXPIRY }
        )

        // Store refresh token
        tokenStore.set(user.id, {
          refreshToken,
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        token.accessToken = accessToken
        token.refreshToken = refreshToken
        token.role = user.role
        token.xp = user.xp
        token.level = user.level
        token.streak = user.streak
        token.totalCases = user.totalCases
        token.winRate = user.winRate
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
        session.user.xp = token.xp as number
        session.user.level = token.level as number
        session.user.streak = token.streak as number
        session.user.totalCases = token.totalCases as number
        session.user.winRate = token.winRate as number
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  }
}

// Token rotation functions
export const rotateToken = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any
    
    if (decoded.type !== "refresh") {
      return null
    }

    // Check if refresh token is still valid
    const storedToken = tokenStore.get(decoded.sub)
    if (!storedToken || storedToken.refreshToken !== refreshToken || Date.now() > storedToken.expires) {
      return null
    }

    // Generate new tokens
    const newAccessToken = jwt.sign(
      { 
        sub: decoded.sub,
        email: decoded.email,
        type: "access"
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    )

    const newRefreshToken = jwt.sign(
      { 
        sub: decoded.sub,
        email: decoded.email,
        type: "refresh"
      },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    )

    // Update stored refresh token
    tokenStore.set(decoded.sub, {
      refreshToken: newRefreshToken,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000
    })

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  } catch (error) {
    console.error("Token rotation error:", error)
    return null
  }
}

// Revoke token
export const revokeToken = async (userId: string): Promise<void> => {
  tokenStore.delete(userId)
}

// Password reset functions
export const generatePasswordResetToken = async (email: string): Promise<string | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return null
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Save reset token to database
    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expires
      }
    })

    return resetToken
  } catch (error) {
    console.error("Password reset token generation error:", error)
    return null
  }
}

export const verifyPasswordResetToken = async (token: string): Promise<string | null> => {
  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!resetToken || resetToken.expires < new Date()) {
      return null
    }

    return resetToken.user.id
  } catch (error) {
    console.error("Password reset token verification error:", error)
    return null
  }
}

export const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
  try {
    const userId = await verifyPasswordResetToken(token)
    if (!userId) {
      return false
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update user password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    // Delete used reset token
    await prisma.passwordResetToken.delete({
      where: { token }
    })

    // Revoke all refresh tokens for this user
    await revokeToken(userId)

    return true
  } catch (error) {
    console.error("Password reset error:", error)
    return false
  }
}

// Role-based access control
export const hasPermission = (userRole: string, requiredRole: string): boolean => {
  const roleHierarchy = {
    "student": 1,
    "teacher": 2,
    "admin": 3,
    "super_admin": 4
  }

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0

  return userLevel >= requiredLevel
}

// Route protection middleware
export const requireAuth = (requiredRole?: string) => {
  return (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.replace("Bearer ", "")
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" })
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      
      if (requiredRole && !hasPermission(decoded.role, requiredRole)) {
        return res.status(403).json({ error: "Insufficient permissions" })
      }

      req.user = decoded
      next()
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" })
    }
  }
}
