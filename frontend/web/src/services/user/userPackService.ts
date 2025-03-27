// src/services/userService.ts
const API_URL = 'http://localhost:3000/api/user-pack';

// src/services/user/userPackService.ts
export const confirmClassAttendance = async (
  userId: number,
  currentDateTime: Date
) => {
  const response = await fetch(`${API_URL}/confirm-attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      userId,
      currentDateTime: currentDateTime.toISOString()
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al confirmar asistencia');
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

export const unassignPackFromUser = async (userId: number) => {
  const response = await fetch(`${API_URL}/remove-pack/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al desasignar el pack del usuario");
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

export const decrementUserClasses = async (userId: number, decrementBy: number = 1) => {
  const response = await fetch(`${API_URL}/decrement-classes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      userId,
      decrementBy 
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al descontar clases');
  }

  const responseData = await response.json(); // Asegúrate de parsear la respuesta
  
  // Devuelve directamente los datos importantes
  return {
    success: true,
    data: {
      classes_remaining: responseData.data.classes_remaining,
      pack_name: responseData.data.pack_name,
      pack_expiration_date: responseData.data.pack_expiration_date
    }
  };
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