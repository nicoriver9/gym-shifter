import { useState, useEffect } from "react";
import AppRoutes from "./router/Routes"; // Importamos el archivo que maneja las rutas


import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Estado para evitar que se renderice antes de verificar la autenticación

  // Verificar si el usuario está autenticado y obtener su rol al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }

    setLoading(false); // Marcar como cargado después de verificar la autenticación
  }, []);

  // Manejar inicio de sesión
  const handleLogin = () => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  };

  // Manejar cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  // Mostrar una pantalla de carga antes de verificar autenticación
  if (loading) {
    return <div className="text-white text-center mt-10">Cargando...</div>;
  }

  return (
    <AppRoutes
      isAuthenticated={isAuthenticated}
      userRole={userRole}
      onLogin={handleLogin}
      onLogout={handleLogout}
    />
  );
};

export default App;
