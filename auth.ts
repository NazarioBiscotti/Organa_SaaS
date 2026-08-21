import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authorizeUser } from "./lib/auth/authorize";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        return authorizeUser({
          email: credentials.email as string,
          password: credentials.password as string,
        });
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