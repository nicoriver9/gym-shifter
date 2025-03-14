// src/components/EditTeacherModal.tsx
import  { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { updateTeacher } from "../../../services/teacherService";

interface EditTeacherModalProps {
  show: boolean;
  handleClose: () => void;
  teacher: any;
  refreshTable: () => void;
}

const EditTeacherModal = ({ show, handleClose, teacher, refreshTable }: EditTeacherModalProps) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (teacher) {
      setName(teacher.name);
    }
  }, [teacher]);

  const handleSubmit = async () => {
    await updateTeacher(teacher.id, { name });
    refreshTable();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Profesor</Modal.Title>
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

export default EditTeacherModal;