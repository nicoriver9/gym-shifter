// src/components/ConfirmDeleteUserModal.tsx

import { Modal, Button } from "react-bootstrap";

interface ConfirmDeleteUserModalProps {
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
}

const ConfirmDeleteUserModal = ({
  show,
  handleClose,
  handleConfirm,
}: ConfirmDeleteUserModalProps) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.</p>
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

export default ConfirmDeleteUserModal;