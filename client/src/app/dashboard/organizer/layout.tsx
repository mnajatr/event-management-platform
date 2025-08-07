// src/app/dashboard/organizer/layout.tsx
import type { ReactNode } from 'react';

export default function OrganizerDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="bg-muted p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-4">Organizer Menu</h2>
        {/* Sidebar content */}
        <ul className="space-y-2 text-sm">
          <li>🏠 Dashboard</li>
          <li>🎟️ Events</li>
          <li>📊 Reports</li>
        </ul>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}