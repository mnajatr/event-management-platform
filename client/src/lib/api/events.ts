import axios from "axios";
import { TEvent, TEventDetail } from "@/types/event.type";
import { TCreateEventPayload } from "../validators/createEvent.schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface IGetEventsParams {
  category?: string;
  search?: string;
  location?: string;
}

export const getEvents = async (
  params: IGetEventsParams
): Promise<TEvent[]> => {
  try {
    const response = await axios.get<{ data: TEvent[] }>(`${API_URL}/events`, {
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
    const response = await axios.get<{ data: TEventDetail }>(
      `${API_URL}/events/${id}`
    );
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch event details");
  }
};

export const createEvent = async (
  data: TCreateEventPayload
): Promise<TEvent> => {
  try {
    const response = await axios.post<{ data: TEvent }>(
      `${API_URL}/events`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to create event:", error);
    throw new Error("Gagal membuat event.");
  }
};
