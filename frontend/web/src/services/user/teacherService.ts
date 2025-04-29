// src/services/teacherService.ts
const API_URL = `${import.meta.env.VITE_API_URL}/api/teachers`;

// Función para obtener el token de acceso
const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const getTeachers = async () => {
  const response = await fetch(API_URL, {
    headers: { "Authorization": `Bearer ${getAccessToken()}` }
  });
  if (!response.ok) {
    throw new Error("Error al obtener los profesores");
  }
  return response.json();
};

export const getTeacherById = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: { "Authorization": `Bearer ${getAccessToken()}` }
  });
  if (!response.ok) {
    throw new Error("Error al obtener el profesor");
  }
  return response.json();
};

export const createTeacher = async (data: any) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAccessToken()}`
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al crear el profesor");
  }
  return response.json();
};

export const updateTeacher = async (id: number, data: any) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAccessToken()}`
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al actualizar el profesor");
  }
  return response.json();
};

export const deleteTeacher = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getAccessToken()}` }
  });
  if (!response.ok) {
    throw new Error("Error al eliminar el profesor");
  }
  return response.json();
};