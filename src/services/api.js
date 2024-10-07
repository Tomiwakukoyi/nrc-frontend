// src/services/api.js

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
);

export const login = (email, password) =>
  api.post("/auth/login", { email, password });
export const register = (email, password, name) =>
  api.post("/auth/register", { email, password, name });
export const getTickets = () => api.get("/tickets");
export const createTicket = (ticketData) =>
  api.post("/tickets", {
    from: ticketData.from,
    to: ticketData.to,
    departureTime: new Date(ticketData.departureTime), // Ensure proper date format
    price: ticketData.price,
  });

export default api;
