
interface ConfirmDeleteUserModalProps {
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  user: string
}

const ConfirmDeleteUserModal = ({
  show,
  handleClose,
  handleConfirm,
}: ConfirmDeleteUserModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md"
        data-aos="zoom-in"
      >
        <h2 className="text-xl font-semibold mb-4 text-red-500">
          Confirmar Eliminación
        </h2>

        <div className="space-y-2">
          <p>¿Estás seguro de que deseas eliminar este usuario?</p>
          <p className="text-red-400">Esta acción no se puede deshacer.</p>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            onClick={handleConfirm}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteUserModal;