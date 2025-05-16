import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import { DatesSetArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { Button } from "react-bootstrap";
import "tippy.js/dist/tippy.css";
// import Tippy from "@tippyjs/react";


import ConfirmDeleteModal from "./modals/classModals/ConfirmDeleteClassModal";
import AddClassModal from "./modals/classModals/AddClassModal";
import EditClassModal from "./modals/classModals/EditClassModal";
import { ClassEvent } from "../../interfaces/admin/IEditClassModal";
import { getDateForDay } from "../../helpers/classSchedulerFunctions";

export default function ClassScheduler() {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [classTypes, setClassTypes] = useState<{ id: number; name: string }[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassEvent | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState<ClassEvent | null>(null);
  const [rangeLabel, setRangeLabel] = useState<string>("");
  const [loadingCalendar, setLoadingCalendar] = useState(true);

  const colorPalette = [
    "bg-purple-600",
    "bg-indigo-600",
    "bg-blue-500",
    "bg-blue-400",
    "bg-slate-500",
    "bg-gray-500",
    "bg-gray-400"
  ];

  const getEventColorClass = (classTypeId: number) => {
    const index = classTypeId % colorPalette.length;
    return `${colorPalette[index]} text-white font-medium rounded px-2 py-1`;
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch(`${import.meta.env.VITE_API_URL}/api/class-types`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setClassTypes(data));
  }, []);

  useEffect(() => {
    if (!classTypes.length) return;
    const token = localStorage.getItem("access_token");
    fetch(`${import.meta.env.VITE_API_URL}/api/classes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        const ev = data.map((e: any) => ({
          id: e.id,
          title: classTypes.find((t) => t.id === e.class_type_id)?.name || "Sin nombre",
          start: getDateForDay(e.day_of_week, e.start_time),
          end: getDateForDay(e.day_of_week, e.end_time),
          class_type_id: e.class_type_id,
          teacher_id: e.teacher_id,
        }));
        setEvents(ev);
        setLoadingCalendar(false);
      });
  }, [classTypes]);

  const fetchClasses = () => {
    const token = localStorage.getItem("access_token");
    fetch(`${import.meta.env.VITE_API_URL}/api/classes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        const ev = data.map((e: any) => ({
          id: e.id,
          title: classTypes.find((t) => t.id === e.class_type_id)?.name || "Sin nombre",
          start: getDateForDay(e.day_of_week, e.start_time),
          end: getDateForDay(e.day_of_week, e.end_time),
          class_type_id: e.class_type_id,
          teacher_id: e.teacher_id,
        }));
        setEvents(ev);
      });
  };

  const handleSaveClass = async (newClasses: any[]) => {
    const valid = newClasses.filter((c) => c.start_time < c.end_time);
    if (valid.length !== newClasses.length) {
      alert("Algunas clases tienen horarios inválidos.");
      return;
    }
    const token = localStorage.getItem("access_token");
    await fetch(`${import.meta.env.VITE_API_URL}/api/classes/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(valid),
    });
    fetchClasses();
    setShowModal(false);
  };

  const handleUpdateClass = async (updated: ClassEvent) => {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/classes/${updated.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      fetchClasses();
      setShowEditModal(false);
    }
  };

  const confirmDeleteClass = (c: ClassEvent) => {
    setClassToDelete(c);
    setShowDeleteModal(true);
  };

  const handleDeleteClassBySchedule = async (classTypeId: number, dayOfWeek: number, startTime: string, endTime: string) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      await fetch(`${import.meta.env.VITE_API_URL}/api/classes/delete-by-schedule?class_type_id=${encodeURIComponent(classTypeId)}&day_of_week=${dayOfWeek}&start_time=${startTime}&end_time=${endTime}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setShowDeleteModal(false);
      setShowEditModal(false);
      setSelectedClass(null);
      fetchClasses();
    } catch (error) {
      console.error("Error al eliminar la clase específica:", error);
    }
  };

  const handleEventClick = (info: any) => {
    const clickedEvent = info.event;
    const classData: ClassEvent = {
      id: Number(clickedEvent.id),
      title: clickedEvent.title,
      class_type_id: clickedEvent.extendedProps.class_type_id,
      teacher_id: clickedEvent.extendedProps.teacher_id,
      start_time: clickedEvent.start.toTimeString().slice(0, 5),
      end_time: clickedEvent.end.toTimeString().slice(0, 5),
      day_of_week: clickedEvent.start.getDay(),
    };
    setSelectedClass(classData);
    setShowEditModal(true);
  };

  return (
    <div className="px-4 py-6 min-h-screen">
      <h2 className="text-center text-3xl font-semibold text-white mb-8">
        Calendario de Clases
      </h2>

      <div className="flex justify-center mb-6">
        <Button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-700 font-semibold text-white px-5 py-2 rounded-full"
        >
          + Agregar Clase
        </Button>
      </div>

      {rangeLabel && !loadingCalendar && (
        <div className="text-center text-white text-xl mb-4 font-semibold">
          {rangeLabel}
        </div>
      )}

      {loadingCalendar ? (
        <div className="text-center text-white mt-20" data-aos="fade-up">
          <p className="text-lg">Cargando calendario...</p>
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-auto">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            events={events}
            editable={true}
            selectable={true}
            locale={esLocale}
            eventClick={handleEventClick}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
            contentHeight="auto"
            aspectRatio={window.innerWidth < 768 ? 0.6 : 1.3}
            handleWindowResize={true}
            headerToolbar={{ left: "prev,next today", center: "", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
            buttonText={{ today: "Hoy", month: "Mes", week: "Semana", day: "Día" }}
            height="auto"
            datesSet={(arg: DatesSetArg) => {
              const start = arg.start;
              const end = new Date(arg.end.getTime() - 1);
              const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
              const s = start.toLocaleDateString("es-AR", opts);
              const e = end.toLocaleDateString("es-AR", opts);
              setRangeLabel(`${s} — ${e}`);
            }}
            eventClassNames={(arg) => getEventColorClass(arg.event.extendedProps.class_type_id)}
            dayHeaderClassNames={() => "bg-gray-700 text-gray-200 p-2 text-center text-sm rounded"}
            slotLabelClassNames={() => "text-gray-400 text-xs text-center"}
            eventDidMount={(info) => {
              const tooltip = document.createElement("div");
              tooltip.innerHTML = `
    <strong>${info.event.title}</strong><br/>
    <span>👨‍🏫 Profesor: ${info.event.extendedProps.teacherName || "Sin asignar"}</span><br/>
    <span>🕓 ${info.event.start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
          ${info.event.end?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
  `;

              import("tippy.js").then(({ default: tippy }) => {
                tippy(info.el, {
                  content: tooltip,
                  allowHTML: true,
                  placement: "top",
                  theme: "light",
                  delay: [100, 50],
                });
              });
            }}

          />
        </div>
      )}

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
        classTypes={classTypes}
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
