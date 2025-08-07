'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardSummary() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">120</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Points</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">Rp 35.000</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral Used</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">24</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">8</p>
        </CardContent>
      </Card>
    </div>
  );
}
