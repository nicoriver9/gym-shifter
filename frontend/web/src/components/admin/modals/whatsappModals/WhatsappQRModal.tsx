// src/components/modals/WhatsappQRModal.tsx
import React from "react";

interface Props {
  show: boolean;
  qrImage: string;
  onClose: () => void;
}

const WhatsappQRModal: React.FC<Props> = ({ show, qrImage, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 relative w-[320px] max-w-full">
        <button
          className="absolute top-2 right-3 text-white text-xl hover:text-red-500 transition"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-lg font-semibold mb-4 text-center">Escaneá el código QR</h3>
        <img
          src={qrImage}
          alt="Código QR"
          className="w-64 h-64 mx-auto rounded-md"
        />
        <p className="text-sm text-center mt-4 text-gray-300">
          Abrí WhatsApp en tu teléfono y escaneá este código para conectarte.
        </p>
      </div>
    </div>
  );
};

export default WhatsappQRModal;
