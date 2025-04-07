// src/services/userService.ts

const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

// Función para obtener el token de acceso
const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const getUsers = async () => {
  const response = await fetch(API_URL, {
    headers: { 
      'Authorization': `Bearer ${getAccessToken()}`
    }
  });
  if (!response.ok) {
    throw new Error("Error al obtener los usuarios");
  }
  return response.json();
};

export const decrementUserClasses = async (userId: number, decrementBy: number = 1) => {
  const response = await fetch(`${API_URL}/decrement-classes`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`
    },
    body: JSON.stringify({ 
      userId,
      decrementBy 
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al descontar clases');
  }

  return response.json();
};

export const getUserById = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: { 
      'Authorization': `Bearer ${getAccessToken()}`
    }
  });  
  if (!response.ok) {
    throw new Error("Error al obtener el usuario");
  }
  return response.json();
};

export const createUser = async (data: any) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      'Authorization': `Bearer ${getAccessToken()}`
    },
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
    headers: { 
      "Content-Type": "application/json",
      'Authorization': `Bearer ${getAccessToken()}`
    },
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
    headers: { 
      'Authorization': `Bearer ${getAccessToken()}`
    }
  });
  if (!response.ok) {
    throw new Error("Error al eliminar el usuario");
  }
  return response.json();
};