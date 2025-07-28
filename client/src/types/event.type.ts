export type TOrganizer = {
  fullName: string;
};

export type TEvent = {
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  basePrice: number;
  availableSeats: number;
  imageUrl: string | null; // URL to the event image, can be null if no image is provided
  organizer: TOrganizer;
};
