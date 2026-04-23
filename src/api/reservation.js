import api from "./axios";

export const holdSeat = (seatId) =>
    api.post(`/api/reservations/hold/${seatId}`);
export const confirmReservation = (seatId) =>
    api.post(`/api/reservations/confirm/${seatId}`);
export const cancelReservation = (reservationId) =>
    api.post(`/api/reservations/cancel/${reservationId}`);
export const getMyReservations = () => api.get("/api/reservations/my");
export const getRemainingTime = (seatId) =>
    api.get(`/api/reservations/remaining/${seatId}`);