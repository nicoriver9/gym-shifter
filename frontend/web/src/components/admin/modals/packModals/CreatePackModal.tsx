import { useState } from 'react';
import { createPack } from '../../../../services/admin/packService';

interface CreatePackModalProps {
  show: boolean;
  handleClose: () => void;
  refreshTable: () => void;
}

const CreatePackModal = ({ show, handleClose, refreshTable }: CreatePackModalProps) => {
  const [name, setName] = useState('');
  const [classesIncluded, setClassesIncluded] = useState(0);
  const [price, setPrice] = useState(0);
  const [validityDays, setValidityDays] = useState(0);
  const [unlimitedClasses, setUnlimitedClasses] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('El nombre no puede estar vacío.');
      return;
    }

    setLoading(true);

    try {
      await createPack({
        name,
        classes_included: classesIncluded,
        price,
        validity_days: validityDays,
        unlimited_classes: unlimitedClasses,
      });
      refreshTable();
      handleClose();
    } catch (error) {
      console.error('❌ Error al crear pack:', error);
      alert('Hubo un error al crear el pack.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96" data-aos="zoom-in">
        <h2 className="text-xl font-semibold mb-4">Crear Pack</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Clases Incluidas</label>
            <input
              type="number"
              value={classesIncluded}
              onChange={(e) => setClassesIncluded(Number(e.target.value))}
              className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Precio</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Validez (Días)</label>
            <input
              type="number"
              value={validityDays}
              onChange={(e) => setValidityDays(Number(e.target.value))}
              className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={unlimitedClasses}
              onChange={(e) => setUnlimitedClasses(e.target.checked)}
              className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label className="ml-2 text-sm">Clases Ilimitadas</label>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
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

export default CreatePackModal;