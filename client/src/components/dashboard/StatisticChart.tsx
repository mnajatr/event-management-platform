"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface Props {
  title: string;
  data: { label: string; totalRevenue: number; attendeeCount: number }[];
  color?: string;
}

export default function StatisticsChart({ title, data, color = "#8884d8" }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow border space-y-4">
      <h3 className="text-xl font-semibold">{title}</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalRevenue" fill={color} name="Total Revenue (Rp)" />
          <Bar dataKey="attendeeCount" fill="#82ca9d" name="Attendees" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}