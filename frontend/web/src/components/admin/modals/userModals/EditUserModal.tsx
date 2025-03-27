// src/components/admin/users/EditUserModal.tsx
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
      fetchPacks();
      setUserInfo(user); // Establecer la información del usuario directamente
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md"
        data-aos="zoom-in"
      >
        <h2 className="text-xl font-semibold mb-4 text-purple-500">
          Editar Usuario
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Apellido</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Contraseña (Opcional)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Sección de Packs */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Asignar Pack
            </label>
            <select
              value={selectedPackId || ""}
              onChange={(e) => setSelectedPackId(Number(e.target.value))}
              className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
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
              onClick={handleAssignPack}
              className="w-full mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
              disabled={!!userInfo?.current_pack}
            >
              Asignar Pack
            </button>
          </div>

          {/* Información del Pack Actual */}
          <div>
            <h3 className="text-sm font-medium text-purple-400 mb-2">
              Pack Actual
            </h3>
            <div className="bg-gray-800 rounded-lg p-4">
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
                    className="w-full mt-3 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                  >
                    Desasignar Pack
                  </button>
                </div>
              ) : (
                <p className="text-gray-400">
                  No hay pack asignado actualmente.
                </p>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-lg transition"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
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
    </div>
  );
};

export default EditUserModal;
