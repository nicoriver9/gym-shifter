// src/components/CreateClassTypeModal.tsx
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { createClassType } from '../../../services/ClassTypeService';

interface CreateClassTypeModalProps {
  show: boolean;
  handleClose: () => void;
  refreshTable: () => void;
}

const CreateClassTypeModal = ({ show, handleClose, refreshTable }: CreateClassTypeModalProps) => {
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    await createClassType({ name });
    refreshTable();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Tipo de Clase</Modal.Title>
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

export default CreateClassTypeModal;