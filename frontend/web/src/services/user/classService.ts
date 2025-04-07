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
