import { useState } from "react";

interface CreateTeacherModalProps {
  show: boolean;
  handleClose: () => void;
  refreshTable: () => void;
}

const CreateTeacherModal = ({ show, handleClose, refreshTable }: CreateTeacherModalProps) => {
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("El nombre no puede estar vacío.");
      return;
    }

    try {
      console.log("📤 Enviando profesor al backend:", name);

      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('No hay token de acceso');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/teachers`, {
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

      console.log("✅ Profesor creado correctamente");
      refreshTable(); // Refrescar la lista de profesores
      handleClose(); // Cerrar el modal
    } catch (error) {
      console.error("❌ Error al crear profesor:", error);
      alert("Hubo un error al crear el profesor. Revisa la consola.");
    }
  };


  if (!show) return null; // No renderizar si el modal está cerrado

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96" data-aos="zoom-in">
        <h2 className="text-xl font-semibold mb-4">Crear Profesor</h2>

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
          >
            Guardar
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            onClick={handleClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeacherModal;
