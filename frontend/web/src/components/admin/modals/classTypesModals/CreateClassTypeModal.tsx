import { useState } from 'react';
import { createClassType } from '../../../../services/admin/classTypeService';
import { FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface CreateClassTypeModalProps {
  show: boolean;
  handleClose: () => void;
  refreshTable: () => void;
}

const CreateClassTypeModal = ({
  show,
  handleClose,
  refreshTable,
}: CreateClassTypeModalProps) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      await Swal.fire({
        title: 'Campo vacío',
        text: 'El nombre no puede estar vacío.',
        icon: 'warning',
        background: '#111827',
        color: '#f9fafb',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    setLoading(true);

    try {
      await createClassType({ name });
      refreshTable();
      handleClose();

      setTimeout(() => {
        Swal.fire({
          title: 'Tipo de clase creado',
          icon: 'success',
          background: '#111827',
          color: '#f9fafb',
          confirmButtonColor: '#10b981',
          timer: 2000,
          timerProgressBar: true,
        });
      }, 300);
    } catch (error) {
      console.error('❌ Error al crear tipo de clase:', error);
      await Swal.fire({
        title: 'Error',
        text: 'Hubo un error al crear el tipo de clase.',
        icon: 'error',
        background: '#111827',
        color: '#f9fafb',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96 relative" data-aos="zoom-in">

        {/* Botón de cerrar */}
        <button
          className="absolute top-3 right-3 text-white hover:text-red-500 text-xl"
          onClick={handleClose}
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold mb-4">Crear Tipo de Clase</h2>

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

        {/* Spinner mientras se procesa */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateClassTypeModal;
