// src/components/TeacherTable.tsx
import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { getTeachers, deleteTeacher } from "../services/teacherService";
import CreateTeacherModal from "./modals/teacherModals/CreateTeacherModal";
import EditTeacherModal from "./modals/teacherModals/EditTeacherModal";
import ConfirmDeleteTeacherModal from "./modals/teacherModals/ConfirmDeleteTeacherModal";

const TeacherTable = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    const data = await getTeachers();
    setTeachers(data);
  };

  const handleEdit = (teacher: any) => {
    setSelectedTeacher(teacher);
    setShowEditModal(true);
  };

  const handleDelete = (teacher: any) => {
    setSelectedTeacher(teacher);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedTeacher) {
      await deleteTeacher(selectedTeacher.id);
      fetchTeachers();
      setShowDeleteModal(false);
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={() => setShowCreateModal(true)}>
        Crear Profesor
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.id}</td>
              <td>{teacher.name}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(teacher)}>
                  Editar
                </Button>{" "}
                <Button variant="danger" onClick={() => handleDelete(teacher)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
        handleConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default TeacherTable;