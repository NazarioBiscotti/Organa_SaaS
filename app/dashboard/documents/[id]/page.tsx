import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DocumentPage({ params }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = Number(session.user.id);

  const { id } = await params;

  const documentId = Number(id);

  if (!documentId) {
    notFound();
  }

  const document = await prisma.document.findFirst({
    where: {
      id: documentId,

      area: {
        organization: {
          memberships: {
            some: {
              userId,
            },
          },
        },
      },
    },
    include: {
      area: true,
      createdBy: true,
    },
  });

  if (!document) {
    notFound();
  }

  return (
    <main>
      {/* NAVIGATION */}

      <div className="mb-10">
        <div className="flex gap-4 text-sm">
          <Link
            href="/dashboard/documents"
            className="text-neutral-500 hover:text-neutral-900"
          >
            ← Documents
          </Link>

          <Link
            href={`/dashboard/areas/${document.area.id}`}
            className="text-neutral-500 hover:text-neutral-900"
          >
            ← {document.area.name}
          </Link>
        </div>

        {/* HEADER */}

        <h1 className="mt-5 text-3xl font-bold">
          {document.title}
        </h1>

        <div className="mt-3 text-sm text-neutral-500 space-y-1">
          <p>
            Area: {document.area.name}
          </p>

          <p>
            Created by: {document.createdBy.name}
          </p>

          <p>
            Updated:{" "}
            {document.updatedAt.toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* CONTENT */}

      <article className="border rounded p-6">
        <div className="whitespace-pre-wrap">
          {document.content}
        </div>
      </article>

      {/* ACTIONS */}

      <div className="mt-5 flex gap-3">
        <Link
          href={`/dashboard/documents/${document.id}/editForm`}
          className="border rounded px-3 py-2"
        >
          Edit
        </Link>

        <Link
          href={`/dashboard/areas/${document.area.id}`}
          className="border rounded px-3 py-2"
        >
          Back to Area
        </Link>
      </div>
    </main>
  );
}