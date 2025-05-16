import { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface ConfirmDeleteReservationModalProps {
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  reservation?: {
    user: {
      firstName: string;
      lastName: string;
    };
    classSchedule: {
      classType: {
        name: string;
      };
      day_of_week: string;
      start_time: string;
      end_time: string;
      teacherName: string;
    };
  };
}

const ConfirmDeleteReservationModal = ({
  show,
  handleClose,
  handleConfirm,
  reservation,
}: ConfirmDeleteReservationModalProps) => {
  const [loading, setLoading] = useState(false);

  if (!show || !reservation) return null;

  const onConfirm = async () => {
    setLoading(true);
    try {
      await handleConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
        data-aos="zoom-in"
      >
        {/* Botón de cierre */}
        <button
          className="absolute top-3 right-3 text-white hover:text-red-500 text-xl"
          onClick={handleClose}
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-red-500">
          Confirmar Eliminación
        </h2>

        <div className="space-y-2 text-sm">
          <p>¿Estás seguro de que deseas eliminar esta reservación?</p>
          <p>
            <strong>👤 Usuario:</strong> {reservation.user.firstName} {reservation.user.lastName}
          </p>
          <p>
            <strong>🏋️ Clase:</strong> {reservation.classSchedule.classType.name}
          </p>
          <p>
            <strong>📅 Día:</strong> {reservation.classSchedule.day_of_week}
          </p>
          <p>
            <strong>🕒 Horario:</strong> {reservation.classSchedule.start_time} - {reservation.classSchedule.end_time}
          </p>
          <p>
            <strong>👨‍🏫 Profesor:</strong> {reservation.classSchedule.teacherName}
          </p>
          <p className="text-red-400 font-medium">Esta acción no se puede deshacer.</p>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>

        {/* Spinner si está procesando */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmDeleteReservationModal;
