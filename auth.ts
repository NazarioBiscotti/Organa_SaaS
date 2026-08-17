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
  try {
    const email = credentials.email as string;
    const password = credentials.password as string;

    console.log("AUTH: starting login", email);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    console.log("AUTH: user found", !!user);

    if (!user) {
      return null;
    }

    const correctPassword = await bcrypt.compare(
      password,
      user.password
    );

    console.log("AUTH: password correct", correctPassword);

    if (!correctPassword) {
      return null;
    }

    return {
      id: String(user.id),
      name: user.name,
      email: user.email,
    };
  } catch (error) {
    console.error("AUTH AUTHORIZE ERROR:", error);

    return null;
  }
}
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