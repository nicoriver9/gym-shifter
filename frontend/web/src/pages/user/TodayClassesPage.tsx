import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridWeekPlugin from "@fullcalendar/timegrid";
import { Container, Alert, Spinner } from "react-bootstrap";
import esLocale from "@fullcalendar/core/locales/es";
import { ClassEvent } from "../../interfaces/user/IEditClassModal";

const getDateForDay = (dayOfWeek: number, time: string): Date => {
  const today = new Date();
  const dayDifference = dayOfWeek - today.getDay();
  const classDate = new Date(today);
  classDate.setDate(today.getDate() + dayDifference);

  const [hours, minutes] = time.split(":").map(Number);
  classDate.setHours(hours, minutes, 0, 0);

  return classDate;
};

const TodayClassesPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPack, setUserPack] = useState<string | null>(null);
  const [userPackClassesIncluded, setUserPackClassesIncluded] = useState<string | null>(null);
  const [classTypes, setClassTypes] = useState<{ id: number; name: string }[]>([]);

  // Obtener el `user_id` desde localStorage
  const userId = localStorage.getItem("user_id");

  // Obtener el pack del usuario
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:3000/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.packs && data.packs.length > 0) {
          setUserPack(data.packs[0].name); // Tomamos el primer pack asignado
          setUserPackClassesIncluded(data.packs[0].classes_included)

        } else {
          setUserPack("No tienes un pack asignado");
        }
      })
      .catch((err) => {
        console.error("Error al obtener el pack del usuario:", err);
        setUserPack("Error al cargar el pack");
      });
  }, [userId]);

  // Obtener tipos de clases
  useEffect(() => {
    fetch("http://localhost:3000/class-types")
      .then((res) => res.json())
      .then((data) => {
        setClassTypes(data);
      })
      .catch((err) => {
        console.error("Error al obtener tipos de clases:", err);
        setError("Error al cargar los tipos de clases.");
      });
  }, []);

  // Obtener las clases después de cargar los tipos de clases
  useEffect(() => {
    if (classTypes.length === 0) return;

    fetch("http://localhost:3000/classes")
      .then((res) => res.json())
      .then((data) => {
        const formattedEvents = data.map((event: any) => ({
          id: event.id,
          title:
            classTypes.find((type) => type.id === event.class_type_id)?.name ||
            "Clase sin nombre",
          start: getDateForDay(event.day_of_week, event.start_time),
          end: getDateForDay(event.day_of_week, event.end_time),
          teacher_id: event.teacher_id,
          class_type_id: event.class_type_id,
        }));
        setEvents(formattedEvents);
      })
      .catch((err) => {
        console.error("Error al obtener clases:", err);
        setError("Error al cargar las clases.");
      })
      .finally(() => setLoading(false));
  }, [classTypes.length]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const handleClassClick = async (clickInfo: any) => {
    console.log(clickInfo, userPackClassesIncluded)
    setUserPackClassesIncluded((prevCount) => {
      if (prevCount === null || Number(prevCount) <= 0) {
        return 0;
      }
      return Number(prevCount) - 1;
    });
    // if (!userPack || userPack.classes_left === 0) {
    //   alert("No tienes clases disponibles en tu pack.");
    //   return;
    // }

    // try {
    //   const response = await fetch(`http://localhost:3000/users/${userId}/consume-class`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //   });

    //   if (!response.ok) {
    //     throw new Error("Error al registrar la clase en el backend.");
    //   }

    //   // Restar 1 clase en la UI
    //   setUserPack((prevPack) => prevPack && { ...prevPack, classes_left: prevPack.classes_left - 1 });

    //   alert("Clase registrada exitosamente.");
    // } catch (error) {
    //   console.error("Error al registrar la clase:", error);
    //   alert("Hubo un error al registrar la clase.");
    // }
  };


  return (
    <Container className="mt-4">
      {/* 🔥 Pack del usuario 🔥 */}
      <div className="bg-purple-800 text-white p-4 rounded-lg shadow-lg mb-6 text-center">
        <h2 className="text-lg font-semibold">Tu Pack Actual:</h2>
        <p className="text-xl font-bold">{userPack} </p>
        <p className="text-xl ">Clases restantes: {userPackClassesIncluded ? userPackClassesIncluded : " "}</p>
      </div>

      {/* Calendario de Clases */}
      <h1 className="text-center mb-4">Clases de Hoy</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, timeGridWeekPlugin]}
        initialView="timeGridDay"
        events={events}
        locale={esLocale}
        editable={false}
        selectable={true}
        eventClick={handleClassClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridDay,timeGridWeek,dayGridMonth",
        }}
        height="auto"
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        buttonText={{
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
        }}
      />
    </Container>
  );
};

export default TodayClassesPage;
