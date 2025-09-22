import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import {authOptions} from "@/lib/auth"
const prisma = new PrismaClient()

export default NextAuth(authOptions)