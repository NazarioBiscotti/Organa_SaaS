"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [error, setError] = useState("");

  async function handleSubmit(
    formData: FormData
  ) {
    setError("");

    const email = String(
      formData.get("email") ?? ""
    );

    const password = String(
      formData.get("password") ?? ""
    );

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email o password non corretti");
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-bold">
          Login
        </h1>

        <p className="mb-6 text-neutral-500">
          Log in to access your dashboard.
        </p>

        <form
          className="flex flex-col gap-4 rounded border p-6"
          action={handleSubmit}
        >
          <input
            className="rounded border p-2"
            name="email"
            type="email"
            placeholder="Email"
            required
          />

          <input
            className="rounded border p-2"
            name="password"
            type="password"
            placeholder="Password"
            required
          />

          {error && (
            <p className="-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

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