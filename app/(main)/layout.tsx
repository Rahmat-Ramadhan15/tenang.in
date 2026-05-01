"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItem = (href: string, label: string) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={`block px-3 py-2 rounded-lg transition
        ${
          isActive
            ? "bg-purple-600 text-white"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <main className="flex min-h-screen bg-[#0f0f14] text-white">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#18181f] p-6 border-r border-gray-800">
        <h1 className="text-2xl font-bold text-purple-400 mb-10">
          tenang.in
        </h1>

        <nav className="space-y-2">
          {navItem("/", "Dashboard")}
          {navItem("/checkin", "Check-in")}
          {navItem("/history", "History")}
        </nav>
      </aside>

      {/* CONTENT */}
      <section className="flex-1 p-8">
        {children}
      </section>

    </main>
  );
}