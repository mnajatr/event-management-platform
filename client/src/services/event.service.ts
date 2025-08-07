import axios from "axios";
import { TEvent } from "@/types/event.type";
import { OrganizerSummary } from "@/types/organizer.type";
import api from "../lib/axios";

// const API = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
// });

// Inject Authorization Header secara otomatis
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 📋 Event - Umum
export const getMyEvents = async (): Promise<TEvent[]> => {
  const res = await api.get("/events/my");
  return res.data.data;
};

export const getEventById = async (id: string): Promise<TEvent> => {
  const res = await api.get(`/events/${id}`);
  return res.data.data;
};

// 🛡️ Organizer (proteksi token + role)
export const getOrganizerEvents = async (): Promise<TEvent[]> => {
  const res = await api.get("/organizers/events");
  return res.data.data;
};

export const getOrganizerEventById = async (id: string): Promise<TEvent> => {
  const res = await api.get(`/organizers/events/${id}`);
  return res.data.data;
};

export const updateEvent = async (
  id: string,
  data: Partial<TEvent>
): Promise<TEvent> => {
  const res = await api.patch(`/organizers/events/${id}`, data);
  return res.data.data;
};

// 📊 Organizer Summary
export const getOrganizerSummary = async (): Promise<OrganizerSummary> => {
  const res = await api.get("/organizers/summary");
  return res.data.data;
};

// 🔮 Upcoming Event
export const getUpcomingEvent = async (): Promise<TEvent | null> => {
  const res = await api.get("/organizers/upcoming-event");
  return res.data.data;
};
