"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardStatistics } from "@/components/dashboard/DashboardStatistics";
import ProtectedPage from "@/components/auth/ProtectedPage";

export default function DashboardPage() {
  return (
    <ProtectedPage allowedRoles={["ORGANIZER"]}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Organizer Dashboard</h1>

        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">📋 Summary</TabsTrigger>
            <TabsTrigger value="statistics">📊 Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <DashboardContent />
          </TabsContent>

          <TabsContent value="statistics">
            <DashboardStatistics />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedPage>
  );
}
