// src/components/EditClassTypeModal.tsx
import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { updateClassType } from '../../../services/ClassTypeService';

interface EditClassTypeModalProps {
  show: boolean;
  handleClose: () => void;
  classType: any;
  refreshTable: () => void;
}

const EditClassTypeModal = ({ show, handleClose, classType, refreshTable }: EditClassTypeModalProps) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (classType) {
      setName(classType.name);
    }
  }, [classType]);

  const handleSubmit = async () => {
    await updateClassType(classType.id, { name });
    refreshTable();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Tipo de Clase</Modal.Title>
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

export default EditClassTypeModal;