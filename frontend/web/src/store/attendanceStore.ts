import { Reservation } from "../interfaces/admin/IReservation";
import { create } from "zustand";

interface AttendanceStore {
  reservations: Reservation[];
  setReservations: (res: Reservation[]) => void;
  currentClassId: number | null;
  setCurrentClassId: (id: number | null) => void;
  attendeeCount: number;
  setAttendeeCount: (count: number) => void;
  computeAttendeeCountForCurrentClass: () => void;

  currentClassSchedule: Reservation["classSchedule"] | null;
  setCurrentClassSchedule: (cs: Reservation["classSchedule"] | null) => void;
}

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  reservations: [],
  currentClassId: null,
  attendeeCount: 0,
  currentClassSchedule: null,

  setReservations: (res) => set({ reservations: res }),
  setCurrentClassId: (id) => set({ currentClassId: id }),
  setAttendeeCount: (count) => set({ attendeeCount: count }),
  setCurrentClassSchedule: (cs) => set({ currentClassSchedule: cs }),

  computeAttendeeCountForCurrentClass: () => {
    const { reservations, currentClassId, setAttendeeCount } = get();
    const today = new Date().toISOString().split("T")[0];

    const count = reservations.filter((r) => {
      const createdDate = new Date(r.created_at).toISOString().split("T")[0];
      return (
        r.classSchedule.id === currentClassId &&
        createdDate === today &&
        r.status === "confirmed"
      );
    }).length;

    setAttendeeCount(count);
  },
}));
