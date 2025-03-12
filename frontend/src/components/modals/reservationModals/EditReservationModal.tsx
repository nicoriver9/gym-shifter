// src/components/EditReservationModal.tsx
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { updateReservation } from "../../../services/reservationService";
import { getUsers } from "../../../services/userService";
import { getAllClasses } from "../../../services/classService";

import { Reservation } from "../../../interfaces/IReservation";

interface EditReservationModalProps {
  show: boolean;
  handleClose: () => void;
  reservation?: Reservation;
  refreshTable: () => void;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface ClassSchedule {
  id: number;
  classType: {
    name: string;
  };
  day_of_week: string;
  start_time: string;
  end_time: string;
  teacher: {
    name:string,    
  };
}

const EditReservationModal = ({ show, handleClose, reservation, refreshTable }: EditReservationModalProps) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [classId, setClassId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [classSchedules, setClassSchedules] = useState<ClassSchedule[]>([]);

  // Obtener la lista de usuarios y clases al abrir el modal
  useEffect(() => {
    if (show && reservation) { // Verificar si reservation existe
      fetchUsers();
      fetchClassSchedules();
      setUserId(reservation.user.id);
      setClassId(reservation.classSchedule.id);
    }
  }, [show, reservation]);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const fetchClassSchedules = async () => {
    const data = await getAllClasses();
    console.log(data)
    setClassSchedules(data);
  };

  const handleSubmit = async () => {
    if (!reservation) {
      alert("No se ha seleccionado una reservación válida.");
      return;
    }
  
    if (userId === null || classId === null) {
      alert("Por favor, selecciona un usuario y una clase.");
      return;
    }
  
    await updateReservation(reservation.id, { user_id: userId, class_id: classId });
    refreshTable();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Reservación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              as="select"
              value={userId || ""}
              onChange={(e) => setUserId(Number(e.target.value))}
            >
              <option value="">Selecciona un usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Clase</Form.Label>
            <Form.Control
              as="select"
              value={classId || ""}
              onChange={(e) => setClassId(Number(e.target.value))}
            >
              <option value="">Selecciona una clase</option>
              {classSchedules.map((classSchedule) => (
                <option key={classSchedule.id} value={classSchedule.id}>
                  {classSchedule.classType.name} - {classSchedule.day_of_week} {classSchedule.start_time} a {classSchedule.end_time} (Profesor: {classSchedule.teacher.name})
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditReservationModal;