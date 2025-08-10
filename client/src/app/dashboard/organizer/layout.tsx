"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const menuItems = [
  { label: "📋 Summary", href: "/dashboard/organizer" },
  { label: "🎟️ Events", href: "/dashboard/organizer/events" },
  { label: "📊 Statistics", href: "/dashboard/organizer/statistics" },
];

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:block w-64 bg-gray-800 text-white p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-6">📁 Organizer Panel</h1>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-3 py-2 rounded hover:bg-gray-700 transition",
                pathname === item.href && "bg-gray-700 font-semibold"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Hamburger button (mobile) */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar Mobile - slide in from right */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-64 bg-gray-800 text-white p-6 space-y-4 transform transition-transform duration-300 z-40",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 left-4 p-2 rounded-md bg-gray-700 hover:bg-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h1 className="text-2xl font-bold mb-6 mt-10">📁 Organizer Panel</h1>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-3 py-2 rounded hover:bg-gray-700 transition",
                pathname === item.href && "bg-gray-700 font-semibold"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}