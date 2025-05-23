import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

import { PackInfo } from "../../components/user/PackInfo";
import { useUserPackStore } from "../../store/packCounter";
import {
  confirmClassAttendance,
  cancelAttendance,
  getNextClass,
} from "../../services/user/userPackService";

const AttendancePage = () => {
  const [nextClass, setNextClass] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

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
    AOS.init({ duration: 600 });
    (async () => {
      try {
        const res = await getNextClass(userId);
        if (res.success && res.data.is_upcoming) {
          setNextClass(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const minutesUntil = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const now = new Date();
    const c = new Date();
    c.setHours(h, m, 0, 0);
    return Math.floor((c.getTime() - now.getTime()) / 60000);
  };

  const handleConfirm = async () => {
    if (!nextClass) return;
    const mins = minutesUntil(nextClass.start_time);
    if (mins > 60) {
      return Swal.fire("⏳ Aún falta mucho", "Solo 1h antes", "info");
    }
    if (nextClass.has_confirmed) {
      return Swal.fire(
        "✅ Ya confirmaste",
        "No necesitas volver a confirmar",
        "info"
      );
    }

    const ok = await Swal.fire({
      title: "Confirmar asistencia",
      html: `<b>${nextClass.name}</b><br/>${nextClass.start_time} - ${nextClass.end_time}<br/>Prof: ${nextClass.teacher}`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
    });
    if (!ok.isConfirmed) return;

    try {
      setIsProcessing(true);
      const resp = await confirmClassAttendance(userId, new Date());
      if (resp.success && resp.data) {
        setUserPack(resp.data.pack_name);
        setUserPackClassesIncluded(resp.data.classes_remaining);
        setPackExpirationDate(resp.data.pack_expiration_date);
        Swal.fire("✅ Confirmado", "¡Has dado presente!", "success");
        setNextClass({ ...nextClass, has_confirmed: true });
      } else {
        throw new Error(resp.message);
      }
    } catch (e: any) {
      Swal.fire("❌ Error", e.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!nextClass) return;
    const mins = minutesUntil(nextClass.start_time);
    if (mins < 10) {
      return Swal.fire(
        "⏳ Muy tarde",
        "Menos de 10 minutos restantes",
        "warning"
      );
    }
    const ok = await Swal.fire({
      title: "Cancelar asistencia",
      text: "¿Seguro?",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
      confirmButtonColor: "#f87171",
    });
    if (!ok.isConfirmed) return;

    try {
      setIsProcessing(true);
      const resp = await await cancelAttendance(
        userId,
        nextClass.id,
        new Date()
      );
      if (resp.success) {
        setUserPackClassesIncluded(
          userPackClassesIncluded ? userPackClassesIncluded + 1 : 1
        );
        Swal.fire("✅ Cancelado", resp.message, "success");
        setNextClass({ ...nextClass, has_confirmed: false });
      } else {
        throw new Error(resp.message);
      }
    } catch (e: any) {
      Swal.fire("❌ Error", e.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-white">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <PackInfo />

      {hasValidPack && nextClass ? (
        <div className="bg-indigo-800 p-6 rounded-lg text-white shadow-md">
          <h2 className="text-xl font-bold mb-2 text-center">Próxima Clase</h2>
          <p className="text-center mb-1 font-semibold">{nextClass.name}</p>
          <p className="text-center mb-1">
            {nextClass.start_time} – {nextClass.end_time}
          </p>
          <p className="text-center mb-4">Prof: {nextClass.teacher}</p>

          <div className="flex justify-center gap-4">
            {/* Confirmar / Presente */}
            <button
              onClick={handleConfirm}
              disabled={isProcessing || nextClass.has_confirmed}
              className={`py-2 px-4 rounded font-semibold transition ${
                nextClass.has_confirmed
                  ? "bg-gray-600 cursor-not-allowed text-gray-300"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {nextClass.has_confirmed ? "Presente" : "Confirmar"}
            </button>

            {/* Cancelar Asistencia (sólo aparece tras confirmar) */}
            {nextClass.has_confirmed && (
              <button
                onClick={handleCancel}
                disabled={isProcessing}
                className="py-2 px-4 rounded bg-red-500 hover:bg-red-600 text-white font-semibold transition"
              >
                Cancelar Asistencia
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 text-gray-400 p-4 rounded-lg text-center">
          No hay clases próximas disponibles.
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
