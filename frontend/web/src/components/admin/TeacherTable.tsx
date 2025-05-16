import { useEffect, useState } from "react";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";

import CreateTeacherModal from "./modals/teacherModals/CreateTeacherModal";
import EditTeacherModal from "./modals/teacherModals/EditTeacherModal";
import { getTeachers } from "../../services/admin/teacherService";

const TeacherTable = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

  useEffect(() => {
    AOS.init({ duration: 600 });
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const data = await getTeachers();
      setTeachers(data);
    } catch (error) {
      console.error("Error al obtener los profesores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (teacher: any) => {
    setSelectedTeacher(teacher);
    setShowEditModal(true);
  };

  const handleDeleteConfirm = async (teacher: any) => {
    if (!teacher || !teacher.id) {
      console.error("❌ Profesor no válido:", teacher);
      return;
    }

    const result = await Swal.fire({
      title: `¿Eliminar al profesor ${teacher.name}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      background: "#111827",
      color: "#f9fafb",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) throw new Error("No hay token de acceso");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/teachers/${teacher.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Código de error:", response.status);
        console.error("❌ Respuesta del backend:", errorText);
        throw new Error("Error al eliminar el profesor");
      }

      await Swal.fire({
        title: "Profesor eliminado",
        icon: "success",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#10b981",
        timer: 2000,
        timerProgressBar: true,
      });

      fetchTeachers();
    } catch (error) {
      console.error("❌ Error al eliminar profesor:", error);
      await Swal.fire({
        title: "Error",
        text: "Hubo un problema al eliminar el profesor.",
        icon: "error",
        background: "#111827",
        color: "#f9fafb",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" data-aos="fade-up">
        <div className="text-center text-white">
          <p className="text-lg">Cargando profesores...</p>
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-semibold text-white text-center mb-8">
        Gestión de Profesores
      </h2>

      {/* Botón para crear profesor */}
      <div className="flex justify-center mb-6">
        <button
          className="bg-purple-700 hover:bg-purple-800 px-6 py-3 font-semibold text-white rounded-lg shadow-md transition"
          onClick={() => setShowCreateModal(true)}
        >
          + Crear Profesor
        </button>
      </div>

      {/* Tabla */}
      {/* Tabla para escritorio */}
      <div className="hidden md:block bg-gray-900 rounded-lg shadow-lg overflow-x-auto">
        <table className="min-w-full text-white">
          <thead>
            <tr className="bg-gray-700 text-white text-sm uppercase tracking-wider">
              <th className="px-6 py-3 text-center">ID</th>
              <th className="px-6 py-3 text-center">Nombre</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4 text-center">{teacher.id}</td>
                  <td className="px-6 py-4 text-center">{teacher.name}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex justify-center space-x-4">
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition text-base"
                        onClick={() => handleEdit(teacher)}
                        title="Editar profesor"
                      >
                        <FaPen />
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-base"
                        onClick={() => handleDeleteConfirm(teacher)}
                        title="Eliminar profesor"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-400">
                  No hay profesores registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tarjetas móviles */}
      <div className="md:hidden flex flex-col gap-4 px-2">
        {teachers.map((teacher, index) => (
          <div
            key={teacher.id}
            className="bg-gray-800 p-4 rounded-lg shadow-md text-white text-sm space-y-2"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="text-lg font-bold text-purple-400">{teacher.name}</div>
            <div><strong>🆔 ID:</strong> {teacher.id}</div>

            <div className="flex justify-end gap-4 pt-2">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition text-base"
                onClick={() => handleEdit(teacher)}
                title="Editar profesor"
              >
                <FaPen />
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-base"
                onClick={() => handleDeleteConfirm(teacher)}
                title="Eliminar profesor"
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modales */}
      <CreateTeacherModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        refreshTable={fetchTeachers}
      />

      <EditTeacherModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        teacher={selectedTeacher}
        refreshTable={fetchTeachers}
      />
    </div>
  );
};

export default TeacherTable;
