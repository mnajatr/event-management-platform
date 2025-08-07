"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getEventById } from "@/lib/api/events";
import { CreateEventForm } from "@/components/events/CreateEventForm";

export default function EditEventPage() {
  const params = useParams();
  const eventId = Number(params.eventId);

  const {
    data: event,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEventById(eventId),
    enabled: !!eventId,
  });

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading data event...</div>;
  }

  if (isError) {
    return <div className="container mx-auto py-8">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold">Edit Event</h1>
        <p className="text-muted-foreground">
          Perbarui detail event Anda di bawah ini.
        </p>
      </div>
      {eventId && <CreateEventForm initialData={event} />}
    </div>
  );
}
