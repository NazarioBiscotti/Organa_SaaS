import { prisma } from "@/lib/prisma";
import { joinOrganization } from "@/actions/organizations";
import { auth } from "@/auth";

export default async function findOrganizzation() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const userId = Number(session.user.id);

  const organizations = await prisma.organization.findMany({
    where: {
      memberships: {
        none: {
          userId: userId,
        },
      },

      joinRequests: {
        none: {
          userId: userId,
          status: "PENDING",
        },
      },
    },
  });

  return (
    <main>
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Organizations</h1>

        <p className="mt-2 text-neutral-500">
          Find the organization you want to join in.
        </p>
      </div>

      <section>
        {organizations.map((organization) => (
          <div key={organization.id} className="border rounded p-8">
            <div>{organization.name}</div>

            <form action={joinOrganization}>
              <input
                type="hidden"
                name="organizationId"
                value={organization.id}
              />

              <button
                className="border my-5 rounded p-3 hover:bg-white"
                type="submit"
              >
                Request to Join
              </button>
            </form>
          </div>
        ))}
      </section>
    </main>
  );
}