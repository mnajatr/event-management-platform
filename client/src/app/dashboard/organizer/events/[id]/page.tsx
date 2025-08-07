"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TEvent } from "@/types/event.type";
import { getEventById } from "@/services/event.service";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const EventDetail = () => {
  const [event, setEvent] = useState<TEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      fetchEventDetails(id);
    }
  }, [id]);

  const fetchEventDetails = async (eventId: string) => {
    setLoading(true);
    try {
      const data = await getEventById(eventId);
      setEvent(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching event details:", err);
      setError("Failed to fetch event details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!event) return <p>No event found.</p>;

  return (
    <div className="space-y-6 mt-6">
      <h2 className="text-2xl font-semibold">📍 Event Details</h2>

      <Card className="p-6 space-y-6">
        {/* Image */}
        <div className="w-full rounded-xl overflow-hidden max-h-[400px]">
          <Image
            src={event.imageUrl ?? "/fallback.jpg"}
            alt={event.name}
            width={1280}
            height={720}
            className="rounded-xl object-cover w-full h-full"
          />
        </div>

        {/* Title & Info */}
        <div className="space-y-1">
          <h3 className="text-3xl font-bold">{event.name}</h3>
          <p className="text-muted-foreground">{event.category} • {event.location}</p>
          <p className="text-muted-foreground">
            {new Date(event.startDate).toLocaleString()} → {new Date(event.endDate).toLocaleString()}
          </p>
        </div>

        {/* Grid Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div>
              <strong className="text-base">🎫 Price:</strong>
              <p>{event.basePrice > 0 ? `Rp ${event.basePrice.toLocaleString()}` : "Free"}</p>
            </div>
            <div>
              <strong className="text-base">🪑 Available Seats:</strong>
              <p>{event.availableSeats}</p>
            </div>
            <div>
              <strong className="text-base">📌 Status:</strong>
              <p>{event.status}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <strong className="text-base">📝 Description:</strong>
              <p>{event.description}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Button
            variant="default"
            onClick={() => router.push(`/dashboard/organizer/events/${event.id}/edit`)}
          >
            ✏️ Edit Event
          </Button>
          <Button
            variant="default"
            onClick={() => router.push(`/dashboard/organizer/events/${event.id}/attendees`)}
          >
            👥 View Attendees
          </Button>
          <Button
            variant="default"
            onClick={() => router.push(`/dashboard/organizer/events/${event.id}/transactions`)}
          >
            💳 View Transactions
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EventDetail;