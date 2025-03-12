// src/App.tsx
import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import ClassTypeTable from "./components/ClassTypes";
import ClassScheduler from "./components/ClassScheduler";
import TeacherTable from "./components/TeacherTable";
import PackTable from "./components/PackTable";
import "bootstrap/dist/css/bootstrap.min.css";
import UserTable from "./components/UserTable";
import ReservationTable from "./components/ReservationTable";

const App = () => {
  const [currentView, setCurrentView] = useState<"classTypes" | "scheduler" | "teachers" | "packs" | "users" | "reservations">("classTypes");

  return (
    <Container className="mt-4 text-center">  
      <h1 className="mb-4">Gestión de Clases</h1>

      {/* Botones de navegación */}
      <div className="d-flex justify-content-center gap-3 mb-4">
        <Button
          variant={currentView === "classTypes" ? "primary" : "outline-primary"}
          onClick={() => setCurrentView("classTypes")}
          className="rounded-pill px-4 py-2"
        >
          Tipos de Clases
        </Button>
        <Button
          variant={currentView === "scheduler" ? "primary" : "outline-primary"}
          onClick={() => setCurrentView("scheduler")}
          className="rounded-pill px-4 py-2"
        >
          Calendario de Clases
        </Button>
        <Button
          variant={currentView === "packs" ? "primary" : "outline-primary"}
          onClick={() => setCurrentView("packs")}
          className="rounded-pill px-4 py-2"
        >
          Packs
        </Button>
        <Button
          variant={currentView === "teachers" ? "primary" : "outline-primary"}
          onClick={() => setCurrentView("teachers")}
          className="rounded-pill px-4 py-2"
        >
          Profesores
        </Button>
        <Button
          variant={currentView === "users" ? "primary" : "outline-primary"}
          onClick={() => setCurrentView("users")}
          className="rounded-pill px-4 py-2"
        >
          Usuarios
        </Button>
        <Button
          variant={currentView === "reservations" ? "primary" : "outline-primary"}
          onClick={() => setCurrentView("reservations")}
          className="rounded-pill px-4 py-2"
        >
          Reservaciones
        </Button>
      </div>

      {/* Renderizar el componente correspondiente */}
      {currentView === "classTypes" && <ClassTypeTable />}
      {currentView === "scheduler" && <ClassScheduler />}
      {currentView === "teachers" && <TeacherTable />}
      {currentView === "packs" && <PackTable />}
      {currentView === "users" && <UserTable />}
      {currentView === "reservations" && <ReservationTable />}
    </Container>
  );
};

export default App;