// src/components/ClassTypeTable.tsx
import { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { getClassTypes, deleteClassType } from '../services/ClassTypeService';
import CreateClassTypeModal from './modals/classTypesModals/CreateClassTypeModal';
import EditClassTypeModal from './modals/classTypesModals/EditClassTypeModal';
import ConfirmDeleteClassTypeModal from './modals/classTypesModals/ConfirmDeleteClassTypeModal';

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
    <div>
      <Button variant="primary" onClick={() => setShowCreateModal(true)}>
        Crear Tipo de Clase
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {classTypes.map((classType) => (
            <tr key={classType.id}>
              <td>{classType.id}</td>
              <td>{classType.name}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(classType)}>
                  Editar
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(classType)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
      />
    </div>
  );
};

export default ClassTypeTable;