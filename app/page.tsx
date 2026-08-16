import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="mx-auto max-w-5xl px-6 pt-32 text-center">
        <div className="mx-auto mb-6 inline-block rounded-full border px-4 py-2 text-sm text-neutral-600">
          Organize. Collaborate. Share knowledge.
        </div>

        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
          Organize your knowledge
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-500">
          Organa gives teams a simple place to organize their
          knowledge, manage areas and collaborate on documents.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          {session?.user ? (
            <Link
              href="/dashboard"
              className="rounded border px-5 py-3 font-medium hover:bg-neutral-50"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="rounded bg-black px-5 py-3 font-medium text-white hover:bg-neutral-800"
              >
                Get started
              </Link>

              <Link
                href="/login"
                className="rounded border px-5 py-3 font-medium hover:bg-neutral-50"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto mt-32 max-w-5xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            One place for your organization's knowledge
          </h2>

          <p className="mt-4 leading-7 text-neutral-500">
            Keep your organization's information structured and
            accessible. Create dedicated areas, organize documents
            and collaborate with the people who belong to your
            organization.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto mt-16 max-w-5xl px-6 pb-32">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold">
              Organizations
            </h3>

            <p className="mt-3 leading-6 text-neutral-500">
              Create organizations and invite people through a
              simple membership and request system.
            </p>
          </div>

          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold">
              Areas
            </h3>

            <p className="mt-3 leading-6 text-neutral-500">
              Structure your organization's knowledge into
              dedicated areas that keep information organized.
            </p>
          </div>

          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold">
              Documents
            </h3>

            <p className="mt-3 leading-6 text-neutral-500">
              Create and manage documents inside each area,
              keeping your team's knowledge easy to find.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}