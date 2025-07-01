import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";

import CreateUserModal from "./modals/userModals/CreateUserModal";
import EditUserModal from "./modals/userModals/EditUserModal";
// import ConfirmDeleteUserModal from "./modals/userModals/ConfirmDeleteUserModal";
import { getUsers, deleteUser } from "../../services/admin/userService";
import { getPacks } from "../../services/admin/packService";
import {
  getWhatsappQR,
  getWhatsappStatus,
} from "../../services/admin/whatsappService";
import WhatsappQRModal from "./modals/whatsappModals/WhatsappQRModal";
// import { FaTimes } from "react-icons/fa";

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
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrImageData, setQRImageData] = useState<string | null>(null);
  const [
    // whatsappStatus
    , setWhatsappStatus] = useState<string | null>(null);
  const [, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0); // contador
  const [isAscOrder, setIsAscOrder] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 600 });
    fetchUsers();
    fetchPacks();
    checkWhatsappStatus();
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

  const checkWhatsappStatus = async () => {
    try {
      const status = await getWhatsappStatus();
      setWhatsappStatus(status);
    } catch (err) {
      console.error("Error al verificar estado de WhatsApp:", err);
      setWhatsappStatus("disconnected");
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
      setFilteredUsers(data);
      setTotalUsers(data.length); // contar usuarios
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSortByName = () => {
    const sorted = [...filteredUsers].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return isAscOrder
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    setFilteredUsers(sorted);
    setIsAscOrder(!isAscOrder);
    setCurrentPage(1); 
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteConfirm = async (user: any) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: `Esta acción eliminará a ${user.firstName} ${user.lastName}`,
      icon: "warning",
      background: "#111827",
      color: "#f9fafb",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // rojo
      cancelButtonColor: "#6b7280", // gris
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteUser(user.id);
      fetchUsers();

      await Swal.fire({
        title: "Usuario eliminado",
        icon: "success",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#10b981",
        confirmButtonText: "Aceptar",
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      await Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el usuario.",
        icon: "error",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#ef4444",
      });
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
      <div
        className="flex justify-center items-center min-h-screen"
        data-aos="fade-up"
      >
        <div className="text-center text-white">
          <p className="text-lg">Cargando usuarios...</p>
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto mt-8 px-4 md:px-8">
      <h2 className="text-2xl md:text-3xl font-semibold text-white text-center mb-8">
        Gestión de Usuarios
      </h2>

      {/* Botón + contador + buscador */}
      <div
        className="w-full flex flex-wrap justify-center gap-4 mb-10"
        data-aos="fade-up"
      >
        <div className="w-full sm:w-auto flex justify-center">
          <button
            className="w-72 bg-purple-600 hover:bg-purple-700 text-white text-sm md:text-base font-medium px-4 py-2 rounded-md shadow-sm text-center"
            onClick={() => setShowCreateModal(true)}
          >
            + Crear Usuario
          </button>
        </div>

        <div className="w-full sm:w-auto flex justify-center">
          <div className="w-72 bg-gray-700 text-white px-4 py-2 rounded-md text-sm md:text-base font-semibold shadow-md flex items-center justify-center gap-2">
            Total de alumnos:{" "}
            <span className="text-purple-400">{totalUsers}</span>
          </div>
        </div>

        <div className="w-full sm:w-auto flex justify-center">
          <button
            onClick={toggleSortByName}
            className="w-72 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base font-medium px-4 py-2 rounded-md shadow-sm text-center"
          >
            Ordenar por Nombre {isAscOrder ? "↓" : "↑"}
          </button>
        </div>

        <div className="w-full sm:w-auto flex justify-center">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o email"
            className="w-72 text-sm md:text-base px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Centrar el botón de conectar WhatsApp */}
      <div className="flex justify-center mb-6">
        <button
          onClick={async () => {
            try {
              const status = await getWhatsappStatus();

              if (status === "authenticated" || status === "ready") {
                Swal.fire({
                  icon: "success",
                  title: "Ya estás conectado a WhatsApp",
                  background: "#111827",
                  color: "#f9fafb",
                  confirmButtonColor: "#10b981",
                });
                return;
              }

              if (status === "qr") {
                const qr = await getWhatsappQR();
                if (!qr || !qr.startsWith("data:image/")) {
                  throw new Error("QR inválido o vacío");
                }
                setQRImageData(qr);
                setShowQRModal(true);
              } else {
                Swal.fire({
                  title: "Estado desconocido",
                  text: `Estado actual: ${status}`,
                  icon: "warning",
                  background: "#111827",
                  color: "#f9fafb",
                });
              }
            } catch (error) {
              console.error("❌ Error al mostrar QR:", error);
              Swal.fire({
                title: "Error",
                text: "No se pudo obtener el código QR.",
                icon: "error",
                background: "#111827",
                color: "#f9fafb",
                confirmButtonColor: "#ef4444",
              });
            }
          }}
          className="w-72 bg-purple-600 hover:bg-purple-700 text-white text-sm md:text-base font-medium px-4 py-2 rounded-md shadow-sm text-center"
        >
          🔌 Conectar WhatsApp
        </button>
      </div>

      {/* Paginación superior */}
      {renderPagination()}

      {/* Tabla para escritorio */}
      <div className="hidden md:block bg-gray-800 rounded-lg shadow-lg max-w-6xl mx-auto">
        <table className="w-full table-fixed text-white text-sm">
          <thead>
            <tr className="bg-gray-700 text-center uppercase tracking-wide text-xs">
              <th className="w-1/6 px-2 py-3">Username</th>
              <th className="w-1/6 px-2 py-3">Nombre</th>
              <th className="w-1/4 px-2 py-3">Email</th>
              <th className="w-1/6 px-2 py-3">Teléfono</th>
              <th className="px-2 py-3 w-[140px] text-xs">Packs</th>
              <th className="px-2 py-3 w-[80px] text-xs">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <tr
                key={u.id}
                className="border-b border-gray-700 even:bg-gray-900 hover:bg-gray-700 transition text-center"
              >
                <td className="px-2 py-3 font-bold break-words">
                  {u.username}
                  {u.googleId && (
                    <img
                      src="https://developers.google.com/identity/images/g-logo.png"
                      alt="Google Login"
                      title="Login con Google"
                      className="inline-block w-4 h-4 ml-1 align-middle"
                    />
                  )}
                </td>
                <td className="px-2 py-3 break-words">
                  {u.firstName} {u.lastName}
                </td>
                <td className="px-2 py-3 break-words">{u.email}</td>
                <td className="px-2 py-3 break-words text-sm">
                  {u.phone ? u.phone : "-"}
                </td>
                <td className="px-2 py-3 text-xs text-center align-top max-w-[140px] break-words">
                  {u.current_pack ? (
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <span className="font-semibold text-purple-400">
                        {u.current_pack.name}
                      </span>
                      <span className="text-gray-300">
                        <div className="text-gray-300">
                          <strong>📅</strong>{" "}
                          {new Date(
                            new Date(u.pack_expiration_date).setMonth(
                              new Date(u.pack_expiration_date).getMonth() - 1
                            )
                          ).toLocaleDateString()}
                        </div>
                      </span>
                      {daysRemaining(u.pack_expiration_date) === 0 ? (
                        <span className="text-red-400 font-medium">
                          ⚠️ Pack vencido
                        </span>
                      ) : (
                        <>
                          <span className="text-green-400">
                            <strong>🗓️</strong>{" "}
                            {daysRemaining(u.pack_expiration_date)} días
                            restantes
                          </span>
                          <span className="text-blue-300">
                            <strong>🎯</strong> {u.classes_remaining ?? 0}{" "}
                            clases restantes
                          </span>
                        </>
                      )}
                    </div>
                  ) : (
                    <span className="italic text-gray-400">
                      Sin Pack Asignado
                    </span>
                  )}
                </td>
                <td className="px-2 py-3">
                  <div className="flex justify-center gap-1">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md transition"
                      onClick={() => handleEdit(u)}
                      title="Editar"
                    >
                      <FaEdit className="text-sm" />
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition"
                      onClick={() => handleDeleteConfirm(u)}
                      title="Eliminar"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tarjetas móviles */}
      <div className="md:hidden flex flex-col gap-4 px-2">
        {paginatedUsers.map((u) => (
          <div
            key={u.id}
            className="bg-gray-800 p-4 rounded-lg shadow-md text-white text-sm space-y-2"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <div className="font-bold text-lg text-purple-400">
              {u.firstName} {u.lastName}
            </div>
            <div>
              <strong>👤 Usuario:</strong> {u.username}
              {u.googleId && (
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google Login"
                  title="Login con Google"
                  className="inline-block w-4 h-4 ml-1 align-middle"
                />
              )}
            </div>
            <div>
              <strong>📧 Email:</strong> {u.email}
            </div>
            <div>
              <strong>📞 Teléfono:</strong> {u.phone || "-"}
            </div>
            <div>
              <strong>🎁 Pack:</strong>{" "}
              {u.current_pack ? (
                <div className="ml-2 space-y-1">
                  <div className="text-purple-300 font-medium">
                    {u.current_pack.name}
                  </div>
                  <div className="text-gray-300">
                    <strong>📅</strong>{" "}
                    {new Date(
                      new Date(u.pack_expiration_date).setMonth(
                        new Date(u.pack_expiration_date).getMonth() - 1
                      )
                    ).toLocaleDateString()}
                  </div>
                  {daysRemaining(u.pack_expiration_date) === 0 ? (
                    <div className="text-red-400 font-medium">
                      ⚠️ Pack vencido
                    </div>
                  ) : (
                    <>
                      <div className="text-green-400">
                        <strong>🗓️</strong>{" "}
                        {daysRemaining(u.pack_expiration_date)} días restantes
                      </div>
                      <div className="text-blue-300">
                        <strong>🎯</strong> {u.classes_remaining ?? 0} clases
                        restantes
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <span className="italic text-gray-400">Sin Pack Asignado</span>
              )}
            </div>
            <div className="flex justify-end gap-4 pt-3">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition text-base"
                onClick={() => handleEdit(u)}
                title="Editar"
              >
                <FaEdit />
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-base"
                onClick={() => handleDeleteConfirm(u)}
                title="Eliminar"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación inferior */}
      {renderPagination()}

      {/* Modals */}
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
      {/* <ConfirmDeleteUserModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleDeleteConfirm}
        user={selectedUser}
      /> */}
      {showQRModal && qrImageData && (
        <WhatsappQRModal
          show={showQRModal}
          qrImage={qrImageData}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
};

export default UserTable;
