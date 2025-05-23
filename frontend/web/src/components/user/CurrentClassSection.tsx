// src/components/CurrentClassSection.tsx
import { useEffect, useState } from 'react';
import { findCurrentClass } from '../../utils/user/classUtils';

interface CurrentClassSectionProps {
  classes: any[];
  classTypes: any[];
  teachers: any[];
}

export const CurrentClassSection = ({ classes, classTypes, teachers }: CurrentClassSectionProps) => {
  const [currentClass, setCurrentClass] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const checkForCurrentClass = () => {
      const now = new Date();
      const foundClass = findCurrentClass(classes, now);

      if (foundClass) {
        const enrichedClass = {
          ...foundClass,
          classType: classTypes.find(type => type.id === foundClass.class_type_id),
          teacher: teachers.find(teacher => teacher.id === foundClass.teacher_id)
        };
        setCurrentClass(enrichedClass);
        updateTimeLeft(foundClass, now);
      } else {
        setCurrentClass(null);
        setTimeLeft('');
      }
    };

    checkForCurrentClass();

    const interval = setInterval(() => {
      checkForCurrentClass();
    }, 30000);

    return () => clearInterval(interval);
  }, [classes, classTypes, teachers]);

  const updateTimeLeft = (classItem: any, currentTime: Date) => {
    const [endHours, endMinutes] = classItem.end_time.split(':').map(Number);
    const classEnd = new Date(currentTime);
    classEnd.setHours(endHours, endMinutes, 0, 0);

    const diffMs = classEnd.getTime() - currentTime.getTime();
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins > 0) {
      setTimeLeft(`${diffMins} min restantes`);
    } else {
      setTimeLeft('Clase finalizada');
      setTimeout(() => setCurrentClass(null), 60000);
    }
  };

  if (!currentClass) {
    return (
      <div className="bg-gray-800 text-gray-400 p-4 rounded-lg mb-6 text-center">
        No hay clases en este momento
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-700 to-indigo-800 rounded-xl p-6 shadow-lg text-white mb-6">
      <h3 className="text-lg font-semibold text-center mb-3">Clase en Curso</h3>
      <p className="text-2xl font-bold text-center mb-2">{currentClass.classType?.name || 'Clase sin nombre'}</p>
      <p className="text-center mb-1">Profesor: <span className="font-medium">{currentClass.teacher?.name || 'Profesor no asignado'}</span></p>
      <p className="text-center mb-1">
        Horario: <span className="font-medium">{currentClass.start_time} - {currentClass.end_time}</span>
      </p>
      <p className="text-center text-sm mt-2 opacity-80">{timeLeft || 'Clase en progreso'}</p>
      {currentClass.room && (
        <div className="mt-3 text-center">
          <span className="inline-block bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
            Sala: {currentClass.room}
          </span>
        </div>
      )}
    </div>
  );
};
