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
}

const MainPanel: React.FC<MainPanelProps> = () => {
  const [currentView, setCurrentView] = useState<
    "classTypes" | "scheduler" | "teachers" | "packs" | "users" | "attendances"
  >("classTypes");

  const tabs = [
    { key: "classTypes", label: "Tipos de Clases" },
    { key: "scheduler", label: "Calendario" },
    { key: "packs", label: "Packs" },
    { key: "teachers", label: "Profesores" },
    { key: "users", label: "Usuarios" },
    { key: "attendances", label: "Asistencias" },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-8">Gestión de Clases</h1>

      <div className="w-full max-w-4xl mb-10">
        <CurrentClassAttendance />
      </div>

      {/* NAV: grid responsivo */}
      <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-12">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setCurrentView(key)}
            className={`
              w-full px-4 py-2 rounded-xl text-center text-base font-medium transition-colors
              ${currentView === key
                ? "bg-indigo-700 hover:bg-indigo-800"
                : "bg-indigo-500 hover:bg-indigo-600"
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Contenido según tab activo */}
      <div className="w-full max-w-4xl">
        {currentView === "classTypes" && <ClassTypeTable />}
        {currentView === "scheduler" && <ClassScheduler />}
        {currentView === "teachers" && <TeacherTable />}
        {currentView === "packs" && <PackTable />}
        {currentView === "users" && <UserTable />}
        {currentView === "attendances" && <ReservationTable />}
      </div>
    </div>
  );
};

export default MainPanel;
