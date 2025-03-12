import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

interface ConfirmDeleteModalProps {
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => void;  
  classTypeId: number | undefined;
}

export default function ConfirmDeleteModal({
  show,
  handleClose,
  handleConfirm,  
  classTypeId,
}: ConfirmDeleteModalProps) {
  // 🔥 Buscar el nombre de la clase basado en `class_type_id`
  
  const [className, setClassName] = useState("");

  const fetchClass = async () => {
    if(classTypeId){
      try {
        const response = await fetch(
          `http://localhost:3000/class-types/${classTypeId}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener el nombre de la clase");
        }
        const data = await response.json();              
        setClassName(data.name);
      } catch (error) {
        console.error("Error al obtener el nombre de la clase:", error);
        // return; // Salir de la función si hay un error
      }  
    }

  }
  
  useEffect(() => {
    fetchClass()
  }, [classTypeId])
  


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
}
