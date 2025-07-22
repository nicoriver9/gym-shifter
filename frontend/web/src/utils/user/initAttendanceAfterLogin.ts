// import { getReservations } from "../services/admin/reservationService";
// import { useAttendanceStore } from "../store/attendanceStore";

import { getReservations } from "../../services/admin/reservationService";
import { useAttendanceStore } from "../../store/attendanceStore";

export const initAttendanceAfterLogin = async () => {
  try {
    const allReservations = await getReservations();

    const today = new Date().toISOString().split("T")[0];

    const todayReservations = allReservations.filter((r) => {
      const createdDate = new Date(r.created_at).toISOString().split("T")[0];
      return createdDate === today;
    });

    const now = new Date();

    const current = todayReservations.find((r) => {
      const [startHour, startMin] = r.classSchedule.start_time.split(":").map(Number);
      const [endHour, endMin] = r.classSchedule.end_time.split(":").map(Number);

      const start = new Date();
      start.setHours(startHour, startMin, 0, 0);

      const end = new Date();
      end.setHours(endHour, endMin, 0, 0);

      return now >= start && now <= end;
    });

    const attendanceStore = useAttendanceStore.getState();
    attendanceStore.setReservations(allReservations);

    if (current) {
      attendanceStore.setCurrentClassId(current.classSchedule.id);
      attendanceStore.setCurrentClassSchedule(current.classSchedule);
      attendanceStore.computeAttendeeCountForCurrentClass();
    } else {
      attendanceStore.setCurrentClassId(null);
      attendanceStore.setCurrentClassSchedule(null);
      attendanceStore.setAttendeeCount(0);
    }
  } catch (err) {
    console.error("Error inicializando la asistencia después del login:", err);
  }
};
