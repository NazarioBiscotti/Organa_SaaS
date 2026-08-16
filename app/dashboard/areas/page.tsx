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
      role: true,
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

  const isAdmin = memberships.some(
  (membership) => membership.role.name === "ADMIN"
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
        <h2 className="mb-5 text-2xl font-semibold">
          Your Areas
        </h2>

        {areas.length === 0 ? (
          <div className="rounded border p-8">
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
            {areas.map((area) => {
              const membership = memberships.find(
                (membership) =>
                  membership.organizationId ===
                  area.organizationId
              );

              const isAdmin =
                membership?.role.name === "ADMIN";

              return (
                <div
                  key={area.id}
                  className="rounded border p-5"
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

                  <div className="mt-5 flex gap-3">
                    {/* VISIBILE A TUTTI */}
                    <Link
                      href={`/dashboard/areas/${area.id}`}
                      className="rounded border px-3 py-2"
                    >
                      Open
                    </Link>

                    {/* SOLO ADMIN */}
                    {isAdmin && (
                      <>
                        <Link
                          href={`/dashboard/areas/${area.id}/editForm`}
                          className="rounded border px-3 py-2"
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
                            className="rounded border px-3 py-2"
                          >
                            Delete
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CREATE AREA */}

      {isAdmin && (


      <section className="mt-10">
        <h2 className="mb-5 text-2xl font-semibold">
          Create a new area
        </h2>

        <form
          className="flex max-w-md flex-col gap-3 rounded border p-5"
          action={createArea}
        >
          <input
            className="rounded border p-2"
            placeholder="Name"
            name="name"
            type="text"
          />

          <input
            className="rounded border p-2"
            placeholder="Description"
            name="description"
            type="text"
          />

          <select
            className="rounded border p-2"
            name="organization"
            id="organization"
            defaultValue={organizationId ?? ""}
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
            className="rounded border p-2"
            type="submit"
          >
            Create Area
          </button>
        </form>
      </section>



      )}
    </main>
  );
}