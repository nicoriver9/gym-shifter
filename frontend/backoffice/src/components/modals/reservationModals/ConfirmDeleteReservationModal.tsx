// src/components/ConfirmDeleteReservationModal.tsx
import { Modal, Button } from "react-bootstrap";

interface ConfirmDeleteReservationModalProps {
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  reservation?: { // Hacer reservation opcional
    user: {
      firstName: string;
      lastName: string;
    };
    classSchedule: {
      classType: {
        name: string;
      };
      day_of_week: string;
      start_time: string;
      end_time: string;
      teacherName: string;
    };
  };
}

const ConfirmDeleteReservationModal = ({
  show,
  handleClose,
  handleConfirm,
  reservation,
}: ConfirmDeleteReservationModalProps) => {
  if (!reservation) { // Verificar si reservation existe
    return null;
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>¿Estás seguro de que deseas eliminar esta reservación?</p>
        <p>
          <strong>Usuario:</strong> {reservation.user.firstName} {reservation.user.lastName}
        </p>
        <p>
          <strong>Clase:</strong> {reservation.classSchedule.classType.name}
        </p>
        <p>
          <strong>Día:</strong> {reservation.classSchedule.day_of_week}
        </p>
        <p>
          <strong>Horario:</strong> {reservation.classSchedule.start_time} - {reservation.classSchedule.end_time}
        </p>
        <p>
          <strong>Profesor:</strong> {reservation.classSchedule.teacherName}
        </p>
        <p>Esta acción no se puede deshacer.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ConfirmDeleteReservationModal;