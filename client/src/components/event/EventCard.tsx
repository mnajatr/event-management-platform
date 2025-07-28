import { TEvent } from "@/types/event.type";
import { MapPin, Calendar } from "lucide-react";
import dayjs from "dayjs";
import Image from "next/image";

interface EventCardProps {
  event: TEvent;
}

export const EventCard = ({ event }: EventCardProps) => {
  const imageUrl = event.imageUrl || "/placeholder-image.jpg";

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Image
        src={imageUrl}
        alt={event.name}
        className="w-full h-48 object-cover"
      />
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
  );
};
