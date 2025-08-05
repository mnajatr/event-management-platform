import axios from "axios";
import { TEvent } from "@/types/event.type";
import { OrganizerSummary } from "@/types/organizer.type";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // contoh: http://localhost:8000
});

// Inject Authorization Header secara otomatis
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMyEvents = async (): Promise<TEvent[]> => {
  const res = await API.get("/events/my");
  return res.data.data;
};

export const getOrganizerSummary = async (): Promise<OrganizerSummary> => {
  const res = await API.get("/organizers/summary");
  return res.data.data;
};

export const getUpcomingEvent = async (): Promise<TEvent | null> => {
  const res = await API.get("/organizers/upcoming-event");
  return res.data.data;
};