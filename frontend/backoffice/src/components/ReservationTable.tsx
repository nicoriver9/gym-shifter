// src/components/ReservationTable.tsx
import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import {
  getReservations,
  deleteReservation,
} from "../services/reservationService";
import { Reservation } from "../interfaces/IReservation";
import CreateReservationModal from "./modals/reservationModals/CreateReservationModal";
import EditReservationModal from "./modals/reservationModals/EditReservationModal";
import ConfirmDeleteReservationModal from "./modals/reservationModals/ConfirmDeleteReservationModal";

// interface Reservation {
//   id: number;
//   user: {
//     firstName: string;
//     lastName: string;
//   };
//   classSchedule: {
//     classType: {
//       name: string;
//     };
//     day_of_week: string; // Nombre del día de la semana
//     start_time: string;
//     end_time: string;
//     teacherName: string; // Nombre del profesor
//   };
//   status: string;
// }

const ReservationTable = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const data = await getReservations();
    setReservations(data);
  };

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowEditModal(true);
  };

  const handleDelete = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedReservation) {
      await deleteReservation(selectedReservation.id);
      fetchReservations();
      setShowDeleteModal(false);
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={() => setShowCreateModal(true)}>
        Crear Reservación
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Tipo de Clase</th>
            <th>Día</th>
            <th>Horario</th>
            <th>Profesor</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.id}</td>
              <td>{`${reservation.user.firstName} ${reservation.user.lastName}`}</td>
              <td>{reservation.classSchedule.classType.name}</td>
              <td>{reservation.classSchedule.day_of_week}</td>
              <td>{`${reservation.classSchedule.start_time} - ${reservation.classSchedule.end_time}`}</td>
              <td>{reservation.classSchedule.teacherName}</td>
              <td>{reservation.status}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleEdit(reservation)}
                >
                  Editar
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(reservation)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <CreateReservationModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        refreshTable={fetchReservations}
      />

      <EditReservationModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        reservation={selectedReservation || undefined} // Pasar undefined si selectedReservation es null
        refreshTable={fetchReservations}
      />

      <ConfirmDeleteReservationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleDeleteConfirm}
        reservation={selectedReservation || undefined} // Pasar undefined si selectedReservation es null
      />
    </div>
  );
};

export default ReservationTable;
