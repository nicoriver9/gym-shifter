import { useState } from "react";
import Swal from "sweetalert2";
import { FaTimes } from "react-icons/fa";
import { createUser } from "../../../../services/admin/userService";

interface CreateUserModalProps {
  show: boolean;
  handleClose: () => void;
  refreshTable: () => void;
}

const CreateUserModal = ({
  show,
  handleClose,
  refreshTable,
}: CreateUserModalProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+54 9");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processing, setProcessing] = useState(false);
  const [role, setRole] = useState("User");

  if (!show) return null;

  const handleSubmit = async () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !username.trim() ||
      !phoneNumber.trim()
    ) {
      await Swal.fire({
        title: "Campos incompletos",
        text: "Todos los campos son obligatorios.",
        icon: "warning",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#d97706",
      });
      return;
    }

    const fullPhoneNumber = `${phonePrefix}${phoneNumber}`;

    try {
      setProcessing(true);
      await createUser({
        firstName,
        lastName,
        username,
        email,
        password,
        phone: fullPhoneNumber,
        role, // 👈 nuevo campo incluido
      });
      refreshTable();
      await Swal.fire({
        title: "Usuario creado",
        icon: "success",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#10b981",
        timer: 2000,
        timerProgressBar: true,
      });
      handleClose();
    } catch (error) {
      console.error("❌ Error al crear usuario:", error);
      await Swal.fire({
        title: "Error",
        text: "Hubo un error al crear el usuario.",
        icon: "error",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
        data-aos="zoom-in"
      >
        <button
          className="absolute top-3 right-3 text-white hover:text-red-500 text-xl"
          onClick={handleClose}
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">
          Crear Usuario
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
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <div className="flex space-x-2">
              <select
                value={phonePrefix}
                onChange={(e) => setPhonePrefix(e.target.value)}
                className="w-1/3 px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="+54 9">🇦🇷 +54 9 (Argentina)</option>
                <option value="+1">🇺🇸 +1 (EE.UU.)</option>
                <option value="+34">🇪🇸 +34 (España)</option>
                <option value="+55">🇧🇷 +55 (Brasil)</option>
                <option value="+598">🇺🇾 +598 (Uruguay)</option>
                <option value="+595">🇵🇾 +595 (Paraguay)</option>
                {/* puedes agregar más países aquí */}
              </select>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Número sin prefijo"
                className="w-2/3 px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 mt-3">Rol</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="User">Usuario</option>
            <option value="Instructor">Instructor</option>
            <option value="Admin">Administrador</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-lg transition"
            onClick={handleSubmit}
            disabled={processing}
          >
            {processing ? "Guardando..." : "Guardar"}
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            onClick={handleClose}
            disabled={processing}
          >
            Cancelar
          </button>
        </div>
      </div>

      {processing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default CreateUserModal;
