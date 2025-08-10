import { eventCategories } from "@/constants/event";

export type TEventStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED";

export type TOrganizer = {
  fullName: string;
};

export type TEvent = {
  id: number;
  name: string;
  description: string;
  category: (typeof eventCategories)[number];
  location: string;
  startDate: string;
  endDate: string;
  basePrice: number;
  availableSeats: number;
  imageUrl: string | null;
  organizer: TOrganizer;
  status: TEventStatus;
};

export type TTicketType = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

// Pastikan TEventDetail memiliki `ticketTypes`
export type TEventDetail = TEvent & {
  ticketTypes: TTicketType[];
  organizer: {
    id: number;
    fullName: string;
    email: string;
  };
};
