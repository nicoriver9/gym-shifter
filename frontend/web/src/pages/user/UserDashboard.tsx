import { FiLogOut } from "react-icons/fi";
import { Link, Outlet } from "react-router-dom";
import { useUserPackStore } from '../../store/packCounter'; // Importa el store

interface UserDashboardProps {
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout }) => {
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const userRole = localStorage.getItem("role");

  // Accede al estado del store
  const { userPackClassesIncluded } = useUserPackStore();

  // Verifica si no hay clases disponibles
  const noClassesAvailable = userPackClassesIncluded === 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold my-6 mb-10">
        {firstName} {lastName}
      </h1>

      {/* Botón de Cerrar Sesión con ícono */}
      <button
        onClick={onLogout}
        className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition"
      >
        <FiLogOut className="text-xl" /> Cerrar Sesión
      </button>

      {/* Navegación */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        <Link
          to="/dashboard/packs"
          className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition"
        >
          Packs
        </Link>

        {/* Botón "Confirmar asistencia" */}
        <Link
          to="/dashboard/qr-scanner"
          className={`px-6 py-2 rounded-full ${
            noClassesAvailable
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white font-medium transition`}
          onClick={(e) => noClassesAvailable && e.preventDefault()} // Evita la navegación si no hay clases
        >
          Confirmar asistencia
        </Link>

        {/* Botón "Clases de Hoy" */}
        <Link
          to="/dashboard/today-classes"
          className={`px-6 py-2 rounded-full ${
            noClassesAvailable
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white font-medium transition`}
          onClick={(e) => noClassesAvailable && e.preventDefault()} // Evita la navegación si no hay clases
        >
          Clases de Hoy
        </Link>

        {userRole === "Admin" && (
          <Link
            to="/dashboard/administration"
            className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition"
          >
            Administración
          </Link>
        )}
      </div>

      {/* Renderizar las rutas anidadas */}
      <div className="w-full max-w-4xl">
        <Outlet />
      </div>
    </div>
  );
};

export default UserDashboard;