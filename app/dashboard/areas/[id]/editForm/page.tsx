import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import updateArea from "@/actions/areas";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAreaPage({ params }: Props) {
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
  });

  if (!area) {
    notFound();
  }

  // Verifica che l'utente appartenga all'Organization dell'Area.
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
      <div className="mb-10">
        <Link
          href={`/dashboard/areas/${area.id}`}
          className="text-sm text-neutral-500 hover:text-neutral-900"
        >
          ← Back to Area
        </Link>

        <h1 className="mt-4 text-3xl font-bold">
          Edit Area
        </h1>

        <p className="mt-2 text-neutral-500">
          Update the information of this area.
        </p>
      </div>

      <form
        action={updateArea}
        className="border rounded p-5 flex flex-col gap-4 max-w-md"
      >
        <input
          type="hidden"
          name="id"
          value={area.id}
        />

        <div>
          <label
            htmlFor="name"
            className="block mb-1 font-medium"
          >
            Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            defaultValue={area.name}
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block mb-1 font-medium"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            defaultValue={area.description ?? ""}
            className="border rounded p-2 w-full"
            rows={4}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="border rounded px-4 py-2"
          >
            Save Changes
          </button>

          <Link
            href={`/dashboard/areas/${area.id}`}
            className="border rounded px-4 py-2"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}