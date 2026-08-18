import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { updateDocument } from "@/actions/documents";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditDocumentPage({ params }: Props) {
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
  });

  if (!document) {
    notFound();
  }


  const areas = await prisma.area.findMany({
    where: {
      organization: {
        memberships: {
          some: {
            userId,
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  
  const memberships = await prisma.membership.findMany({
    where: {
      userId,
    },

    include: {
      role: true,
    },
  });

  const isAdmin = memberships[0].role.name === "ADMIN"
    

  

  return (
    <main>
      <div className="mb-10">
        <Link
          href={`/dashboard/documents/${document.id}`}
          className="text-sm text-neutral-500 hover:text-neutral-900"
        >
          ← Back to Document
        </Link>

        <h1 className="mt-4 text-3xl font-bold">
          Edit Document
        </h1>

        <p className="mt-2 text-neutral-500">
          Update the document information.
        </p>
      </div>

      <form
        action={updateDocument}
        className="border rounded p-5 flex flex-col gap-4 max-w-xl"
      >
        <input
          type="hidden"
          name="id"
          value={document.id}
          
        />

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
            defaultValue={document.title}
            className="border rounded p-2 w-full"
            required
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
            defaultValue={document.content}
            className="border rounded p-2 w-full"
            rows={12}
            required
          />
        </div>

        {/* AREA */}

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
            defaultValue={document.areaId}
            className="border rounded p-2 w-full"
          >
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

        {/* ACTIONS */}

        {isAdmin && (

        <div className="flex gap-3">
          <button
            type="submit"
            className="border rounded px-4 py-2"
          >
            Save Changes
          </button>

          <Link
            href={`/dashboard/documents/${document.id}`}
            className="border rounded px-4 py-2"
          >
            Cancel
          </Link>
        </div>

        )}

      </form>
    </main>
  );
}