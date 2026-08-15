"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// CREATE
export default async function createDocument(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Utente non autenticato");
  }

  const userId = Number(session.user.id);

  const areaId = Number(formData.get("area"));
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "");

  if (!areaId || !title) {
    return;
  }

  // Controlliamo che l'Area esista
  // e che appartenga a una Organization
  // di cui l'utente è membro.
  const area = await prisma.area.findFirst({
    where: {
      id: areaId,
      organization: {
        memberships: {
          some: {
            userId,
          },
        },
      },
    },
  });

  if (!area) {
    throw new Error("Non autorizzato");
  }

  await prisma.document.create({
    data: {
      title,
      content,
      areaId,
      createdById: userId,
    },
  });

  revalidatePath("/dashboard/documents");
  revalidatePath(`/dashboard/areas/${areaId}`);
}

// UPDATE
export async function updateDocument(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Utente non autenticato");
  }

  const userId = Number(session.user.id);

  const id = Number(formData.get("id"));
  const areaId = Number(formData.get("area"));
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "");

  if (!id || !areaId || !title) {
    return;
  }

  const document = await prisma.document.findUnique({
    where: {
      id,
    },
    include: {
      area: true,
    },
  });

  if (!document) {
    throw new Error("Document non trovato");
  }

  // Controlliamo che l'utente appartenga
  // all'Organization dell'Area attuale.
const membership = await prisma.membership.findFirst({
  where: {
    userId,
    organizationId: document.area.organizationId,
    role: {
      name: "ADMIN",
    },
  },
});

  if (!membership) {
    throw new Error("Non autorizzato");
  }

  // Se il documento viene spostato in un'altra Area,
  // controlliamo anche che la nuova Area appartenga
  // alla stessa Organization dell'utente.
  const newArea = await prisma.area.findFirst({
    where: {
      id: areaId,
      organization: {
        memberships: {
          some: {
            userId,
          },
        },
      },
    },
  });

  if (!newArea) {
    throw new Error("Non autorizzato");
  }

  const oldAreaId = document.areaId;

  await prisma.document.update({
    where: {
      id,
    },
    data: {
      title,
      content,
      areaId,
    },
  });

  revalidatePath("/dashboard/documents");
  revalidatePath(`/dashboard/documents/${id}`);
  revalidatePath(`/dashboard/areas/${oldAreaId}`);
  revalidatePath(`/dashboard/areas/${areaId}`);

  redirect(`/dashboard/documents/${id}`);
}

// DELETE
export async function deleteDocument(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Utente non autenticato");
  }

  const userId = Number(session.user.id);
  const id = Number(formData.get("id"));

  if (!id) {
    return;
  }

  const document = await prisma.document.findUnique({
    where: {
      id,
    },
    include: {
      area: true,
    },
  });

  if (!document) {
    throw new Error("Document non trovato");
  }

  // L'utente deve appartenere
  // all'Organization dell'Area.
const membership = await prisma.membership.findFirst({
  where: {
    userId,
    organizationId: document.area.organizationId,
    role: {
      name: "ADMIN",
    },
  },
});

  if (!membership) {
    throw new Error("Non autorizzato");
  }

  await prisma.document.delete({
    where: {
      id,
    },
  });

  revalidatePath("/dashboard/documents");
  revalidatePath(`/dashboard/areas/${document.areaId}`);
}