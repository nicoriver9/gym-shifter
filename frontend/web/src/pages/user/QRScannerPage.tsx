// src/components/QRScannerPage.tsx
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Scanner } from "@yudiel/react-qr-scanner";
import { PackInfo } from "../../components/user/PackInfo";
import { confirmClassAttendance } from "../../services/user/userPackService";
import { useUserPackStore } from "../../store/packCounter";
import { ConfirmationModal } from "../../components/user/ConfirmationModal";
import { findCurrentClass } from "../../utils/user/classUtils";
import { CurrentClassSection } from "../../components/user/CurrentClassSection";

const QRScannerPage = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showManualOption, setShowManualOption] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasCurrentClass, setHasCurrentClass] = useState<boolean>(false);
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

  const [currentClass, setCurrentClass] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [classTypes, setClassTypes] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  // Cargar clases, tipos de clase y profesores
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
        // Verificar si hay clases en curso al cargar
        checkCurrentClass(data);
      });
  }, []);

  const checkCurrentClass = (classList: any[]) => {
    const now = new Date();
    const foundClass = findCurrentClass(classList, now);
    setHasCurrentClass(!!foundClass);
  };

  const handleSuccess = (result: any) => {
    if (result.success && result.data) {
      const message = result.data.is_new_confirmation
        ? `Asistencia confirmada a ${result.data.class_name} con ${result.data.teacher_name}. Clases restantes: ${result.data.classes_remaining}`
        : `Ya habías confirmado asistencia a ${result.data.class_name} con ${result.data.teacher_name}. Clases restantes: ${result.data.classes_remaining}`;

      setScanResult(message);
      setError(null);
      setShowManualOption(false);

      setUserPack(result.data.pack_name);
      setUserPackClassesIncluded(result.data.classes_remaining);
      setPackExpirationDate(result.data.pack_expiration_date);
    } else {
      throw new Error("Respuesta inesperada del servidor");
    }
  };

  const handleScan = (data: any) => {
    if (data && hasCurrentClass) {
      const now = new Date();
      const foundClass = findCurrentClass(classes, now);

      if (!foundClass) {
        setError("No hay clases programadas en este momento");
        setHasCurrentClass(false);
        return;
      }

      setCurrentClass({
        ...foundClass,
        classType: classTypes.find(
          (type) => type.id === foundClass.class_type_id
        ),
        teacher: teachers.find(
          (teacher) => teacher.id === foundClass.teacher_id
        ),
      });

      setIsModalOpen(true);
    }
  };

  const handleManualCheckIn = async () => {
    if (!hasCurrentClass) return;

    const now = new Date();
    const foundClass = findCurrentClass(classes, now);

    if (!foundClass) {
      setError("No hay clases programadas en este momento");
      setHasCurrentClass(false);
      return;
    }

    setCurrentClass({
      ...foundClass,
      classType: classTypes.find(
        (type) => type.id === foundClass.class_type_id
      ),
      teacher: teachers.find((teacher) => teacher.id === foundClass.teacher_id),
    });

    setIsModalOpen(true);
  };

  const confirmAttendance = async () => {
    if (!currentClass) return;

    setIsProcessing(true);
    try {
      const now = new Date();
      const result = await confirmClassAttendance(userId, now);
      handleSuccess(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
      setIsModalOpen(false);
      setCurrentClass(null);
    }
  };

  const handleError = (err: any) => {
    console.error("Error al escanear el código QR:", err);
    setError("Error al escanear el código QR. Inténtalo de nuevo.");
    setShowManualOption(hasCurrentClass);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <PackInfo />
      <CurrentClassSection
        classes={classes}
        classTypes={classTypes}
        teachers={teachers}
      />

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmAttendance}
        onCancel={() => {
          setIsModalOpen(false);
          setCurrentClass(null);
        }}
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

      {/* Mensajes de estado */}
      {error && (
        <div className="bg-red-100 text-red-800 px-6 py-4 mb-4 rounded-md shadow-md text-center">
          ❌ {error}
        </div>
      )}

      {scanResult && (
        <div className="bg-green-100 text-green-800 px-6 py-4 mb-4 rounded-md shadow-md text-center">
          ✅ {scanResult}
        </div>
      )}

      {/* Contenido principal - Solo mostrar si hay clase en curso */}
      {!scanResult && hasCurrentClass && hasValidPack && (
        <>
          {isMobile ? (
            <>
              <div className="rounded-md overflow-hidden shadow-md border border-gray-700 mb-4">
                <Scanner
                  onScan={handleScan}
                  onError={handleError}
                  constraints={{ facingMode: "environment" }}
                  styles={{ finderBorder: 1 }}
                />
              </div>

              {showManualOption && (
                <div className="text-center mt-6">
                  <p className="text-white mb-3">¿No funciona el escáner QR?</p>
                  <button
                    onClick={handleManualCheckIn}
                    disabled={isProcessing}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition shadow-md disabled:bg-gray-500"
                  >
                    {isProcessing
                      ? "Procesando..."
                      : "Confirmar asistencia manualmente"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col justify-center items-center min-h-[60vh] px-4 gap-4">
              <div className="bg-yellow-100 text-yellow-800 px-6 py-4 rounded-md shadow-md text-center max-w-md w-full">
                <p className="font-semibold">
                  ⚠️ Por favor, ingresa a la aplicación desde tu celular para
                  usar el escáner de QR.
                </p>
              </div>
              <button
                onClick={handleManualCheckIn}
                disabled={isProcessing}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition shadow-md disabled:bg-gray-500"
              >
                {isProcessing
                  ? "Procesando..."
                  : "Confirmar asistencia manualmente"}
              </button>
            </div>
          )}
        </>
      )}

      {!scanResult && hasCurrentClass && !hasValidPack && (
        <div className="bg-red-900 text-white p-4 rounded-lg text-center mb-6">
          No puedes confirmar tu asistencia porque no tienes un pack activo
          asignado.
        </div>
      )}

      {/* Mensaje cuando no hay clases */}
      {!hasCurrentClass && !scanResult && (
        <div className="bg-blue-900 text-white p-4 rounded-lg text-center mb-6">
          No hay clases en curso actualmente. El escáner QR y la confirmación
          manual estarán disponibles cuando haya una clase programada.
        </div>
      )}

      {scanResult && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setScanResult(null)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition shadow-md"
          >
            Escanear otro código
          </button>
        </div>
      )}
    </div>
  );
};

export default QRScannerPage;
