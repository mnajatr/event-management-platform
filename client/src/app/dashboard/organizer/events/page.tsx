"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrganizerEvents } from "@/services/event.service";
import { TEvent } from "@/types/event.type";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OrganizerEventListPage = () => {
  const [events, setEvents] = useState<TEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initial fetch
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getOrganizerEvents();
        const sorted = data.sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        setEvents(sorted);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Handler sort
  const handleSort = (value: string) => {
    const sorted = [...events].sort((a, b) => {
      if (value === "newest") {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      } else if (value === "oldest") {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      } else if (value === "price-asc") {
        return a.basePrice - b.basePrice;
      } else if (value === "price-desc") {
        return b.basePrice - a.basePrice;
      }
      return 0;
    });
    setEvents(sorted);
  };

  if (loading) return <p>Loading...</p>;
  if (events.length === 0) return <p>No events found.</p>;

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">📋 My Events</h2>
        <div className="w-[180px]">
          <Select defaultValue="newest" onValueChange={handleSort}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">🕒 Newest</SelectItem>
              <SelectItem value="oldest">📆 Oldest</SelectItem>
              <SelectItem value="price-asc">💰 Price Low → High</SelectItem>
              <SelectItem value="price-desc">💸 Price High → Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => (
          <Card
            key={event.id}
            className="cursor-pointer hover:shadow-md transition p-5 border"
            onClick={() =>
              router.push(`/dashboard/organizer/events/${event.id}`)
            }
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{event.name}</h3>
                <Badge variant="outline" className="capitalize">
                  <p className="text-sm text-muted-foreground">
                    Status: {event.status || "Unknown"}
                  </p>
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{event.category}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(event.startDate).toLocaleDateString()} →{" "}
                {new Date(event.endDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Location: {event.location}
              </p>
              <p className="text-sm text-muted-foreground">
                Price:{" "}
                {event.basePrice > 0
                  ? `Rp ${event.basePrice.toLocaleString()}`
                  : "Free"}
              </p>
              <p className="text-sm text-muted-foreground">
                Available Seats: {event.availableSeats}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrganizerEventListPage;