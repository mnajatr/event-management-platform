import axios from "axios";
import { TEvent } from "@/types/event.type";

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
