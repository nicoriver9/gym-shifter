const API_URL = `${import.meta.env.VITE_API_URL}/classes`;

// Función para obtener el token de acceso
const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const getAllClasses = async () => {
  const response = await fetch(API_URL, {
    headers: { "Authorization": `Bearer ${getAccessToken()}` }
  });
  return response.json();
};

export const createClass = async (classData: any) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAccessToken()}` 
    },
    body: JSON.stringify(classData),
  });
  return response.json();
};

export const updateClass = async (id: number, classData: any) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAccessToken()}` 
    },
    body: JSON.stringify(classData),
  });
  return response.json();
};

export const deleteClass = async (id: number) => {
  await fetch(`${API_URL}/${id}`, { 
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getAccessToken()}` }
  });
};
