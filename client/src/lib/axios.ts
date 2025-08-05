import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Tambahkan token otomatis
api.interceptors.request.use(
  (config) => {
    // HANYA jalankan kode ini jika kita berada di lingkungan browser
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// TAPI: jangan redirect dari sini langsung (biar form gak reset)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // HANYA jalankan kode ini jika kita berada di lingkungan browser
      if (typeof window !== "undefined") {
        localStorage.clear(); // cukup clear token
      }
      // jangan redirect dari sini ya
    }
    return Promise.reject(err);
  }
);

export default api;
