import { useState, useEffect } from "react";
import AppRoutes from "./router/Routes";
import SplashScreen from "./pages/SplashScreen";

import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // controla splash + auth

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("access_token");
      const role = localStorage.getItem("role");

      if (token) {
        setIsAuthenticated(true);
        setUserRole(role);
      }

      setLoading(false); // termina splash + verificación
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  if (loading) {
    return <SplashScreen />;
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
