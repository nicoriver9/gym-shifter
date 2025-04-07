import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "../pages/LoginForm";
import UserDashboard from "../pages/user/UserDashboard";
import PacksPage from "../pages/user/PacksPage";
import QRScannerPage from "../pages/user/QRScannerPage";
import TodayClassesPage from "../pages/user/TodayClassesPage";
import MainPanel from "../components/MainPanel";
import AccessDenied from "../pages/AccessDenied";

// Definir los tipos de los props
interface AppRoutesProps {
  isAuthenticated: boolean;
  userRole: string | null;
  onLogin: () => void;
  onLogout: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ isAuthenticated, userRole, onLogin, onLogout }) => {
  return (
    <Router>
      <Routes>
        {/* Si el usuario NO está autenticado, mostrar LoginForm */}
        <Route
          path="/"
          element={
            !isAuthenticated ? <LoginForm onLogin={onLogin} /> : <Navigate to="/dashboard" replace />
          }
        />

        {/* Ruta del panel de usuario */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <UserDashboard onLogout={onLogout} /> : <Navigate to="/" />}
        >
          <Route path="packs" element={<PacksPage />} />
          <Route path="qr-scanner" element={<QRScannerPage />} />
          <Route path="today-classes" element={<TodayClassesPage />} />

          {/* Ruta de administración solo para Admins */}
          <Route
            path="administration"
            element={
              isAuthenticated && userRole === "Admin" ? (
                <MainPanel onLogout={onLogout} />
              ) : (
                <AccessDenied />
              )
            }
          />
        </Route>

        {/* Agregar ruta para success que redirija a packs */}
        <Route
          path="/payments/success"
          element={<Navigate to="/dashboard/packs" replace />}
        />

        {/* Ruta comodín para redirigir a la raíz */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
