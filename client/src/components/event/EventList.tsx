"use client";

import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/lib/api/events";
import { EventCard } from "./EventCard";

export const EventList = () => {
  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  // Tampilan saat data sedang dimuat
  if (isLoading) {
    return <div>Loading events... ⏳</div>;
  }

  // Tampilan saat terjadi error
  if (isError) {
    return <div>Error fetching events: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events?.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
