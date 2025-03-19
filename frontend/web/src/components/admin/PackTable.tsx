import { useEffect, useState } from 'react';
import CreatePackModal from './modals/packModals/CreatePackModal';
import EditPackModal from './modals/packModals/EditPackModal';
import ConfirmDeletePackModal from './modals/packModals/ConfirmDeletePackModal';
import { getPacks, deletePack } from '../../services/admin/packService';
import { getPaymentLink } from '../../services/admin/paymentService';

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
      const response = await getPaymentLink(1, packId);
      const paymentLink = response.paymentLink;

      await navigator.clipboard.writeText(paymentLink);
      alert('Link de pago copiado al portapapeles: ' + paymentLink);
    } catch (error) {
      console.error('Error al obtener el link de pago:', error);
      alert('Error al obtener el link de pago');
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-white text-center mb-4">
        Gestión de Packs
      </h2>

      <div className="flex justify-center mb-6">
        <button
          className="bg-purple-700 hover:bg-purple-800 px-6 py-3 font-semibold text-white rounded-lg shadow-md transition"
          onClick={() => setShowCreateModal(true)}
        >
          + Crear Pack
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 text-white rounded-lg shadow-md overflow-hidden">
          <thead>
            <tr className="bg-gray-700 text-white text-left text-sm uppercase tracking-wider">
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Clases Incluidas</th>
              <th className="px-6 py-3">Precio</th>
              <th className="px-6 py-3">Validez (Días)</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {packs.length > 0 ? (
              packs.map((pack) => (
                <tr
                  key={pack.id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4">{pack.id}</td>
                  <td className="px-6 py-4">{pack.name}</td>
                  <td className="px-6 py-4">{pack.classes_included}</td>
                  <td className="px-6 py-4">${pack.price}</td>
                  <td className="px-6 py-4">{pack.validity_days}</td>
                  <td className="px-6 py-4 flex justify-center space-x-4">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                      onClick={() => handleEdit(pack)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                      onClick={() => handleDelete(pack)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                      onClick={() => handleGetPaymentLink(pack.id)}
                    >
                      Link de Pago
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400">
                  No hay packs registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
        pack={selectedPack}
        refreshTable={fetchPacks}
      />
    </div>
  );
};

export default PackTable;
