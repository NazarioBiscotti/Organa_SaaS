"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


export async function createOrganization(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Non autenticato");
  }

  const userId = Number(session.user.id);

  const name = String(
    formData.get("name") ?? ""
  ).trim();

  if (!name) {
    throw new Error(
      "Il nome dell'organizzazione è obbligatorio"
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        name,
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
        userId,
        organizationId: organization.id,
        roleId: adminRole.id,
      },
    });

    return organization;
  });

  redirect(
    `/dashboard`
  );
}

export async function joinOrganization(formData:FormData) {

  console.log(formData);
  


  

      const id= formData.get("organizationId") as string
      const session = await auth();
      const organizationId = Number(id)

      console.log(id, organizationId);
      





  const userId = Number(session?.user?.id);

    await prisma.joinRequest.create({

      data : {

          userId : userId,
          organizationId : organizationId

      }

    })
    
    redirect("/dashboard")
    
}

export async function approveJoinRequest(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Non autenticato");
  }

  const userId = Number(session.user.id);

  const id = formData.get("joinRequestId") as string;
  const joinRequestId = Number(id);

  const joinRequest = await prisma.joinRequest.findUnique({
    where: {
      id: joinRequestId,
    },
  });

  if (!joinRequest) {
    throw new Error("Richiesta non trovata");
  }

  const membership = await prisma.membership.findFirst({
    where: {
      userId: userId,
      organizationId: joinRequest.organizationId,
      role: {
        name: "ADMIN",
      },
    },
  });

  if (!membership) {
    throw new Error("Non autorizzato");
  }

  const memberRole = await prisma.role.upsert({
    where: {
      name: "MEMBER",
    },
    update: {},
    create: {
      name: "MEMBER",
    },
  });

  await prisma.$transaction([
    prisma.membership.create({
      data: {
        userId: joinRequest.userId,
        organizationId: joinRequest.organizationId,
        roleId: memberRole.id,
      },
    }),

    prisma.joinRequest.update({
      where: {
        id: joinRequest.id,
      },
      data: {
        status: "APPROVED",
      },
    }),
  ]);

  redirect("/dashboard");
}


export async function rejectJoinRequest(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Non autenticato");
  }

  const userId = Number(session.user.id);

  const id = formData.get("joinRequestId") as string;
  const joinRequestId = Number(id);

  const joinRequest = await prisma.joinRequest.findUnique({
    where: {
      id: joinRequestId,
    },
  });

  if (!joinRequest) {
    throw new Error("Richiesta non trovata");
  }

  if (joinRequest.status !== "PENDING") {
    throw new Error("La richiesta è già stata gestita");
  }

  if (!joinRequest) {
  throw new Error("Richiesta non trovata");
}

  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      organizationId: joinRequest.organizationId,
      role: {
        name: "ADMIN",
      },
    },
  });

  if (!membership) {
    throw new Error("Non autorizzato");
  }

  await prisma.joinRequest.update({
    where: {
      id: joinRequest.id,
    },
    data: {
      status: "REJECTED",
    },
  });

  redirect("/dashboard");
}

export async function undoRequest(formData:FormData) {


    const id = formData.get("id") as string
    const requestId = Number(id)

    await prisma.joinRequest.delete({

      where : {

        id : requestId

      }

    })


    revalidatePath("/dashboard/requests")
    

  
}