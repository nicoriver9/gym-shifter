import { useEffect, useState } from "react";

interface ConfirmDeleteModalProps {
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  classTypeId: number | undefined;
}

export default function ConfirmDeleteModal({
  show,
  handleClose,
  handleConfirm,
  classTypeId,
}: ConfirmDeleteModalProps) {
  const [className, setClassName] = useState("");

  const fetchClass = async () => {
    if (classTypeId) {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) throw new Error("No hay token de acceso");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/class-types/${classTypeId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener el nombre de la clase");
        }

        const data = await response.json();
        setClassName(data.name);
      } catch (error) {
        console.error("Error al obtener el nombre de la clase:", error);
      }
    }
  };

  useEffect(() => {
    fetchClass();
  }, [classTypeId]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div
        className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md animate-fade-in"
        data-aos="zoom-in"
      >
        <h2 className="text-xl font-bold text-red-500 mb-4">
          Confirmar Eliminación
        </h2>

        <p className="mb-6">
          ¿Estás seguro de que deseas eliminar la clase{" "}
          <strong className="text-red-400">{className}</strong>? Esta acción no
          se puede deshacer.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
