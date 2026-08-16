import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-56 border-r min-h-screen p-5">
     

      <nav className="flex flex-col gap-2">
        <Link
          className="rounded px-3 py-2 hover:bg-neutral-100"
          href="/dashboard"
        >
          Dashboard
        </Link>

        <Link
          className="rounded px-3 py-2 hover:bg-neutral-100"
          href="/dashboard/areas"
        >
          Areas
        </Link>

        <Link
          className="rounded px-3 py-2 hover:bg-neutral-100"
          href="/dashboard/documents"
        >
          Documents
        </Link>
      </nav>
    </aside>
  );
}