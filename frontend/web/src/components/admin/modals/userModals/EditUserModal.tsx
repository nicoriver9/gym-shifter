import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { FaTimes, FaTrash } from "react-icons/fa";

import {
  updateUser,
  getUserById,
  // deleteUser
} from "../../../../services/admin/userService";
import { getPacks } from "../../../../services/admin/packService";
import {
  assignSinglePackToUser,
  unassignPackFromUser,
} from "../../../../services/user/userPackService";

interface EditUserModalProps {
  show: boolean;
  handleClose: () => void;
  user: any;
  refreshTable: () => void;
}

interface Pack {
  id: number;
  name: string;
  created_at: string;
  validity_days: string;
}

const EditUserModal = ({
  show,
  handleClose,
  user = {},
  refreshTable,
}: EditUserModalProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [packs, setPacks] = useState<Pack[]>([]);
  const [selectedPackId, setSelectedPackId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(user);
  const [username, setUsername] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+54 9");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userRole, setUserRole] = useState("User"); // default

  const fetchUserInfo = async () => {
    try {
      const updatedUser = await getUserById(user.id);
      setUserInfo(updatedUser);
    } catch (error) {
      console.error("Error al obtener info del usuario:", error);
    }
  };

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPassword("");
      setUsername(user.username || "");
      setUserRole(user.role || "User");

      if (user.phone) {
        const knownPrefixes = ["+54 9", "+1", "+34", "+55", "+598", "+595"];
        let foundPrefix = knownPrefixes.find((prefix) =>
          user.phone.startsWith(prefix)
        );

        if (foundPrefix) {
          setPhonePrefix(foundPrefix);
          setPhoneNumber(user.phone.substring(foundPrefix.length).trim());
        } else {
          setPhonePrefix("+54 9");
          setPhoneNumber(user.phone);
        }
      } else {
        setPhonePrefix("+54 9");
        setPhoneNumber("");
      }
      fetchPacks();
      setUserInfo(user);
    }
  }, [user]);

  const fetchPacks = async () => {
    const data = await getPacks();
    setPacks(data);
  };

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      alert("Todos los campos excepto la contraseña son obligatorios.");
      return;
    }

    setLoading(true);

    try {
      const fullPhoneNumber = `${phonePrefix}${phoneNumber}`;

      await updateUser(user.id, {
        firstName,
        lastName,
        email,
        username,
        role: userRole, 
        ...(password && { password }),
        phone: fullPhoneNumber,
      });
      refreshTable();
      handleClose();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      alert("Hubo un error al actualizar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPack = async () => {
    if (selectedPackId === null) {
      await Swal.fire({
        title: "Pack no seleccionado",
        text: "Por favor, selecciona un pack antes de asignar.",
        icon: "warning",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#d97706",
      });
      return;
    }

    const result = await Swal.fire({
      title: "¿Asignar este pack?",
      icon: "question",
      background: "#111827",
      color: "#f9fafb",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, asignar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      setProcessing(true);
      await assignSinglePackToUser(user.id, selectedPackId);
      await fetchUserInfo();
      refreshTable();

      await Swal.fire({
        title: "Pack asignado",
        icon: "success",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#10b981",
        confirmButtonText: "Aceptar",
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Error al asignar pack:", error);
      await Swal.fire({
        title: "Error",
        text: "Hubo un error al asignar el pack.",
        icon: "error",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleUnassignPack = async () => {
    const result = await Swal.fire({
      title: "¿Eliminar el pack?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      background: "#111827",
      color: "#f9fafb",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      setProcessing(true);
      await unassignPackFromUser(user.id);
      await fetchUserInfo();
      refreshTable();

      await Swal.fire({
        title: "Pack eliminado",
        icon: "success",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#10b981",
        confirmButtonText: "Aceptar",
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Error al desasignar pack:", error);
      await Swal.fire({
        title: "Error",
        text: "Hubo un problema al eliminar el pack.",
        icon: "error",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleSubtractClass = async () => {
    const result = await Swal.fire({
      title: "¿Restar una clase?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      background: "#111827",
      color: "#f9fafb",
      showCancelButton: true,
      confirmButtonColor: "#d97706", // naranja
      cancelButtonColor: "#6b7280", // gris
      confirmButtonText: "Sí, restar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("No hay token de autenticación");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user-pack/decrement-classes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            decrementBy: 1,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Error al restar clase");
      }

      await fetchUserInfo(); // refresca info del usuario en el modal
      refreshTable(); // refresca la tabla de usuarios

      await Swal.fire({
        title: "Clase restada",
        text: `Clases restantes: ${data.data.classes_remaining}`,
        icon: "success",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#10b981",
        confirmButtonText: "Aceptar",
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error: any) {
      console.error("Error:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Error al restar la clase.",
        icon: "error",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          className="absolute top-3 right-3 text-white hover:text-red-500 text-xl"
          onClick={handleClose}
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Editar Usuario
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-white block mb-1">Nombre</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </div>

          <div>
            <label className="text-white block mb-1">Apellido</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </div>

          <div>
            <label className="text-white block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </div>

          <div>
            <label className="text-white block mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </div>
          <div>
            <label className="text-white block mb-1">Teléfono</label>
            <div className="flex space-x-2">
              <select
                value={phonePrefix}
                onChange={(e) => setPhonePrefix(e.target.value)}
                className="w-1/3 p-2 rounded bg-gray-800 text-white"
              >
                <option value="+54 9">🇦🇷 +54 9 (Argentina)</option>
                <option value="+1">🇺🇸 +1 (EE.UU.)</option>
                <option value="+34">🇪🇸 +34 (España)</option>
                <option value="+55">🇧🇷 +55 (Brasil)</option>
                <option value="+598">🇺🇾 +598 (Uruguay)</option>
                <option value="+595">🇵🇾 +595 (Paraguay)</option>
              </select>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Número sin prefijo"
                className="w-2/3 p-2 rounded bg-gray-800 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-white block mb-1">Rol del Usuario</label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            >
                <option value="User">Usuario</option>
                <option value="Instructor">Instructor</option>
                <option value="Admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="text-white block mb-1">
              Contraseña (Opcional)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={email.toLowerCase().includes("@gmail.com")}
              className={`w-full p-2 rounded text-white ${
                email.toLowerCase().includes("@gmail.com")
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gray-800"
              }`}
            />
          </div>

          <div>
            <label className="text-white block mb-1">Asignar Pack</label>
            <select
              className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
              value={selectedPackId || ""}
              onChange={(e) => setSelectedPackId(Number(e.target.value))}
              disabled={!!userInfo?.current_pack}
            >
              <option value="">Selecciona un pack</option>
              {packs.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {pack.name}
                </option>
              ))}
            </select>
            <button
              className="mt-2 font-semibold bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
              onClick={handleAssignPack}
              disabled={!!userInfo?.current_pack}
            >
              Asignar Pack
            </button>
          </div>

          <div>
            <label className="text-white font-semibold block mb-1">
              Pack Actual
            </label>
            <div className="bg-gray-800 p-4 rounded-lg text-white">
              {userInfo?.current_pack ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Nombre:</span>
                    <span>{userInfo.current_pack.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Clases restantes:</span>
                    <span>{userInfo.classes_remaining}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Precio:</span>
                    <span>${userInfo.current_pack.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Validez:</span>
                    <span>{userInfo.current_pack.validity_days} días</span>
                  </div>
                  {userInfo.pack_expiration_date && (
                    <div className="flex justify-between">
                      <span className="font-medium">Expira:</span>
                      <span>
                        {new Date(
                          userInfo.pack_expiration_date
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={handleSubtractClass}
                    disabled={userInfo?.classes_remaining <= 0}
                    className={`w-full mt-2 font-semibold px-4 py-2 rounded-lg transition ${
                      userInfo?.classes_remaining <= 0
                        ? "bg-gray-700 cursor-not-allowed text-gray-400"
                        : "bg-yellow-600 hover:bg-yellow-700 text-white"
                    }`}
                  >
                    Restar Clase
                  </button>

                  <button
                    onClick={handleUnassignPack}
                    className="w-full mt-3 font-semibold bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <FaTrash /> Eliminar Pack
                  </button>
                </div>
              ) : (
                <p className="text-gray-400">
                  No hay pack asignado actualmente.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-semibold"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
            <button
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
      />
      {processing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default EditUserModal;
