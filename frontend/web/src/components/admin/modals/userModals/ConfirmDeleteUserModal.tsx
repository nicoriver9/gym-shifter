import { useState } from 'react';
import Swal from 'sweetalert2';
import { FaTimes } from 'react-icons/fa';

interface ConfirmDeleteUserModalProps {
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  user: string;
}

const ConfirmDeleteUserModal = ({
  show,
  handleClose,
  handleConfirm,
  user,
}: ConfirmDeleteUserModalProps) => {
  const [processing, setProcessing] = useState(false);

  if (!show) return null;

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: `Vas a eliminar a ${user}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      background: '#111827',
      color: '#f9fafb',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      setProcessing(true);
      await handleConfirm();

      await Swal.fire({
        title: 'Usuario eliminado',
        icon: 'success',
        background: '#111827',
        color: '#f9fafb',
        confirmButtonColor: '#10b981',
        timer: 2000,
        timerProgressBar: true,
      });

      handleClose();
    } catch (error) {
      console.error('Error al eliminar:', error);
      await Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al eliminar el usuario.',
        icon: 'error',
        background: '#111827',
        color: '#f9fafb',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
        data-aos="zoom-in"
      >
        {/* Botón de cierre */}
        <button
          className="absolute top-3 right-3 text-white hover:text-red-500 text-xl"
          onClick={handleClose}
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-red-500 text-center">
          Confirmar Eliminación
        </h2>

        <div className="space-y-2 text-center">
          <p>¿Estás seguro de que deseas eliminar este usuario?</p>
          <p className="text-red-400">Esta acción no se puede deshacer.</p>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            onClick={handleClose}
            disabled={processing}
          >
            Cancelar
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            onClick={handleDelete}
            disabled={processing}
          >
            Eliminar
          </button>
        </div>

        {processing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmDeleteUserModal;
