import { useState } from "react";
// import { FiLogOut } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";

import ClassTypeTable from "./ClassTypes";
import ClassScheduler from "./ClassScheduler";
import TeacherTable from "./TeacherTable";
import PackTable from "./PackTable";
import UserTable from "./UserTable";
import ReservationTable from "./ReservationTable";
import CurrentClassAttendance from "./CurrentClassAttendance";

interface MainPanelProps {
  onLogout: () => void;
}

const MainPanel: React.FC<MainPanelProps> = () => {
  const [currentView, setCurrentView] = useState<
    "classTypes" | "scheduler" | "teachers" | "packs" | "users" | "reservations"
  >("classTypes");

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold my-6 mb-10">Gestión de Clases</h1>

      {/* Botón de Cerrar Sesión con ícono */}
      {/* <button
        onClick={onLogout}
        className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition"
      >
        <FiLogOut className="text-xl" /> Cerrar Sesión
      </button> */}

      <div className="w-full max-w-4xl mb-6">
        <CurrentClassAttendance />
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {[
          { key: "classTypes", label: "Tipos de Clases" },
          { key: "scheduler", label: "Calendario de Clases" },
          { key: "packs", label: "Packs" },
          { key: "teachers", label: "Profesores" },
          { key: "users", label: "Usuarios" },
          { key: "reservations", label: "Reservaciones" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setCurrentView(key as any)}
            className={`px-6 py-2 rounded-full font-medium transition ${currentView === key
              ? "bg-purple-700 hover:bg-purple-800 text-white"
              : "bg-purple-500 hover:bg-purple-600 text-gray-900"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Renderizar el componente correspondiente */}
      <div className="mt-4 w-full max-w-4xl">
        {currentView === "classTypes" && <ClassTypeTable />}
        {currentView === "scheduler" && <ClassScheduler />}
        {currentView === "teachers" && <TeacherTable />}
        {currentView === "packs" && <PackTable />}
        {currentView === "users" && <UserTable />}
        {currentView === "reservations" && <ReservationTable />}
      </div>
    </div>
  );
};

export default MainPanel;
