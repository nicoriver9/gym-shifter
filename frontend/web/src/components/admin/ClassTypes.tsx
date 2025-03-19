import { useEffect, useState } from 'react';
import CreateClassTypeModal from './modals/classTypesModals/CreateClassTypeModal';
import EditClassTypeModal from './modals/classTypesModals/EditClassTypeModal';
import ConfirmDeleteClassTypeModal from './modals/classTypesModals/ConfirmDeleteClassTypeModal';
import { getClassTypes, deleteClassType } from '../../services/admin/classTypeService';

const ClassTypeTable = () => {
  const [classTypes, setClassTypes] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClassType, setSelectedClassType] = useState<any>(null);

  useEffect(() => {
    fetchClassTypes();
  }, []);

  const fetchClassTypes = async () => {
    const data = await getClassTypes();
    setClassTypes(data);
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
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-white text-center mb-4">
        Gestión de Tipos de Clases
      </h2>

      <div className="flex justify-center mb-6">
        <button
          className="bg-purple-700 hover:bg-purple-800 px-6 py-3 font-semibold text-white rounded-lg shadow-md transition"
          onClick={() => setShowCreateModal(true)}
        >
          + Crear Tipo de Clase
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 text-white rounded-lg shadow-md overflow-hidden">
          <thead>
            <tr className="bg-gray-700 text-white text-left text-sm uppercase tracking-wider">
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {classTypes.length > 0 ? (
              classTypes.map((classType) => (
                <tr
                  key={classType.id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4">{classType.id}</td>
                  <td className="px-6 py-4">{classType.name}</td>
                  <td className="px-6 py-4 flex justify-center space-x-4">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                      onClick={() => handleEdit(classType)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                      onClick={() => handleDelete(classType)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-400">
                  No hay tipos de clase registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
        classType={selectedClassType}
        refreshTable={fetchClassTypes}
      />
    </div>
  );
};

export default ClassTypeTable;
