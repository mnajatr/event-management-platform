// src/app/dashboard/organizer/page.tsx
'use client';

import ProtectedPage from '@/components/auth/ProtectedPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrganizerDashboardPage() {
  return (
    <ProtectedPage allowedRoles={['ORGANIZER']}>
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-6">
        <h1 className="text-3xl font-bold">Welcome, Organizer!</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">12</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">4</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tickets Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">1,245</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedPage>
  );
}