import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "react-bootstrap";
import esLocale from "@fullcalendar/core/locales/es";

import ConfirmDeleteModal from "./modals/classModals/ConfirmDeleteClassModal";
import AddClassModal from "./modals/classModals/AddClassModal";
import EditClassModal from "./modals/classModals/EditClassModal";
import { ClassEvent } from "../../interfaces/admin/IEditClassModal";
import { getDateForDay } from "../../helpers/classSchedulerFunctions";

export default function ClassScheduler() {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [classTypes, setClassTypes] = useState<{ id: number; name: string }[]>(
    []
  );

  const [selectedClass, setSelectedClass] = useState<ClassEvent | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState<ClassEvent | null>(null);

  /** 🔥 Obtener los tipos de clases */
  useEffect(() => {
    fetch("http://localhost:3000/class-types")
      .then((res) => res.json())
      .then((data) => setClassTypes(data));
  }, []);

  /** 🔥 Obtener las clases del calendario */
  useEffect(() => {
    fetch("http://localhost:3000/classes")
      .then((res) => res.json())
      .then((data) => {
        const formattedEvents = data.map((event: any) => ({
          id: event.id,
          title: classTypes.find((type) => type.id === event.class_type_id)
            ?.name,
          start: getDateForDay(event.day_of_week, event.start_time),
          end: getDateForDay(event.day_of_week, event.end_time),
          teacher_id: event.teacher_id,
          class_type_id: event.class_type_id,
        }));
        setEvents(formattedEvents);
      });
  }, [classTypes]);


  function fetchClasses() {
    fetch("http://localhost:3000/classes")
      .then((res) => res.json())
      .then((data) => {
        const formattedEvents = data.map((event: any) => ({
          id: event.id,
          title: classTypes.find((type) => type.id === event.class_type_id)
            ?.name,
          start: getDateForDay(event.day_of_week, event.start_time),
          end: getDateForDay(event.day_of_week, event.end_time),
          teacher_id: event.teacher_id,
        }));
        setEvents(formattedEvents);
      });
  }

  /** 🔥 Guardar nuevas clases */
  const handleSaveClass = async (newClasses: any[]) => {
    console.log("newClasses", newClasses);
    const validClasses = newClasses.filter((c) => c.start_time < c.end_time);
    if (validClasses.length !== newClasses.length) {
      alert("Algunas clases tienen horarios de inicio y fin inválidos.");
      return;
    }

    await fetch("http://localhost:3000/classes/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validClasses),
    });

    fetchClasses();
  };

  const handleEventClick = (clickInfo: any) => {
    // Extraemos la información correctamente
    const eventTitle = clickInfo.event.title;
    const eventStart = clickInfo.event.start;
    const eventEnd = clickInfo.event.end;

    // Función para encontrar el ID del evento con logging para debug
    const findEventId = () => {
      const matchingEvent = events.find((event) => {
        const eventStartHour = new Date(event.start).getHours();
        const eventStartMinutes = new Date(event.start).getMinutes();
        const clickedStartHour = eventStart.getHours();
        const clickedStartMinutes = eventStart.getMinutes();

        const eventEndHour = new Date(event.end).getHours();
        const eventEndMinutes = new Date(event.end).getMinutes();
        const clickedEndHour = eventEnd.getHours();
        const clickedEndMinutes = eventEnd.getMinutes();

        const timeMatches =
          eventStartHour === clickedStartHour &&
          eventStartMinutes === clickedStartMinutes &&
          eventEndHour === clickedEndHour &&
          eventEndMinutes === clickedEndMinutes;

        return event.title === eventTitle && timeMatches;
      });

      return matchingEvent;
    };

    // Convertimos las fechas a formato "HH:MM"
    const formatTime = (date: Date) => {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    if (clickInfo.event) {
      const eventId = findEventId().id; // Obtenemos el ID usando la nueva función

      if (eventId) {
        setSelectedClass({
          id: eventId,
          class_type_id: findEventId().class_type_id,
          day_of_week: eventStart.getDay(),
          start_time: formatTime(eventStart),
          end_time: formatTime(eventEnd),
          teacher_id: findEventId().teacher_id,
        });
        setShowEditModal(true);
      } else {
        console.warn("No se pudo encontrar el ID del evento.");
      }
    } else {
      console.warn("No se encontró la clase seleccionada.");
    }
  };

  /** 🔥 Actualizar una clase */
  const handleUpdateClass = async (updatedClass: ClassEvent) => {
    try {
      const response = await fetch(
        `http://localhost:3000/classes/${updatedClass.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedClass),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar la clase");
      }

      setEvents((prev) =>
        prev.map((event) =>
          event.id === updatedClass.id
            ? {
              ...event,
              title: classTypes.find(
                (type) => type.id === updatedClass.class_type_id
              )?.name,
              start: getDateForDay(
                updatedClass.day_of_week,
                updatedClass.start_time
              ),
              end: getDateForDay(
                updatedClass.day_of_week,
                updatedClass.end_time
              ),
              teacher_id: updatedClass.teacher_id,
            }
            : event
        )
      );

      setShowEditModal(false);
      fetchClasses();

    } catch (error) {
      console.error("Error al actualizar la clase:", error);
    }
  };

  // Función para abrir el modal de confirmación
  const confirmDeleteClass = (classData: ClassEvent) => {
    setClassToDelete(classData);
    setShowDeleteModal(true);
  };

  // Función para eliminar la clase después de la confirmación
  // TODO: let this function for future considerations
  const handleDeleteClass = async () => {
    if (!classToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/classes/${classToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la clase");
      }

      // Cierra los modales
      setShowDeleteModal(false);
      setShowEditModal(false);
      setSelectedClass(null);

      // Actualiza el estado de eventos eliminando la clase
      setEvents((prev) =>
        prev.filter((event) => event.id !== classToDelete.id)
      );

      // Opcional: Refrescar los datos desde el backend para mayor seguridad
      fetch("http://localhost:3000/classes")
        .then((res) => res.json())
        .then((data) => {
          const formattedEvents = data.map((event: any) => ({
            id: event.id,
            title: event.class_name,
            start: getDateForDay(event.day_of_week, event.start_time),
            end: getDateForDay(event.day_of_week, event.end_time),
            teacher_id: event.teacher_id,
          }));
          setEvents(formattedEvents);
        });
    } catch (error) {
      console.error("Error al eliminar la clase:", error);
    }
  };

  const handleDeleteClassBySchedule = async (
    classTypeId: number,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
  ) => {
    console.log('classTypeId', classTypeId)
    let className = "";
    try {
      const response = await fetch(
        `http://localhost:3000/class-types/${classTypeId}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener el nombre de la clase");
      }
      const data = await response.json();
      className = data.name;
    } catch (error) {
      console.error("Error al obtener el nombre de la clase:", error);
      return; // Salir de la función si hay un error
    }

    try {
      const response = await fetch(
        `http://localhost:3000/classes/delete-by-schedule?class_type_id=${encodeURIComponent(
          classTypeId
        )}&day_of_week=${dayOfWeek}&start_time=${startTime}&end_time=${endTime}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la clase específica");
      }

      // Cerrar los modales
      setShowDeleteModal(false);
      setShowEditModal(false);
      setSelectedClass(null);

      // Filtrar la clase eliminada del estado
      setEvents((prev) =>
        prev.filter(
          (event) =>
            !(
              event.title === className &&
              event.start === getDateForDay(dayOfWeek, startTime)
            )
        )
      );

      fetchClasses();

    } catch (error) {
      console.error("Error al eliminar la clase específica:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center text-3xl font-semibold mb-6">Calendario de Clases</h2>
      <Button
        variant="success"
        className="bg-purple-700 mt-2 mb-9 hover:bg-purple-800 text-white px-6 py-2 rounded-2xl font-medium transition"
        onClick={() => setShowModal(true)}
      >
        + Agregar Clase
      </Button>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-5xl">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          events={events}
          editable={true}
          selectable={true}
          locale={esLocale}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
          }}
          height="auto"
          eventClassNames={() =>
            "bg-purple-600 text-white font-bold rounded-md px-2 py-1 shadow"
          }
          dayHeaderClassNames={() =>
            "bg-gray-700 text-white p-2 rounded-lg text-center"
          }
          slotLabelClassNames={() =>
            "text-center text-white flex justify-center"
          }
        />
      </div>
      <EditClassModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        classData={selectedClass}
        onSave={handleUpdateClass}
        confirmDeleteClass={confirmDeleteClass}
      />

      <AddClassModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSave={handleSaveClass}
        classTypes={classTypes} // 🔥 Pasamos los tipos de clases disponibles
      />

      <ConfirmDeleteModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={() =>
          handleDeleteClassBySchedule(
            classToDelete!.class_type_id,
            classToDelete!.day_of_week,
            classToDelete!.start_time,
            classToDelete!.end_time
          )
        }
        classTypeId={classToDelete?.class_type_id}
      />
    </div>
  );
}
