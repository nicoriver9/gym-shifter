// src/components/CreateTeacherModal.tsx
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createTeacher } from "../../../services/teacherService";

interface CreateTeacherModalProps {
  show: boolean;
  handleClose: () => void;
  refreshTable: () => void;
}

const CreateTeacherModal = ({ show, handleClose, refreshTable }: CreateTeacherModalProps) => {
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    await createTeacher({ name });
    refreshTable();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Profesor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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

export default CreateTeacherModal;