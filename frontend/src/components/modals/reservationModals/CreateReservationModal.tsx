// src/components/CreateReservationModal.tsx
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createReservation } from "../../../services/reservationService";
import { getUsers } from "../../../services/userService";
import { getAllClasses } from "../../../services/classService";

interface CreateReservationModalProps {
  show: boolean;
  handleClose: () => void;
  refreshTable: () => void;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface ClassSchedule {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  classType: {
    name: string;
  };
}

const CreateReservationModal = ({ show, handleClose, refreshTable }: CreateReservationModalProps) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [classId, setClassId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [classSchedules, setClassSchedules] = useState<ClassSchedule[]>([]);

  // Obtener la lista de usuarios y clases al abrir el modal
  useEffect(() => {
    if (show) {
      fetchUsers();
      fetchClassSchedules();
    }
  }, [show]);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const fetchClassSchedules = async () => {
    const data = await getAllClasses();
    setClassSchedules(data);
  };

  const handleSubmit = async () => {
    if (userId === null || classId === null) {
      alert("Por favor, selecciona un usuario y una clase.");
      return;
    }

    await createReservation({ user_id: userId, class_id: classId });
    refreshTable();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Reservación</Modal.Title>
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
                  {classSchedule.classType.name} - {classSchedule.start_time} a {classSchedule.end_time}
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

export default CreateReservationModal;