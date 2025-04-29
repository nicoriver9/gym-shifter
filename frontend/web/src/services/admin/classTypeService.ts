// src/services/classTypeService.ts
const API_URL = `${import.meta.env.VITE_API_URL}/api/class-types`;

// Función para obtener el token de acceso
const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const getClassTypes = async () => {
  const response = await fetch(API_URL, {
    headers: { "Authorization": `Bearer ${getAccessToken()}` }
  });
  if (!response.ok) {
    throw new Error("Error al obtener los tipos de clases");
  }
  return response.json();
};

export const getClassTypeById = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: { "Authorization": `Bearer ${getAccessToken()}` }
  });
  if (!response.ok) {
    throw new Error("Error al obtener el tipo de clase");
  }
  return response.json();
};

export const createClassType = async (data: any) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAccessToken()}` 
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al crear el tipo de clase");
  }
  return response.json();
};

export const updateClassType = async (id: number, data: any) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAccessToken()}` 
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al actualizar el tipo de clase");
  }
  return response.json();
};

export const deleteClassType = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getAccessToken()}` }
  });
  if (!response.ok) {
    throw new Error("Error al eliminar el tipo de clase");
  }
  return response.json();
};