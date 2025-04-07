import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridWeekPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import { PackInfo } from '../../components/user/PackInfo';

const getDateForDay = (dayOfWeek: number, time: string): Date => {
  const today = new Date();
  const dayDifference = dayOfWeek - today.getDay();
  const classDate = new Date(today);
  classDate.setDate(today.getDate() + dayDifference);

  const [hours, minutes] = time.split(':').map(Number);
  classDate.setHours(hours, minutes, 0, 0);

  return classDate;
};

const TodayClassesPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classTypes, setClassTypes] = useState<{ id: number; name: string }[]>([]);
  

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/class-types`)
      .then((res) => res.json())
      .then((data) => setClassTypes(data))
      .catch((err) => {
        console.error('Error al obtener tipos de clases:', err);
        setError('Error al cargar los tipos de clases.');
      });
  }, []);

  useEffect(() => {
    if (classTypes.length === 0) return;

    fetch(`${import.meta.env.VITE_API_URL}/classes`)
      .then((res) => res.json())
      .then((data) => {
        const formattedEvents = data.map((event: any) => ({
          id: event.id,
          title:
            classTypes.find((type) => type.id === event.class_type_id)?.name || 'Clase sin nombre',
          start: getDateForDay(event.day_of_week, event.start_time),
          end: getDateForDay(event.day_of_week, event.end_time),
          teacher_id: event.teacher_id,
          class_type_id: event.class_type_id,
        }));
        setEvents(formattedEvents);
      })
      .catch((err) => {
        console.error('Error al obtener clases:', err);
        setError('Error al cargar las clases.');
      })
      .finally(() => setLoading(false));
  }, [classTypes.length]);



  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white text-xl">Cargando clases...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 text-red-800 px-6 py-4 rounded-md shadow-md text-center max-w-md w-full">
          ❌ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      {/* 🗓️ Calendario de Clases */}
      <PackInfo/>
      <h2 className="text-2xl text-white text-center mb-6">Clases de Hoy</h2>
      <div className="bg-gray-900 rounded-lg shadow-md p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, timeGridWeekPlugin]}
          initialView="timeGridDay"
          events={events}
          locale={esLocale}
          editable={false}
          selectable={false}          
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth',
          }}
          height="auto"
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          buttonText={{
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
          }}
          eventClassNames={() =>
            'bg-purple-600 text-white font-bold rounded-md px-2 py-1 shadow'
          }
          dayHeaderClassNames={() => 'bg-gray-700 text-white p-2 rounded-lg text-center'}
          slotLabelClassNames={() => 'text-center text-white flex justify-center'}
        />
      </div>
    </div>
  );
};

export default TodayClassesPage;