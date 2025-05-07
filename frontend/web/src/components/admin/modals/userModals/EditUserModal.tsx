import { useState, useEffect } from "react";
import {
  updateUser,
  getUserById,
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
  const [userInfo, setUserInfo] = useState<any>(user);
  const [username, setUsername] = useState("");

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
      await updateUser(user.id, {
        firstName,
        lastName,
        email,
        username,
        ...(password && { password }),
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
      alert("Por favor, selecciona un pack.");
      return;
    }

    try {
      await assignSinglePackToUser(user.id, selectedPackId);
      refreshTable();
      await fetchUserInfo();
      alert("Pack asignado correctamente.");
    } catch (error) {
      console.error("Error al asignar pack:", error);
      alert("Hubo un error al asignar el pack.");
    }
  };

  const handleUnassignPack = async () => {
    try {
      await unassignPackFromUser(user.id);
      refreshTable();
      await fetchUserInfo();
      alert("Pack desasignado correctamente.");
    } catch (error) {
      console.error("Error al desasignar pack:", error);
      alert("Hubo un error al desasignar el pack.");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
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
            <label className="text-white block mb-1">
              Contraseña (Opcional)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
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
                    onClick={handleUnassignPack}
                    className="w-full mt-3 font-semibold bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                  >
                    Eliminar Pack
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
    </div>
  );
};

export default EditUserModal;
