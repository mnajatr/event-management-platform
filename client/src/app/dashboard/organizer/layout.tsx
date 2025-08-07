"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "📋 Summary", href: "/dashboard/organizer" },
  { label: "🎟️ Events", href: "/dashboard/organizer/events" },
  { label: "💰 Transactions", href: "/dashboard/organizer/transactions" },
  { label: "🧑‍🤝‍🧑 Attendees", href: "/dashboard/organizer/attendees" },
  { label: "📊 Statistics", href: "/dashboard/organizer/statistics" },
];

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
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
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}