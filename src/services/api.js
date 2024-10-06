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
    console.error("API Error:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    throw error;
  }
);

export const login = (email, password) =>
  api.post("/auth/login", { email, password });
export const register = (email, password, name) =>
  api.post("/auth/register", { email, password, name });
export const getTickets = () => api.get("/tickets");
export const createTicket = (ticketData) => api.post("/tickets", ticketData);

export default api;
