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

    // Verificamos al montar el componente
    checkForCurrentClass();

    // Verificamos cada 30 segundos
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
    <div className="bg-purple-900 border border-purple-600 rounded-lg p-4 mb-6">
      <h3 className="text-xl text-center font-bold text-white mb-4">Clase en Curso</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
        <div>
          <p className="font-semibold">Clase:</p>
          <p className="text-lg">{currentClass.classType?.name || 'Clase sin nombre'}</p>
        </div>
        
        <div>
          <p className="font-semibold">Profesor:</p>
          <p className="text-lg">{currentClass.teacher?.name || 'Profesor no asignado'}</p>
        </div>
        
        <div>
          <p className="font-semibold">Horario:</p>
          <p className="text-lg">
            {currentClass.start_time} - {currentClass.end_time} 
            <span className="block text-sm text-purple-300">{timeLeft}</span>
          </p>
        </div>
      </div>
      
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