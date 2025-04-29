import { FiLogOut, FiPackage, FiCheckCircle, FiClock, FiSettings } from "react-icons/fi";
import { Link, Outlet } from "react-router-dom";
import { useUserPackStore } from "../../store/packCounter";

interface UserDashboardProps {
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout }) => {
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const userRole = localStorage.getItem("role");

  const { userPackClassesIncluded } = useUserPackStore();
  const noClassesAvailable = userPackClassesIncluded === 0;

  return (
    <div className="relative min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow mb-8">
        <div className="flex-grow">
          <h1 className="text-2xl font-bold text-center">Hola!! {firstName} {lastName}</h1>
        </div>
        <button
          onClick={onLogout}
          className="w-10 h-10 flex items-center justify-center bg-red-600 hover:bg-red-700 rounded-full transition"
        >
          <FiLogOut className="text-xl text-white" />
          <span className="sr-only">Cerrar Sesión</span>
        </button>
      </header>

      {/* Badge de clases restantes */}
      <div className="mb-6 px-3 py-1 bg-gray-700 rounded-full text-sm flex items-center">
        <span className="font-medium mr-2">Clases restantes:</span>
        <span className="font-bold">{userPackClassesIncluded}</span>
      </div>

      {/* Navegación mobile-first */}
      <nav className="w-full max-w-4xl flex flex-col sm:flex-row items-center gap-4 mb-10 justify-center">
        {/* Packs */}
        <Link
          to="/dashboard/packs"
          data-aos="fade-up" data-aos-duration="1000"
          className="flex w-3/5 sm:w-auto items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-full text-base font-medium transition"
        >
          <FiPackage /> <span>Packs</span>
        </Link>

        {/* Confirmar asistencia (destacado en mobile) */}
        <Link
          to="/dashboard/confirm-attendance"
          data-aos="fade-up" data-aos-duration="1500"
          className={`
            flex w-3/5 sm:w-auto items-center justify-center text-center gap-2 px-6 py-3
            ${noClassesAvailable
              ? "bg-gray-500 cursor-not-allowed opacity-60"
              : "bg-green-600 hover:bg-green-700"}
            rounded-full text-base font-semibold transition
          `}
          onClick={(e) => noClassesAvailable && e.preventDefault()}
        >
          <FiCheckCircle /> <span>Confirmar Asistencia</span>
        </Link>

        {/* Clases de Hoy */}
        <Link
          to="/dashboard/today-classes"
          data-aos="fade-up" data-aos-duration="2000"
          className={`
            flex w-3/5 sm:w-auto items-center justify-center gap-2 px-6 py-3
            ${noClassesAvailable
              ? "bg-gray-500 cursor-not-allowed opacity-60"
              : "bg-purple-600 hover:bg-purple-700"}
            rounded-full text-base font-medium transition
          `}
          onClick={(e) => noClassesAvailable && e.preventDefault()}
        >
          <FiClock /> <span>Clases de Hoy</span>
        </Link>

        {/* Admin */}
        {userRole === "Admin" && (
          <Link
            to="/dashboard/administration"
            data-aos="fade-up" data-aos-duration="2500"
            className="flex w-3/5 sm:w-auto items-center justify-center gap-2 px-6 py-3 bg-sky-900 hover:bg-sky-700 rounded-full text-base font-medium transition"
          >
            <FiSettings /> <span>Administración</span>
          </Link>
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
