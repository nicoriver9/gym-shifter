//src/services/admin/whatsappService.ts

export const getWhatsappStatus = async (): Promise<string> => {
  const url = `${import.meta.env.VITE_API_URL}/api/whatsapp/status`;
//   console.log("📡 Llamando a:", url);

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    // console.log("✅ Respuesta recibida:", res);
    const text = await res.text();
    // console.log("📝 Texto recibido:", text);

    return text;
  } catch (err) {
    // console.error("❌ Error en getWhatsappStatus:", err);
    throw err;
  }
};

export const getWhatsappQR = (): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/whatsapp/get-qr`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return reject(new Error(errorText));
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        return reject(new Error("Respuesta inválida del servidor"));
      }

      const data = await response.json();
      if (!data.qrCode) {
        return reject(new Error("QR no disponible"));
      }

      resolve(data.qrCode);
    } catch (err) {
      reject(err);
    }
  });
};


