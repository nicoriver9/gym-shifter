import { useEffect, useState } from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import Swal from "sweetalert2";

interface ConfirmDeletePackModalProps {
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => Promise<void>;
  pack?: { name: string };
}

const ConfirmDeletePackModal = ({
  show,
  handleClose,
  handleConfirm,
  pack,
}: ConfirmDeletePackModalProps) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
    }
  }, [show]);

  const onConfirm = async () => {
    setLoading(true);
    try {
      await handleConfirm();
      handleClose(); // Cerramos modal

      setTimeout(() => {
        Swal.fire({
          title: "Pack eliminado",
          icon: "success",
          background: "#111827",
          color: "#f9fafb",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });
      }, 300);
    } catch (error) {
      console.error("❌ Error al eliminar el pack:", error);
      await Swal.fire({
        title: "Error",
        text: "Hubo un problema al eliminar el pack.",
        icon: "error",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 transition-opacity">
      <div
        className={`relative bg-[#111827] text-white px-6 py-8 rounded-xl shadow-xl w-[90%] max-w-md transform transition-all duration-300 ${visible ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
      >
        {/* Botón cerrar */}
        <button
          className="absolute top-3 right-3 text-white hover:text-red-500 text-xl"
          onClick={handleClose}
          disabled={loading}
        >
          <FaTimes />
        </button>

        {/* Ícono estilo Swal */}
        <div className="text-red-500 text-4xl flex justify-center mb-3">
          <FaExclamationTriangle />
        </div>

        <h2 className="text-xl font-bold text-center text-purple-400 mb-3">
          Confirmar Eliminación
        </h2>

        <p className="text-center text-sm md:text-base mb-1">
          ¿Estás seguro de que deseas eliminar el pack <strong>{pack?.name}</strong>?
        </p>
        <p className="text-center text-red-400 text-sm mb-5">
          Esta acción no se puede deshacer.
        </p>

        <div className="flex justify-center gap-4">
          <button
            className="bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded-lg transition"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg transition"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>

        {/* Spinner tipo swal */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-xl">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmDeletePackModal;
