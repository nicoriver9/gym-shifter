import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginForm from "../pages/LoginForm";
import UserDashboard from "../pages/user/UserDashboard";
import PacksPage from "../pages/user/PacksPage";
import AttendancePage from "../pages/user/AttendancePage"; // ✅ nueva vista principal
import QRScanOnlyPage from "../pages/user/QRScanOnlyPage"; // ✅ vista solo QR
import TodayClassesPage from "../pages/user/TodayClassesPage";
import MainPanel from "../components/MainPanel";
import AccessDenied from "../pages/AccessDenied";
import PaymentAliasCard from "../pages/user/PaymentAliasCard"; // alias de pago

// Props del router
interface AppRoutesProps {
  isAuthenticated: boolean;
  userRole: string | null;
  onLogin: () => void;
  onLogout: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  isAuthenticated,
  userRole,
  onLogin,
  onLogout,
}) => {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginForm onLogin={onLogin} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <UserDashboard onLogout={onLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route path="packs" element={<PacksPage />} />
          <Route path="confirm-attendance" element={<AttendancePage />} /> {/* ✅ nueva ruta */}
          <Route path="scan" element={<QRScanOnlyPage />} /> {/* ✅ nueva ruta */}
          <Route path="today-classes" element={<TodayClassesPage />} />

          {/* Panel Admin */}
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

        {/* Alias de pago */}
        <Route path="/payment/alias" element={<PaymentAliasCard />} />

        {/* Redirección de éxito de pago */}
        <Route
          path="/payments/success"
          element={<Navigate to="/dashboard/packs" replace />}
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
