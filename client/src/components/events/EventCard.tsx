import { TEvent } from "@/types/event.type";
import { MapPin, Calendar } from "lucide-react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  event: TEvent;
}

export const EventCard = ({ event }: EventCardProps) => {
  const imageUrl = event.imageUrl || "/placeholder-image.svg";

  return (
    <Link href={`/events/${event.id}`} className="block">
      <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={event.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2 truncate">{event.name}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Calendar className="w-4  h-4 mr-2" />
            <span>{dayjs(event.startDate).format("DD MM YYYY")}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-blue-600">
              {event.basePrice > 0
                ? `Rp ${event.basePrice.toLocaleString("id-ID")}`
                : "Free"}
            </p>
            <span className="text-sm text-gray-500">
              {event.organizer.fullName}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
