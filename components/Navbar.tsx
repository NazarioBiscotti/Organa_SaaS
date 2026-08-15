import Link from "next/link";
import { auth } from "@/auth";
import Dropdown from "./Dropdown";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-50 border-b bg-gray-800/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-3">
        <Link
          href="/"
          className="font-bold"
        >
          Mini CRM
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="hover:underline"
          >
            Home
          </Link>

          {session ? (
            <>
              <Link
                href="/dashboard"
                className="hover:underline"
              >
                Dashboard
              </Link>

              <span>
                {session.user?.name}
              </span>

              <Dropdown />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:underline"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="hover:underline"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}