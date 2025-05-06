import { useEffect, useState } from "react";
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

  const handleSubmit = () => {
    if (!onSave || !classData) return;
    onSave({
      ...classData,
      id: classId,
      class_type_id: classTypeId,
      start_time: startTime,
      end_time: endTime,
      teacher_id: teacherId,
    });
  };

  if (!show || !classData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg w-full max-w-xl animate-fade-in" data-aos="zoom-in">
        <h3 className="text-2xl font-bold mb-4 text-center">Editar Clase</h3>

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
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition"
          >
            Guardar Cambios
          </button>
          <button
            onClick={() => confirmDeleteClass && classData && confirmDeleteClass(classData)}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
