import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./db";
import { compare } from "bcrypt";
export const authOptions:NextAuthOptions={
    adapter:PrismaAdapter(db),
    session:{
        strategy:"jwt"
    },
    pages:{
        signIn:'/sign-in'
    },
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. "Sign in with...")
          name: "Credentials",
          // `credentials` is used to generate a form on the sign in page.
          // You can specify which fields should be submitted, by adding keys to the `credentials` object.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials) {
            if (credentials) {
              // Any object returned will be saved in `user` property of the JWT
              return {
                id:"`${existingUser.id}`" ,
                email:"existingUser.email",
                username:'existingUser.username'
              }
            } else {
              // If you return null or false then the credentials will be rejected
              return null
              // You can also Reject this callback with an Error or with a URL:
              // throw new Error('error message') // Redirect to error page
              // throw '/path/to/redirect'        // Redirect to a URL
            }
         
          }
        })
      ],
      callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
          console.log("aaaaaaaaa")
          return true
        }}
}