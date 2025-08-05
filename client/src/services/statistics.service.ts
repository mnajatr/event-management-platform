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

export const getDailyStats = async () => {
  const res = await API.get("/statistics/daily");
  return res.data.data;
};

export const getMonthlyStats = async () => {
  const res = await API.get("/statistics/monthly");
  return res.data.data;
};

export const getYearlyStats = async () => {
  const res = await API.get("/statistics/yearly");
  return res.data.data;
};