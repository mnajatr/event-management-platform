"use client";

import { useEffect, useState } from "react";
import {
  getDailyStats,
  getMonthlyStats,
  getYearlyStats,
} from "@/services/statistics.service";
import { getOrganizerEvents } from "@/services/event.service";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

type TStat = {
  label: string;
  totalRevenue: number;
  attendeeCount: number;
  transactionCount: number;
};

type TEvent = {
  id: number;
  name: string;
};

export const DashboardStatistics = () => {
  const [filter, setFilter] = useState<"daily" | "monthly" | "yearly">("daily");
  const [eventId, setEventId] = useState<string>("all");
  const [events, setEvents] = useState<TEvent[]>([]);
  const [data, setData] = useState<TStat[]>([]);
  const [loading, setLoading] = useState(true);

const fetchData = async () => {
  setLoading(true);
  try {
    let result: TStat[] = [];

    const parsedEventId = eventId !== "all" ? parseInt(eventId) : undefined;

    if (filter === "daily") result = await getDailyStats(parsedEventId);
    else if (filter === "monthly") result = await getMonthlyStats(parsedEventId);
    else result = await getYearlyStats(parsedEventId);

    setData(result);
  } catch (error) {
    console.error("Failed to fetch stats", error);
  } finally {
    setLoading(false);
  }
};
  const fetchEvents = async () => {
    try {
      const eventList = await getOrganizerEvents();
      setEvents(eventList);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchData();
  }, [filter, eventId]);

  const totalRevenue = data.reduce((acc, curr) => acc + curr.totalRevenue, 0);
  const totalAttendees = data.reduce((acc, curr) => acc + curr.attendeeCount, 0);
  const totalTransactions = data.reduce((acc, curr) => acc + curr.transactionCount, 0);

  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">📊 Statistics</h2>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={(val) => setFilter(val as typeof filter)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          <Select value={eventId} onValueChange={(val) => setEventId(val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id.toString()}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 🔍 Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <h4 className="font-semibold mb-1">💰 Revenue</h4>
          <p className="text-xl font-bold">Rp {totalRevenue.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <h4 className="font-semibold mb-1">👥 Attendees</h4>
          <p className="text-xl font-bold">{totalAttendees}</p>
        </Card>
        <Card className="p-4">
          <h4 className="font-semibold mb-1">📦 Transactions</h4>
          <p className="text-xl font-bold">{totalTransactions}</p>
        </Card>
      </div>

      {/* 📈 Charts */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="text-md font-semibold mb-2">💰 Revenue</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-4">
            <h3 className="text-md font-semibold mb-2">👥 Attendees</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="attendeeCount" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-4 md:col-span-2">
            <h3 className="text-md font-semibold mb-2">📦 Transactions</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="transactionCount" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
};