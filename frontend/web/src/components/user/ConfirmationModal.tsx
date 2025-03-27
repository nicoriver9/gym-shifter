// src/components/ConfirmationModal.tsx
import { useEffect } from "react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message: string | React.ReactNode; // Ahora acepta JSX
  }
  
  export const ConfirmationModal = ({
    isOpen,
    onConfirm,
    onCancel,
    message,
  }: ConfirmationModalProps) => {
  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold text-white mb-4">Confirmar Asistencia</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};