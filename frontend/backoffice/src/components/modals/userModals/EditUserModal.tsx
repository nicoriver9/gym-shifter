import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  assignSinglePackToUser,
  updateUser,
} from "../../../services/userService";
import { getPacks } from "../../../services/packService";
import { unassignPackFromUser } from "../../../services/userService";

interface EditUserModalProps {
  show: boolean;
  handleClose: () => void;
  user: any; // Puedes mejorar el tipado de `user` si tienes una interfaz definida
  refreshTable: () => void;
}

interface Pack {
  id: number;
  name: string;
  created_at: string;
  validity_days: string;
}

const EditUserModal = ({
  show,
  handleClose,
  user = {}, // Inicializar `user` con un objeto vacío si es null/undefined
  refreshTable,
}: EditUserModalProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [packs, setPacks] = useState<Pack[]>([]);
  const [selectedPackId, setSelectedPackId] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPassword(user.password || "");
      fetchPacks();
    }
  }, [user]);

  const fetchPacks = async () => {
    const data = await getPacks();
    setPacks(data);
  };

  const handleSubmit = async () => {
    await updateUser(user.id, { firstName, lastName, email, password });
    refreshTable();
    handleClose();
  };

  const handleAssignPack = async () => {
    if (selectedPackId === null) {
      alert("Por favor, selecciona un pack.");
      return;
    }

    try {
      await assignSinglePackToUser(user.id, selectedPackId);
      refreshTable();
      alert("Pack asignado correctamente.");
    } catch (error) {
      alert(error); // Mostrar el mensaje de error del backend
    }
  };

  const handleUnassignPack = async (packId: number) => {
    await unassignPackFromUser(user.id, packId);
    refreshTable();
    alert("Pack desasignado correctamente.");
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Asignar Pack</Form.Label>
            <Form.Control
              as="select"
              value={selectedPackId || ""}
              onChange={(e) => setSelectedPackId(Number(e.target.value))}
              disabled={user && (user.packs ?? []).length > 0} // Deshabilitar si ya tiene un pack
            >
              <option value="">Selecciona un pack</option>
              {packs.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {pack.name}
                </option>
              ))}
            </Form.Control>
            <Button
              variant="success"
              onClick={handleAssignPack}
              className="mt-2"
              disabled={user && (user.packs ?? []).length > 0} // Deshabilitar si ya tiene un pack
            >
              Asignar Pack
            </Button>
          </Form.Group>

          <Form.Group>
            <Form.Label>Packs Asignados</Form.Label>
            <table className="striped bordered hover">
              <tbody>
                {user && user.packs.length > 0 ? (
                  user.packs.map((pack: Pack) => (
                    <tr key={pack.id}>
                      <td>{pack.name}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleUnassignPack(pack.id)}
                        >
                          Desasignar
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center">
                      No hay packs asignados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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

export default EditUserModal;
