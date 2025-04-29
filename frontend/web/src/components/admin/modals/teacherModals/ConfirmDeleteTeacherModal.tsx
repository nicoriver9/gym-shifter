// src/components/ConfirmDeleteTeacherModal.tsx
import { useState } from "react";

interface ConfirmDeleteTeacherModalProps {
  show: boolean;
  handleClose: () => void;
  teacher: any; // Recibe el profesor a eliminar
  refreshTable: () => void;
}

const ConfirmDeleteTeacherModal = ({
  show,
  handleClose,
  teacher,
  refreshTable,
}: ConfirmDeleteTeacherModalProps) => {
  const [loading, setLoading] = useState(false);

  // Función para eliminar el profesor
  const handleConfirm = async () => {
    if (!teacher) return;
    setLoading(true);

    try {
      console.log("🗑 Eliminando profesor:", teacher.id);

      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('No hay token de acceso');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teachers/${teacher.id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el profesor");
      }

      console.log("✅ Profesor eliminado correctamente");
      refreshTable(); // Refrescar la tabla después de eliminar
      handleClose(); // Cerrar modal
    } catch (error) {
      console.error("❌ Error al eliminar profesor:", error);
      alert("Hubo un error al eliminar el profesor. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null; // No renderizar si el modal está cerrado

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96" data-aos="zoom-in">
        <h2 className="text-xl font-semibold mb-4 text-red-500">Eliminar Profesor</h2>
        <p className="mb-4">
          ¿Estás seguro de que deseas eliminar a <strong>{teacher?.name}</strong>?
          Esta acción <span className="text-red-500 font-bold">no se puede deshacer</span>.
        </p>

        {/* Botones */}
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteTeacherModal;
