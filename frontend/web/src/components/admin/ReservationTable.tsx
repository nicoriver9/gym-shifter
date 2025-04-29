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
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await getReservations();
  
      // 🔽 Ordena por fecha de creación (más reciente primero)
      const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a.classSchedule.created_at).getTime();
        const dateB = new Date(b.classSchedule.created_at).getTime();
        return dateB - dateA; // Descendente
      });
  
      setReservations(sortedData);
      setFilteredReservations(sortedData);
    } catch (error) {
      console.error("Error al obtener reservaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (r: Reservation) => {
    setSelectedReservation(r);
    setShowEditModal(true);
  };
  const handleDelete = (r: Reservation) => {
    setSelectedReservation(r);
    setShowDeleteModal(true);
  };
  const handleDeleteConfirm = async () => {
    if (!selectedReservation) return;
    await deleteReservation(selectedReservation.id);
    setShowDeleteModal(false);
    fetchReservations();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredReservations(
      reservations.filter((r) => {
        const fullName = `${r.user.firstName} ${r.user.lastName}`.toLowerCase();
        const type = r.classSchedule.classType.name.toLowerCase();
        const day = r.classSchedule.day_of_week.toLowerCase();
        const teacher = r.classSchedule.teacherName.toLowerCase();
        const email = (r.user.email || "").toLowerCase();
        return (
          fullName.includes(term) ||
          email.includes(term) ||
          type.includes(term) ||
          day.includes(term) ||
          teacher.includes(term)
        );
      })
    );
  };

  // Formatea un string ISO o instancia Date a 'dd MMM yyyy, HH:mm'
  const formatDateTime = (input: string | Date) => {
    const d = typeof input === "string" ? new Date(input) : input;
    return d.toLocaleString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-white text-xl">Cargando reservaciones…</span>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto px-4 lg:px-8 mt-8">
      <h2 className="text-2xl font-semibold text-white text-center mb-6">
        Control de Asistencias
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido, clase…"
          className="w-full md:w-80 text-sm px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 transition"
          value={searchTerm}
          onChange={handleSearch}
        />
        {/* <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow transition text-sm"
          onClick={() => setShowCreateModal(true)}
        >
          + Crear Reservación
        </button> */}
      </div>

      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
        <table className="w-full table-auto text-white">
          <thead>
            <tr className="bg-gray-700 text-xs uppercase tracking-wide">
              {/* <th className="px-3 py-2 text-center">ID</th> */}
              <th className="px-3 py-2 text-center">Usuario</th>
              <th className="px-3 py-2 text-center">Clase</th>
              {/* <th className="px-3 py-2 text-center">Día</th> */}
              <th className="px-3 py-2 text-center">Horario</th>
              <th className="px-3 py-2 text-center">Profesor</th>
              <th className="px-3 py-2 text-center">Confirmacion Asistencia</th>
              {/* <th className="px-3 py-2 text-center">Estado</th> */}
              <th className="px-3 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length > 0 ? (
              filteredReservations.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-gray-700 even:bg-gray-900 hover:bg-gray-700 transition text-sm"
                >
                  {/* <td className="px-3 py-2 text-center">{r.id}</td> */}
                  <td className="px-3 py-2 text-center whitespace-nowrap">
                    {r.user.firstName} {r.user.lastName}
                  </td>
                  <td className="px-3 py-2 text-center">{r.classSchedule.classType.name}</td>
                  {/* <td className="px-3 py-2 text-center">{r.classSchedule.day_of_week}</td> */}
                  <td className="px-3 py-2 text-center whitespace-nowrap">
                    {r.classSchedule.start_time} - {r.classSchedule.end_time}
                  </td>
                  <td className="px-3 py-2 text-center">{r.classSchedule.teacherName}</td>
                  <td className="px-3 py-2 text-center whitespace-nowrap text-xs">
                    {formatDateTime(r.classSchedule.created_at)}
                  </td>
                  {/* <td className="px-3 py-2 text-center">{r.status}</td> */}
                  <td className="px-3 py-2 text-center space-x-1">
                    <button
                      className="bg-green-500 hover:bg-green-600 px-2 py-1 my-2 rounded-md text-xs transition"
                      onClick={() => handleEdit(r)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded-md text-xs transition"
                      onClick={() => handleDelete(r)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-4 text-center text-gray-400">
                  No se encontraron asistencias.
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
