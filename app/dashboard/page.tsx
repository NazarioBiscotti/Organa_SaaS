import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { approveJoinRequest, rejectJoinRequest } from "@/actions/organizations";


export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = Number(session.user.id);

  const memberships = await prisma.membership.findMany({
    where: {
      userId,
    },
    include: {
      organization: {
        include: {
          areas: {
            include: {
              documents: true,
            },
          },
        },
      },
      role: true,
    },
  });

  const adminOrganizationIds = memberships
  .filter((membership) => membership.role.name === "ADMIN")
  .map((membership) => membership.organization.id);

const pendingJoinRequests =
  adminOrganizationIds.length > 0
    ? await prisma.joinRequest.findMany({
        where: {
          organizationId: {
            in: adminOrganizationIds,
          },
          status: "PENDING",
        },
        include: {
          user: true,
          organization: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    : [];

  return (
    <main>
      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          Welcome {session.user.name}
        </h1>

        <p className="mt-2 text-neutral-500">
          Manage your organizations and knowledge.
        </p>
      </div>

      {memberships.length === 0 ? (
        <div className="rounded border p-6">
          <h2 className="text-2xl font-semibold">
            You don't belong to any organization yet
          </h2>

          <p className="mt-2 text-neutral-500">
            Create a new organization or find an existing one
            to request access.
          </p>

          <div className="mt-6 flex gap-3">
            <Link
              href="/dashboard/organizations/new"
              className="rounded border px-4 py-2 hover:underline"
            >
              Create an organization
            </Link>

            <Link
              href="/dashboard/organizations/find"
              className="rounded border px-4 py-2 hover:underline"
            >
              Find an organization
            </Link>
          </div>
        </div>
      ) : (
        <>

        {pendingJoinRequests.length > 0 && (
  <section className="mb-10">
    <h2 className="mb-5 text-2xl font-semibold">
      Pending Join Requests
    </h2>

    <div className="grid gap-4">
      {pendingJoinRequests.map((request) => (
        <div
          key={request.id}
          className="rounded border p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold">
                {request.user.name}
              </h3>

              <p className="text-sm text-neutral-500">
                wants to join {request.organization.name}
              </p>

              <p className="mt-1 text-xs text-neutral-400">
                {request.user.email}
              </p>
            </div>

            <div className="flex gap-2">
              <form action={approveJoinRequest}>
                <input
                  type="hidden"
                  name="joinRequestId"
                  value={request.id}
                />

                <button
                  type="submit"
                  className="rounded border px-3 py-2 hover:bg-neutral-100"
                >
                  Approve
                </button>
              </form>

              <form action={rejectJoinRequest}>
                <input
                  type="hidden"
                  name="joinRequestId"
                  value={request.id}
                />

                <button
                  type="submit"
                  className="rounded border px-3 py-2 hover:bg-neutral-100"
                >
                  Reject
                </button>
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
)}
          <h2 className="mb-5 text-2xl font-semibold">
            Your Organizations
          </h2>

          <div className="grid gap-5">
            {memberships.map((membership) => (
              <div
                key={membership.id}
                className="rounded border p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {membership.organization.name}
                    </h3>

                    <p className="text-sm text-neutral-500">
                      Role: {membership.role.name}
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/areas?organization=${membership.organization.id}`}
                    className="rounded border px-3 py-2 hover:underline"
                  >
                    Open
                  </Link>
                </div>

                <div className="mt-5">
                  <p className="text-sm text-neutral-500">
                    Areas
                  </p>

                  <p className="text-lg">
                    {membership.organization.areas.length}
                  </p>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-neutral-500">
                    Documents
                  </p>

                  <p className="text-lg">
                    {membership.organization.areas.reduce(
                      (total, area) =>
                        total + area.documents.length,
                      0
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}