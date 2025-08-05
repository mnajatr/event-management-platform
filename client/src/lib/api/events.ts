import api from "../axios";
import { TEvent, TEventDetail } from "@/types/event.type";
import { TCreateEventPayload } from "../validators/createEvent.schema";

interface IGetEventsParams {
  category?: string;
  search?: string;
  location?: string;
}

export const getEvents = async (
  params: IGetEventsParams
): Promise<TEvent[]> => {
  try {
    const response = await api.get<{ data: TEvent[] }>("/events", {
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const getEventById = async (id: number): Promise<TEventDetail> => {
  try {
    const response = await api.get<{ data: TEventDetail }>("/events/${id}");
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch event details");
  }
};

export const createEvent = async (
  data: TCreateEventPayload
): Promise<TEvent> => {
  try {
    const response = await api.post<{ data: TEvent }>("/events", data);
    return response.data.data;
  } catch (error) {
    console.error("Failed to create event:", error);
    throw new Error("Gagal membuat event.");
  }
};

export const getMyEvents = async (): Promise<TEvent[]> => {
  try {
    const response = await api.get<{ data: TEvent[] }>("/events/my-events");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch organizer's events:", error);
    throw new Error("Gagal mengambil data event Anda");
  }
};
