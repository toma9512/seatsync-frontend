import api from "./axios";

export const getSeatsBySchedule = (scheduleId) =>
    api.get(`/api/seats/schedules/${scheduleId}`);
export const createSeats = (data) => api.post("/api/seats", data);
