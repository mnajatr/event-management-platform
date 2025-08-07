import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDailyStats = async (eventId?: number) => {
  const res = await API.get("/statistics/daily", {
    params: eventId ? { eventId } : {},
  });
  return res.data.data;
};

export const getMonthlyStats = async (eventId?: number) => {
  const res = await API.get("/statistics/monthly", {
    params: eventId ? { eventId } : {},
  });
  return res.data.data;
};

export const getYearlyStats = async (eventId?: number) => {
  const res = await API.get("/statistics/yearly", {
    params: eventId ? { eventId } : {},
  });
  return res.data.data;
};