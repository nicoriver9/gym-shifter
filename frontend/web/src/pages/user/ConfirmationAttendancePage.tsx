import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

import { PackInfo } from "../../components/user/PackInfo";
import { useUserPackStore } from "../../store/packCounter";
import {
  confirmClassAttendance,
  getNextClass,
} from "../../services/user/userPackService";
import { countConfirmedForClass } from "../../utils/user/attendanceUtils";

const showDarkModal = ({
  title,
  text,
  html,
  icon,
  showCancelButton = false,
  confirmButtonText = "OK",
  cancelButtonText = "Cancelar",
  confirmButtonColor = "#6366f1",
  cancelButtonColor = "#dc2626",
}: {
  title: string;
  text?: string;
  html?: string;
  icon: "info" | "success" | "error" | "warning" | "question";
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
}) => {
  return Swal.fire({
    title,
    text,
    html,
    icon,
    background: "#1e293b",
    color: "#f1f5f9",
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor,
    cancelButtonColor,
    showCancelButton,
  });
};

const ConfirmationAttendancePage = () => {
  const [nextClass, setNextClass] = useState<any>(null);
  const [confirmedCount, setConfirmedCount] = useState<number | null>(null);
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

  const isAlreadyConfirmed = nextClass?.has_confirmed;


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
          const updatedCount = await countConfirmedForClass(res.data);
          setConfirmedCount(updatedCount);
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
      return showDarkModal({
        title: "⏳ Aún falta mucho",
        text: "Solo 1h antes",
        icon: "info",
      });
    }

    if (nextClass.has_confirmed) {
      return showDarkModal({
        title: "✅ Ya confirmaste",
        text: "No necesitas volver a confirmar",
        icon: "info",
        confirmButtonColor: "#22c55e",
      });
    }

    const ok = await showDarkModal({
      title: "Confirmar asistencia (No podrás cancelar)",
      html: `<b>${nextClass.name}</b><br/>${nextClass.start_time} - ${nextClass.end_time}<br/>Prof: ${nextClass.teacher}`,
      icon: "question",
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

        if (resp.data.is_new_confirmation) {
          await showDarkModal({
            title: "✅ Confirmado",
            text: "¡Has dado presente!",
            icon: "success",
            confirmButtonColor: "#22c55e",
          });
        } else {
          await showDarkModal({
            title: "✅ Ya habías confirmado",
            text: "Tu asistencia ya estaba registrada para esta clase.",
            icon: "info",
            confirmButtonColor: "#22c55e",
          });
        }

        setNextClass({ ...nextClass, has_confirmed: true });

        // 🔄 Refrescar cantidad confirmados
        const updatedCount = await countConfirmedForClass(nextClass);
        setConfirmedCount(updatedCount);
      } else {
        throw new Error(resp.message);
      }
    } catch (e: any) {
      showDarkModal({
        title: "❌ Error",
        text: e.message,
        icon: "error",
      });
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
          {confirmedCount !== null && (
            <p className="text-center text-sm text-purple-200">
              Confirmados:{" "}
              <span className="font-semibold text-white">
                {confirmedCount}
              </span>
            </p>
          )}

          <div className="flex flex-col items-center gap-4 mt-4">
            <button
              onClick={handleConfirm}
              disabled={isProcessing || nextClass.has_confirmed}
              className={`w-20 h-20 p-2 flex items-center justify-center text-sm sm:text-base font-semibold rounded-full border transition duration-300 shadow-lg ${
                nextClass.has_confirmed
                  ? "bg-gray-600 border-gray-500 cursor-not-allowed text-gray-300"
                  : "bg-green-500 border-green-700 hover:bg-green-600 text-white"
              }`}
            >
              {isAlreadyConfirmed ? "Presente" : "Confirmar"}
            </button>
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

export default ConfirmationAttendancePage;
