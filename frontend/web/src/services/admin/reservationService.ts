import { Reservation } from "../../interfaces/admin/IReservation";

// src/services/reservationService.ts
const API_URL = `${import.meta.env.VITE_API_URL}/reservations`;

// Función para obtener el token de acceso
const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const getReservations = async (): Promise<Reservation[]> => {
  const response = await fetch(API_URL, {
    headers: { "Authorization": `Bearer ${getAccessToken()}` }
  });
  if (!response.ok) {
    throw new Error("Error al obtener las reservaciones");
  }
  return response.json();
};

export const getReservationById = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: { "Authorization": `Bearer ${getAccessToken()}` }
  });
  if (!response.ok) {
    throw new Error("Error al obtener la reservación");
  }
  return response.json();
};

export const createReservation = async (data: any) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAccessToken()}`
    },
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
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAccessToken()}`
    },
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
    headers: { "Authorization": `Bearer ${getAccessToken()}` }
  });
  if (!response.ok) {
    throw new Error("Error al eliminar la reservación");
  }
  return response.json();
};