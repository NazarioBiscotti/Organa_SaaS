
"use client";

import { useState } from "react";
import { register } from "@/actions/auth";
import Link from "next/link";

export default function Register() {
  const [createOrganization, setCreateOrganization] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-bold">
          Create your account
        </h1>

        <p className="mb-6 text-neutral-500">
          Create your account to get started.
        </p>

        <form
          action={register}
          className="flex flex-col gap-4 rounded border p-6"
        >
          <input
            className="rounded border p-2"
            name="name"
            type="text"
            placeholder="Your name"
            required
          />

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

          <label className="flex items-center gap-2">
            <input
              name="createOrganization"
              type="checkbox"
              value="true"
              checked={createOrganization}
              onChange={(event) =>
                setCreateOrganization(event.target.checked)
              }
            />

            <span>Create an organization</span>
          </label>

          {createOrganization && (
            <input
              className="rounded border p-2"
              name="organizationName"
              type="text"
              placeholder="Organization name"
              required
            />
          )}

          <button
            className="rounded border px-3 py-2"
            type="submit"
          >
            Create account
          </button>
        </form>

        <p className="mt-5 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}

