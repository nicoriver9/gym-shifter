// src/pages/user/QRScanOnlyPage.tsx
import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { confirmClassAttendance } from "../../services/user/userPackService";
import { useUserPackStore } from "../../store/packCounter";
import { findCurrentClass } from "../../utils/user/classUtils";
import { useNavigate } from "react-router-dom";
import { FiArrowLeftCircle } from "react-icons/fi";


const QRScanOnlyPage = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<any[]>([]);
  const [, setClassTypes] = useState<any[]>([]);
  const [, setTeachers] = useState<any[]>([]);
  const [hasCurrentClass, setHasCurrentClass] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = Number(localStorage.getItem("user_id"));

  const { setUserPack, setUserPackClassesIncluded, setPackExpirationDate } =
    useUserPackStore();

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
        console.log(data)
        setClasses(data);
        const now = new Date();
        const found = findCurrentClass(data, now);
        setHasCurrentClass(!!found);
      });
  }, []);

  const handleScan = async (data: any) => {
    if (data && hasCurrentClass) {
      const now = new Date();
      const foundClass = findCurrentClass(classes, now);

      if (!foundClass) {
        setError("No hay clases en este momento");
        return;
      }

      try {
        const result = await confirmClassAttendance(userId, now);
        if (result.success && result.data) {
          setUserPack(result.data.pack_name);
          setUserPackClassesIncluded(result.data.classes_remaining);
          setPackExpirationDate(result.data.pack_expiration_date);

          alert(
            `✅ Asistencia confirmada a ${result.data.class_name} con ${result.data.teacher_name}. Clases restantes: ${result.data.classes_remaining}`
          );
          navigate("/dashboard/confirm-attendance");
        } else {
          throw new Error("Respuesta inesperada del servidor");
        }
      } catch (err: any) {
        setError(err.message || "Error al confirmar asistencia");
      }
    }
  };

  // return (
  //   <div className="max-w-xl mx-auto mt-10 px-4">
  //     <h2 className="text-center text-xl font-bold mb-6 text-white">
  //       Escanea el código QR
  //     </h2>

  //     <div className="rounded-md overflow-hidden shadow-md border border-gray-700 mb-4">
  //       <Scanner
  //         onScan={handleScan}
  //         onError={(e: any) =>
  //           setError("Error al escanear: " + e?.name || "desconocido")
  //         }
  //         constraints={{
  //           facingMode: { ideal: "environment" }, // ✅ Usa `ideal` en lugar de `exacto`
  //           width: { ideal: 1280 },
  //           height: { ideal: 720 },
  //         }}
  //       />
  //     </div>

  //     {error && (
  //       <div className="bg-red-100 text-red-800 px-6 py-4 mb-4 rounded-md shadow-md text-center">
  //         ❌ {error}
  //       </div>
  //     )}

  //     <div className="flex justify-center mt-6">
  //       <button
  //         onClick={() => navigate("/dashboard/confirm-attendance")}
  //         className="flex items-center bg-gray-600 hover:bg-gray-700 font-semibold text-white px-6 py-3 rounded-lg transition shadow-md"
  //       >
  //         <FiArrowLeftCircle className="text-2xl mr-2" /> Volver
  //       </button>
  //     </div>
  //   </div>
  // );

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h2 className="text-center text-xl font-bold mb-6 text-white">
        Escanea el código QR
      </h2>

      <div className="relative w-full h-80 mb-4 rounded-md overflow-hidden shadow-md border border-gray-700">
        <Scanner
          onScan={handleScan}
          onError={(e: any) => setError("Error al escanear: " + e?.name || "desconocido")}
          constraints={{
            facingMode: { ideal: "environment" },
          }}
          // 1) Desactivamos el finder nativo
          components={{ finder: false }}
          // 2) Forzamos que el video “cubra” el contenedor
          styles={{
            container: { position: "relative", width: "100%", height: "100%" },
            video: { width: "100%", height: "100%", objectFit: "cover" },
            // quitamos cualquier borde del finder
            // finderBorder: 0,
          }}
        >
          {/*
            3) Aquí va nuestro overlay personalizado:
            un div absolutamente centrado con borde rojo
          */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-3/4 aspect-square border-4 border-red-500 rounded-lg" />
          </div>
        </Scanner>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 px-6 py-4 mb-4 rounded-md shadow-md text-center">
          ❌ {error}
        </div>
      )}

      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/dashboard/confirm-attendance")}
          className="flex items-center bg-gray-600 hover:bg-gray-700 font-semibold text-white px-6 py-3 rounded-lg transition shadow-md"
        >
          <FiArrowLeftCircle className="text-2xl mr-2" /> Volver
        </button>
      </div>
    </div>
  );


};

export default QRScanOnlyPage;
