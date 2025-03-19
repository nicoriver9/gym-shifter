// src/components/EditTeacherModal.tsx
import { useState, useEffect } from "react";
import { updateTeacher } from "../../../../services/admin/teacherService";

interface EditTeacherModalProps {
  show: boolean;
  handleClose: () => void;
  teacher: any;
  refreshTable: () => void;
}

const EditTeacherModal = ({ show, handleClose, teacher, refreshTable }: EditTeacherModalProps) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (teacher) {
      setName(teacher.name);
    }
  }, [teacher]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);

    try {
      await updateTeacher(teacher.id, { name });
      refreshTable();
      handleClose();
    } catch (error) {
      console.error("❌ Error al actualizar profesor:", error);
      alert("Hubo un error al actualizar el profesor.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null; // No renderizar si el modal está cerrado

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96" data-aos="zoom-in">
        <h2 className="text-xl font-semibold mb-4 text-purple-500">Editar Profesor</h2>

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
      </div>
    </div>
  );
};

export default EditTeacherModal;
