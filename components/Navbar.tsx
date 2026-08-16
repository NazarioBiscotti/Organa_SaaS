import Link from "next/link";
import { auth } from "@/auth";
import Dropdown from "./Dropdown";

export default async function Navbar() {
  const session = await auth();

  return (
    <>
    <nav className="sticky top-0 z-50 border-b bg-gray-800/20 backdrop-blur-xl ">
      <div className=" flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
     

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

    <div className="flex justify-center w-full  md:hidden p-1 ">

       <div className=" flex justify-evenly gap-5 mt-3 rounded-3xl border p-2 w-full">
     

        <Link
          className="rounded  hover:bg-neutral-100"
          href="/dashboard"
        >
          Dashboard
        </Link>

        <Link
          className="rounded  hover:bg-neutral-100"
          href="/dashboard/areas"
        >
          Areas
        </Link>

        <Link
          className="rounded  hover:bg-neutral-100"
          href="/dashboard/documents"
        >
          Documents
        </Link>

    </div>
    </div>
    </>
  );
}