import { DefaultSession } from "next-auth"
import { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      xp: number
      level: number
      streak: number
      totalCases: number
      winRate: number
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRole
    xp: number
    level: number
    streak: number
    totalCases: number
    winRate: number
  }

  interface JWT {
    role: UserRole
    xp: number
    level: number
    streak: number
    totalCases: number
    winRate: number
  }
}
