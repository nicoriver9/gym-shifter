// src/components/CreatePackModal.tsx
import  { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createPack } from "../../../services/packService";

interface CreatePackModalProps {
  show: boolean;
  handleClose: () => void;
  refreshTable: () => void;
}

const CreatePackModal = ({ show, handleClose, refreshTable }: CreatePackModalProps) => {
  const [name, setName] = useState("");
  const [classesIncluded, setClassesIncluded] = useState(0);
  const [price, setPrice] = useState(0);
  const [validityDays, setValidityDays] = useState(0);
  const [unlimitedClasses, setUnlimitedClasses] = useState(false);

  const handleSubmit = async () => {
    await createPack({
      name,
      classes_included: classesIncluded,
      price,
      validity_days: validityDays,
      unlimited_classes: unlimitedClasses,
    });
    refreshTable();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Pack</Modal.Title>
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
          <Form.Group>
            <Form.Label>Clases Incluidas</Form.Label>
            <Form.Control
              type="number"
              value={classesIncluded}
              onChange={(e) => setClassesIncluded(Number(e.target.value))}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Validez (Días)</Form.Label>
            <Form.Control
              type="number"
              value={validityDays}
              onChange={(e) => setValidityDays(Number(e.target.value))}
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Clases Ilimitadas"
              checked={unlimitedClasses}
              onChange={(e) => setUnlimitedClasses(e.target.checked)}
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

export default CreatePackModal;