import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem("freedom-auth");
  
  if (authStorage) {
    try {
      const { state } = JSON.parse(authStorage);
      if (state && state.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch (e) {
      console.error("Ошибка чтения токена", e);
    }
  }
  
  return config;
});