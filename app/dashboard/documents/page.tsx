import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import createDocument, {
  deleteDocument,
} from "@/actions/documents";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    areaId?: string;
  }>;
};

export default async function DocumentsPage({
  searchParams,
}: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = Number(session.user.id);

  const { areaId } = await searchParams;

  const selectedAreaId = areaId
    ? Number(areaId)
    : undefined;



  const memberships = await prisma.membership.findMany({
    where: {
      userId,
    },
  });

  const organizationIds = memberships.map(
    (membership) => membership.organizationId
  );



  const areas = await prisma.area.findMany({
    where: {
      organizationId: {
        in: organizationIds,
      },
    },
    orderBy: {
      name: "asc",
    },
  });



  const selectedArea = selectedAreaId
    ? areas.find(
        (area) => area.id === selectedAreaId
      )
    : undefined;

 

  const documents = await prisma.document.findMany({
    where: {
      area: {
        organizationId: {
          in: organizationIds,
        },
      },
    },
    include: {
      area: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });



  if (selectedAreaId && !selectedArea) {
    redirect("/dashboard/documents");
  }

  return (
    <main>
      {/* HEADER */}

      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          Documents
        </h1>

        <p className="mt-2 text-neutral-500">
          Create and manage your documents.
        </p>
      </div>

      {/* CREATE DOCUMENT */}

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-5">
          Create a new document
        </h2>

        <form
          className="border rounded p-5 flex flex-col gap-4 max-w-xl"
          action={createDocument}
        >
          {/* TITLE */}

          <div>
            <label
              htmlFor="title"
              className="block mb-1 font-medium"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder="Document title"
              className="border rounded p-2 w-full"
            />
          </div>

          {/* CONTENT */}

          <div>
            <label
              htmlFor="content"
              className="block mb-1 font-medium"
            >
              Content
            </label>

            <textarea
              id="content"
              name="content"
              placeholder="Type your document..."
              rows={8}
              className="border rounded p-2 w-full"
            />
          </div>

          {/* AREA */}

          {selectedArea ? (
            <>
              <input
                type="hidden"
                name="area"
                value={selectedArea.id}
              />

              <div>
                <label className="block mb-1 font-medium">
                  Area
                </label>

                <div className="border rounded p-2 bg-neutral-50">
                  {selectedArea.name}
                </div>
              </div>
            </>
          ) : (
            <div>
              <label
                htmlFor="area"
                className="block mb-1 font-medium"
              >
                Area
              </label>

              <select
                id="area"
                name="area"
                className="border rounded p-2 w-full"
                defaultValue=""
              >
                <option value="" disabled>
                  Select an area
                </option>

                {areas.map((area) => (
                  <option
                    key={area.id}
                    value={area.id}
                  >
                    {area.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="border rounded px-4 py-2 w-fit"
          >
            Create Document
          </button>
        </form>
      </section>

      {/* DOCUMENT LIST */}

      <section>
        <h2 className="text-2xl font-semibold mb-5">
          All Documents
        </h2>

        {documents.length === 0 ? (
          <div className="border rounded p-8">
            <h3 className="text-lg font-semibold">
              No documents yet
            </h3>

            <p className="mt-2 text-neutral-500">
              Create your first document to start organizing
              your knowledge.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {documents.map((document) => (
              <div
                key={document.id}
                className="border rounded p-5"
              >
                <Link
                  href={`/dashboard/documents/${document.id}`}
                  className="block hover:bg-neutral-50 rounded p-2 -m-2"
                >
                  <h3 className="text-xl font-semibold">
                    {document.title}
                  </h3>

                  <p className="mt-2 text-sm text-neutral-500">
                    Area: {document.area.name}
                  </p>

                  <p className="mt-1 text-sm text-neutral-500">
                    Updated{" "}
                    {document.updatedAt.toLocaleDateString()}
                  </p>
                </Link>

                <div className="flex gap-3 mt-5">
                  <Link
                    href={`/dashboard/documents/${document.id}/editForm`}
                    className="border rounded px-3 py-2"
                  >
                    Edit
                  </Link>

                  <form action={deleteDocument}>
                    <input
                      type="hidden"
                      name="id"
                      value={document.id}
                    />

                    <button
                      type="submit"
                      className="border rounded px-3 py-2"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}