import { useEffect, useState } from "react";
import CreateTeacherModal from "./modals/teacherModals/CreateTeacherModal";
import EditTeacherModal from "./modals/teacherModals/EditTeacherModal";
import ConfirmDeleteTeacherModal from "./modals/teacherModals/ConfirmDeleteTeacherModal";
import {
  getTeachers,
  // deleteTeacher,
} from "../../services/admin/teacherService";

const TeacherTable = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

  useEffect(() => {
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

  const handleDelete = (teacher: any) => {
    setSelectedTeacher(teacher);
    setShowDeleteModal(true);
  };

  // const handleDeleteConfirm = async () => {
  //   if (selectedTeacher) {
  //     await deleteTeacher(selectedTeacher.id);
  //     fetchTeachers();
  //     setShowDeleteModal(false);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-white text-center mb-4">
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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 text-white rounded-lg shadow-md overflow-hidden">
          <thead>
            <tr className="bg-gray-700 text-white text-left text-sm uppercase tracking-wider">
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
                  <td className="px-6 py-4 flex justify-center space-x-4">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                      onClick={() => handleEdit(teacher)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                      onClick={() => handleDelete(teacher)}
                    >
                      Eliminar
                    </button>
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

      <ConfirmDeleteTeacherModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        teacher={selectedTeacher}
        refreshTable={fetchTeachers}
      />
    </div>
  );
};

export default TeacherTable;
