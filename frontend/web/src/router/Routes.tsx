import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginForm from "../pages/LoginForm";
import UserDashboard from "../pages/user/UserDashboard";
import PacksPage from "../pages/user/PacksPage";
import AttendancePage from "../pages/user/ConfirmationAttendancePage";
import QRScanOnlyPage from "../pages/user/QRScanOnlyPage";
import TodayClassesPage from "../pages/user/TodayClassesPage";
import MainPanel from "../components/MainPanel";
import AccessDenied from "../pages/AccessDenied";
import PaymentAliasCard from "../pages/user/PaymentAliasCard";
import UserLayout from "../layouts/UserLayout";
import PrivacyPolicy from "../pages/PrivacyPolicy";

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
        <Route path="/privacy" element={<PrivacyPolicy />} />
        {/* Dashboard con layout */}
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
          <Route path="confirm-attendance" element={<AttendancePage />} />
          <Route path="scan" element={<QRScanOnlyPage />} />
          <Route path="today-classes" element={<TodayClassesPage />} />
          <Route
            path="administration"
            element={
              isAuthenticated &&
              (userRole === "Admin" || userRole === "Instructor") ? (
                <MainPanel userRole={userRole} onLogout={onLogout} />
              ) : (
                <AccessDenied />
              )
            }
          />
        </Route>

        {/* Rutas externas con layout de usuario */}
        <Route element={<UserLayout />}>
          <Route
            path="/packs"
            element={isAuthenticated ? <PacksPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/today-classes"
            element={
              isAuthenticated ? <TodayClassesPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/confirm-attendance"
            element={
              isAuthenticated ? <AttendancePage /> : <Navigate to="/login" />
            }
          />
        </Route>

        {/* Alias de pago */}
        <Route path="/payment/alias" element={<PaymentAliasCard />} />

        {/* Redirección post-pago */}
        {/* <Route
          path="/payments/success"
          element={<Navigate to="/dashboard/packs" replace />}
        /> */}

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
