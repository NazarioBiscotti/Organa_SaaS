"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/actions/logout";

export default function Dropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="text-2xl hover:cursor-pointer"
      >
        <i className="fa-solid fa-user" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-40 rounded-md bg-gray-800 shadow-lg">
          <div className="flex flex-col gap-3 p-4 text-sm text-gray-300">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="hover:text-white"
            >
              Dashboard
            </Link>

            <form action={logout}>
              <button
                type="submit"
                className="hover:text-white"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}