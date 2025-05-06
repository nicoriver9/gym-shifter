import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

interface ClassAttendance {
  id: number | null;
  name: string | null;
  start_time: string | null;
  end_time: string | null;
  teacher: string | null;
  attendees_count: number;
  room?: string | null;
  is_active: boolean;
}

const CurrentClassAttendance = () => {
  const [currentClass, setCurrentClass] = useState<ClassAttendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({ duration: 600 });

    const fetchCurrentClass = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) throw new Error("No hay token de acceso");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/classes/current`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!response.ok) throw new Error("Error al obtener la clase actual");

        const data = await response.json();
        if (!data.success) throw new Error(data.message);

        setCurrentClass(data.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentClass();
    const interval = setInterval(fetchCurrentClass, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12" data-aos="fade-up">
        <div className="text-center">
          <p className="text-white text-lg mb-3">Cargando clase actual...</p>
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-800 text-red-200 p-4 rounded-lg mb-6 text-center shadow-md">
        Error: {error}
      </div>
    );
  }

  if (!currentClass?.is_active) {
    return (
      <div className="bg-gray-800 text-gray-400 p-4 rounded-lg mb-6 text-center shadow">
        No hay ninguna clase en curso actualmente.
      </div>
    );
  }

  return (
    <div
      className="bg-purple-800 border border-purple-500 rounded-xl p-6 mb-8 shadow-lg max-w-3xl mx-auto text-center"
    >
      <h3 className="text-2xl font-bold text-white mb-6">
        CLASE EN CURSO
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center text-white">
        <div>
          <p className="font-semibold text-sm text-gray-300">Clase:</p>
          <p className="text-lg font-medium">{currentClass.name}</p>
        </div>

        <div>
          <p className="font-semibold text-sm text-gray-300">Profesor:</p>
          <p className="text-lg font-medium">{currentClass.teacher}</p>
        </div>

        <div>
          <p className="font-semibold text-sm text-gray-300">Horario:</p>
          <p className="text-lg font-medium">
            {currentClass.start_time?.substring(0, 5) ?? "--:--"} - {currentClass.end_time?.substring(0, 5) ?? "--:--"}
          </p>
        </div>

        <div>
          <p className="font-semibold text-sm text-gray-300">Asistentes:</p>
          <p className="text-lg font-medium">{currentClass.attendees_count}</p>
        </div>
      </div>

      {currentClass.room && (
        <div className="mt-6">
          <span className="inline-block bg-gray-700 px-4 py-1 rounded-full text-sm text-white font-medium">
            Sala: {currentClass.room}
          </span>
        </div>
      )}
    </div>
  );
};

export default CurrentClassAttendance;
