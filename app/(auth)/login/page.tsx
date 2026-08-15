import { signIn } from "@/auth";
import Link from "next/link";

export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-bold">
          Welcome back
        </h1>

        <p className="mb-6 text-neutral-500">
          Log in to access your dashboard.
        </p>

        <form
          className="flex flex-col gap-4 border rounded p-6"
          action={async (formData) => {
            "use server";

            await signIn("credentials", {
              email: formData.get("email"),
              password: formData.get("password"),
              redirectTo: "/dashboard",
            });
          }}
        >
          <input
            className="border rounded p-2"
            name="email"
            type="email"
            placeholder="Email"
            required
          />

          <input
            className="border rounded p-2"
            name="password"
            type="password"
            placeholder="Password"
            required
          />

          <button
            className="rounded border px-3 py-2"
            type="submit"
          >
            Login
          </button>
        </form>

        <p className="mt-5 text-center text-sm">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}