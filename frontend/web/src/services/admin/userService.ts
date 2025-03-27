// src/services/userService.ts
const API_URL = 'http://localhost:3000/api/users';

export const getUsers = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Error al obtener los usuarios");
  }
  return response.json();
};

export const assignPackToUser = async (userId: number, packId: number) => {
  const response = await fetch(`${API_URL}/${userId}/packs/${packId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error("Error al asignar el pack al usuario");
  }
  return response.json();
};

export const unassignPackFromUser = async (userId: number, packId: number) => {
  const response = await fetch(`${API_URL}/${userId}/packs/${packId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error("Error al desasignar el pack del usuario");
  }
  return response.json();
};

export const assignSinglePackToUser = async (userId: number, packId: number) => {
  const response = await fetch(`${API_URL}/single/${userId}/pack`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ packId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al asignar el pack');
  }

  return response.json();
};

export const getUserById = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Error al obtener el usuario");
  }
  return response.json();
};

export const createUser = async (data: any) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al crear el usuario");
  }
  return response.json();
};

export const updateUser = async (id: number, data: any) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al actualizar el usuario");
  }
  return response.json();
};

export const deleteUser = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error al eliminar el usuario");
  }
  return response.json();
};