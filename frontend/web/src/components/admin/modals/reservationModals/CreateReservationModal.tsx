import { useState, useEffect } from 'react';
import { createReservation } from '../../../../services/admin/reservationService';
import { getUsers } from '../../../../services/admin/userService';
import { getAllClasses } from '../../../../services/admin/classService';

interface CreateReservationModalProps {
  show: boolean;
  handleClose: () => void;
  refreshTable: () => void;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface ClassSchedule {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  classType: {
    name: string;
  };
}

const CreateReservationModal = ({ show, handleClose, refreshTable }: CreateReservationModalProps) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [classId, setClassId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [classSchedules, setClassSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      fetchUsers();
      fetchClassSchedules();
    }
  }, [show]);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const fetchClassSchedules = async () => {
    const data = await getAllClasses();
    setClassSchedules(data);
  };

  const handleSubmit = async () => {
    if (userId === null || classId === null) {
      alert('Por favor, selecciona un usuario y una clase.');
      return;
    }

    setLoading(true);

    try {
      await createReservation({ user_id: userId, class_id: classId });
      refreshTable();
      handleClose();
    } catch (error) {
      console.error('❌ Error al crear reservación:', error);
      alert('Hubo un error al crear la reservación.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md" data-aos="zoom-in">
        <h2 className="text-xl font-semibold mb-4">Crear Reservación</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Usuario</label>
            <select
              value={userId || ''}
              onChange={(e) => setUserId(Number(e.target.value))}
              className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Selecciona un usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Clase</label>
            <select
              value={classId || ''}
              onChange={(e) => setClassId(Number(e.target.value))}
              className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Selecciona una clase</option>
              {classSchedules.map((classSchedule) => (
                <option key={classSchedule.id} value={classSchedule.id}>
                  {classSchedule.classType.name} - {classSchedule.start_time} a {classSchedule.end_time}
                </option>
              ))}
            </select>
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

export default CreateReservationModal;