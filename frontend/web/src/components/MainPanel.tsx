import { useState } from "react";
import ClassTypeTable from "./admin/ClassTypes";
import ClassScheduler from "./admin/ClassScheduler";
import TeacherTable from "./admin/TeacherTable";
import PackTable from "./admin/PackTable";
import UserTable from "./admin/UserTable";
import ReservationTable from "./admin/ReservationTable";
import CurrentClassAttendance from "./admin/CurrentClassAttendance";

interface MainPanelProps {
  onLogout: () => void;
  userRole: string | null;
}

const MainPanel: React.FC<MainPanelProps> = ({ userRole }) => {
  const isInstructor = userRole === "Instructor";

  const tabs = isInstructor
    ? [{ key: "attendances", label: "Asistencias" }]
    : [
        { key: "classTypes", label: "Tipos de Clases" },
        { key: "scheduler", label: "Calendario" },
        { key: "packs", label: "Packs" },
        { key: "teachers", label: "Profesores" },
        { key: "users", label: "Usuarios" },
        { key: "attendances", label: "Asistencias" },
      ];

  const [currentView, setCurrentView] = useState(tabs[0].key);

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col py-10 px-4">
      {/* Solo mostrar título si no es Instructor */}
      {!isInstructor && (
        <h1 className="text-4xl font-bold mb-8 text-center">Gestión de Clases</h1>
      )}

      {/* Panel resumen solo para Admin */}
      {!isInstructor && (
        <div className="w-full mb-10 px-4">
          <CurrentClassAttendance />
        </div>
      )}

      {/* Botones de navegación solo para Admin */}
      {!isInstructor && (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-12 px-4">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setCurrentView(key)}
              className={`w-full px-4 py-2 rounded-xl text-center text-base font-medium transition-colors ${
                currentView === key
                  ? "bg-indigo-700 hover:bg-indigo-800"
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Contenido dinámico según rol y vista */}
      <div className="w-full px-4">
        {currentView === "classTypes" && <ClassTypeTable />}
        {currentView === "scheduler" && <ClassScheduler />}
        {currentView === "teachers" && <TeacherTable />}
        {currentView === "packs" && <PackTable />}
        {currentView === "users" && <UserTable />}
        {currentView === "attendances" && <ReservationTable userRole={userRole} />}
      </div>
    </div>
  );
};

export default MainPanel;
