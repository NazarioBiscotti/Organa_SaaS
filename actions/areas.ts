"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export default async function createArea(
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Utente non autenticato");
  }

  const userId = Number(session.user.id);

  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const organizationId = Number(
    formData.get("organization")
  );

  if (!name || !organizationId) {
    return;
  }

const membership =
  await prisma.membership.findFirst({
    where: {
      userId,
      organizationId,
      role: {
        name: "ADMIN",
      },
    },
  });

if (!membership) {
  throw new Error("Non autorizzato");
}

  await prisma.area.create({
    data: {
      name,
      description,
      organizationId,
    },
  });

  revalidatePath("/dashboard/areas");
  revalidatePath(
    `/dashboard/areas?organization=${organizationId}`
  );
}

export async function deleteArea(
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Utente non autenticato");
  }

  const userId = Number(session.user.id);
  const id = Number(formData.get("id"));

  if (!id) {
    return;
  }

  const area = await prisma.area.findUnique({
    where: {
      id,
    },
  });

  if (!area) {
    throw new Error("Area non trovata");
  }
  
const membership =
  await prisma.membership.findFirst({
    where: {
      userId,
      organizationId: area.organizationId,
      role: {
        name: "ADMIN",
      },
    },
  });

  if (!membership) {
    throw new Error("Non autorizzato");
  }

  await prisma.document.deleteMany({
    where: {
      areaId: id,
    },
  });

  await prisma.area.delete({
    where: {
      id,
    },
  });

  revalidatePath("/dashboard/areas");
  revalidatePath("/dashboard/documents");
}

export async function updateArea(
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Utente non autenticato");
  }

  const userId = Number(session.user.id);

  const id = Number(formData.get("id"));

  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  if (!id || !name) {
    return;
  }

  const area = await prisma.area.findUnique({
    where: {
      id,
    },
  });

  if (!area) {
    throw new Error("Area non trovata");
  }

 const membership =
  await prisma.membership.findFirst({
    where: {
      userId,
      organizationId: area.organizationId,
      role: {
        name: "ADMIN",
      },
    },
  });
  
  if (!membership) {
    throw new Error("Non autorizzato");
  }

  await prisma.area.update({
    where: {
      id,
    },
    data: {
      name,
      description,
    },
  });

  revalidatePath("/dashboard/areas");
  revalidatePath(`/dashboard/areas/${id}`);
}