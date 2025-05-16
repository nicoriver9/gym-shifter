import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import * as XLSX from "xlsx";
import { FaSortUp, FaSortDown } from "react-icons/fa";


import CreateReservationModal from "./modals/reservationModals/CreateReservationModal";
import EditReservationModal from "./modals/reservationModals/EditReservationModal";
import ConfirmDeleteReservationModal from "./modals/reservationModals/ConfirmDeleteReservationModal";
import {
  getReservations,
  deleteReservation,
} from "../../services/admin/reservationService";
import { Reservation } from "../../interfaces/admin/IReservation";

const RESERVATIONS_PER_PAGE = 10;

const ReservationTable = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [paginatedReservations, setPaginatedReservations] = useState<Reservation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortDescending, setSortDescending] = useState(true);
  const [classTypes, setClassTypes] = useState<string[]>([]);
  const [selectedClassType, setSelectedClassType] = useState<string>("Todos");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("Todos");
  const [teachers, setTeachers] = useState<string[]>([]);


  useEffect(() => {
    AOS.init({ duration: 600 });
    fetchReservations();
  }, []);

  useEffect(() => {
    const start = (currentPage - 1) * RESERVATIONS_PER_PAGE;
    const end = start + RESERVATIONS_PER_PAGE;
    setPaginatedReservations(filteredReservations.slice(start, end));
  }, [filteredReservations, currentPage]);

  useEffect(() => {
    let filtered = [...reservations];

    if (selectedClassType !== "Todos") {
      filtered = filtered.filter(r => r.classSchedule.classType.name === selectedClassType);
    }

    if (selectedTeacher !== "Todos") {
      filtered = filtered.filter(r => r.classSchedule.teacherName === selectedTeacher);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((r) => {
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
      });
    }

    setFilteredReservations(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedClassType, selectedTeacher, reservations]);


  const fetchReservations = async () => {
    try {
      const data = await getReservations();

      const cleanData = data.filter(r => r.created_at);

      const sortedData = [...cleanData].sort((a, b) => {
        const dateA = !isNaN(new Date(a.created_at).getTime())
          ? new Date(a.created_at).getTime()
          : 0;
        const dateB = !isNaN(new Date(b.created_at).getTime())
          ? new Date(b.created_at).getTime()
          : 0;
        return sortDescending ? dateB - dateA : dateA - dateB;
      });

      const uniqueClassTypes = [...new Set(sortedData.map(r => r.classSchedule.classType.name))];
      const uniqueTeachers = [...new Set(sortedData.map(r => r.classSchedule.teacherName))];

      setReservations(sortedData);
      setFilteredReservations(sortedData);
      setClassTypes(uniqueClassTypes);
      setTeachers(uniqueTeachers);

    } catch (error) {
      console.error("Error al obtener asistencias:", error);
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
    const filtered = reservations.filter((r) => {
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
    });
    setFilteredReservations(filtered);
    setCurrentPage(1);
  };

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

  const exportToExcel = () => {
    const dataToExport = filteredReservations.map((r) => ({
      Usuario: `${r.user.firstName} ${r.user.lastName}`,
      Email: r.user.email,
      Clase: r.classSchedule.classType.name,
      Horario: `${r.classSchedule.start_time} - ${r.classSchedule.end_time}`,
      Profesor: r.classSchedule.teacherName,
      "Fecha de Confirmación": formatDateTime(r.created_at),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asistencias");

    XLSX.writeFile(workbook, "asistencias.xlsx");
  };

  const totalPages = Math.ceil(filteredReservations.length / RESERVATIONS_PER_PAGE);
  const renderPagination = () => (
    <div className="flex justify-center my-4 gap-2 flex-wrap">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          className={`px-3 py-1 rounded-md text-sm font-semibold transition ${currentPage === index + 1
            ? "bg-purple-600 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-purple-700"
            }`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" data-aos="fade-up">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Cargando asistencias…</p>
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto px-4 lg:px-8 mt-8">
      <h2 className="text-2xl font-semibold text-white text-center mb-6">
        Control de Asistencias
      </h2>

      {/* Filtros y buscador */}
      <div className="flex flex-col md:flex-row flex-wrap justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido, clase…"
          className="w-full md:w-72 text-sm px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 transition"
          value={searchTerm}
          onChange={handleSearch}
        />

        <select
          value={selectedClassType}
          onChange={(e) => setSelectedClassType(e.target.value)}
          className="bg-gray-700 text-white px-3 py-2 rounded-md text-sm w-full md:w-60"
        >
          <option value="Todos">Todas las clases</option>
          {classTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          className="bg-gray-700 text-white px-3 py-2 rounded-md text-sm w-full md:w-60"
        >
          <option value="Todos">Todos los profesores</option>
          {teachers.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setSortDescending((prev) => !prev);
              fetchReservations();
            }}
            className="text-sm text-white bg-gray-700 px-3 py-2 rounded-md hover:bg-gray-600 flex items-center gap-1"
            title="Ordenar por fecha"
          >
            Orden:
            {sortDescending ? <FaSortDown /> : <FaSortUp />}
          </button>

          <button
            onClick={exportToExcel}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow text-sm"
          >
            Descargar Excel
          </button>
        </div>
      </div>

      {renderPagination()}

      {/* Tabla para escritorio */}
      <div className="hidden md:block overflow-x-auto bg-gray-800 rounded-lg shadow-md">
        <table className="w-full table-auto text-white">
          <thead>
            <tr className="bg-gray-700 text-xs uppercase tracking-wide">
              <th className="px-3 py-2 text-center">Usuario</th>
              <th className="px-3 py-2 text-center">Clase</th>
              <th className="px-3 py-2 text-center">Horario</th>
              <th className="px-3 py-2 text-center">Profesor</th>
              <th className="px-3 py-2 text-center">Confirmación Asistencia</th>
              <th className="px-3 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReservations.length > 0 ? (
              paginatedReservations.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-gray-700 even:bg-gray-900 hover:bg-gray-700 transition text-sm"
                >
                  <td className="px-3 py-2 text-center whitespace-pre-line break-words max-w-[180px]">
                    {r.user.firstName + "\n" + r.user.lastName}
                  </td>
                  <td className="px-3 py-2 text-center">{r.classSchedule.classType.name}</td>
                  <td className="px-3 py-2 text-center whitespace-nowrap">
                    {r.classSchedule.start_time} - {r.classSchedule.end_time}
                  </td>
                  <td className="px-3 py-2 text-center">{r.classSchedule.teacherName}</td>
                  <td className="px-3 py-2 text-center whitespace-nowrap text-xs">
                    {formatDateTime(r.created_at)}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-xs font-semibold transition"
                        onClick={() => handleEdit(r)}
                        title="Editar"
                      >
                        <FaEdit className="inline mr-1" />
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-xs font-semibold transition"
                        onClick={() => handleDelete(r)}
                        title="Eliminar"
                      >
                        <FaTrash className="inline mr-1" />
                      </button>
                    </div>
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

      {/* Tarjetas móviles */}
      <div className="md:hidden flex flex-col gap-4 px-2">
        {paginatedReservations.map((r, index) => (
          <div
            key={r.id}
            className="bg-gray-800 p-4 rounded-lg shadow-md text-white text-sm space-y-2"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="text-lg font-bold text-purple-400">
              {r.user.firstName} {r.user.lastName}
            </div>
            <div><strong>📧 Email:</strong> {r.user.email}</div>
            <div>
              <strong>📚 Clase:</strong>{" "}
              <span className="inline-block bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                {r.classSchedule.classType.name}
              </span>
            </div>
            <div><strong>🕓 Horario:</strong> {r.classSchedule.start_time} - {r.classSchedule.end_time}</div>
            <div><strong>👨‍🏫 Profesor:</strong> {r.classSchedule.teacherName}</div>
            <div><strong>🗓️ Confirmación:</strong> {formatDateTime(r.created_at)}</div>

            <div className="flex justify-end gap-4 pt-2">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition text-base"
                onClick={() => handleEdit(r)}
                title="Editar asistencia"
              >
                <FaEdit />
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-base"
                onClick={() => handleDelete(r)}
                title="Eliminar asistencia"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {renderPagination()}

      {/* Modales */}
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
