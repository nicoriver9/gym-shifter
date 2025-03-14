// src/components/PackTable.tsx
import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { getPacks, deletePack } from "../services/packService";
import CreatePackModal from "./modals/packModals/CreatePackModal";
import EditPackModal from "./modals/packModals/EditPackModal";
import ConfirmDeletePackModal from "./modals/packModals/ConfirmDeletePackModal";
import { getPaymentLink } from "../services/paymentService"; // Importar el servicio para obtener el link de pago

const PackTable = () => {
  const [packs, setPacks] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPack, setSelectedPack] = useState<any>(null);

  useEffect(() => {
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    const data = await getPacks();
    setPacks(data);
  };

  const handleEdit = (pack: any) => {
    setSelectedPack(pack);
    setShowEditModal(true);
  };

  const handleDelete = (pack: any) => {
    setSelectedPack(pack);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPack) {
      await deletePack(selectedPack.id);
      fetchPacks();
      setShowDeleteModal(false);
    }
  };

  const handleGetPaymentLink = async (packId: number) => {
    try {
      // Obtener el link de pago desde el backend
      const response = await getPaymentLink(1, packId); // Reemplaza "1" con el ID del usuario
      const paymentLink = response.paymentLink;

      // Copiar el link al portapapeles
      await navigator.clipboard.writeText(paymentLink);
      alert("Link de pago copiado al portapapeles: " + paymentLink);
    } catch (error) {
      console.error("Error al obtener el link de pago:", error);
      alert("Error al obtener el link de pago");
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={() => setShowCreateModal(true)}>
        Crear Pack
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Clases Incluidas</th>
            <th>Precio</th>
            <th>Validez (Días)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {packs ? (
            packs.map((pack) => (
              <tr key={pack.id}>
                <td>{pack.id}</td>
                <td>{pack.name}</td>
                <td>{pack.classes_included}</td>
                <td>${pack.price}</td>
                <td>{pack.validity_days}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEdit(pack)}>
                    Editar
                  </Button>{" "}
                  <Button variant="danger" onClick={() => handleDelete(pack)}>
                    Eliminar
                  </Button>{" "}
                  <Button
                    variant="success"
                    onClick={() => handleGetPaymentLink(pack.id)}
                  >
                    Obtener Link de Pago
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No hay packs creados</td>
            </tr>
          )}
        </tbody>
      </Table>

      <CreatePackModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        refreshTable={fetchPacks}
      />

      <EditPackModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        pack={selectedPack}
        refreshTable={fetchPacks}
      />

      <ConfirmDeletePackModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default PackTable;