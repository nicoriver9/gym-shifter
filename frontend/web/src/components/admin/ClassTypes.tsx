import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import CreateClassTypeModal from "./modals/classTypesModals/CreateClassTypeModal";
import EditClassTypeModal from "./modals/classTypesModals/EditClassTypeModal";
import ConfirmDeleteClassTypeModal from "./modals/classTypesModals/ConfirmDeleteClassTypeModal";
import { getClassTypes, deleteClassType } from "../../services/admin/classTypeService";

const ClassTypeTable = () => {
  const [classTypes, setClassTypes] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClassType, setSelectedClassType] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 600 });
    fetchClassTypes();
  }, []);

  const fetchClassTypes = async () => {
    try {
      const data = await getClassTypes();
      setClassTypes(data);
    } catch (error) {
      console.error("Error al obtener tipos de clases:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (classType: any) => {
    setSelectedClassType(classType);
    setShowEditModal(true);
  };

  const handleDelete = (classType: any) => {
    setSelectedClassType(classType);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedClassType) {
      await deleteClassType(selectedClassType.id);
      fetchClassTypes();
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h2 className="text-2xl md:text-3xl font-semibold text-white text-center mb-8">
        Gestión de Tipos de Clases
      </h2>

      {/* Botón crear */}
      <div className="flex justify-center mb-6">
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm md:text-base px-5 py-2 rounded-md shadow transition"
          onClick={() => setShowCreateModal(true)}
        >
          + Crear Tipo de Clase
        </button>
      </div>

      {/* Spinner */}
      {loading ? (
        <div className="text-center text-white mt-20" data-aos="fade-up">
          <p className="text-lg">Cargando tipos de clases...</p>
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
          <table className="w-full text-white">
            <thead>
              <tr className="bg-gray-700 text-sm md:text-base uppercase tracking-wide">
                <th className="px-6 py-3 text-center">ID</th>
                <th className="px-6 py-3 text-center">Nombre</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {classTypes.length > 0 ? (
                classTypes.map((ct) => (
                  <tr
                    key={ct.id}
                    className="border-b border-gray-700 hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-4 text-center">{ct.id}</td>
                    <td className="px-6 py-4 text-center">{ct.name}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex justify-center space-x-3">
                        <button
                          className="bg-green-600 hover:bg-green-700 font-semibold text-white text-xs md:text-sm px-3 py-1 rounded-md transition"
                          onClick={() => handleEdit(ct)}
                        >
                          Editar
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 font-semibold text-white text-xs md:text-sm px-3 py-1 rounded-md transition"
                          onClick={() => handleDelete(ct)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-400">
                    No hay tipos de clase registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modales */}
      <CreateClassTypeModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        refreshTable={fetchClassTypes}
      />
      <EditClassTypeModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        classType={selectedClassType}
        refreshTable={fetchClassTypes}
      />
      <ConfirmDeleteClassTypeModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleDeleteConfirm}
        className={selectedClassType?.name}
      />
    </div>
  );
};

export default ClassTypeTable;
