// src/utils/classUtils.ts
export const findCurrentClass = (classes: any[], currentTime: Date) => {
    const currentDay = currentTime.getDay(); // 0 (Domingo) a 6 (Sábado)
    // const currentHours = currentTime.getHours();
    // const currentMinutes = currentTime.getMinutes();
  
    return classes.find((classItem) => {
      // Verificar día de la semana (ajustar según tu modelo de datos)
      if (classItem.day_of_week !== currentDay) return false;
  
      // Verificar horario
      const [startHours, startMinutes] = classItem.start_time.split(':').map(Number);
      const [endHours, endMinutes] = classItem.end_time.split(':').map(Number);
  
      const classStart = new Date(currentTime);
      classStart.setHours(startHours, startMinutes, 0, 0);
  
      const classEnd = new Date(currentTime);
      classEnd.setHours(endHours, endMinutes, 0, 0);
  
      return currentTime >= classStart && currentTime <= classEnd;
    });
  };