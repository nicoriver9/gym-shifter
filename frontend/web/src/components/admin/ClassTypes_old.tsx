import { useEffect, useState } from "react";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

import CreateClassTypeModal from "./modals/classTypesModals/CreateClassTypeModal";
import EditClassTypeModal from "./modals/classTypesModals/EditClassTypeModal";
import ConfirmDeleteClassTypeModal from "./modals/classTypesModals/ConfirmDeleteClassTypeModal";
import { getClassTypes, deleteClassType } from "../../services/admin/classTypeService";

const badgeColors = [
  "bg-purple-600",   // 1 - morado fuerte
  "bg-purple-500",   // 2
  "bg-indigo-500",   // 3 - transición a azul
  "bg-blue-500",     // 4 - azul
  "bg-blue-400",     // 5
  "bg-slate-500",    // 6 - azul grisáceo
  "bg-gray-500",     // 7 - gris medio
  "bg-gray-400",     // 8 - gris claro
];


const ClassTypeTable = () => {
  const [classTypes, setClassTypes] = useState<any[]>([]);
  const [filteredClassTypes, setFilteredClassTypes] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClassType, setSelectedClassType] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState("Todos");

  useEffect(() => {
    AOS.init({ duration: 600 });
    fetchClassTypes();
  }, []);

  useEffect(() => {
    if (filterName === "Todos") {
      setFilteredClassTypes(classTypes);
    } else {
      setFilteredClassTypes(classTypes.filter((ct) => ct.name === filterName));
    }
  }, [filterName, classTypes]);

  const fetchClassTypes = async () => {
    try {
      const data = await getClassTypes();
      setClassTypes(data);
      setFilteredClassTypes(data);
    } catch (error) {
      console.error("Error al obtener tipos de clases:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (classType: any) => {
    setSelectedClassType(classType);
    setShowEditModal(true);
  };

  const handleDelete = (classType: any) => {
    setSelectedClassType(classType);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedClassType) {
      await deleteClassType(selectedClassType.id);
      fetchClassTypes();
      setShowDeleteModal(false);
    }
  };

  const getBadgeColor = (name: string) => {
    const index = name.charCodeAt(0) % badgeColors.length;
    return badgeColors[index];
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h2 className="text-2xl md:text-3xl font-semibold text-white text-center mb-8">
        Gestión de Tipos de Clases
      </h2>

      {/* Botón crear y filtro */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm md:text-base px-5 py-2 rounded-md shadow transition"
          onClick={() => setShowCreateModal(true)}
        >
          + Crear Tipo de Clase
        </button>

        <select
          className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        >
          <option value="Todos">Todas las clases</option>
          {classTypes.map((ct) => (
            <option key={ct.id} value={ct.name}>{ct.name}</option>
          ))}
        </select>
      </div>

      {/* Spinner */}
      {loading ? (
        <div className="text-center text-white mt-20" data-aos="fade-up">
          <p className="text-lg">Cargando tipos de clases...</p>
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
        </div>
      ) : (
        <>
          {/* Tabla para escritorio */}
          <div className="hidden md:block overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
            <table className="w-full text-white">
              <thead>
                <tr className="bg-gray-700 text-sm md:text-base uppercase tracking-wide">
                  <th className="px-6 py-3 text-center">ID</th>
                  <th className="px-6 py-3 text-center">Nombre</th>
                  <th className="px-6 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClassTypes.length > 0 ? (
                  filteredClassTypes.map((ct) => (
                    <tr
                      key={ct.id}
                      className="border-b border-gray-700 hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-4 text-center">{ct.id}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(ct.name)}`}>
                          {ct.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex justify-center space-x-3">
                          <button
                            className="bg-green-600 hover:bg-green-700 font-semibold text-white text-xs md:text-sm px-3 py-2 rounded-md transition"
                            onClick={() => handleEdit(ct)}
                            title="Editar Tipo de Clase"
                          >
                            <FaPen />
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 font-semibold text-white text-xs md:text-sm px-3 py-2 rounded-md transition"
                            onClick={() => handleDelete(ct)}
                            title="Eliminar Tipo de Clase"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-400">
                      No se encontraron tipos de clase.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Tarjetas para móvil */}
          <div className="md:hidden flex flex-col gap-4 px-2 mt-6">
            {filteredClassTypes.map((ct, index) => (
              <div
                key={ct.id}
                className="bg-gray-800 p-4 rounded-lg shadow-md text-white text-sm space-y-2"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="text-lg font-bold text-purple-400">#{ct.id}</div>
                <div>
                  <strong>📚 Tipo:</strong>{" "}
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(ct.name)}`}>
                    {ct.name}
                  </span>
                </div>
                <div className="flex justify-end gap-4 pt-2">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition text-base"
                    onClick={() => handleEdit(ct)}
                    title="Editar Tipo de Clase"
                  >
                    <FaPen />
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-base"
                    onClick={() => handleDelete(ct)}
                    title="Eliminar Tipo de Clase"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modales */}
      <CreateClassTypeModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        refreshTable={fetchClassTypes}
      />
      <EditClassTypeModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        classType={selectedClassType}
        refreshTable={fetchClassTypes}
      />
      <ConfirmDeleteClassTypeModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleDeleteConfirm}
        className={selectedClassType?.name}
      />
    </div>
  );
};

export default ClassTypeTable;
