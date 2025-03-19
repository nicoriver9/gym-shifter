import { useState, useEffect } from "react";
import { assignSinglePackToUser, updateUser, unassignPackFromUser } from "../../../../services/user/userService";
import { getPacks } from "../../../../services/user/packService";

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

const EditUserModal = ({ show, handleClose, user = {}, refreshTable }: EditUserModalProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [packs, setPacks] = useState<Pack[]>([]);
  const [selectedPackId, setSelectedPackId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPassword("");
      fetchPacks();
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
      await updateUser(user.id, { firstName, lastName, email, ...(password && { password }) });
      refreshTable();
      handleClose();
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
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
      alert("Pack asignado correctamente.");
    } catch (error) {
      console.error("❌ Error al asignar pack:", error);
      alert("Hubo un error al asignar el pack.");
    }
  };

  const handleUnassignPack = async (packId: number) => {
    try {
      await unassignPackFromUser(user.id, packId);
      refreshTable();
      alert("Pack desasignado correctamente.");
    } catch (error) {
      console.error("❌ Error al desasignar pack:", error);
      alert("Hubo un error al desasignar el pack.");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md" data-aos="zoom-in">
        <h2 className="text-xl font-semibold mb-4 text-purple-500">Editar Usuario</h2>

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
            <label className="block text-sm font-medium mb-1">Contraseña (Opcional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Pack Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Asignar Pack</label>
            <select
              value={selectedPackId || ""}
              onChange={(e) => setSelectedPackId(Number(e.target.value))}
              className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              disabled={user && (user.packs ?? []).length > 0}
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
              disabled={user && (user.packs ?? []).length > 0}
            >
              Asignar Pack
            </button>
          </div>

          {/* Lista de Packs Asignados */}
          <div>
            <h3 className="text-sm font-medium text-purple-400 mb-2">Packs Asignados</h3>
            <ul className="bg-gray-800 rounded-lg p-3 space-y-2">
              {user && user.packs.length > 0 ? (
                user.packs.map((pack: Pack) => (
                  <li key={pack.id} className="flex justify-between items-center bg-gray-700 p-2 rounded-lg">
                    <span>{pack.name}</span>
                    <button
                      onClick={() => handleUnassignPack(pack.id)}
                      className="bg-red-600 hover:bg-red-700 px-2 py-1 text-sm rounded-lg"
                    >
                      Desasignar
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No hay packs asignados.</li>
              )}
            </ul>
          </div>

          {/* Botones */}
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
