'use client';

import ProtectedPage from '@/components/auth/ProtectedPage';
import DashboardSummary from '@/components/dashboard/DasboardSummary';

export default function DashboardPage() {
  return (
    <ProtectedPage allowedRoles={['ORGANIZER']}>
      <div>
        <h1 className="text-2xl font-bold mb-2">Organizer Dashboard</h1>
        <p className="text-muted-foreground mb-4">Manage your events, users, and insights here.</p>
        <DashboardSummary />
      </div>
    </ProtectedPage>
  );
}
