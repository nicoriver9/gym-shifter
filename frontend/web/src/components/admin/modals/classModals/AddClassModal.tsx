import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

interface Teacher {
  id: number;
  name: string;
}

interface ClassType {
  id: number;
  name: string;
}

interface AddClassModalProps {
  show: boolean;
  handleClose: () => void;
  onSave: (newClass: any) => void;
  classTypes: ClassType[];
}

export default function AddClassModal({
  show,
  handleClose,
  onSave,
  classTypes,
}: AddClassModalProps) {
  const [classTypeId, setClassTypeId] = useState<number | null>(null);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) throw new Error("No hay token de acceso");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/teachers`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) throw new Error("Error al obtener los profesores");
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error("Error al obtener los profesores:", error);
      }
    };

    fetchTeachers();
  }, []);

  const handleDayToggle = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async () => {
    if (!classTypeId || selectedDays.length === 0 || !teacherId) {
      await Swal.fire({
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos.",
        icon: "warning",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    setLoading(true);

    try {
      const newClasses = selectedDays.map((day) => ({
        class_type_id: classTypeId,
        day_of_week: day,
        start_time: startTime,
        end_time: endTime,
        teacher_id: teacherId,
      }));

      onSave(newClasses);
      handleClose();

      setTimeout(() => {
        Swal.fire({
          title: "Clase creada correctamente",
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
        text: "Hubo un problema al guardar la clase.",
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
        className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
        data-aos="zoom-in"
      >
        {/* Botón de cierre */}
        <button
          className="absolute top-3 right-3 text-white hover:text-red-500 text-xl"
          onClick={handleClose}
          disabled={loading}
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">
          Agregar Nueva Clase
        </h2>

        {/* Tipo de clase */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tipo de Clase</label>
          <select
            value={classTypeId || ""}
            onChange={(e) => setClassTypeId(Number(e.target.value))}
            className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="">Selecciona un tipo de clase</option>
            {classTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Días */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Días de la Semana</label>
          <div className="flex justify-between flex-wrap gap-2">
            {["D", "L", "M", "Mi", "J", "V", "S"].map((day, index) => (
              <button
                key={index}
                onClick={() => handleDayToggle(index)}
                className={`w-10 py-2 rounded-lg transition text-sm ${selectedDays.includes(index)
                    ? "bg-purple-700 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Horarios */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Hora de Inicio</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Hora de Fin</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        {/* Profesor */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Profesor</label>
          <select
            value={teacherId || ""}
            onChange={(e) => setTeacherId(Number(e.target.value))}
            className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="">Selecciona un profesor</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-lg transition"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Clase"}
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
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
