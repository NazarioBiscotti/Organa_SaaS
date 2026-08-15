import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AreaPage({ params }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = Number(session.user.id);

  const { id } = await params;

  const areaId = Number(id);

  if (!areaId) {
    notFound();
  }

  const area = await prisma.area.findUnique({
    where: {
      id: areaId,
    },
    include: {
      documents: true,
    },
  });

  if (!area) {
    notFound();
  }

  // Verifica che l'utente appartenga
  // all'Organization dell'Area.
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      organizationId: area.organizationId,
    },
  });

  if (!membership) {
    notFound();
  }

  return (
    <main>
      {/* AREA HEADER */}

      <div className="mb-10">
        <Link
          href="/dashboard/areas"
          className="text-sm text-neutral-500 hover:text-neutral-900"
        >
          ← Areas
        </Link>

        <h1 className="mt-4 text-3xl font-bold">
          {area.name}
        </h1>

        {area.description && (
          <p className="mt-2 text-neutral-500">
            {area.description}
          </p>
        )}
      </div>

      {/* DOCUMENTS */}

      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-semibold">
            Documents
          </h2>

          <Link
            href={`/dashboard/documents?areaId=${area.id}`}
            className="border rounded px-3 py-2"
          >
            + New Document
          </Link>
        </div>

        {area.documents.length === 0 ? (
          <div className="border rounded p-8">
            <h3 className="text-lg font-semibold">
              No documents yet
            </h3>

            <p className="mt-2 text-neutral-500">
              Create the first document for this area.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {area.documents.map((document) => (
              <Link
                key={document.id}
                href={`/dashboard/documents/${document.id}`}
                className="block border rounded p-5 hover:bg-neutral-50"
              >
                <h3 className="text-xl font-semibold">
                  {document.title}
                </h3>

                <p className="mt-2 text-sm text-neutral-500">
                  Updated{" "}
                  {document.updatedAt.toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}