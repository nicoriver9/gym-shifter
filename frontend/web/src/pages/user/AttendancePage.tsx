// src/pages/user/AttendancePage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PackInfo } from "../../components/user/PackInfo";
import { useUserPackStore } from "../../store/packCounter";
import { findCurrentClass } from "../../utils/user/classUtils";
import { CurrentClassSection } from "../../components/user/CurrentClassSection";
import { confirmClassAttendance } from "../../services/user/userPackService";
import { ConfirmationModal } from "../../components/user/ConfirmationModal";
import { FaQrcode } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";

const AttendancePage = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<any[]>([]);
  const [classTypes, setClassTypes] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [hasCurrentClass, setHasCurrentClass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState<any>(null);

  const userId = Number(localStorage.getItem("user_id"));
  const {
    userPack,
    userPackClassesIncluded,
    setUserPack,
    setUserPackClassesIncluded,
    setPackExpirationDate,
  } = useUserPackStore();

  const hasValidPack =
    !!userPack &&
    userPack !== "No tienes un pack asignado" &&
    userPackClassesIncluded !== null;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/class-types`)
      .then((res) => res.json())
      .then(setClassTypes);

    fetch(`${import.meta.env.VITE_API_URL}/api/teachers`)
      .then((res) => res.json())
      .then(setTeachers);

    fetch(`${import.meta.env.VITE_API_URL}/api/classes`)
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
        setHasCurrentClass(!!findCurrentClass(data, new Date()));
      });
  }, []);

  const showConfirmationModal = () => {
    const now = new Date();
    const found = findCurrentClass(classes, now);
    if (!found) {
      setError("No hay clases en curso en este momento.");
      return;
    }
    setCurrentClass({
      ...found,
      classType: classTypes.find((t) => t.id === found.class_type_id),
      teacher: teachers.find((t) => t.id === found.teacher_id),
    });
    setIsModalOpen(true);
  };

  const handleManualConfirmation = async () => {
    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    try {
      const now = new Date();
      const result = await confirmClassAttendance(userId, now);
      if (result.success && result.data) {
        setUserPack(result.data.pack_name);
        setUserPackClassesIncluded(result.data.classes_remaining);
        setPackExpirationDate(result.data.pack_expiration_date);
        setSuccess(
          `✅ Asistencia confirmada: ${result.data.class_name} con ${result.data.teacher_name}. Clases restantes: ${result.data.classes_remaining}`
        );
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      setError(err.message || "Error al confirmar asistencia.");
    } finally {
      setIsProcessing(false);
      setIsModalOpen(false);
      setCurrentClass(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <PackInfo />
      <CurrentClassSection
        classes={classes}
        classTypes={classTypes}
        teachers={teachers}
      />

      <ConfirmationModal
        isOpen={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setCurrentClass(null);
        }}
        onConfirm={handleManualConfirmation}
        message={
          currentClass ? (
            <div>
              <p>¿Confirmar asistencia a:</p>
              <p className="font-bold text-lg mt-2">
                {currentClass.classType?.name}
              </p>
              <p>
                Horario: {currentClass.start_time} - {currentClass.end_time}
              </p>
              <p>Profesor: {currentClass.teacher?.name}</p>
              <p className="mt-2">Se descontará una clase de tu pack.</p>
            </div>
          ) : (
            "¿Confirmar asistencia a la clase actual?"
          )
        }
      />

      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-2 my-4 rounded-md text-center">
          ❌ {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-800 px-4 py-2 my-4 rounded-md text-center">
          {success}
        </div>
      )}

      {hasValidPack && hasCurrentClass && (
        <div className="text-center mt-6 space-y-4">
          <button
            onClick={() => navigate("/dashboard/scan")}
            disabled={!!success}
            className={`flex items-center justify-center gap-2 w-full text-white font-semibold px-6 py-3 rounded-lg shadow-md transition ${success
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-teal-500 hover:bg-teal-600"
              }`}
          >
            <FaQrcode className="text-xl" />
            Confirmar por QR
          </button>

          <button
            onClick={showConfirmationModal}
            disabled={isProcessing || !!success}
            className={`flex items-center justify-center gap-2 w-full text-white font-semibold px-6 py-3 rounded-lg shadow-md transition ${isProcessing || success
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
              }`}
          >
            <FiCheckCircle className="text-xl" />
            {isProcessing ? "Procesando..." : "Confirmar manual"}
          </button>
        </div>
      )}

      {!hasValidPack && (
        <div className="bg-red-900 text-white p-4 rounded-lg text-center mt-6">
          No puedes confirmar asistencia porque no tienes un pack activo.
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
