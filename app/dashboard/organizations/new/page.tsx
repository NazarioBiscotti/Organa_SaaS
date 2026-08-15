import { createOrganization } from "@/actions/organizations";

export default function NewOrganizationPage() {
  return (
    <main className="max-w-md">
      <h1 className="mb-2 text-3xl font-bold">
        Create an organization
      </h1>

      <p className="mb-6 text-neutral-500">
        Create a new organization and become its admin.
      </p>

      <form
        action={createOrganization}
        className="flex flex-col gap-4 rounded border p-6"
      >
        <input
          className="rounded border p-2"
          name="name"
          type="text"
          placeholder="Organization name"
          required
        />

        <button
          className="rounded border px-3 py-2"
          type="submit"
        >
          Create organization
        </button>
      </form>
    </main>
  );
}