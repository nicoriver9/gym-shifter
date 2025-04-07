// src/services/paymentService.ts
const API_URL = `${import.meta.env.VITE_API_URL}/payments`;

// Función para obtener el token de acceso
const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const getApprovedPayments = async () => {
  try {
    const response = await fetch(`${API_URL}/approved`, {
      headers: { "Authorization": `Bearer ${getAccessToken()}` }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching approved payments:', error);
    throw error;
  }
};

export const getPaymentLink = async (userId: number, packId: number) => {
  const url = `${API_URL}/link?user_id=${userId}&pack_id=${packId}`;

  try {
    const response = await fetch(url, {
      headers: { "Authorization": `Bearer ${getAccessToken()}` }
    });
    if (!response.ok) {
      throw new Error("Error al obtener el link de pago");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getPaymentLink:", error);
    throw error;
  }
};