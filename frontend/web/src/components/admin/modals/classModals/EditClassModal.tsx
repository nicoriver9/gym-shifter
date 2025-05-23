import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { EditClassModalProps, Teacher } from "../../../../interfaces/admin/IEditClassModal";

export default function EditClassModal({
  show,
  handleClose,
  classData,
  onSave,
  confirmDeleteClass,
}: EditClassModalProps) {
  const [classId, setClassId] = useState(classData?.id || null);
  const [classTypeId, setClassTypeId] = useState(classData?.class_type_id || "");
  const [startTime, setStartTime] = useState(classData?.start_time || "00:00");
  const [endTime, setEndTime] = useState(classData?.end_time || "00:00");
  const [teacherId, setTeacherId] = useState(classData?.teacher_id || null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classTypes, setClassTypes] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
    }
  }, [show]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teachers`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error("Error al obtener los profesores:", error);
      }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (classData) {
      setClassId(classData.id);
      setClassTypeId(classData.class_type_id);
      setStartTime(classData.start_time);
      setEndTime(classData.end_time);
      setTeacherId(classData.teacher_id || null);
    }
  }, [classData]);

  useEffect(() => {
    const fetchClassTypes = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/class-types`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await response.json();
        setClassTypes(data);
      } catch (error) {
        console.error("Error al obtener los tipos de clase:", error);
      }
    };
    fetchClassTypes();
  }, []);

  const handleSubmit = async () => {
    if (!onSave || !classData) return;
    setLoading(true);
    try {
      await onSave({
        ...classData,
        id: classId,
        class_type_id: classTypeId,
        start_time: startTime,
        end_time: endTime,
        teacher_id: teacherId,
      });

      handleClose();

      setTimeout(() => {
        Swal.fire({
          title: "Clase actualizada",
          icon: "success",
          background: "#111827",
          color: "#f9fafb",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        });
      }, 300);
    } catch (error) {
      console.error("❌ Error al guardar clase:", error);
      await Swal.fire({
        title: "Error",
        text: "No se pudo actualizar la clase.",
        icon: "error",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!show || !classData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center transition-opacity">
      <div
        className={`bg-gray-900 text-white p-6 rounded-xl shadow-lg w-full max-w-xl relative transform transition-all duration-300 ${visible ? "scale-100 opacity-100" : "scale-75 opacity-0"
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

        <h3 className="text-2xl font-bold mb-4 text-center text-purple-500">Editar Clase</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Tipo de Clase</label>
            <select
              value={classTypeId}
              onChange={(e) => setClassTypeId(Number(e.target.value))}
              className="w-full px-3 py-2 text-black rounded-lg outline-none"
            >
              <option value="">Selecciona un tipo</option>
              {classTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Profesor</label>
            <select
              value={teacherId || ""}
              onChange={(e) => setTeacherId(Number(e.target.value))}
              className="w-full px-3 py-2 text-black rounded-lg outline-none"
            >
              <option value="">Selecciona un profesor</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Hora de Inicio</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 text-black rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Hora de Fin</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 text-black rounded-lg outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleClose}
            className="px-5 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
          <button
            onClick={() => confirmDeleteClass && classData && confirmDeleteClass(classData)}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition"
            disabled={loading}
          >
            Eliminar
          </button>
        </div>

        {/* Spinner de carga */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-xl">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
