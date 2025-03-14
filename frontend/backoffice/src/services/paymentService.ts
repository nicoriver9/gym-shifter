// src/services/paymentService.ts
const API_URL = "http://localhost:3000/payments"; // Ajusta la URL según tu backend

export const getPaymentLink = async (userId: number, packId: number) => {
  const url = `${API_URL}/link?user_id=${userId}&pack_id=${packId}`;

  try {
    const response = await fetch(url);
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