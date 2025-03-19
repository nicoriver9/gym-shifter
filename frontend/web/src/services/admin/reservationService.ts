import { Reservation } from "../../interfaces/admin/IReservation";

// src/services/reservationService.ts
const API_URL = 'http://localhost:3000/reservations';

export const getReservations = async (): Promise<Reservation[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Error al obtener las reservaciones");
  }
  return response.json();
};

export const getReservationById = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Error al obtener la reservación");
  }
  return response.json();
};

export const createReservation = async (data: any) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al crear la reservación");
  }
  return response.json();
};

export const updateReservation = async (id: number, data: any) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al actualizar la reservación");
  }
  return response.json();
};

export const deleteReservation = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error al eliminar la reservación");
  }
  return response.json();
};