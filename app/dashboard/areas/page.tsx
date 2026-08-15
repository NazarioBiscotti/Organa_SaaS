import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import createArea, { deleteArea } from "@/actions/areas";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    organization?: string;
  }>;
};

export default async function AreasPage({
  searchParams,
}: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = Number(session.user.id);

  const { organization } = await searchParams;

  const organizationId = organization
    ? Number(organization)
    : undefined;

  const memberships = await prisma.membership.findMany({
    where: {
      userId,
      ...(organizationId
        ? {
            organizationId,
          }
        : {}),
    },
    include: {
      organization: true,
    },
  });

  if (
    organizationId &&
    memberships.length === 0
  ) {
    redirect("/dashboard");
  }

  const organizationIds = memberships.map(
    (membership) => membership.organizationId
  );

  const areas = await prisma.area.findMany({
    where: {
      organizationId: {
        in: organizationIds,
      },
    },
    include: {
      organization: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const organizations = memberships.map(
    (membership) => membership.organization
  );

  return (
    <main>
      {/* HEADER */}

      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          Areas
        </h1>

        <p className="mt-2 text-neutral-500">
          Organize your knowledge into areas.
        </p>
      </div>

      {/* AREAS */}

      <section>
        <h2 className="text-2xl font-semibold mb-5">
          Your Areas
        </h2>

        {areas.length === 0 ? (
          <div className="border rounded p-8">
            <h3 className="text-lg font-semibold">
              No areas yet
            </h3>

            <p className="mt-2 text-neutral-500">
              Create your first area to start
              organizing your knowledge.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {areas.map((area) => (
              <div
                key={area.id}
                className="border rounded p-5"
              >
                <h3 className="text-xl font-semibold">
                  {area.name}
                </h3>

                <p className="mt-2 text-neutral-500">
                  {area.description}
                </p>

                <p className="mt-3 text-sm">
                  Organization:{" "}
                  {area.organization.name}
                </p>

                <div className="flex gap-3 mt-5">
                  <Link
                    href={`/dashboard/areas/${area.id}`}
                    className="border rounded px-3 py-2"
                  >
                    Open
                  </Link>

                  <Link
                    href={`/dashboard/areas/${area.id}/editForm`}
                    className="border rounded px-3 py-2"
                  >
                    Edit
                  </Link>

                  <form action={deleteArea}>
                    <input
                      type="hidden"
                      name="id"
                      value={area.id}
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

      {/* CREATE AREA */}

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-5">
          Create a new area
        </h2>

        <form
          className="border rounded p-5 flex flex-col gap-3 max-w-md"
          action={createArea}
        >
          <input
            className="border rounded p-2"
            placeholder="Name"
            name="name"
            type="text"
          />

          <input
            className="border rounded p-2"
            placeholder="Description"
            name="description"
            type="text"
          />

          <select
            className="border rounded p-2"
            name="organization"
            id="organization"
            defaultValue={
              organizationId ?? ""
            }
          >
            {!organizationId && (
              <option
                value=""
                disabled
              >
                Select an organization
              </option>
            )}

            {organizations.map((organization) => (
              <option
                value={organization.id}
                key={organization.id}
              >
                {organization.name}
              </option>
            ))}
          </select>

          <button
            className="border rounded p-2"
            type="submit"
          >
            Create Area
          </button>
        </form>
      </section>
    </main>
  );
}