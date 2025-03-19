// src/pages/AccessDenied.tsx
import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Acceso Denegado</h1>
      <p className="text-lg mb-6">
        No tienes permisos para acceder a esta página.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition"
      >
        Volver al Panel de Usuario
      </Link>
    </div>
  );
};

export default AccessDenied;