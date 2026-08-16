import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  approveJoinRequest,
  rejectJoinRequest,
  createOrganization,
} from "@/actions/organizations";

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

  const sentRequests = await prisma.joinRequest.findMany({
    where: {
      userId,
      status: "PENDING",
    },
  });

  return (
    <main className="w-full max-w-5xl">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Welcome {session.user.name}
        </h1>

        <p className="mt-2 text-sm text-neutral-500 sm:text-base">
          Manage your organizations and knowledge.
        </p>
      </div>

      {/* Sent requests */}
      {sentRequests.length !== 0 && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded border p-3 text-sm sm:justify-end">
          <span>
            You have {sentRequests.length}{" "}
            {sentRequests.length === 1 ? "request" : "requests"} sent
          </span>

          <Link
            href="/dashboard/requests"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-neutral-100"
            aria-label="View requests"
          >
            <i className="fa-solid fa-magnifying-glass" />
          </Link>
        </div>
      )}

      {/* No organizations */}
      {memberships.length === 0 ? (
        <div className="rounded border p-5 sm:p-6">
          <h2 className="text-xl font-semibold sm:text-2xl">
            You don't belong to any organization yet
          </h2>

          <p className="mt-2 text-sm text-neutral-500 sm:text-base">
            Create a new organization or find an existing one to request
            access.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/organizations/new"
              className="rounded border px-4 py-2 text-center hover:bg-neutral-50"
            >
              Create an organization
            </Link>

            <Link
              href="/dashboard/organizations/find"
              className="rounded border px-4 py-2 text-center hover:bg-neutral-50"
            >
              Find an organization
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Pending requests */}
          {pendingJoinRequests.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-5 text-xl font-semibold sm:text-2xl">
                Pending Join Requests
              </h2>

              <div className="grid gap-4">
                {pendingJoinRequests.map((request) => (
                  <div key={request.id} className="rounded border p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="font-semibold">
                          {request.user.name}
                        </h3>

                        <p className="text-sm text-neutral-500">
                          wants to join {request.organization.name}
                        </p>

                        <p className="mt-1 break-all text-xs text-neutral-400">
                          {request.user.email}
                        </p>
                      </div>

                      <div className="flex w-full gap-2 sm:w-auto">
                        <form action={approveJoinRequest} className="flex-1 sm:flex-none">
                          <input
                            type="hidden"
                            name="joinRequestId"
                            value={request.id}
                          />

                          <button
                            type="submit"
                            className="w-full rounded border px-3 py-2 hover:bg-neutral-100 sm:w-auto"
                          >
                            Approve
                          </button>
                        </form>

                        <form action={rejectJoinRequest} className="flex-1 sm:flex-none">
                          <input
                            type="hidden"
                            name="joinRequestId"
                            value={request.id}
                          />

                          <button
                            type="submit"
                            className="w-full rounded border px-3 py-2 hover:bg-neutral-100 sm:w-auto"
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

          {/* Organizations header */}
          <div className="mb-5 flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-semibold">Your Organizations</h2>

              <Link
                href="/dashboard/organizations/find"
                className="rounded border px-4 py-2 text-center text-sm hover:bg-neutral-50"
              >
                Find an organization
              </Link>
            </div>

            {/* Create organization */}
            <form
              action={createOrganization}
              className="flex w-full flex-col gap-2 sm:flex-row"
            >
              <input
                name="name"
                className="min-w-0 flex-1 rounded border p-2"
                placeholder="Create new organization"
                type="text"
              />

              <button
                type="submit"
                className="rounded border px-4 py-2 text-gray-800 hover:bg-neutral-50 sm:w-auto"
              >
                Create
              </button>
            </form>
          </div>

          {/* Organizations */}
          <div className="grid gap-4 sm:gap-5">
            {memberships.map((membership) => (
              <div
                key={membership.id}
                className="rounded border p-4 sm:p-5"
              >
                {/* Organization header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="wrap-break-words text-lg font-semibold sm:text-xl">
                      {membership.organization.name}
                    </h3>

                    <p className="text-sm text-neutral-500">
                      Role: {membership.role.name}
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/areas?organization=${membership.organization.id}`}
                    className="w-full rounded border px-3 py-2 text-center text-sm hover:bg-neutral-50 sm:w-auto"
                  >
                    Open
                  </Link>
                </div>

                {/* Stats */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded border p-3">
                    <p className="text-xs text-neutral-500 sm:text-sm">
                      Areas
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {membership.organization.areas.length}
                    </p>
                  </div>

                  <div className="rounded border p-3">
                    <p className="text-xs text-neutral-500 sm:text-sm">
                      Documents
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {membership.organization.areas.reduce(
                        (total, area) => total + area.documents.length,
                        0,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}