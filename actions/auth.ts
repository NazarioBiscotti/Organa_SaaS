
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function register(formData: FormData) {
  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const email = String(
    formData.get("email") ?? ""
  ).trim();

  const password = String(
    formData.get("password") ?? ""
  );

  const createOrganization =
    formData.get("createOrganization") === "true";

  const organizationName = String(
    formData.get("organizationName") ?? ""
  ).trim();

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Email già registrata");
  }

  if (createOrganization && !organizationName) {
    throw new Error(
      "Il nome dell'organizzazione è obbligatorio"
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (createOrganization) {
      const organization =
        await tx.organization.create({
          data: {
            name: organizationName,
          },
        });

      const adminRole = await tx.role.upsert({
        where: {
          name: "ADMIN",
        },
        update: {},
        create: {
          name: "ADMIN",
        },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          roleId: adminRole.id,
        },
      });
    }
  });
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Email o password non corretti");
  }

  const correctPassword = await bcrypt.compare(
    password,
    user.password
  );

  if (!correctPassword) {
    throw new Error("Email o password non corretti");
  }

  console.log("Login riuscito:", user.email);
}

