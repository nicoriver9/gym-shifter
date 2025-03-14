export function getDateForDay(dayOfWeek: number, time: string): string {
    const today = new Date();
    const diff =
      dayOfWeek - today.getDay() + (dayOfWeek < today.getDay() ? 7 : 0);
    const eventDate = new Date(today);
    eventDate.setDate(today.getDate() + diff);
    eventDate.setHours(
      parseInt(time.split(":")[0]),
      parseInt(time.split(":")[1])
    );
    return eventDate.toISOString();
  }

  