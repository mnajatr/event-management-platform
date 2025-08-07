"use client";

import { useEffect, useState } from "react";
import {
  getMyEvents,
  getOrganizerSummary,
  getUpcomingEvent,
} from "@/services/event.service";
import { TEvent } from "@/types/event.type";
import { OrganizerSummary } from "@/types/organizer.type";

export const DashboardContent = () => {
  const [events, setEvents] = useState<TEvent[]>([]);
  const [summary, setSummary] = useState<OrganizerSummary | null>(null);
  const [upcomingEvent, setUpcomingEvent] = useState<TEvent | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [summaryData, eventData, upcoming] = await Promise.all([
        getOrganizerSummary(),
        getMyEvents(),
        getUpcomingEvent(),
      ]);
      setSummary(summaryData);
      setEvents(eventData);
      setUpcomingEvent(upcoming);
    }

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Upcoming Event Box */}
      {upcomingEvent && (
        <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded shadow-sm">
          <h2 className="text-lg font-semibold mb-1">🎉 Upcoming Event</h2>
          <p className="font-medium">{upcomingEvent.name}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(upcomingEvent.startDate).toLocaleDateString("id-ID")}
          </p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Events</p>
          <p className="text-xl font-semibold">{summary?.totalEvents ?? "-"}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Active Events</p>
          <p className="text-xl font-semibold">
            {summary?.activeEvents ?? "-"}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Transactions</p>
          <p className="text-xl font-semibold">
            {summary?.successfulTransactions ?? "-"}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-xl font-semibold">
            Rp {summary?.totalRevenue?.toLocaleString("id-ID") ?? "-"}
          </p>
        </div>
      </div>

      {/* Event List */}
      <h2 className="text-lg font-semibold mb-2">Your Events</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="border rounded p-4 shadow-sm hover:shadow-md"
          >
            <p className="font-semibold">{event.name}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(event.startDate).toLocaleDateString("id-ID")}
            </p>
            <p className="text-sm">
              {event.basePrice === 0
                ? "Free"
                : `Rp ${event.basePrice.toLocaleString("id-ID")}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};