"use client";

import { EventCard } from "./EventCard";
import { TEvent } from "@/types/event.type";

interface EventListProps {
  events: TEvent[] | undefined;
}

export const EventList = ({ events }: EventListProps) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center text-gray-500 col-span-full">
        Tidak ada event yang ditemukan. Coba ganti filter Anda.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
