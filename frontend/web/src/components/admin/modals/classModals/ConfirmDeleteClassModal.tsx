import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

interface ConfirmDeleteModalProps {
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => Promise<void>;
  classTypeId: number | undefined;
}

export default function ConfirmDeleteModal({
  show,
  handleClose,
  handleConfirm,
  classTypeId,
}: ConfirmDeleteModalProps) {
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
    }
  }, [show]);

  const fetchClass = async () => {
    if (classTypeId) {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) throw new Error("No hay token de acceso");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/class-types/${classTypeId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener el nombre de la clase");
        }

        const data = await response.json();
        setClassName(data.name);
      } catch (error) {
        console.error("Error al obtener el nombre de la clase:", error);
      }
    }
  };

  useEffect(() => {
    fetchClass();
  }, [classTypeId]);

  const onDelete = async () => {
    setLoading(true);
    try {
      await handleConfirm();
      handleClose();

      setTimeout(() => {
        Swal.fire({
          title: "Clase eliminada",
          icon: "success",
          background: "#111827",
          color: "#f9fafb",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });
      }, 300);
    } catch (error) {
      console.error("❌ Error al eliminar clase:", error);
      await Swal.fire({
        title: "Error",
        text: "No se pudo eliminar la clase.",
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div
        className={`bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md relative transform transition-all duration-300 ${visible ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
      >
        {/* Botón de cierre */}
        <button
          className="absolute top-3 right-3 text-white hover:text-red-500 text-xl"
          onClick={handleClose}
          disabled={loading}
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold text-red-500 mb-4 text-center">
          Confirmar Eliminación
        </h2>

        <p className="mb-6 text-center text-sm">
          ¿Estás seguro de que deseas eliminar la clase{" "}
          <strong className="text-red-400">{className}</strong>?<br />
          Esta acción no se puede deshacer.
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={handleClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>

        {/* Spinner */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
