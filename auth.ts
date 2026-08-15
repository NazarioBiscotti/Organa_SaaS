import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          return null;
        }

        const correctPassword = await bcrypt.compare(
          password,
          user.password
        );

        if (!correctPassword) {
          return null;
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
        };
      },
    }),
    
  ],

  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.userId = user.id;
    }

    return token;
  },

  async session({ session, token }) {
    session.user.id = token.userId as string;

    return session;
  },
},
  
});