// src/components/UserDashboard.tsx
import { Button, Container, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleConfirmAttendance = () => {
    // Lógica para confirmar asistencia
    navigate("/qr-scanner");
  };

  const handleBuyPacks = () => {
    // Navegar a la pantalla de compra de packs    
    navigate("/packs");
  };

  const handleLogout = () => {
    // Lógica para cerrar sesión
    alert("Cerrar sesión");
    navigate("/login"); // Redirigir al login
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }} // Centrar verticalmente
    >
      <Stack gap={3} className="text-center">
        {/* Botón para confirmar asistencia */}
        <Button
          variant="primary"
          size="lg"
          className="rounded-pill"
          style={{ width: "200px" }}
          onClick={handleConfirmAttendance}
        >
          Confirmar Asistencia
        </Button>

        {/* Botón para comprar packs */}
        <Button
          variant="success"
          size="lg"
          className="rounded-pill"
          style={{ width: "200px" }}
          onClick={handleBuyPacks}
        >
          Comprar Packs
        </Button>

        {/* Botón para cerrar sesión */}
        <Button
          variant="danger"
          size="lg"
          className="rounded-pill"
          style={{ width: "200px" }}
          onClick={handleLogout}
        >
          Cerrar Sesión
        </Button>
      </Stack>
    </Container>
  );
};

export default UserDashboard;