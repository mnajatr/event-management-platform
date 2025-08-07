import axios from "axios";
import { TEvent } from "@/types/event.type";
import { OrganizerSummary } from "@/types/organizer.type";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Inject Authorization Header secara otomatis
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 📋 Event - Umum
export const getMyEvents = async (): Promise<TEvent[]> => {
  const res = await API.get("/events/my");
  return res.data.data;
};

export const getEventById = async (id: string): Promise<TEvent> => {
  const res = await API.get(`/events/${id}`);
  return res.data.data;
};

// 🛡️ Organizer (proteksi token + role)
export const getOrganizerEvents = async (): Promise<TEvent[]> => {
  const res = await API.get("/organizers/events");
  return res.data.data;
};

export const getOrganizerEventById = async (id: string): Promise<TEvent> => {
  const res = await API.get(`/organizers/events/${id}`);
  return res.data.data;
};

export const updateEvent = async (
  id: string,
  data: Partial<TEvent>
): Promise<TEvent> => {
  const res = await API.patch(`/organizers/events/${id}`, data);
  return res.data.data;
};

// 📊 Organizer Summary
export const getOrganizerSummary = async (): Promise<OrganizerSummary> => {
  const res = await API.get("/organizers/summary");
  return res.data.data;
};

// 🔮 Upcoming Event
export const getUpcomingEvent = async (): Promise<TEvent | null> => {
  const res = await API.get("/organizers/upcoming-event");
  return res.data.data;
};