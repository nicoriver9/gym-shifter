import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timeGridWeekPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { PackInfo } from '../../components/user/PackInfo';

const getDateForDay = (dayOfWeek: number, time: string): Date => {
  const today = new Date();
  const diff = dayOfWeek - today.getDay();
  const d = new Date(today);
  d.setDate(today.getDate() + diff);
  const [h, m] = time.split(':').map(Number);
  d.setHours(h, m, 0, 0);
  return d;
};

const TodayClassesPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classTypes, setClassTypes] = useState<{ id: number; name: string }[]>([]);

  // Cargo tipos de clase
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/class-types`)
      .then(r => r.json())
      .then(data => setClassTypes(data))
      .catch(() => setError('Error al cargar los tipos de clases.'));
  }, []);

  // Cargo clases y formateo events
  useEffect(() => {
    if (!classTypes.length) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/classes`)
      .then(r => r.json())
      .then(data => {
        const ev = data.map((e: any) => ({
          id: e.id,
          title:
            classTypes.find(t => t.id === e.class_type_id)?.name ||
            'Sin nombre',
          start: getDateForDay(e.day_of_week, e.start_time),
          end: getDateForDay(e.day_of_week, e.end_time),
        }));
        setEvents(ev);
      })
      .catch(() => setError('Error al cargar las clases.'))
      .finally(() => setLoading(false));
  }, [classTypes]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-white text-xl">Cargando clases…</span>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-red-100 text-red-800 px-6 py-4 rounded-md shadow-md text-center max-w-md w-full">
          ❌ {error}
        </div>
      </div>
    );

  // Formateo manual de la fecha de hoy
  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4 sm:px-6">
      <PackInfo />

      {/* Título y fecha */}
      <h2 className="text-3xl sm:text-4xl font-semibold text-white text-center mb-3">
        Clases de Hoy
      </h2>
      <div className="text-white text-lg sm:text-2xl text-center mb-6 font-semibold capitalize">
        {formattedDate}
      </div>

      {/* Calendario */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-2 sm:p-6">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            timeGridWeekPlugin,
            interactionPlugin,
          ]}
          locale={esLocale}
          initialView="timeGridDay"
          events={events}
          editable={false}
          selectable={false}
          height="auto"
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          headerToolbar={{
            left: 'prev,next today',
            center: '',
            right: 'timeGridDay,timeGridWeek,dayGridMonth',
          }}
          buttonText={{
            today: 'Hoy',
            day: 'Día',
            week: 'Semana',
            month: 'Mes',
          }}
          views={{
            timeGridDay: {
              titleFormat: { weekday: 'long', day: 'numeric', month: 'long' },
            },
          }}
          eventClassNames={() =>
            'bg-purple-600 text-white font-medium rounded-lg px-2 py-1 shadow-md'
          }
          dayHeaderClassNames={() =>
            'bg-gray-700 text-gray-200 p-2 text-center text-sm sm:text-base rounded'
          }
          slotLabelClassNames={() =>
            'text-gray-400 text-xs sm:text-sm text-center'
          }
        />
      </div>
    </div>
  );
};

export default TodayClassesPage;
