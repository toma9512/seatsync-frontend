import api from "./axios";

export const getEvents = (params) => api.get("/api/events", { params });
export const getEvent = (id) => api.get(`/api/events/${id}`);
export const createEvent = (data) => api.post("/api/events", data);
