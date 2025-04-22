// src/components/CurrentClassAttendance.tsx
import { useEffect, useState } from "react";

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
  const [currentClass, setCurrentClass] = useState<ClassAttendance | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentClass = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          throw new Error("No hay token de acceso");
        }
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/classes/current`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener la clase actual");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message);
        }

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
      <div className="bg-gray-800 text-gray-400 p-4 rounded-lg mb-6 text-center">
        Cargando información de la clase...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-6 text-center">
        Error: {error}
      </div>
    );
  }

  if (!currentClass?.is_active) {
    return (
      <div className="bg-gray-800 text-gray-400 p-4 rounded-lg mb-6 text-center">
        No hay clases en curso
      </div>
    );
  }

  return (
    <div className="bg-purple-900 border border-purple-600 rounded-lg p-6 mb-6">
      <h3 className="text-xl text-center font-bold text-white mb-4">
        CLASE EN CURSO
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
        <div>
          <p className="font-semibold">Clase:</p>
          <p className="text-lg">{currentClass.name}</p>
        </div>

        <div>
          <p className="font-semibold">Profesor:</p>
          <p className="text-lg">{currentClass.teacher}</p>
        </div>

        <div>
          <p className="font-semibold">Horario:</p>
          <p className="text-lg">
            {currentClass.start_time
              ? currentClass.start_time.substring(0, 5)
              : "--:--"}{" "}
            -
            {currentClass.end_time
              ? currentClass.end_time.substring(0, 5)
              : "--:--"}
          </p>
        </div>

        <div>
          <p className="font-semibold">Asistentes:</p>
          <p className="text-lg">{currentClass.attendees_count}</p>
        </div>
      </div>

      {currentClass.room && (
        <div className="mt-4 text-center">
          <span className="inline-block bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
            Sala: {currentClass.room}
          </span>
        </div>
      )}
    </div>
  );
};

export default CurrentClassAttendance;
