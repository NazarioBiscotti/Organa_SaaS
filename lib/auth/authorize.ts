import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

type AuthorizeCredentials = {
  email: string;
  password: string;
};

export async function authorizeUser(
  credentials: AuthorizeCredentials
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: credentials.email,
      },
    });

    if (!user) {
      return null;
    }

    const correctPassword = await bcrypt.compare(
      credentials.password,
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
  } catch (error) {
    console.error("AUTH AUTHORIZE ERROR:", error);
    return null;
  }
}