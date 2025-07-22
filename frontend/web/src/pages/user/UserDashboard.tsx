import {
  FiLogOut,
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiSettings,
} from "react-icons/fi";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUserPackStore } from "../../store/packCounter";
import { useIsMobile } from "../../hooks/useIsMobile";
import { PackInfo } from "../../components/user/PackInfo";
import { useEffect } from "react";
import { initAttendanceAfterLogin } from "../../utils/user/initAttendanceAfterLogin";

interface UserDashboardProps {
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout }) => {
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const userRole = localStorage.getItem("role");

  const { userPackClassesIncluded } = useUserPackStore();
  const noClassesAvailable = userPackClassesIncluded === 0;

  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const isMainDashboard =
    location.pathname === "/dashboard" || location.pathname === "/dashboard/";

  useEffect(() => {
    initAttendanceAfterLogin();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-gray-900 text-white flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow mb-8">
        <div className="flex-grow">
          <h1 className="text-2xl font-bold text-center">
            Hola!! {firstName} {lastName}
          </h1>
        </div>
        <button
          onClick={onLogout}
          className="w-14 h-11 flex items-center justify-center bg-red-600 hover:bg-red-700 rounded-full transition"
        >
          <FiLogOut className="text-xl text-white" />
          <span className="sr-only">Cerrar Sesión</span>
        </button>
      </header>

      {/* Pack actual solo en ruta raíz del dashboard */}
      {isMainDashboard && <PackInfo />}

      {/* Navegación */}
      <nav className="w-2/3 max-w-4xl flex flex-col sm:flex-row items-center gap-4 mt-10 mb-16 justify-center">
        {/* Packs */}
        <button
          onClick={() =>
            isMobile ? navigate("/packs") : navigate("/dashboard/packs")
          }
          className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-lg font-semibold rounded-full transition shadow-md hover:shadow-xl active:scale-95"
        >
          <FiPackage className="text-xl sm:text-2xl" />
          <span className="leading-tight">Packs</span>
        </button>

        {/* Confirmar Asistencia */}
        <button
          onClick={() => {
            if (noClassesAvailable) return;
            isMobile
              ? navigate("/confirm-attendance")
              : navigate("/dashboard/confirm-attendance");
          }}
          className={`flex w-full sm:w-auto items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-full text-sm sm:text-lg font-semibold transition shadow-md hover:shadow-xl active:scale-95 ${
            noClassesAvailable
              ? "bg-gray-500 cursor-not-allowed opacity-60"
              : "bg-teal-500 hover:bg-teal-600 text-white"
          }`}
        >
          <FiCheckCircle className="text-xl sm:text-2xl" />
          <span className="leading-tight">Confirmar Asistencia</span>
        </button>

        {/* Clases de Hoy */}
        <button
          onClick={() => {
            if (noClassesAvailable) return;
            isMobile
              ? navigate("/today-classes")
              : navigate("/dashboard/today-classes");
          }}
          className={`flex w-full sm:w-auto items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-full text-sm sm:text-lg font-semibold transition shadow-md hover:shadow-xl active:scale-95 ${
            noClassesAvailable
              ? "bg-gray-500 cursor-not-allowed opacity-60"
              : "bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
          }`}
        >
          <FiClock className="text-xl sm:text-2xl" />
          <span className="leading-tight">Clases de Hoy</span>
        </button>

        {/* Administración */}
        {(userRole === "Admin" || userRole === "Instructor") && (
          <button
            onClick={() => navigate("/dashboard/administration")}
            className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-blue-800 hover:bg-blue-700 text-white text-sm sm:text-lg font-semibold rounded-full transition shadow-md hover:shadow-xl active:scale-95"
          >
            <FiSettings className="text-xl sm:text-2xl" />
            <span className="leading-tight">Administración</span>
          </button>
        )}
      </nav>

      {/* Contenido anidado */}
      <div className="w-full max-w-4xl">
        <Outlet />
      </div>
    </div>
  );
};

export default UserDashboard;
