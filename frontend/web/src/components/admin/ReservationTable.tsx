import { useEffect, useState } from "react";
import CreateReservationModal from "./modals/reservationModals/CreateReservationModal";
import EditReservationModal from "./modals/reservationModals/EditReservationModal";
import ConfirmDeleteReservationModal from "./modals/reservationModals/ConfirmDeleteReservationModal";
import {
  getReservations,
  deleteReservation,
} from "../../services/admin/reservationService";
import { Reservation } from "../../interfaces/admin/IReservation";

const ReservationTable = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<
    Reservation[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true); // 👈 Paso 1: nuevo estado de carga

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await getReservations();
      setReservations(data);
      setFilteredReservations(data);
    } catch (error) {
      console.error("Error al obtener las reservaciones:", error);
    } finally {
      setLoading(false); // 👈 Paso 2: cuando termina, apagamos el "loading"
    }
  };

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowEditModal(true);
  };

  const handleDelete = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedReservation) {
      await deleteReservation(selectedReservation.id);
      fetchReservations();
      setShowDeleteModal(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = reservations.filter((r) => {
      const fullName = `${r.user.firstName} ${r.user.lastName}`.toLowerCase();
      const type = r.classSchedule.classType.name.toLowerCase();
      const day = r.classSchedule.day_of_week.toLowerCase();
      const teacher = r.classSchedule.teacherName.toLowerCase();
      const email = r.user.email?.toLowerCase() || "";

      return (
        fullName.includes(term) ||
        email.includes(term) ||
        type.includes(term) ||
        day.includes(term) ||
        teacher.includes(term)
      );
    });

    setFilteredReservations(filtered);
  };

  // 👇 Paso 3: mostrar "Cargando..." mientras se cargan los datos
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto px-4 lg:px-1 mt-8">
      <h2 className="text-2xl font-semibold text-white text-center mb-4">
        Gestión de Reservaciones
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Buscar por nombre, tipo, día o profesor..."
          className="w-full md:w-1/2 px-4 py-2 rounded-lg text-black focus:ring-2 focus:ring-purple-500"
        />
        <button
          className="bg-purple-700 hover:bg-purple-800 px-6 py-3 font-semibold text-white rounded-lg shadow-md transition"
          onClick={() => setShowCreateModal(true)}
        >
          + Crear Reservación
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-gray-900 text-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-700 text-white text-left text-sm uppercase tracking-wider">
              <th className="px-2 py-2 text-center whitespace-nowrap">ID</th>
              <th className="px-2 py-2 text-center whitespace-nowrap">
                Usuario
              </th>
              <th className="px-2 py-2 text-center whitespace-nowrap">
                Tipo de Clase
              </th>
              <th className="px-2 py-2 text-center whitespace-nowrap">Día</th>
              <th className="px-2 py-2 text-center whitespace-nowrap">
                Horario
              </th>
              <th className="px-2 py-2 text-center whitespace-nowrap">
                Profesor
              </th>
              <th className="px-2 py-2 text-center whitespace-nowrap">
                Estado
              </th>
              <th className="px-2 py-2 whitespace-nowrap text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition text-sm"
                >
                  <td className="px-2 py-2 text-center whitespace-nowrap">
                    {reservation.id}
                  </td>
                  <td className="px-2 py-2 text-center whitespace-nowrap">{`${reservation.user.firstName} ${reservation.user.lastName}`}</td>
                  <td className="px-2 py-2 text-center whitespace-nowrap">
                    {reservation.classSchedule.classType.name}
                  </td>
                  <td className="px-2 py-2 text-center whitespace-nowrap">
                    {reservation.classSchedule.day_of_week}
                  </td>
                  <td className="px-2 py-2 text-center whitespace-nowrap">{`${reservation.classSchedule.start_time} - ${reservation.classSchedule.end_time}`}</td>
                  <td className="px-2 py-2 text-center whitespace-nowrap">
                    {reservation.classSchedule.teacherName}
                  </td>
                  <td className="px-2 py-2 text-center whitespace-nowrap">
                    {reservation.status}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-center space-x-1">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-lg transition text-sm"
                      onClick={() => handleEdit(reservation)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg transition text-sm"
                      onClick={() => handleDelete(reservation)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-400">
                  No se encontraron reservaciones.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateReservationModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        refreshTable={fetchReservations}
      />

      <EditReservationModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        reservation={selectedReservation || undefined}
        refreshTable={fetchReservations}
      />

      <ConfirmDeleteReservationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleDeleteConfirm}
        reservation={selectedReservation || undefined}
      />
    </div>
  );
};

export default ReservationTable;
