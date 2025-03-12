// src/components/UserTable.tsx
import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { getUsers, deleteUser } from "../services/userService";
import CreateUserModal from "./modals/userModals/CreateUserModal";
import EditUserModal from "./modals/userModals/EditUserModal";
import ConfirmDeleteUserModal from "./modals/userModals/ConfirmDeleteUserModal";

const UserTable = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
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

  return (
    <div>
      <Button variant="primary" onClick={() => setShowCreateModal(true)}>
        Crear Usuario
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{`${user.firstName} ${user.lastName}`}</td>
              <td>{user.email}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(user)}>
                  Editar
                </Button>{" "}
                <Button variant="danger" onClick={() => handleDelete(user)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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

      <ConfirmDeleteUserModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default UserTable;