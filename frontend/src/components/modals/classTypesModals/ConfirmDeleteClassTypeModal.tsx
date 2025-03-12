// src/components/ConfirmDeleteClassTypeModal.tsx

import { Modal, Button } from 'react-bootstrap';

interface ConfirmDeleteClassTypeModalProps {
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  className?: string; // Nombre de la clase para mostrar en el mensaje
}

const ConfirmDeleteClassTypeModal = ({
  show,
  handleClose,
  handleConfirm,
  className,
}: ConfirmDeleteClassTypeModalProps) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Estás seguro de que deseas eliminar la clase{" "}
          <strong>{className}</strong>? Esta acción no se puede deshacer.
        </p>
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

export default ConfirmDeleteClassTypeModal;