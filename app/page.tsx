import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  console.log(session?.user?.id);

  return (
    <main className="min-h-screen">
      <section className="mx-auto mt-32 max-w-3xl text-center">
        <h1 className="text-5xl font-semibold tracking-tight">
          Organize your knowledge
        </h1>

        <p className="mt-6 text-lg text-neutral-500">
          A simple SaaS to manage areas and documents.
        </p>
      </section>
    </main>
  );
}