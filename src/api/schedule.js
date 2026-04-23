import api from "./axios";

export const getSchedulesByEvent = (eventId) =>
    api.get(`/api/schedules/events/${eventId}`);
export const createSchedule = (data) => api.post("/api/schedules", data);
