import { useEffect, useState } from 'react';
import { FaPen, FaTrashAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

import CreatePackModal from './modals/packModals/CreatePackModal';
import EditPackModal from './modals/packModals/EditPackModal';
import ConfirmDeletePackModal from './modals/packModals/ConfirmDeletePackModal';
import { getPacks, deletePack } from '../../services/admin/packService';
// import { getPaymentLink } from '../../services/admin/paymentService';

const PackTable = () => {
  const [packs, setPacks] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 600 });
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    setLoading(true);
    try {
      const data = await getPacks();
      setPacks(data);
    } catch (error) {
      console.error("Error al cargar packs:", error);
    } finally {
      setLoading(false);
    }
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

  // const handleGetPaymentLink = async (packId: number) => {
  //   try {
  //     const response = await getPaymentLink(1, packId);
  //     const paymentLink = response.paymentLink;
  //     await navigator.clipboard.writeText(paymentLink);
  //     alert('Link de pago copiado al portapapeles: ' + paymentLink);
  //   } catch (error) {
  //     console.error('Error al obtener el link de pago:', error);
  //     alert('Error al obtener el link de pago');
  //   }
  // };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h2 className="text-2xl md:text-3xl font-semibold text-white text-center mb-8">
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

      {loading ? (
        <div
          className="text-center text-white mt-20"
          data-aos="fade-up"
        >
          <p className="text-lg">Cargando packs...</p>
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
        </div>
      ) : (
        <div
          className="overflow-x-auto bg-gray-900 rounded-lg shadow-lg"
        >
          <table className="min-w-full text-white">
            <thead>
              <tr className="bg-gray-700 text-sm uppercase tracking-wide">
                <th className="px-6 py-3 text-center">Nombre</th>
                <th className="px-6 py-3 text-center">Clases Incluidas</th>
                <th className="px-6 py-3 text-center">Precio</th>
                <th className="px-6 py-3 text-center">Validez (Días)</th>
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
                    <td className="px-6 py-4 text-center">{pack.name}</td>
                    <td className="px-6 py-4 text-center">{pack.classes_included}</td>
                    <td className="px-6 py-4 text-center">${pack.price}</td>
                    <td className="px-6 py-4 text-center">{pack.validity_days}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                        <button
                          className="bg-green-600 hover:bg-green-700 font-semibold text-white px-4 py-2 rounded-md transition"
                          onClick={() => handleEdit(pack)}
                          title="Editar Pack"
                        >
                          <FaPen />
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 font-semibold text-white px-4 py-2 rounded-md transition"
                          onClick={() => handleDelete(pack)}
                          title="Eliminar Pack"
                        >
                          <FaTrashAlt />
                        </button>
                        {/* 
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                          onClick={() => handleGetPaymentLink(pack.id)}
                        >
                          Link de Pago
                        </button> 
                        */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
                    No hay packs registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

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
      />
    </div>
  );
};

export default PackTable;
