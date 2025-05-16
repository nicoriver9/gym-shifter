import { useState } from "react";
import Swal from "sweetalert2";
import { FaTimes } from "react-icons/fa";

interface CreateTeacherModalProps {
  show: boolean;
  handleClose: () => void;
  refreshTable: () => void;
}

const CreateTeacherModal = ({ show, handleClose, refreshTable }: CreateTeacherModalProps) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      await Swal.fire({
        title: "Campo vacío",
        text: "Por favor, ingresa el nombre del profesor.",
        icon: "warning",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#d97706",
      });
      return;
    }

    try {
      setLoading(true);
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('No hay token de acceso');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teachers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el profesor");
      }

      await Swal.fire({
        title: "¡Profesor creado!",
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
      console.error("❌ Error al crear profesor:", error);
      await Swal.fire({
        title: "Error",
        text: "Hubo un error al crear el profesor.",
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md relative" data-aos="zoom-in">

        {/* Botón de cerrar */}
        <button
          className="absolute top-3 right-3 text-white hover:text-red-500 text-xl"
          onClick={handleClose}
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold mb-6 text-purple-500 text-center">Crear Profesor</h2>

        {/* Formulario */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-2">
          <button
            className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-lg transition"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>

        {/* Overlay y spinner de carga */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTeacherModal;
