import { useState, useEffect } from 'react';
import { updateClassType } from '../../../../services/admin/classTypeService';

interface EditClassTypeModalProps {
  show: boolean;
  handleClose: () => void;
  classType: any;
  refreshTable: () => void;
}

const EditClassTypeModal = ({
  show,
  handleClose,
  classType,
  refreshTable,
}: EditClassTypeModalProps) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (classType) {
      setName(classType.name);
    }
  }, [classType]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);

    try {
      await updateClassType(classType.id, { name });
      refreshTable();
      handleClose();
    } catch (error) {
      console.error('❌ Error al actualizar tipo de clase:', error);
      alert('Hubo un error al actualizar el tipo de clase.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96" data-aos="zoom-in">
        <h2 className="text-xl font-semibold mb-4 text-purple-500">Editar Tipo de Clase</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-lg transition"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditClassTypeModal;
