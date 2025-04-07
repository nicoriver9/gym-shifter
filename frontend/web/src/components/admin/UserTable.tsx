import { useEffect, useState } from "react";
import CreateUserModal from "./modals/userModals/CreateUserModal";
import EditUserModal from "./modals/userModals/EditUserModal";
import ConfirmDeleteUserModal from "./modals/userModals/ConfirmDeleteUserModal";
import { getUsers, deleteUser } from "../../services/admin/userService";
import { getPacks } from "../../services/admin/packService";

interface Pack {
  id: number;
  name: string;
  created_at: string;
  validity_days: string;
}

const UserTable = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchPacks();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(lowerSearch) ||
        user.lastName.toLowerCase().includes(lowerSearch) ||
        user.email.toLowerCase().includes(lowerSearch)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

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

  function calculateRemainingDays(expirationDate: Date | string): number {
    const expDate = new Date(expirationDate);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-white text-center mb-4">
        Gestión de Usuarios
      </h2>

      <div className="flex justify-center mb-6 gap-4">
        <button
          className="bg-purple-700 hover:bg-purple-800 px-6 py-3 font-semibold text-white rounded-lg shadow-md transition"
          onClick={() => setShowCreateModal(true)}
        >
          + Crear Usuario
        </button>
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o email"
          className="px-4 py-2 rounded-md border border-gray-600 w-80 text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 text-white rounded-lg shadow-md overflow-hidden">
          <thead>
            <tr className="bg-gray-700 text-white text-left text-sm uppercase tracking-wider">
              <th className="px-6 py-3 text-center">ID</th>
              <th className="px-6 py-3 text-center">Nombre</th>
              <th className="px-6 py-3 text-center">Email</th>
              <th className="px-6 py-3 text-center">Packs</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4 text-center">{user.id}</td>
                  <td className="px-6 py-4 text-center">{`${user.firstName} ${user.lastName}`}</td>
                  <td className="px-6 py-4 text-center">{user.email}</td>
                  <td className="px-6 py-4 text-center">
                    {user.current_pack ? (
                      <div>
                        <strong>{user.current_pack.name}</strong> - Fecha:{" "}
                        {new Date(
                          user.current_pack.created_at
                        ).toLocaleDateString()} {" "}- {" "}
                        {user.pack_expiration_date ? (
                          calculateRemainingDays(user.pack_expiration_date) ===
                          0 ? (
                            <span style={{ color: "red" }}>Pack vencido</span>
                          ) : (
                            `Días restantes: ${calculateRemainingDays(
                              user.pack_expiration_date
                            )} días`
                          )
                        ) : (
                          "Sin fecha de expiración"
                        )}
                        <br />
                        Clases restantes: {user.classes_remaining ?? 0}
                      </div>
                    ) : (
                      <div>Sin Pack Asignado</div>
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