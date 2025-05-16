import { useState, useEffect } from 'react';
import { updatePack } from '../../../../services/admin/packService';
import { FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface EditPackModalProps {
  show: boolean;
  handleClose: () => void;
  pack: any;
  refreshTable: () => void;
}

const EditPackModal = ({ show, handleClose, pack, refreshTable }: EditPackModalProps) => {
  const [name, setName] = useState('');
  const [classesIncluded, setClassesIncluded] = useState(0);
  const [price, setPrice] = useState(0);
  const [validityDays, setValidityDays] = useState(0);
  const [unlimitedClasses, setUnlimitedClasses] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wasUpdated, setWasUpdated] = useState(false);

  useEffect(() => {
    if (pack) {
      setName(pack.name);
      setClassesIncluded(pack.classes_included);
      setPrice(pack.price);
      setValidityDays(pack.validity_days);
      setUnlimitedClasses(pack.unlimited_classes);
    }
  }, [pack]);

  useEffect(() => {
    if (wasUpdated) {
      Swal.fire({
        title: "Pack actualizado",
        icon: "success",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#10b981",
        timer: 2000,
        timerProgressBar: true,
      });
      setWasUpdated(false);
    }
  }, [wasUpdated]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      await Swal.fire({
        title: 'Campo vacío',
        text: 'El nombre del pack no puede estar vacío.',
        icon: 'warning',
        background: '#111827',
        color: '#f9fafb',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    setLoading(true);

    try {
      await updatePack(pack.id, {
        name,
        classes_included: classesIncluded,
        price,
        validity_days: validityDays,
        unlimited_classes: unlimitedClasses,
      });

      refreshTable();
      handleClose();
      setWasUpdated(true);

    } catch (error) {
      console.error("❌ Error al actualizar pack:", error);
      await Swal.fire({
        title: 'Error',
        text: 'Hubo un error al actualizar el pack.',
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
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md relative" data-aos="zoom-in">

        {/* Botón cerrar */}
        <button
          className="absolute top-3 right-3 text-white hover:text-red-500 text-xl"
          onClick={handleClose}
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-purple-500">Editar Pack</h2>

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

        {/* Spinner mientras se guarda */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPackModal;
