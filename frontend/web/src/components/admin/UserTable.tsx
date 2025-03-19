import { useEffect, useState } from 'react';
import CreateUserModal from './modals/userModals/CreateUserModal';
import EditUserModal from './modals/userModals/EditUserModal';
import ConfirmDeleteUserModal from './modals/userModals/ConfirmDeleteUserModal';
import { getUsers, deleteUser } from '../../services/admin/userService';
import { getPacks } from '../../services/admin/packService';

interface Pack {
  id: number;
  name: string;
  created_at: string;
  validity_days: string;
}

const UserTable = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [packs, setPacks] = useState<Pack[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    const data = await getPacks();
    setPacks(data);
  };

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (user: any) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.id);
      fetchUsers();
      setShowDeleteModal(false);
    }
  };

  const calculateRemainingDays = (validityDays: string, createdAt: string) => {
    const createdDate = new Date(createdAt).getDate();
    return parseInt(validityDays) - createdDate;
  };

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-white text-center mb-4">
        Gestión de Usuarios
      </h2>

      <div className="flex justify-center mb-6">
        <button
          className="bg-purple-700 hover:bg-purple-800 px-6 py-3 font-semibold text-white rounded-lg shadow-md transition"
          onClick={() => setShowCreateModal(true)}
        >
          + Crear Usuario
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 text-white rounded-lg shadow-md overflow-hidden">
          <thead>
            <tr className="bg-gray-700 text-white text-left text-sm uppercase tracking-wider">
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Packs</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4">{user.id}</td>
                  <td className="px-6 py-4">{`${user.firstName} ${user.lastName}`}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.packs && user.packs.length > 0 ? (
                      user.packs.map((pack: Pack) => (
                        <div key={pack.id}>
                          <strong>{pack.name}</strong> - Fecha:{' '}
                          {new Date(pack.created_at).toLocaleDateString()} - Días
                          restantes:{' '}
                          {calculateRemainingDays(pack.validity_days, pack.created_at)} días
                        </div>
                      ))
                    ) : (
                      <div>Sin Packs Asignados</div>
                    )}
                  </td>
                  <td className="px-6 py-4 flex justify-center space-x-4">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                      onClick={() => handleEdit(user)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                      onClick={() => handleDelete(user)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateUserModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        refreshTable={fetchUsers}
      />

      <EditUserModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        user={selectedUser}
        refreshTable={fetchUsers}
      />

      <ConfirmDeleteUserModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleDeleteConfirm}
        user={selectedUser}
      />
    </div>
  );
};

export default UserTable;