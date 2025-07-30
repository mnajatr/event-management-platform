"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getEventById } from "@/lib/api/events";
import { InfoBlock } from "@/components/events/details/InfoBlock";
import { Calendar, MapPin, UserCircle, Ticket } from "lucide-react";
import dayjs from "dayjs";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = typeof params.id === "string" ? Number(params.id) : null;

  const {
    data: event,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEventById(eventId!),
    enabled: eventId !== null,
  });

  if (isLoading)
    return <div className="text-center p-10">Loading details... ⏳</div>;
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Error: {error.message}
      </div>
    );
  if (!event) return <div className="text-center p-10">Event not found.</div>;

  const imageUrl = event.imageUrl || "/placeholder-image.svg";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <img
          src={imageUrl}
          alt={event.name}
          className="w-full h-64 md:h-96 object-cover"
        />

        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2">
            {event.name}
          </h1>
          <p className="text-xl md:text-2xl font-bold text-blue-600 mb-6">
            {event.basePrice > 0
              ? `Rp ${event.basePrice.toLocaleString("id-ID")}`
              : "Gratis"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <InfoBlock icon={Calendar} title="Tanggal & Waktu">
              <p>{dayjs(event.startDate).format("dddd, D MMMM YYYY")}</p>
              <p>
                {dayjs(event.startDate).format("HH:mm")} -{" "}
                {dayjs(event.endDate).format("HH:mm")} WIB
              </p>
            </InfoBlock>

            <InfoBlock icon={MapPin} title="Lokasi">
              <p>{event.location}</p>
            </InfoBlock>

            <InfoBlock icon={UserCircle} title="Diselenggarakan oleh">
              <p>{event.organizer.fullName}</p>
            </InfoBlock>

            <InfoBlock icon={Ticket} title="Tiket Tersedia">
              <p>{event.availableSeats} kursi</p>
            </InfoBlock>
          </div>

          <hr className="my-8" />

          <div>
            <h2 className="text-2xl font-bold mb-4">Deskripsi Event</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
