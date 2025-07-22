export const countConfirmedForClass = async (targetClass: {
  name: string;
  start_time: string;
  end_time: string;
  teacher: string;
}) => {
  const { getReservations } = await import("../../services/admin/reservationService");
  const allReservations = await getReservations();
  const today = new Date().toISOString().split("T")[0];

  const filtered = allReservations.filter((r) => {
    const createdDate = new Date(r.created_at).toISOString().split("T")[0];
    const sameClass =
      r.classSchedule.classType.name === targetClass.name &&
      r.classSchedule.start_time === targetClass.start_time &&
      r.classSchedule.end_time === targetClass.end_time &&
      r.classSchedule.teacherName === targetClass.teacher;

    return createdDate === today && sameClass && r.status === "confirmed";
  });

  return filtered.length;
};
