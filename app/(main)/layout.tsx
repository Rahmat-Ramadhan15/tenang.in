"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname =
    usePathname();

  const navItem = (
    href: string,
    label: string
  ) => {

    const isActive =
      pathname === href;

    return (

      <Link
        href={href}
        className={`block px-4 py-3 rounded-xl transition font-medium
        ${
          isActive
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
            : "text-gray-300 hover:bg-[#232336] hover:text-white"
        }`}
      >

        {label}

      </Link>
    );
  };

  return (

    <main className="flex min-h-screen bg-[#070710] text-white">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#111118] border-r border-[#232336] p-6 flex flex-col">

        {/* LOGO */}
        <div className="mb-10">

          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">

            Tenang.in

          </h1>

        </div>

        {/* NAVIGATION */}
        <nav className="space-y-3">

          {navItem(
            "/dashboard",
            "Dashboard"
          )}

          {navItem(
            "/checkin",
            "Check-in"
          )}

          {navItem(
            "/history",
            "History"
          )}

          {navItem(
            "/profile",
            "Profile"
          )}

        </nav>

      </aside>

      {/* CONTENT */}
      <section className="flex-1 p-8 overflow-y-auto">

        {children}

      </section>

    </main>
  );
}