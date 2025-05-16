import { useState } from "react";
import Swal from "sweetalert2";
import { FaTimes } from "react-icons/fa";

interface ConfirmDeleteTeacherModalProps {
  show: boolean;
  handleClose: () => void;
  teacher: any;
  refreshTable: () => void;
}

const ConfirmDeleteTeacherModal = ({
  show,
  handleClose,
  teacher,
  refreshTable,
}: ConfirmDeleteTeacherModalProps) => {
  const [processing, setProcessing] = useState(false);

  if (!show) return null;

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: `¿Eliminar a ${teacher?.name}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      background: "#111827",
      color: "#f9fafb",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      setProcessing(true);

      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) throw new Error("No hay token de acceso");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/teachers/${teacher.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al eliminar el profesor");

      await Swal.fire({
        title: "Profesor eliminado",
        icon: "success",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#10b981",
        timer: 2000,
        timerProgressBar: true,
      });

      refreshTable();
      handleClose();
    } catch (error) {
      console.error("❌ Error al eliminar profesor:", error);
      await Swal.fire({
        title: "Error",
        text: "Hubo un problema al eliminar el profesor.",
        icon: "error",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-[#111827] text-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        {/* Botón cerrar */}
        <button
          className="absolute top-3 right-3 text-white hover:text-red-500 text-xl"
          onClick={handleClose}
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-red-400 text-center">
          Confirmar Eliminación
        </h2>

        <div className="text-center space-y-2">
          <p>¿Deseas eliminar al profesor <strong>{teacher?.name}</strong>?</p>
          <p className="text-red-400">Esta acción no se puede deshacer.</p>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            className="bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded-lg transition"
            onClick={handleClose}
            disabled={processing}
          >
            Cancelar
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg transition"
            onClick={handleDelete}
            disabled={processing}
          >
            Eliminar
          </button>
        </div>

        {processing && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmDeleteTeacherModal;
