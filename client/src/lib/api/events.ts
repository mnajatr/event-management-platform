import axios from "axios";
import { TEvent, TEventDetail } from "@/types/event.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const getEvents = async (): Promise<TEvent[]> => {
  try {
    const response = await axios.get<{ data: TEvent[] }>(`${API_URL}/events`);
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
