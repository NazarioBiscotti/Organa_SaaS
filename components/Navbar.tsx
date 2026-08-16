import Link from "next/link";
import { auth } from "@/auth";
import Dropdown from "./Dropdown";

export default async function Navbar() {
  const session = await auth();

  return (
    <>
    <nav className="sticky top-0 z-50 border-b bg-gray-800/20 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2 text-xl font-semibold sm:text-2xl"
        >
          <div className="hidden">

          <img
            src="/files/OrganaLogo.png"
            alt="Organa"
            className="h-8 w-8 object-contain"
          />

          <span className="logo">Organa</span>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex w-full justify-between items-center gap-3 text-sm sm:gap-5 sm:text-base">
          <Link
            href="/"
            className="whitespace-nowrap hover:underline"
          >
            Home
          </Link>

          {session ? (
            <>
              <Link
                href="/dashboard"
                className="whitespace-nowrap hover:underline"
              >
                Dashboard
              </Link>

              {/* Username - hidden on mobile */}

              <div className="flex gap-5">

              <span className="hidden max-w-32 truncate sm:block">
                Welcome {session.user?.name}
              </span>
              <Dropdown />
              </div>

            </>
          ) : (
            <>
              <Link
                href="/login"
                className="whitespace-nowrap hover:underline"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="whitespace-nowrap hover:underline"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

          {/* Topbar  */}
    </nav>

    <div className="block md:hidden ">

       <div className="m-auto flex border-r p-3 mt-3 rounded-3xl border w-fit">
     

      <nav className="flex gap-2">
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
    </div>
    </div>
    </>
  );
}