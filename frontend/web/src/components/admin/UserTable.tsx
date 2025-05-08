import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

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

const USERS_PER_PAGE = 10;

const UserTable = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [paginatedUsers, setPaginatedUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 600 });
    fetchUsers();
    fetchPacks();
  }, []);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = users.filter(
      (u) =>
        u.firstName.toLowerCase().includes(lower) ||
        u.lastName.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;
    setPaginatedUsers(filteredUsers.slice(startIndex, endIndex));
  }, [filteredUsers, currentPage]);

  const fetchPacks = async () => {
    const data = await getPacks();
    setPacks(data);
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
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

  const daysRemaining = (exp: Date | string): number => {
    const diff = new Date(exp).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const renderPagination = () => (
    <div className="flex justify-center my-4 gap-2 flex-wrap">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          className={`px-3 py-1 rounded-md text-sm font-semibold transition ${
            currentPage === index + 1
              ? "bg-purple-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-purple-700"
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" data-aos="fade-up">
        <div className="text-center text-white">
          <p className="text-lg">Cargando usuarios...</p>
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto mt-8 px-4 md:px-8">
      <h2 className="text-2xl md:text-3xl font-semibold text-white text-center mb-8">
        Gestión de Usuarios
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm md:text-base font-medium px-4 md:px-6 py-2 rounded-md shadow-sm"
          onClick={() => setShowCreateModal(true)}
        >
          + Crear Usuario
        </button>

        <input
          type="text"
          placeholder="Buscar por nombre, apellido o email"
          className="w-full md:w-80 text-sm md:text-base px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Paginación superior */}
      {renderPagination()}

      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto">
        <table className="w-full table-auto text-white">
          <thead>
            <tr className="bg-gray-700 text-center text-sm md:text-base uppercase tracking-wide">
              <th className="px-1 py-3">Username</th>
              <th className="px-2 py-3">Nombre</th>
              <th className="px-2 py-3">Email</th>
              <th className="px-2 py-3">Packs</th>
              <th className="px-2 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length ? (
              paginatedUsers.map((u) => (
                <tr key={u.id} className="border-b border-gray-700 even:bg-gray-900 hover:bg-gray-700 transition text-center">
                  <td className="px-1 py-3 font-bold">{u.username}</td>
                  <td className="px-2 py-3">{u.firstName} {u.lastName}</td>
                  <td className="px-2 py-3">{u.email}</td>
                  <td className="px-2 py-3 text-sm">
                    {u.current_pack ? (
                      <div className="space-y-1">
                        <div><strong>{u.current_pack.name}</strong></div>
                        <div>Fecha: {new Date(u.current_pack.created_at).toLocaleDateString()}</div>
                        <div>{daysRemaining(u.pack_expiration_date) === 0 ? (
                          <span className="text-red-400">Pack vencido</span>
                        ) : `Días restantes: ${daysRemaining(u.pack_expiration_date)}`}</div>
                        <div>Clases restantes: {u.classes_remaining ?? 0}</div>
                      </div>
                    ) : (
                      <span>Sin Pack Asignado</span>
                    )}
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md transition"
                        onClick={() => handleEdit(u)}
                        title="Editar"
                      >
                        <FaEdit className="text-sm" />
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition"
                        onClick={() => handleDelete(u)}
                        title="Eliminar"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-400 text-sm md:text-base">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación inferior */}
      {renderPagination()}

      {/* Modals */}
      <CreateUserModal show={showCreateModal} handleClose={() => setShowCreateModal(false)} refreshTable={fetchUsers} />
      <EditUserModal show={showEditModal} handleClose={() => setShowEditModal(false)} user={selectedUser} refreshTable={fetchUsers} />
      <ConfirmDeleteUserModal show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} handleConfirm={handleDeleteConfirm} user={selectedUser} />
    </div>
  );
};

export default UserTable;
