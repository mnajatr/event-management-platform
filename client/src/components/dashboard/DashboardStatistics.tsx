"use client";

import { useEffect, useState } from "react";
import {
  getDailyStats,
  getMonthlyStats,
  getYearlyStats,
} from "@/services/statistics.service";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

type TStat = {
  label: string;
  totalRevenue: number;
  attendeeCount: number;
  transactionCount: number;
};

export const DashboardStatistics = () => {
  const [filter, setFilter] = useState<"daily" | "monthly" | "yearly">("daily");
  const [data, setData] = useState<TStat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      let result: TStat[] = [];
      if (filter === "daily") result = await getDailyStats();
      else if (filter === "monthly") result = await getMonthlyStats();
      else result = await getYearlyStats();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">📊 Statistics</h2>
        <Select value={filter} onValueChange={(val) => setFilter(val as typeof filter)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

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